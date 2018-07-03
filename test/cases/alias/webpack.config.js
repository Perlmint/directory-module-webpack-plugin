const DirectoryModulePlugin = require("../../../src/plugin").default;
const join = require("path").join;

module.exports = {
	entry: "./index.js",
	plugins: [
		new DirectoryModulePlugin({
			object: "json-object",
			array: "json-array"
		})
	],
	resolve: {
		alias: {
			a: join(__dirname, "array"),
			o: join(__dirname, "object"),
		}
	}
};
