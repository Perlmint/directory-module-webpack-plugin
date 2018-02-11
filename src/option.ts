import { Minimatch } from "minimatch";

export type EmitType = "json-object" | "json-array" | "ts-object";
export type PluginOption = EmitType | {
	[globPath: string]: EmitType,
};
export type InternalOption = Array < [RegExp, EmitType] > ;

export function ConvertOption(option: PluginOption) {
	const ret: InternalOption = [];
	if (typeof option === "string") {
		ret.push([new Minimatch("*").makeRe(), option]);
		ret.push([new Minimatch("**/*").makeRe(), option]);
	} else {
		for (const key of Object.keys(option)) {
			ret.push([new Minimatch(key).makeRe(), option[key]]);
		}
	}

	return ret;
}
