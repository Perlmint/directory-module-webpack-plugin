const DirectoryModulePlugin = require("../../../src/plugin").default;
const join = require("path").join;

module.exports = {
	entry: "./index.js",
	module: {
		loaders: [],
	},
	plugins: [
		new DirectoryModulePlugin("json-object")
	],
	resolveLoader: {
		alias: {
			"inline-loader": join(__dirname, "inline_loader.js"),
		}
	}
};
