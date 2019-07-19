# padding-before-after-all-blocks

## Rule Details

This rule enforces a line of padding before afterAll blocks

Examples of **incorrect** code for this rule:

```js
const something = 123;
afterAll(() => {
  // more stuff
});
```

Examples of **correct** code for this rule:

```js
const something = 123;

afterAll(() => {
  // more stuff
});
```
