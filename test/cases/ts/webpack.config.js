const DirectoryModulePlugin = require("../../../src/plugin").default;

module.exports = {
	entry: "./index.ts",
	plugins: [
		new DirectoryModulePlugin("ts-object")
	],
};
