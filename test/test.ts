import "mocha";
import { assert } from "chai";
import webpack from "webpack";
import path from "path";
import fs from "fs";

function readFileContents(path: string) {
	return fs.readFileSync(path, {
		encoding: "utf8"
	}).replace(/\r\n/g, "\n");
}

async function runTestCase(this: Mocha.ITestCallbackContext, testCase: string) {
	const testDirectory = path.join(__dirname, 'cases', testCase);
	const outputDirectory = path.join(__dirname, 'dist', testCase);
	let webpackConfig: any;

	const configFile = path.join(testDirectory, 'webpack.config.js');
	if (fs.existsSync(configFile)) {
		// eslint-disable-next-line import/no-dynamic-require, global-require
		webpackConfig = require(configFile);
		if (typeof webpackConfig === 'function') {
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
					loader:'file-loader',
					options: {
						name: '[path][name].[ext]'
					}
				}]
			},
		];
	}
	options.output = {
		filename: 'main.js',
		path: outputDirectory,
		library: 'test',
		libraryTarget: 'umd',
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
		const expectedDirectory = path.join(testDirectory, '__expected');
		if (fs.existsSync(expectedDirectory)) {
			fs.readdirSync(expectedDirectory).forEach((file) => {
				const filePath = path.join(expectedDirectory, file);
				const actualPath = path.join(outputDirectory, file);
				assert.equal(
					readFileContents(actualPath),
					readFileContents(filePath),
					`${file} should be correct`
				);
			});
		}
		const expectedExportsDirectory = path.join(testDirectory, '__expected_exports');
		if (fs.existsSync(expectedExportsDirectory)) {
			const exporteds = require(path.join(outputDirectory, "main.js"));
			fs.readdirSync(expectedExportsDirectory).forEach((file) => {
				const ext = path.extname(file);
				const base = path.basename(file, ext);
				const filePath = path.join(expectedExportsDirectory, file);
				assert.deepEqual(
					exporteds[base],
					require(filePath),
					`${file} should be correct`
				);
			});
		}

		resolve();
	}));
}

const casesRoot = path.join(__dirname, "cases");
for (const testCase of fs.readdirSync(casesRoot)) {
	const stat = fs.statSync(path.join(casesRoot, testCase));
	if (stat.isDirectory()) {
		describe(testCase, function (this) {
			it("run case", runTestCase.bind(this, testCase));
		});
	}
}
