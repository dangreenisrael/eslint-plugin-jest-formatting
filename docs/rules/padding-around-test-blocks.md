# padding-around-test-blocks

- **Rule ID:** `jest-formatting/padding-around-test-blocks`
- **Presets:** `recommended`; covered by `padding-around-all` in `strict`
- **Fixable:** yes, `eslint --fix` inserts the missing blank lines
- **Options:** none
- **Message IDs:** `missingPaddingBefore`, `missingPaddingAfter`

## Rule summary

Require a blank line before and after every `test` or `it` block, including `fit`, `xit`, and `xtest`.

- Matches every statement that starts with `test`, `it`, `fit`, `xit`, or `xtest`, including `test.each(...)`, `it.only(...)`, `test.skip(...)`, and `test.todo(...)`.
- Only neighbouring statements in the same block are compared: the top level of the file, a `{ ... }` block such as a callback body, or a `switch` case. The first statement in a block needs no blank line before it, and the last needs none after it.
- One blank line is enough; extra blank lines are never reported.
- Consecutive tests need a blank line between them.
- A comment on its own line is not a blank line, but a blank line on either side of a comment satisfies the rule.

## Why

Each `test` or `it` block is one self-contained case. A blank line between cases, and between a case and the surrounding setup, makes individual tests easy to find, count, and move, and keeps one test's body from running visually into the next.

## Incorrect examples

```js
/* eslint jest-formatting/padding-around-test-blocks: "error" */
const thing = 123;
test('foo', () => {});
test.each([1, 2])('bar %i', () => {});
```

ESLint reports:

```text
3:1  error  Missing blank line before `test`. Expected at least one blank line between the previous statement and this `test` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-test-blocks
4:1  error  Missing blank line after `test`. Expected at least one blank line between the `test` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).  jest-formatting/padding-around-test-blocks
```

```js
/* eslint jest-formatting/padding-around-test-blocks: "error" */
describe('suite', () => {
  const thing = 123;
  it('foo', () => {});
  xit('bar', () => {});
});
```

ESLint reports:

```text
4:3  error  Missing blank line before `it`. Expected at least one blank line between the previous statement and this `it` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-test-blocks
5:3  error  Missing blank line after `it`. Expected at least one blank line between the `it` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).  jest-formatting/padding-around-test-blocks
```

## Correct examples

```js
/* eslint jest-formatting/padding-around-test-blocks: "error" */
const thing = 123;

test('foo', () => {});

test.each([1, 2])('bar %i', () => {});
```

```js
/* eslint jest-formatting/padding-around-test-blocks: "error" */
describe('suite', () => {
  const thing = 123;

  it('foo', () => {});

  xit('bar', () => {});
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
      'jest-formatting/padding-around-test-blocks': 'error',
    },
  },
];
```

## Fixability

Fixable (`meta.fixable` is `"whitespace"`). `eslint --fix` resolves every report from this rule by inserting a newline after the last token of the statement before the gap, after any comment that trails on the same line, so that a blank line separates the two statements. The fix only adds whitespace; it never removes, moves, or reformats code.

Both messages are reported on the statement that should have a blank line above it. `{{token}}` is the identifier that matched, for example `xit`.

- `missingPaddingBefore`, reported on the `test` or `it` call: Missing blank line before `{{token}}`. Expected at least one blank line between the previous statement and this `{{token}}` call. Fix: insert an empty line above it (autofixable with --fix).
- `missingPaddingAfter`, reported on the statement after the `test` or `it` call: Missing blank line after `{{token}}`. Expected at least one blank line between the `{{token}}` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).
