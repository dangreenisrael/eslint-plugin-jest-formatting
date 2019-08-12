[![CircleCI](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master.svg?style=svg)](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master)
![npm monthly downloads](https://img.shields.io/npm/dm/eslint-plugin-jest-formatting.svg)

**_Note: The master version may not be the version deployed to npm. Please treat https://www.npmjs.com/package/eslint-plugin-jest-formatting as the cannonical source for docs._**

# eslint-plugin-jest-formatting

This project aims to provide formatting rules (auto-fixable where possible) to ensure consistency and readability in jest test suites.

Like this plugin? [Say thanks with a ⭐️](https://github.com/dangreenisrael/eslint-plugin-jest-formatting/stargazers)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ yarn add eslint -dev
```

Next, install `eslint-plugin-jest-formatting`:

```
$ yarn add eslint-plugin-jest-formatting --dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-jest-formatting` globally.

## Usage

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

You can use our recommeneded settings which enables all of the rules for you

```json
{
  "extends": ["plugin:jest-formatting/recommended"]
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

### Deprecated

- [padding-before-all](docs/rules/padding-before-all.md)
- [padding-before-before-each-blocks](docs/rules/padding-before-before-each-blocks.md)
- [padding-before-after-each-blocks](docs/rules/padding-before-after-each-blocks.md)
- [padding-before-before-all-blocks](docs/rules/padding-before-before-all-blocks.md)
- [padding-before-after-all-blocks](docs/rules/padding-before-after-all-blocks.md)
- [padding-before-describe-blocks](docs/rules/padding-before-describe-blocks.md)
- [padding-before-expect-statements](docs/rules/padding-before-expect-statements.md)
- [padding-before-test-blocks](docs/rules/padding-before-test-blocks.md)
