[![CircleCI](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master.svg?style=svg)](https://circleci.com/gh/dangreenisrael/eslint-plugin-jest-formatting/tree/master)

# This is not stable yet, API will likely change before v1.0.0

# eslint-plugin-jest-formatting

Formatting rules for tests written in jest

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
    "plugins": [
        "jest-formatting"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "jest-formatting/padding-before-test-blocks": 2,
        "jest-formatting/padding-before-describe-blocks": 2,
    }
}
```

## Rule Documentation

* [padding-before-test-blocks](docs/rules/padding-before-test-blocks.md)

* [padding-before-describe-blocks](docs/rules/padding-before-describe-blocks.md)




