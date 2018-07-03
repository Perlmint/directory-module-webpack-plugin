import wp from "webpack";
import {
	ConvertOption,
	EmitType,
	InternalOption,
	PluginOption
} from "./option";
import {
	exists, readdir, isDirectoryAsync, isDirectorySync
} from "./util";
import { VirtualStats, StatsCreateOption } from "./virtualStats";
import partial from "lodash.partial";
import { join, relative } from "path";
import "bluebird-global";

// avoid type error
declare global {
	const Map: any;
}

interface IResolveRequest {
	contextInfo: any;
	context: string;
	request: string;
}

export type Compiler = wp.Compiler & {
	resolvers: any;
}

type IBeforeResolveRequestCallback = (error: Error | null | undefined, data: IResolveRequest) => void;

export default class GameAssetPlugin implements wp.Plugin {
	private convertOption!: InternalOption;
	private rawOption: PluginOption;
	private context?: string;
	private populatedDirectories: {[module: string]: string} = {};

	constructor(option: PluginOption) {
		this.rawOption = option;
	}

	public apply(compiler: Compiler) {
		this.context = compiler.options.context;

		this.convertOption = ConvertOption(this.context, this.rawOption);

		compiler.plugin("compilation", () => {
			this.populatedDirectories = {};
		});
		compiler.plugin("normal-module-factory", (nmf) => {
			nmf.plugin("before-resolve", partial(GameAssetPlugin.beforeResolve, this));
		});
	}

	private static async beforeResolve(this: any, plugin: GameAssetPlugin, data: IResolveRequest, callback: IBeforeResolveRequestCallback) {
		if (plugin.populatedDirectories[data.request]) {
			data.request = plugin.populatedDirectories[data.request];
			return callback(null, data);
		}

		const modulePath = await new Promise<string | undefined>(
			resolve => this.resolvers.context.resolve(
				data.contextInfo, data.context, data.request,
				(_e: Error | null, o: any) => resolve(o),
			)
		);

		if (modulePath === undefined || !await exists(modulePath) || !await isDirectoryAsync(modulePath)) {
			return callback(null, data);
		}

		try {
			const moduleRelative = plugin.context ? relative(plugin.context, modulePath) : modulePath;

			for (const match of plugin.convertOption) {
				if (match[0].test(moduleRelative)) {
					const outModuleRequest = (await plugin.getEmitter(match[1])).getName(modulePath);
					await plugin.populateFilesystem(this.resolvers.normal.fileSystem, data.context, modulePath, outModuleRequest, match[1]);
					plugin.populatedDirectories[data.request] = outModuleRequest;

					data.request = outModuleRequest;
					break;
				}
			}

			return callback(null, data);
		} catch (e) {
			return callback(e, data);
		}
	}

	private async populateFilesystem(fs: any, context: string, modulePath: string, outPath: string, emitType: EmitType) {
    const mapIsAvailable = typeof Map !== 'undefined';
    const statStorageIsMap = mapIsAvailable && fs._statStorage.data instanceof Map;
    const readFileStorageIsMap = mapIsAvailable && fs._readFileStorage.data instanceof Map;

		// already populated
    if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      if (fs._readFileStorage.data.has(outPath)) {
        return;
      }
    } else if (fs._readFileStorage.data[outPath]) { // enhanced-resolve@3.3.0 or lower
      return;
		}

		const containedEntries = (await readdir(modulePath)).map(p => join(modulePath, p));
		const containedFiles = containedEntries.filter(p => !isDirectorySync(p));
		const contents = await (await this.getEmitter(emitType)).generate(context, containedFiles);
		const options: StatsCreateOption = {
			contents,
		};
    const stats = VirtualStats.create(options);
    if (statStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs._statStorage.data.set(outPath, [null, stats]);
    } else { // enhanced-resolve@3.3.0 or lower
      fs._statStorage.data[outPath] = [null, stats];
    }
    if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs._readFileStorage.data.set(outPath, [null, contents]);
    } else { // enhanced-resolve@3.3.0 or lower
      fs._readFileStorage.data[outPath] = [null, contents];
    }
	}

	private async getEmitter(emitType: EmitType) {
		switch (emitType) {
			case "json-object":
				return import("./emitter/json-object");
			case "json-array":
				return import("./emitter/json-array");
			case "ts-object":
				return import("./emitter/ts-object");
			default:
				throw new Error("unknown emitType");
		}
	}
}
