import { Minimatch } from "minimatch";
import { isAbsolute, relative } from "path";

export type EmitType = "json-object" | "json-array" | "ts-object";
interface IMultipleEmitOption {
	[globPath: string]: EmitType;
}
export type PluginOption = EmitType | IMultipleEmitOption;
export type InternalOption = Array < [RegExp, EmitType] > ;

export function ConvertOption(context: string | undefined, option: PluginOption) {
	if (typeof option === "string") {
		return ConvertSingleOption(option);
	} else {
		return ConvertMultipleOption(context, option);
	}
}

function ConvertSingleOption(option: EmitType): InternalOption {
	return [
		[new Minimatch("*").makeRe(), option],
		[new Minimatch("**/*").makeRe(), option],
	];
}

function ConvertMultipleOption(context: string | undefined, option: IMultipleEmitOption) {
	const ret: InternalOption = [];
	for (let key of Object.keys(option)) {
		if (context !== undefined && isAbsolute(key)) {
			key = relative(context, key);
		}
		ret.push([new Minimatch(key).makeRe(), option[key]]);
	}

	return ret;
}
