# padding-describe-blocks

## Rule Details

This rule enforces at least one line of padding before describe blocks (newline or comment).

Examples of **incorrect** code for this rule:

```js
describe('foo', () => {
  // stuff
});
describe('bar', () => {
  // more stuff
});
```

Examples of **correct** code for this rule:

```js
describe('foo', () => {
  // stuff
});

describe('bar', () => {
  // more stuff
});
```
