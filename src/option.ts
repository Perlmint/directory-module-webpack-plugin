import { Minimatch } from "minimatch";
import { isAbsolute, relative } from "path";

export type EmitType = "json-object" | "json-array" | "ts-object";
export type PluginOption = EmitType | {
	[globPath: string]: EmitType,
};
export type InternalOption = Array < [RegExp, EmitType] > ;

export function ConvertOption(context: string | undefined, option: PluginOption) {
	const ret: InternalOption = [];
	if (typeof option === "string") {
		ret.push([new Minimatch("*").makeRe(), option]);
		ret.push([new Minimatch("**/*").makeRe(), option]);
	} else {
		for (let key of Object.keys(option)) {
			if (context !== undefined && isAbsolute(key)) {
				key = relative(context, key);
			}
			ret.push([new Minimatch(key).makeRe(), option[key]]);
		}
	}

	return ret;
}
