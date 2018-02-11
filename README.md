# directory-module-webpack-plugin
Generate module based on directory contents

## Usage
```javascript
import DirectoryModulePlugin from "directory-module-webpack-plugin";

export = {
	entry: "./index.js",
	plugins: [
		new DirectoryModulePlugin({
			object: "json-object",
            array: "json-array",
            ts_object: "ts-object",
		})
	],
};
```

## 