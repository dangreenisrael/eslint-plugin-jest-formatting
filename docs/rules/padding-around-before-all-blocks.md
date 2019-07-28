# padding-around-before-all-blocks

## Rule Details

This rule enforces a line of padding before _and_ after `beforeAll` statements.

Note that it doesn't add/enforce a padding line if it's the last statement in its scope.

Examples of **incorrect** code for this rule:

```js
const something = 123;
beforeAll(() => {
  // more stuff
});
describe('foo', () => {});
```

Examples of **correct** code for this rule:

```js
const something = 123;

beforeAll(() => {
  // more stuff
});

describe('foo', () => {});
```
