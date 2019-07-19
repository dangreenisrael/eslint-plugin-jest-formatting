# padding-before-before-each-blocks

## Rule Details

This rule enforces a line of padding before beforeEach blocks

Examples of **incorrect** code for this rule:

```js
const something = 123;
beforeEach(() => {
  // more stuff
});
```

Examples of **correct** code for this rule:

```js
const something = 123;

beforeEach(() => {
  // more stuff
});
```
