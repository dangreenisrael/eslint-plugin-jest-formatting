[![CircleCI](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master.svg?style=svg)](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master)
![npm monthly downloads](https://img.shields.io/npm/dm/eslint-plugin-jest-formatting.svg)

# eslint-plugin-jest-formatting

This package provides ESLint rules for jest test suites.

This project aims to provide formatting rules (auto-fixable where possible) to ensure consistency and readability in jest test suites.

Like this plugin? [Say thanks with a ⭐️](https://github.com/dangreenisrael/eslint-plugin-jest-formatting/stargazers)

**_Note: The master version may not be the version deployed to npm. Please treat https://www.npmjs.com/package/eslint-plugin-jest-formatting as the cannonical source for docs._**

## Installation

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

## Related Projects

### eslint-plugin-jest

This provides an extensive set of jest eslint rules

https://github.com/jest-community/eslint-plugin-jest
