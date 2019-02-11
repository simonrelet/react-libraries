# {{name}}

{{description}}

⚠️ **Warning:** The current master can represent unreleased features.
[See lastest release]({{repository.url}}/tree/{{version}}).

## Installation

### npm

```sh
npm install --save-dev {{name}}
```

### yarn

```sh
yarn add {{name}} -D
```

## Scripts

### build

Build the library JavaScript and styles.

_Usage:_

```sh
react-libraries build [options]
```

_Options:_

- `-i`, `--ignore=pattern`:
  [Glob pattern](https://www.npmjs.com/package/glob) to ignore from JavaScript build.
  The files ignored by default are:
  - _\*\*/\*.spec.js_
  - _\*\*/\*.test.js_
  - _\*\*/\*.stories.js_
  - <em>\*\*/\_\_tests\_\_/\*\*</em>
  - <em>\*\*/\_\_mocks\_\_/\*\*</em>
  - _src/setupTests.js_
- `-c`, `--copy=pattern`: [Glob pattern](https://www.npmjs.com/package/glob) to copy to the output folder.
- `-s`, `--sass=entryFile`: The SASS entry point, _src/index.scss_ by default.
- `-w`, `--watch`: Watch the files and rebuild in case of changes.

In order to build in CommonJS the entry _package.json#main_ must point to the output folder.
Ex: `"main": "build/cjs"`.

In order to build in ES modules the entry _package.json#module_ must point to the output folder.
Ex: `"module": "build/es"`.

In order to build SASS styles the entry _package.json#style_ must point to the output file.
Ex: `"style": "build/my-lib.css"`.

_Examples:_

```sh
react-libraries build
react-libraries build --watch
react-libraries build --copy "**/*.ts" --copy="src/_mixins.scss"
react-libraries build -s "src/main.scss"
react-libraries build -i "**/*.doc.js" --ignore "src/renderTests.js"
```

### bump-version

Update the new version number in the project.

_Usage:_

```sh
react-libraries bump-version [options] <new-verison>
```

_Options:_

- `-r`, `--readme=templatePath`: Path of the template file to use, _README-template.md_ by default.

The files that will be updated are:

- _package.json_: The `version` field is updated.
- _package-lock.json_ (if it exists): The `version` field is updated.
- _CHANGELOG.md_ (if it exists): The "Unreleased" section is renamed to "\<new-version> (date)".
- _README.md_ (if the template file exists): See the [`readme` script](#readme).

_Examples:_

```sh
react-libraries bump-version 2.3.0
react-libraries bump-version -t "template-README.md" 5.0.0-alpha.2
```

### clean

Clean the project.

_Usage:_

```sh
react-libraries clean [folders]
```

The folders removed by default are:

- _build/_
- _build-storybook/_
- _coverage/_

_Examples:_

```sh
react-libraries clean
react-libraries clean .docz .tmp
```

### readme

Generate a _README.md_ file from a template.

_Usage:_

```sh
react-libraries readme [options]
```

_Options:_

- `-t`, `--template=templatePath`: Path of the template file to use, _README-template.md_ by default.

_Examples:_

```sh
react-libraries readme
react-libraries readme --template="template-README.md"
```

#### README template

The _README.md_ file can be generated from a template file allowing you to inject values from your _package.json_.
You can use the syntax `{{path}}` where `path` is any valid object path in _package.json_.
An injection will be skipped if `path` isn't found in _package.json_ or if the path is prefixed with a `!` (`{{!path}}`).
In which case the `!` will be removed from the output.

**Example:**

_package.json_

```json
{
  "name": "my-lib",
  "description": "Library of things.",
  "version": "1.0.0",
  "unpkg": "build/umd/my-lib.production.min.js",
  "unpkg-dev": "build/umd/my-lib.development.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/me/my-lib"
  }
}
```

_README-template.md_

````md
# {{!name}}

{{!description}}

## Installation

### npm

```sh
npm install --save {{!name}}
```

### yarn

```sh
yarn add {{!name}}
```

### UMD

- Production: https://unpkg.com/{{!name}}@{{!version}} or https://unpkg.com/{{!name}}@{{!version}}/{{!unpkg}}
- Development: https://unpkg.com/{{!name}}@{{!version}}/{{!unpkg-dev}}

## Documentation

The documentation can be found [here]({{!repository.url}}/tree/{{!version}}/docs).
````

_README.md_

````md
# my-lib

Library of things.

## Installation

### npm

```sh
npm install --save my-lib
```

### yarn

```sh
yarn add my-lib
```

### UMD

- Production: https://unpkg.com/my-lib@1.0.0 or https://unpkg.com/my-lib@1.0.0/build/umd/my-lib.production.min.js
- Development: https://unpkg.com/my-lib@1.0.0/build/umd/my-lib.development.js

## Documentation

The documentation can be found [here](https://github.com/me/my-lib/tree/1.0.0/docs).
````

### test

Launches the test with Jest.

_Usage:_

```sh
react-libraries test [options]
```

_Options:_

- `--coverage`: Compute the coverage.

_Examples:_

```sh
react-libraries test
react-libraries test --coverage
env CI=true react-libraries test
```
