const DirectoryModulePlugin = require("../../../src/plugin").default;

module.exports = {
	entry: "./index.js",
	plugins: [
		new DirectoryModulePlugin({
			"assets/*": "json-object",
		}),
	],
};
