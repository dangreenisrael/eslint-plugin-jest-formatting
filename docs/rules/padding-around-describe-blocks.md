# padding-around-describe-blocks

## Rule Details

This rule enforces a line of padding before _and_ after 1 or more `beforeEach` statements

Note that it doesn't add/enforce a padding line if it's the last statement in its scope

Examples of **incorrect** code for this rule:

```js
const thing = 123;
describe('foo', () => {
  // stuff
});
describe('bar', () => {
  // more stuff
});
```

Examples of **correct** code for this rule:

```js
const thing = 123;

describe('foo', () => {
  // stuff
});

describe('bar', () => {
  // more stuff
});
```
