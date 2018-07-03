import fromPairs from "lodash.frompairs";
import { basename } from "path";
import { beautifyJSON, normalizePath } from "../util";

export async function generate(context: string, files: string[]): Promise<string> {
	return beautifyJSON(fromPairs(files.map((val) => [basename(val), normalizePath(context, val)])), null, "\t", 1);
}

export function getName(modulePath: string) {
	return `${modulePath}.json`;
}
