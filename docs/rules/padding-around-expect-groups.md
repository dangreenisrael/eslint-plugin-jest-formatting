# padding-around-expect-groups

- **Rule ID:** `jest-formatting/padding-around-expect-groups`
- **Presets:** not in `recommended`; covered by `padding-around-all` in `strict`
- **Fixable:** yes, `eslint --fix` inserts the missing blank lines
- **Options:** none
- **Message IDs:** `missingPaddingBefore`, `missingPaddingAfter`

## Rule summary

Require a blank line before and after every group of consecutive `expect` statements, with no blank line required inside the group.

- Matches every statement that starts with `expect`, including `await expect(...)`, `expect.assertions(...)`, and `expect.hasAssertions()`. A `return expect(...)` is a return statement and is not matched.
- Only neighbouring statements in the same block are compared: the top level of the file, a `{ ... }` block such as a callback body, or a `switch` case. The first statement in a block needs no blank line before it, and the last needs none after it.
- One blank line is enough; extra blank lines are never reported.
- Consecutive `expect` statements form one group and need no blank line between them; the group as a whole needs a blank line before it and after it.
- A comment on its own line is not a blank line, but a blank line on either side of a comment satisfies the rule.

## Why

Tests read best in arrange, act, assert order. Separating each run of assertions from the code that set up and produced the values makes it obvious which `expect` calls belong to which action, while keeping assertions about the same result together as one group.

## Incorrect examples

```js
/* eslint jest-formatting/padding-around-expect-groups: "error" */
test('thing one', () => {
  let abc = 123;
  expect(abc).toEqual(123);
  expect(123).toEqual(abc);
  abc = 456;
  expect(abc).toEqual(456);
});
```

ESLint reports:

```text
4:3  error  Missing blank line before `expect`. Expected at least one blank line between the previous statement and this `expect` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-expect-groups
6:3  error  Missing blank line after `expect`. Expected at least one blank line between the `expect` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).  jest-formatting/padding-around-expect-groups
7:3  error  Missing blank line before `expect`. Expected at least one blank line between the previous statement and this `expect` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-expect-groups
```

## Correct examples

```js
/* eslint jest-formatting/padding-around-expect-groups: "error" */
test('thing one', () => {
  let abc = 123;

  expect(abc).toEqual(123);
  expect(123).toEqual(abc);

  abc = 456;

  expect(abc).toEqual(456);
});
```

```js
/* eslint jest-formatting/padding-around-expect-groups: "error" */
test('resolves', async () => {
  await expect(fetchUser(1)).resolves.toEqual({ id: 1 });
  expect(cache.size).toBe(1);
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
      'jest-formatting/padding-around-expect-groups': 'error',
    },
  },
];
```

## Fixability

Fixable (`meta.fixable` is `"whitespace"`). `eslint --fix` resolves every report from this rule by inserting a newline after the last token of the statement before the gap, after any comment that trails on the same line, so that a blank line separates the two statements. The fix only adds whitespace; it never removes, moves, or reformats code.

Both messages are reported on the statement that should have a blank line above it. `{{token}}` is the identifier that matched, for example `expect`.

- `missingPaddingBefore`, reported on the `expect` call: Missing blank line before `{{token}}`. Expected at least one blank line between the previous statement and this `{{token}}` call. Fix: insert an empty line above it (autofixable with --fix).
- `missingPaddingAfter`, reported on the statement after the `expect` call: Missing blank line after `{{token}}`. Expected at least one blank line between the `{{token}}` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).
