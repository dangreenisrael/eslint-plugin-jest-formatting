# padding-around-after-all-blocks

- **Rule ID:** `jest-formatting/padding-around-after-all-blocks`
- **Presets:** `recommended`; covered by `padding-around-all` in `strict`
- **Fixable:** yes, `eslint --fix` inserts the missing blank lines
- **Options:** none
- **Message IDs:** `missingPaddingBefore`, `missingPaddingAfter`

## Rule summary

Require a blank line before and after every `afterAll` call.

- Matches every statement that starts with the identifier `afterAll`.
- Only neighbouring statements in the same block are compared: the top level of the file, a `{ ... }` block such as a callback body, or a `switch` case. The first statement in a block needs no blank line before it, and the last needs none after it.
- One blank line is enough; extra blank lines are never reported.
- Two consecutive `afterAll` calls also need a blank line between them.
- A comment on its own line is not a blank line, but a blank line on either side of a comment satisfies the rule.

## Why

`afterAll` runs once, after every test in its scope, so it is part of the suite's skeleton rather than of any one test. A blank line on each side keeps that teardown visually separate from the declarations and tests around it, which makes the setup and teardown structure of a file readable at a glance and keeps cleanup code from being mistaken for part of a neighbouring block.

## Incorrect examples

```js
/* eslint jest-formatting/padding-around-after-all-blocks: "error" */
const server = startServer();
afterAll(() => {
  server.close();
});
describe('GET /health', () => {
  test('responds with 200', async () => {
    expect(await server.get('/health')).toBe(200);
  });
});
```

ESLint reports:

```text
3:1  error  Missing blank line before `afterAll`. Expected at least one blank line between the previous statement and this `afterAll` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-after-all-blocks
6:1  error  Missing blank line after `afterAll`. Expected at least one blank line between the `afterAll` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).  jest-formatting/padding-around-after-all-blocks
```

## Correct examples

```js
/* eslint jest-formatting/padding-around-after-all-blocks: "error" */
const server = startServer();

afterAll(() => {
  server.close();
});

describe('GET /health', () => {
  test('responds with 200', async () => {
    expect(await server.get('/health')).toBe(200);
  });
});
```

## Options

This rule has no options; configure only the severity. Passing options makes ESLint reject the configuration, because the rule's schema is empty.

```js
// eslint.config.js (flat); the same `rules` entry works in a legacy .eslintrc
import jestFormatting from 'eslint-plugin-jest-formatting';

export default [
  {
    plugins: { 'jest-formatting': jestFormatting },
    rules: {
      'jest-formatting/padding-around-after-all-blocks': 'error',
    },
  },
];
```

## Fixability

Fixable (`meta.fixable` is `"whitespace"`). `eslint --fix` resolves every report from this rule by inserting a newline after the last token of the statement before the gap, after any comment that trails on the same line, so that a blank line separates the two statements. The fix only adds whitespace; it never removes, moves, or reformats code.

Both messages are reported on the statement that should have a blank line above it. `{{token}}` is the identifier that matched, for example `afterAll`.

- `missingPaddingBefore`, reported on the `afterAll` call: Missing blank line before `{{token}}`. Expected at least one blank line between the previous statement and this `{{token}}` call. Fix: insert an empty line above it (autofixable with --fix).
- `missingPaddingAfter`, reported on the statement after the `afterAll` call: Missing blank line after `{{token}}`. Expected at least one blank line between the `{{token}}` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).
