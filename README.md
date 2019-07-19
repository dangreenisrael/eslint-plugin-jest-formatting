[![CircleCI](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master.svg?style=svg)](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master)
![npm monthly downloads](https://img.shields.io/npm/dm/eslint-plugin-jest-formatting.svg)

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
    "jest-formatting/padding-before-all": 2
  }
}
```

_or_

```json
{
  "rules": {
    "jest-formatting/padding-before-describe-blocks": 2,
    "jest-formatting/padding-before-test-blocks": 2
  }
}
```

## Rule Documentation

- [padding-before-all](docs/rules/padding-before-all.md)

- [padding-before-after-all-blocks](docs/rules/padding-before-after-all-blocks.md)
- [padding-before-after-each-blocks](docs/rules/padding-before-after-each-blocks.md)
- [padding-before-before-all-blocks](docs/rules/padding-before-before-all-blocks.md)
- [padding-before-before-each-blocks](docs/rules/padding-before-before-each-blocks.md)
- [padding-before-describe-blocks](docs/rules/padding-before-describe-blocks.md)
- [padding-before-expect-statements](docs/rules/padding-before-expect-statements.md)
- [padding-before-test-blocks](docs/rules/padding-before-test-blocks.md)
