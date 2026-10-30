# padding-around-all

- **Rule ID:** `jest-formatting/padding-around-all`
- **Presets:** `strict`
- **Fixable:** yes, `eslint --fix` inserts the missing blank lines
- **Options:** none
- **Message IDs:** `missingPaddingBefore`, `missingPaddingAfter`

## Rule summary

Require a blank line before and after every Jest hook, `describe` block, `test` or `it` block, and group of `expect` statements, as a single rule that combines the seven `padding-around-*` rules.

- Covers exactly the statements matched by [padding-around-after-all-blocks](padding-around-after-all-blocks.md), [padding-around-after-each-blocks](padding-around-after-each-blocks.md), [padding-around-before-all-blocks](padding-around-before-all-blocks.md), [padding-around-before-each-blocks](padding-around-before-each-blocks.md), [padding-around-describe-blocks](padding-around-describe-blocks.md), [padding-around-expect-groups](padding-around-expect-groups.md), and [padding-around-test-blocks](padding-around-test-blocks.md).
- It is one rule, not an alias for seven: a gap is reported once even where two of the individual rules would both report it, and an `eslint-disable` comment must name `padding-around-all`.
- Only neighbouring statements in the same block are compared: the top level of the file, a `{ ... }` block such as a callback body, or a `switch` case. The first statement in a block needs no blank line before it, and the last needs none after it.
- One blank line is enough; extra blank lines are never reported.
- Consecutive `expect` statements need no blank line between them; every other pair of consecutive Jest calls does.
- A comment on its own line is not a blank line, but a blank line on either side of a comment satisfies the rule.

## Why

Using one rule for all Jest blocks gives a file a single consistent rhythm: every hook, suite, test, and assertion group is set off by blank lines. It is the rule behind the `strict` configs. Because it is a single rule, a gap between two different kinds of block (for example `beforeEach` followed by `describe`) is reported once, whereas enabling the seven individual rules reports that gap twice. To pad only some kinds of block, enable the individual rules instead of this one.

## Incorrect examples

```js
/* eslint jest-formatting/padding-around-all: "error" */
const db = connect();
beforeAll(() => db.migrate());
afterAll(() => db.close());
describe('users', () => {
  beforeEach(() => db.reset());
  test('creates a user', async () => {
    const user = await db.users.create({ name: 'Ada' });
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Ada');
  });
  test('rejects an empty name', async () => {
    await expect(db.users.create({ name: '' })).rejects.toThrow();
  });
});
```

ESLint reports:

```text
3:1  error  Missing blank line before `beforeAll`. Expected at least one blank line between the previous statement and this `beforeAll` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-all
4:1  error  Missing blank line after `beforeAll`. Expected at least one blank line between the `beforeAll` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).  jest-formatting/padding-around-all
5:1  error  Missing blank line before `describe`. Expected at least one blank line between the previous statement and this `describe` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-all
7:3  error  Missing blank line before `test`. Expected at least one blank line between the previous statement and this `test` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-all
9:5  error  Missing blank line before `expect`. Expected at least one blank line between the previous statement and this `expect` call. Fix: insert an empty line above it (autofixable with --fix).  jest-formatting/padding-around-all
12:3  error  Missing blank line after `test`. Expected at least one blank line between the `test` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).  jest-formatting/padding-around-all
```

## Correct examples

```js
/* eslint jest-formatting/padding-around-all: "error" */
const db = connect();

beforeAll(() => db.migrate());

afterAll(() => db.close());

describe('users', () => {
  beforeEach(() => db.reset());

  test('creates a user', async () => {
    const user = await db.users.create({ name: 'Ada' });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('Ada');
  });

  test('rejects an empty name', async () => {
    await expect(db.users.create({ name: '' })).rejects.toThrow();
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
      'jest-formatting/padding-around-all': 'error',
    },
  },
];
```

## Fixability

Fixable (`meta.fixable` is `"whitespace"`). `eslint --fix` resolves every report from this rule by inserting a newline after the last token of the statement before the gap, after any comment that trails on the same line, so that a blank line separates the two statements. The fix only adds whitespace; it never removes, moves, or reformats code.

Both messages are reported on the statement that should have a blank line above it. `{{token}}` is the identifier that matched, for example `beforeEach`.

- `missingPaddingBefore`, reported on the Jest call: Missing blank line before `{{token}}`. Expected at least one blank line between the previous statement and this `{{token}}` call. Fix: insert an empty line above it (autofixable with --fix).
- `missingPaddingAfter`, reported on the statement after the Jest call: Missing blank line after `{{token}}`. Expected at least one blank line between the `{{token}}` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).
