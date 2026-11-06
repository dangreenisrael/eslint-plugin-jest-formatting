# Changelog

## Unreleased (prerelease notes)

Development dependencies are upgraded to their latest versions. The published plugin's behavior, rules, messages and peer dependency range are unchanged.

### Changed

- Dev tooling: ESLint 10, Jest 30, ts-jest 29, Prettier 3, `@typescript-eslint` 8, `eslint-plugin-jest` 29, `eslint-config-prettier` 10, `eslint-plugin-prettier` 5, `eslint-plugin-import` 2.32, `eslint-import-resolver-typescript` 4, and updated `@types/*`.
- The repo now lints with a flat `eslint.config.js` (the `.eslintrc` and `.eslintignore` files are gone). `import/order` is off because `eslint-plugin-import` crashes on ESLint 10 when it reports.
- Rule specs use `languageOptions` instead of `parserOptions`. The legacy `.eslintrc` config tests are skipped on ESLint 10, which cannot load that format.
- TypeScript stays on 6.x: ts-jest does not yet support the TypeScript 7 compiler API. `tsconfig.json` sets `rootDir`, `types` and `strict: false` for TypeScript 6 defaults.

## v4.0.0 - November 2, 2026

Lint output is read by AI coding agents as often as by people, and agents act on rule messages literally. This release makes the plugin's messages, documentation and package easier for an agent, or a person, to understand and act on. The same code is reported at the same positions and `eslint --fix` writes the same output as in 3.1.0; the message text is new. Breaking Changes below lists what else can affect an upgrade.

### Added

- Flat config presets for ESLint 9 and 10: `configs['flat/recommended']` and `configs['flat/strict']`. Unlike the legacy presets they set no `files`, so your own config decides which files are linted. The legacy `plugin:jest-formatting/recommended` and `plugin:jest-formatting/strict` configs are unchanged. (#122, #120)
- Every report carries a `messageId`, `missingPaddingBefore` or `missingPaddingAfter`, and a message that names the matched Jest call, states the expected form, and says how to fix it. For example: Missing blank line before `describe`. Expected at least one blank line between the previous statement and this `describe` call. Fix: insert an empty line between the statements, before any comments leading the next statement (autofixable with --fix).
- Every rule declares `meta.type`, `meta.docs.description`, `meta.docs.url` and an empty `meta.schema`.
- Every rule page in `docs/rules` has the same sections: Rule summary, Why, Incorrect examples, Correct examples, Options, Fixability. The "ESLint reports" block under each incorrect example is real output, and a test keeps it that way.
- `AGENTS.md` and `llms.txt` for AI coding agents, and a README section on using the plugin with them.
- The plugin object exposes `meta.name` and `meta.version`.

### Breaking Changes

- Requires ESLint 8, 9 or 10 and Node 22 or later. ESLint 7 and earlier, and Node 20 and earlier, are no longer supported. npm warns on an `engines` mismatch; Yarn 1 refuses to install unless `--ignore-engines` is passed.
- The package exports one plugin object (`module.exports = plugin`) with `rules`, `configs` and `meta`, following eslint-plugin-jest. `require(...)`, `import plugin from ...` and `import { rules, configs } from ...` under TypeScript or a bundler keep working. In a native ESM file such as `eslint.config.mjs`, named imports (`import { configs } from 'eslint-plugin-jest-formatting'`) no longer resolve, and a namespace import (`import * as jestFormatting from ...`) no longer has `rules` or `configs`, so ESLint fails with `Could not find "<rule>" in plugin`. Use the default import.
- Rules now declare an empty `meta.schema`, so ESLint 8 rejects a rule configured with options, such as `["error", {}]`, and stops with `Configuration for rule ... is invalid`. These options never had any effect (ESLint 9 and later already rejected them); configure severity only.
- Rules now declare `meta.type: 'layout'`, so `eslint --fix-type layout` applies their fixes. It skipped them in 3.1.0.

### Changed

- The npm package contains only the compiled code, the rule docs, `AGENTS.md`, `llms.txt` and this changelog: 17 files, down from 47. Sources, tests and CI config are no longer shipped. The `module` field, which pointed at an unshipped TypeScript file, is gone.

### Fixed

- Rules load on ESLint 10, where `context.getSourceCode()` was removed.

### Internal

- CI runs on GitHub Actions against Node 22, 24 and 26. The CircleCI configuration, including its tag-triggered publish job, is gone; releases are manual.
- New tests load the plugin through ESLint's own config loading under flat and legacy config, and check every rule's metadata and documentation page against the built plugin.

## v3.0.0 - May 4, 2021

### Breaking Changes

- Padding is no longer enforced between statements and `await`ed statements of the same kind.

## v1.1.0 - August 14, 2019

### Changed

- Removed `padding-around-expect-groups` from the "recommended" set of rules.

### Added

- Exposes "strict" rules for eslint `extends`. This preset is equivalent to version `1.0.0`'s "recommended" preset.

## v1.0.0 - August 12, 2019

### Added

- Exposes "recommended" rules for eslint `extends`

- Improve documentation

### Deprecated

- The `padding-before-all` rule has been deprecated

## v0.1.0 - July 20, 2019

### Rules Added

- `padding-before-all`

- `padding-before-after-all-blocks`

- `padding-before-after-each-blocks`

- `padding-before-before-all-blocks`

- `padding-before-before-each-blocks`

- `padding-before-expect-statements`

### Other

- Security update of lodash
