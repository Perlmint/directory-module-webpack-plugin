import fromPairs from "lodash.frompairs";
import { basename } from "path";
import { beautifyJSON, normalizedRelativePath } from "../util";

export async function generate(context: string, files: string[]): Promise<string> {
	return `const data = ${beautifyJSON(
		fromPairs(
			files.map(
				(val) => [
					basename(val),
					normalizedRelativePath(context, val),
				],
			),
		), null, "\t", 1,
	)}
export default data;
`;
}

export function getName(modulePath: string) {
	return `${modulePath}.ts`;
}
