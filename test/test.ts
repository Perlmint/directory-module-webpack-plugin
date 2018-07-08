
import { assert } from "chai";
import fs from "fs";
import _ from "lodash";
import "mocha";
import path from "path";
import { promisify } from "util";
import webpack from "webpack";

const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function readFileContents(filePath: string) {
	return (await readFile(filePath, {
		encoding: "utf8",
	})).replace(/\r\n/g, "\n");
}

async function collectContents(directory: string): Promise<string[]> {
	return _.flatten(await Promise.all((await readDir(directory)).map(async (sub) => {
		const fullPath = path.join(directory, sub);
		const stats = await stat(fullPath);
		if (stats.isDirectory()) {
			return collectContents(fullPath);
		} else {
			return fullPath;
		}
	})));
}

async function runTestCase(this: Mocha.ITestCallbackContext, testCase: string) {
	const testDirectory = path.join(__dirname, "cases", testCase);
	const outputDirectory = path.join(__dirname, "dist", testCase);
	let webpackConfig: any;

	const configFile = path.join(testDirectory, "webpack.config.js");
	if (fs.existsSync(configFile)) {
		// eslint-disable-next-line import/no-dynamic-require, global-require
		webpackConfig = require(configFile);
		if (typeof webpackConfig === "function") {
			webpackConfig = webpackConfig();
		}
	}
	const options = Promise.is(webpackConfig) ? (await webpackConfig) : webpackConfig;
	options.context = testDirectory;
	options.target = "node";
	if (!options.module) {
		options.module = {};
	}
	if (!options.module.loaders) {
		options.module.loaders = [
			{
				test: /\.json$/,
				use: [{
					loader: "file-loader",
					options: {
						name: "[path][name].[ext]",
					},
				}],
			},
		];
	}
	options.output = {
		filename: "main.js",
		library: "test",
		libraryTarget: "umd",
		path: outputDirectory,
	};

	return new Promise<void>((resolve, reject) => webpack(options, (err, stats) => {
		if (err) {
			reject(err);
			return;
		}
		if (stats.hasErrors()) {
			reject(new Error(stats.toString()));
			return;
		}
		const checkPromises: Array<Promise<any>> = [];
		const expectedDirectory = path.join(testDirectory, "__expected");
		if (fs.existsSync(expectedDirectory)) {
			checkPromises.push(collectContents(expectedDirectory).then((files) => Promise.all(files.map((filePath) => {
				const file = path.relative(expectedDirectory, filePath);
				const actualPath = path.join(outputDirectory, file);

				return Promise.all([
					readFileContents(actualPath),
					readFileContents(filePath),
				]).then(([actualContent, expectedContents]) => {
					assert.equal(
						actualContent,
						expectedContents,
						`${file} should be correct`,
					);
				});
			}))));
		}
		const expectedExportsDirectory = path.join(testDirectory, "__expected_exports");
		if (fs.existsSync(expectedExportsDirectory)) {
			const exporteds = require(path.join(outputDirectory, "main.js"));
			checkPromises.push(collectContents(expectedExportsDirectory).then((files) => Promise.all(files.map((filePath) => {
				const file = path.relative(expectedExportsDirectory, filePath);
				const ext = path.extname(file);
				const base = path.basename(file, ext);
				assert.deepEqual(
					exporteds[base],
					require(filePath),
					`${file} should be correct`,
				);
			}))));
		}

		Promise.all(checkPromises).then(() => resolve());
	}));
}

const casesRoot = path.join(__dirname, "cases");
for (const testCase of fs.readdirSync(casesRoot)) {
	const stats = fs.statSync(path.join(casesRoot, testCase));
	if (stats.isDirectory()) {
		describe(testCase, function(this) {
			it("run case", runTestCase.bind(this, testCase));
		});
	}
}
