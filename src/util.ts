import { exists as existsAsync, readdir as readdirAsync, stat as statAsync, statSync } from "fs";
import { posix, relative } from "path";
import { promisify } from "util";

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

export function normalizePath(path: string) {
	return posix.normalize(path.replace(/\\/g, "/"));
}

export function normalizedRelativePath(base: string, path: string) {
	return `./${normalizePath(relative(base, path))}`;
}

import beautifyJSON from "json-beautify";
export { beautifyJSON };
