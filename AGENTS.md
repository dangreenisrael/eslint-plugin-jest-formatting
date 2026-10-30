# AGENTS.md

Briefing for AI coding agents working with or on `eslint-plugin-jest-formatting`. Everything here is also in [README.md](README.md) and [docs/rules](docs/rules); this is the short version.

## What this plugin does

`eslint-plugin-jest-formatting` provides ESLint rules that require a blank line before and after Jest blocks: `describe`, `test`/`it`, `beforeAll`, `beforeEach`, `afterAll`, `afterEach`, and groups of `expect` statements. That is its whole scope. It does not check test correctness, naming, or structure; [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest) does that, and the two are used together.

Facts that hold for every rule:

- No options. Configure severity only.
- Autofixable with `eslint --fix`. The fixer only inserts newlines; it never removes or moves code.
- Only neighbouring statements in the same block are compared. The first statement in a block needs no blank line before it and the last needs none after it. One blank line is enough.
- A statement counts as a Jest call when it starts with the identifier (`describe(...)`, `describe.each(...)`, `await expect(...)`), not when the identifier appears later (`return expect(...)`, `const p = describe(...)`).
- Works with ESLint 8, 9, and 10, in flat config (`eslint.config.js`) and legacy `.eslintrc`. Requires Node 22 or later. There is no Jest version requirement: nothing is imported from Jest.

## Rules

| Rule                                | Requires a blank line                                                          | `recommended` | `strict` |
| ----------------------------------- | ------------------------------------------------------------------------------ | ------------- | -------- |
| `padding-around-after-all-blocks`   | before and after each `afterAll` call                                          | yes           | yes      |
| `padding-around-after-each-blocks`  | before and after each `afterEach` call                                         | yes           | yes      |
| `padding-around-before-all-blocks`  | before and after each `beforeAll` call                                         | yes           | yes      |
| `padding-around-before-each-blocks` | before and after each `beforeEach` call                                        | yes           | yes      |
| `padding-around-describe-blocks`    | before and after each `describe`, `fdescribe`, or `xdescribe` block            | yes           | yes      |
| `padding-around-expect-groups`      | before and after each run of consecutive `expect` statements, not between them | no            | yes      |
| `padding-around-test-blocks`        | before and after each `test`, `it`, `fit`, `xit`, or `xtest` block             | yes           | yes      |
| `padding-around-all`                | everything above, as one rule (one report per gap)                             | no            | yes      |

`recommended` enables the six rules marked yes individually. `strict` enables `padding-around-all` only, which covers the same statements plus `expect` groups. Each rule's page in `docs/rules/<rule>.md` has the same sections in the same order: Rule summary, Why, Incorrect examples, Correct examples, Options, Fixability.

## Configuration

Flat config (ESLint 9+, `eslint.config.js`):

```js
import jestFormatting from 'eslint-plugin-jest-formatting';

export default [
  jestFormatting.configs['flat/recommended'], // or 'flat/strict'
];
```

The flat configs set no `files`, so they apply wherever ESLint already lints. To limit them to test files, spread the config into an object with your own `files` (name the extensions; a bare `**/*.test.*` would also match Jest snapshot files):

```js
export default [
  {
    files: [
      '**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,mjs,cjs,ts,tsx}',
    ],
    ...jestFormatting.configs['flat/recommended'],
  },
];
```

Legacy config (`.eslintrc`), already scoped to common test-file globs:

```json
{
  "extends": ["plugin:jest-formatting/recommended"]
}
```

Use `"plugin:jest-formatting/strict"` for everything. Individual rules go in `rules` as `"jest-formatting/<rule>": "error"` in either style; flat config also needs `plugins: { 'jest-formatting': jestFormatting }`.

Fixing a tree: `npx eslint --fix .`

## Reading the output

Every report uses one of two messages. `{{token}}` is the Jest identifier that matched (`describe`, `xit`, `expect`, ...). Both are reported on the statement that should have a blank line above it.

- `missingPaddingBefore`: Missing blank line before `{{token}}`. Expected at least one blank line between the previous statement and this `{{token}}` call. Fix: insert an empty line above it (autofixable with --fix).
- `missingPaddingAfter`: Missing blank line after `{{token}}`. Expected at least one blank line between the `{{token}}` call above and this statement. Fix: insert an empty line between them (autofixable with --fix).

The message contains the fix, so there is no need to open the docs to act on it, and `eslint --fix` resolves all of them. When two rules both cover a gap (for example `beforeEach` followed by `describe` under `recommended`), the same line is reported twice, once per rule; one inserted blank line satisfies both.

## Working in this repository

Layout:

- `src/index.ts`: plugin entry. The rule table (`ruleDefinitions`), the preset rule lists, and the legacy and flat config objects. Exported with `export = plugin` (CommonJS).
- `src/rules/padding.ts`: the single rule factory `createRule`, the shared `messages`, and the statement-matching logic. All eight rules are instances of it.
- `src/ast-utils.ts`: token and blank-line helpers.
- `tests/lib/rules/*.spec.js`: one `RuleTester` spec per rule. `tests/lib/ast-utils.spec.ts`: helper tests.
- `tests/dogfood.spec.js` and `tests/catfood.js`: linted by `yarn lint` through the repo's own `.eslintrc`, which extends `plugin:jest-formatting/recommended`. The spec must pass clean; `catfood.js` has bad padding on purpose and must be ignored, because it does not match the legacy config's test-file globs.
- `docs/rules/*.md`: one page per rule in the fixed section order above. Each rule's `meta.docs.url` points at its page on the `master` branch.
- `lib/`: `tsc` output, git-ignored, and the package `main`. Build before loading the plugin.

Commands (Yarn 1, `yarn.lock` is checked in; without Yarn installed, `npx -y yarn@1 <script>` works):

```bash
yarn install --frozen-lockfile
yarn test     # tsc build, then jest
yarn lint     # build, prettier --check, eslint over the repo
yarn format   # the same, writing fixes
yarn build    # tsc only, into lib/
```

CI (`.github/workflows/ci.yml`) runs `yarn test` on each supported Node version and `yarn lint`; a `CI passed` job gates merges to `master`.

Guardrails:

- Rule behaviour is the public contract. Do not change what is reported, where it is reported, or what the fixer writes outside a major release. Rule names, the `recommended`, `strict`, `flat/recommended`, and `flat/strict` configs, and the two message IDs are public API.
- Never weaken or delete a spec assertion to make a build green; fix the cause.
- A rule change touches all of: `ruleDefinitions` in `src/index.ts`, its spec in `tests/lib/rules`, its page in `docs/rules`, and the rule lists in `README.md`, `AGENTS.md`, and `llms.txt`.
- Messages are shared by all rules and live in `src/rules/padding.ts`; specs assert `messageId` and `data.token`, so update them together.
- Specs use `parserOptions` because the dev dependency is ESLint 8. Under an ESLint 9+ `RuleTester` they need `languageOptions` instead.
- Releases are manual. Do not run `npm publish` or push `v*` tags.
