# padding-before-before-all-blocks

## Rule Details

This rule enforces a line of padding before beforeAll blocks

Examples of **incorrect** code for this rule:

```js
const something = 123;
beforeAll(() => {
  // more stuff
});
```

Examples of **correct** code for this rule:

```js
const something = 123;

beforeAll(() => {
  // more stuff
});
```
