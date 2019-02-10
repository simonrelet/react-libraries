# {{name}}

> {{description}}

⚠️ **Warning:** The current master can represent unreleased features.
[See lastest release]({{repository.url}}/tree/react-libraries-{{version}}/packages/react-libraries).

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

### `build`

_Usage_:

```sh
react-libraries build [-c|--copy globPattern] [-w|--watch]
```

Build the library JavaScript in CommonJS and ES modules.

This script accepts the `--watch` (or `-w`) option in which case it will watch for changes and rebuild.
An optional pattern of files can be passed in order to copy them to the output folders.

In order to build in CommonJS the entry _package.json#main_ must point to the output folder.
Ex: `"main": "build/cjs"`.

In order to build in ES modules the entry _package.json#module_ must point to the output folder.
Ex: `"module": "build/es"`.

### `bump-version`

_Usage_:

```sh
react-libraries bump-version [-r|--readme <readme-template-path>] <new-verison>
```

Update the following files with the new version:

- _package.json_: The `version` field is updated.
- _CHANGELOG.md_ (if it exists): The `## Unreleased` section is renamed to "\<new-version> (date)".
- _README.md_ (if the template file exists): See the [`readme` script](#readme).

### `clean`

_Usage_:

```sh
react-libraries clean
```

Remove the folowing generated folders:

- _build/_
- _build-storybook/_
- _coverage/_

### `readme`

_Usage_:

```sh
react-libraries readme [-t|--template <readme-template-path>]
```

Generate a _README.md_ file from a template.
By default, the README template path is _README-template.md_ but it can be changed using the `--template` (or `-t`) option.

#### README template

The _README.md_ file can be generated from a template file allowing you to inject values from your _package.json_.
You can use the syntax `{{path}}` where `path` is any valid object path in _package.json_.

Example:

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
# \\{{name}}

> \\{{description}}

## Installation

### npm

```sh
npm install --save \\{{name}}
```

### yarn

```sh
yarn add \\{{name}}
```

### UMD

- Production: https://unpkg.com/\\{{name}}@\\{{version}} or https://unpkg.com/\\{name}@\\{{version}}/\\{{unpkg}}
- Development: https://unpkg.com/\\{{name}}@\\{{version}}/\\{{unpkg-dev}}

## Documentation

The documentation can be found [here]({{repository.url}}/tree/{{version}}/docs).
````

_README.md_

````md
# my-lib

> Library of things.

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

### `test`

_Usage_:

```sh
react-libraries test [--coverage]
```

Launches Jest in the interactive watch mode.