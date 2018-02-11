[![Build Status](https://travis-ci.org/Perlmint/directory-module-webpack-plugin.svg?branch=master)](https://travis-ci.org/Perlmint/directory-module-webpack-plugin)
[![Coverage Status](https://coveralls.io/repos/github/Perlmint/directory-module-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/Perlmint/directory-module-webpack-plugin?branch=master)

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
        }),
    ],
};
```

## 