import { exists as existsAsync, readdir as readdirAsync, stat as statAsync, statSync } from "fs";
import { promisify } from "util";
import { posix, relative } from "path";

export const exists = promisify(existsAsync);
export const readdir = promisify(readdirAsync);
export const stat = promisify(statAsync);
export async function isDirectoryAsync(path: string) {
	const targetStat = await stat(path);

	return targetStat.isDirectory();
}
export function isDirectorySync(path: string) {
	const targetStat = statSync(path);

	return targetStat.isDirectory();
}

export function normalizePath(base: string, path: string) {
	return `./${posix.normalize(relative(base, path).replace(/\\/g, '/'))}`;
}

import beautifyJSON from "json-beautify";
export { beautifyJSON };
