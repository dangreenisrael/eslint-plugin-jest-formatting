# padding-before-after-each-blocks

## Rule Details

This rule enforces a line of padding before afterEach blocks

Examples of **incorrect** code for this rule:

```js
const something = 123;
afterEach(() => {
  // more stuff
});
```

Examples of **correct** code for this rule:

```js
const something = 123;

afterEach(() => {
  // more stuff
});
```
