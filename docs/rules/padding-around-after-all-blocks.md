# padding-around-after-all-blocks

## Rule Details

This rule enforces a line of padding before _and_ after 1 or more `afterAll` statements.

Note that it doesn't add/enforce a padding line if it's the last statement in its scope.

Examples of **incorrect** code for this rule:

```js
const someText = 'abc';
afterAll(() => {});
describe('someText', () => {});
```

Examples of **correct** code for this rule:

```js
const someText = 'abc';

afterAll(() => {});

describe('someText', () => {});
```
