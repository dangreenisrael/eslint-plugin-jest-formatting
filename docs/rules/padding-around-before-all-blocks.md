# padding-around-before-all-blocks

- **Rule ID:** `jest-formatting/padding-around-before-all-blocks`
- **Presets:** `recommended`; covered by `padding-around-all` in `strict`
- **Fixable:** yes, `eslint --fix` inserts the missing blank lines
- **Options:** none
- **Message IDs:** `missingPaddingBefore`, `missingPaddingAfter`

## Rule summary

Require a blank line before and after every `beforeAll` call.

- Matches every statement that starts with the identifier `beforeAll`.
- Only neighbouring statements in the same block are compared: the top level of the file, a `{ ... }` block such as a callback body, or a `switch` case. The first statement in a block needs no blank line before it, and the last needs none after it.
- One blank line is enough; extra blank lines are never reported.
- Two consecutive `beforeAll` calls also need a blank line between them.
- A comment on its own line is not a blank line, but a blank line on either side of a comment satisfies the rule.

## Why

`beforeAll` is one-time setup shared by every test in its scope. Separating it with blank lines makes the shared setup easy to spot and keeps it from reading as the first step of whichever test happens to follow it.

## Incorrect examples

```js
/* eslint jest-formatting/padding-around-before-all-blocks: "error" */
let db;
beforeAll(async () => {
  db = await connect();
});
test('reads a row', async () => {
  expect(await db.get(1)).toBeDefined();
});
```

ESLint reports:

```text
3:1  error  Missing blank line before `beforeAll`. Expected at least one blank line between the previous statement and this `beforeAll` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-before-all-blocks
6:1  error  Missing blank line after `beforeAll`. Expected at least one blank line between the `beforeAll` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).  jest-formatting/padding-around-before-all-blocks
```

## Correct examples

```js
/* eslint jest-formatting/padding-around-before-all-blocks: "error" */
let db;

beforeAll(async () => {
  db = await connect();
});

test('reads a row', async () => {
  expect(await db.get(1)).toBeDefined();
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
      'jest-formatting/padding-around-before-all-blocks': 'error',
    },
  },
];
```

## Fixability

Fixable (`meta.fixable` is `"whitespace"`). `eslint --fix` resolves every report from this rule by inserting a newline after the last token of the statement before the gap, after any comment that trails on the same line, so that a blank line separates the two statements. The fix only adds whitespace; it never removes, moves, or reformats code.

Both messages are reported on the statement that should have a blank line above it. `{{token}}` is the identifier that matched, for example `beforeAll`.

- `missingPaddingBefore`, reported on the `beforeAll` call: Missing blank line before `{{token}}`. Expected at least one blank line between the previous statement and this `{{token}}` call. Fix: insert an empty line above it (autofixable with --fix).
- `missingPaddingAfter`, reported on the statement after the `beforeAll` call: Missing blank line after `{{token}}`. Expected at least one blank line between the `{{token}}` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).
