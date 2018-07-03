[![Build Status](https://travis-ci.org/Perlmint/directory-module-webpack-plugin.svg?branch=master)](https://travis-ci.org/Perlmint/directory-module-webpack-plugin)
[![Coverage Status](https://coveralls.io/repos/github/Perlmint/directory-module-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/Perlmint/directory-module-webpack-plugin?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/79466958384dd05c69d3/maintainability)](https://codeclimate.com/github/Perlmint/directory-module-webpack-plugin/maintainability)

# directory-module-webpack-plugin
Generate module based on directory contents

## Usage

### Configuration
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

### Source code
```javascript
import object_directory_contents from "./object";
```
