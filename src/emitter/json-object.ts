import fromPairs from "lodash.frompairs";
import { beautifyJSON, normalizePath } from "../util";
import { basename } from "path";

export async function generate(context: string, files: string[]): Promise<string> {
	return beautifyJSON(fromPairs(files.map(val => [basename(val), normalizePath(context, val)])), null, "\t", 1);
}

export function getName(modulePath: string) {
	return `${modulePath}.json`;
}
