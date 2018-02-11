const DirectoryModulePlugin = require("../../../src/plugin").default;

module.exports = {
	entry: "./index.js",
	plugins: [
		new DirectoryModulePlugin("json-object")
	],
};
