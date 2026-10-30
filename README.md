[![CircleCI](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master.svg?style=svg)](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master)
![npm monthly downloads](https://img.shields.io/npm/dm/eslint-plugin-jest-formatting.svg)

# eslint-plugin-jest-formatting

This package provides ESLint rules for jest test suites.

This project aims to provide formatting rules (auto-fixable where possible) to ensure consistency and readability in jest test suites.

Like this plugin? [Say thanks with a ⭐️](https://github.com/dangreenisrael/eslint-plugin-jest-formatting/stargazers)

**_Note: The master version may not be the version deployed to npm. Please treat https://www.npmjs.com/package/eslint-plugin-jest-formatting as the cannonical source for docs._**

## Installation

Requires Node 22 or later and ESLint 8, 9, or 10. There is no Jest version requirement: the rules match identifiers such as `describe` and `expect` and import nothing from Jest.

You'll first need to install [ESLint](http://eslint.org):

```
$ yarn add eslint --dev
```

Next, install `eslint-plugin-jest-formatting`:

```
$ yarn add eslint-plugin-jest-formatting --dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-jest-formatting` globally.

## Usage

### Flat config (ESLint 9+, `eslint.config.js`)

```js
import jestFormatting from 'eslint-plugin-jest-formatting';

export default [
  // ...your other config objects
  jestFormatting.configs['flat/recommended'],
];
```

`flat/strict` enables every rule via `padding-around-all`. The flat configs do not set `files`, so the rules run on every file ESLint already lints. To scope them to test files, spread the config into your own object (name the extensions explicitly: in flat config a `files` glob opts matching files into linting, and a bare `**/*.test.*` would also match Jest snapshot files):

```js
export default [
  {
    files: [
      '**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,mjs,cjs,ts,tsx}',
    ],
    ...jestFormatting.configs['flat/recommended'],
  },
];
```

With CommonJS use `const jestFormatting = require('eslint-plugin-jest-formatting');`.

### Legacy config (`.eslintrc`)

Add `jest-formatting` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["jest-formatting"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "jest-formatting/padding-around-describe-blocks": 2,
    "jest-formatting/padding-around-test-blocks": 2
  }
}
```

_or_

You can use our "recommended" settings which enables most of the rules for you

```json
{
  "extends": ["plugin:jest-formatting/recommended"]
}
```

We also support a "strict" settings which enabled all of the rules for you

```json
{
  "extends": ["plugin:jest-formatting/strict"]
}
```

## Rule Documentation

- [padding-around-after-all-blocks](docs/rules/padding-around-after-all-blocks.md)
- [padding-around-after-each-blocks](docs/rules/padding-around-after-each-blocks.md)
- [padding-around-before-all-blocks](docs/rules/padding-around-before-all-blocks.md)
- [padding-around-before-each-blocks](docs/rules/padding-around-before-each-blocks.md)
- [padding-around-expect-groups](docs/rules/padding-around-expect-groups.md)
- [padding-around-describe-blocks](docs/rules/padding-around-describe-blocks.md)
- [padding-around-test-blocks](docs/rules/padding-around-test-blocks.md)
- [padding-around-all](docs/rules/padding-around-all.md)

## Using with AI coding agents

This plugin is built to be driven by coding agents as well as people:

- **Self-describing messages.** Every report says what is missing, where, and how to fix it, for example: `` Missing blank line before `describe`. Expected at least one blank line between the previous statement and this `describe` call. Fix: insert an empty line above it (autofixable with --fix). `` An agent can act on the message without opening the docs.
- **Everything is autofixable.** `eslint --fix` resolves every report from this plugin by inserting blank lines. The fixer never removes or reorders code.
- **Fixed documentation shape.** Each page in [docs/rules](docs/rules) has the same sections in the same order: Rule summary, Why, Incorrect examples, Correct examples, Options, Fixability. Each rule's `meta.docs.url` points at its page.
- **[AGENTS.md](AGENTS.md)** is a one-page briefing: what the plugin does, every rule in one line, flat and legacy config snippets, and how to build and test.
- **[llms.txt](llms.txt)** lists the documentation in the [llms.txt](https://llmstxt.org) format for tools that fetch context automatically.

## Related Projects

### eslint-plugin-jest

This provides an extensive set of jest eslint rules

https://github.com/jest-community/eslint-plugin-jest
