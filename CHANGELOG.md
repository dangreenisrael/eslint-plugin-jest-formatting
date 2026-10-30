# Changelog

## v3.2.0 - October 30, 2026

Lint output is read by AI coding agents as often as by people, and agents act on rule messages literally. This release makes the plugin's messages, documentation and package easier for an agent, or a person, to understand and act on. Rule behaviour is unchanged: the same code is reported at the same positions and fixed to the same output as in 3.1.0.

### Added

- Flat config presets for ESLint 9 and 10: `configs['flat/recommended']` and `configs['flat/strict']`. Unlike the legacy presets they set no `files`, so your own config decides which files are linted. The legacy `plugin:jest-formatting/recommended` and `plugin:jest-formatting/strict` configs are unchanged. (#122, #120)
- Every report carries a `messageId`, `missingPaddingBefore` or `missingPaddingAfter`, and a message that names the matched Jest call, states the expected form, and says how to fix it. For example: Missing blank line before `describe`. Expected at least one blank line between the previous statement and this `describe` call. Fix: insert an empty line above it (autofixable with --fix).
- Every rule declares `meta.type`, `meta.docs.description`, `meta.docs.url` and an empty `meta.schema`.
- Every rule page in `docs/rules` has the same sections: Rule summary, Why, Incorrect examples, Correct examples, Options, Fixability. The "ESLint reports" block under each incorrect example is real output, and a test keeps it that way.
- `AGENTS.md` and `llms.txt` for AI coding agents, and a README section on using the plugin with them.
- The plugin object exposes `meta.name` and `meta.version`.

### Changed

- Requires ESLint 8, 9 or 10 and Node 22 or later. ESLint 7 and earlier, and Node 20 and earlier, are no longer supported. npm warns on an `engines` mismatch; Yarn 1 refuses to install unless `--ignore-engines` is passed.
- The package exports one plugin object (`module.exports = plugin`) with `rules`, `configs` and `meta`, following eslint-plugin-jest. `require(...)`, `import plugin from ...` and `import { rules, configs } from ...` under TypeScript or a bundler keep working. Native ESM named imports (`import { configs } from 'eslint-plugin-jest-formatting'` in a `.mjs` file) no longer resolve; use the default import.
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
