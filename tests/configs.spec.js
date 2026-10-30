/**
 * Smoke tests: load the plugin the way users do, through ESLint's own config
 * loading, under flat config (eslint.config.js) and legacy eslintrc, and check
 * that the presets scope and fix files as the README says.
 *
 * `tests/catfood.js` is the unformatted fixture; its name does not match the
 * legacy test-file globs. `tests/dogfood.spec.js` is correctly formatted.
 */

/* eslint-disable @typescript-eslint/no-var-requires -- CommonJS test file */

const fs = require('fs');
const path = require('path');
const eslint = require('eslint');
// Resolved through `moduleNameMapper` in jest.config.js; see the note there.
// eslint-disable-next-line import/no-unresolved -- resolver predates package exports
const unsafe = require('eslint/use-at-your-own-risk');
const plugin = require('../lib');

const eslintMajor = Number(eslint.Linter.version.split('.')[0]);

// ESLint 8: `ESLint` is eslintrc and `FlatESLint` is flat.
// ESLint 9: `ESLint` is flat and `LegacyESLint` is eslintrc.
// ESLint 10: `ESLint` is flat and eslintrc support is gone.
const FlatESLint = eslintMajor >= 9 ? eslint.ESLint : unsafe.FlatESLint;
const LegacyESLint =
  eslintMajor <= 8 ? eslint.ESLint : unsafe.LegacyESLint || null;

const read = (file) => fs.readFileSync(path.join(__dirname, file), 'utf8');
const catfood = read('catfood.js');
const dogfood = read('dogfood.spec.js');

const RULE_PREFIX = 'jest-formatting/';
const MESSAGE_IDS = ['missingPaddingBefore', 'missingPaddingAfter'];

// Only this plugin's reports. The fixtures carry an eslint-disable comment for
// a rule that is not loaded here, which ESLint reports under that rule's id.
const pluginMessages = (result) =>
  result.messages.filter((m) => m.ruleId && m.ruleId.startsWith(RULE_PREFIX));

// A report without a messageId would be "Definition for rule ... was not
// found", which is how a plugin that failed to load shows up.
const expectPluginReports = (result, count) => {
  expect(result.messages.filter((m) => m.fatal)).toEqual([]);

  const messages = pluginMessages(result);

  messages.forEach((m) => {
    expect(MESSAGE_IDS).toContain(m.messageId);
    expect(m.message).toContain('Fix:');
  });
  expect(messages).toHaveLength(count);
};

// The unformatted fixture is missing a blank line in 11 places. `strict` runs
// the single `padding-around-all` rule and reports each gap once. `recommended`
// runs six rules and reports four of the gaps twice, once from each side, for
// example "after beforeEach" and "before afterAll" on the same line.
const CATFOOD_GAPS = 11;
const CATFOOD_REPORTS = { recommended: 15, strict: 11 };

const expectOnlyNewlinesAdded = (output) => {
  expect(output).toBeDefined();
  expect(output.replace(/\n/g, '')).toBe(catfood.replace(/\n/g, ''));
  expect(output.split('\n').length - catfood.split('\n').length).toBe(
    CATFOOD_GAPS,
  );
};

describe('flat config', () => {
  const lint = async (configs, code, filePath, fix = false) => {
    const linter = new FlatESLint({
      cwd: __dirname,
      overrideConfigFile: true,
      overrideConfig: configs,
      fix,
    });
    const [result] = await linter.lintText(code, { filePath });

    return result;
  };

  describe.each(['recommended', 'strict'])('flat/%s', (preset) => {
    const config = plugin.configs[`flat/${preset}`];

    it('is a named config object that carries the plugin', () => {
      expect(config.name).toBe(`jest-formatting/${preset}`);
      expect(config.plugins['jest-formatting']).toBe(plugin);
      expect(config.files).toBeUndefined();
    });

    it('reports the unformatted fixture on any file name', async () => {
      const result = await lint([config], catfood, 'catfood.js');

      expectPluginReports(result, CATFOOD_REPORTS[preset]);
    });

    it('accepts the formatted fixture', async () => {
      const result = await lint([config], dogfood, 'dogfood.spec.js');

      expectPluginReports(result, 0);
    });

    it('fixes the unformatted fixture by only adding newlines', async () => {
      const result = await lint([config], catfood, 'catfood.js', true);

      expectOnlyNewlinesAdded(result.output);
      expectPluginReports(result, 0);

      const again = await lint([config], result.output, 'catfood.js');

      expectPluginReports(again, 0);
    });

    it('can be scoped with a user-supplied files pattern', async () => {
      const scoped = [{ ...config, files: ['**/*.test.js'] }];

      expectPluginReports(await lint(scoped, catfood, 'catfood.js'), 0);
      expectPluginReports(
        await lint(scoped, catfood, 'catfood.test.js'),
        CATFOOD_REPORTS[preset],
      );
    });
  });
});

(LegacyESLint ? describe : describe.skip)('legacy eslintrc config', () => {
  const lint = async (preset, code, filePath, fix = false) => {
    const linter = new LegacyESLint({
      cwd: __dirname,
      useEslintrc: false,
      baseConfig: {
        extends: [`plugin:jest-formatting/${preset}`],
        parserOptions: { ecmaVersion: 2017 },
      },
      plugins: { 'eslint-plugin-jest-formatting': plugin },
      fix,
    });
    const [result] = await linter.lintText(code, { filePath });

    return result;
  };

  describe.each(['recommended', 'strict'])(
    'plugin:jest-formatting/%s',
    (preset) => {
      it('only applies to files matching the test globs', async () => {
        expectPluginReports(await lint(preset, catfood, 'catfood.js'), 0);
        expectPluginReports(await lint(preset, catfood, 'src/catfood.js'), 0);
      });

      it.each([
        'catfood.test.js',
        'catfood_test.js',
        'catfoodTest.js',
        'catfood.spec.js',
        'catfood_spec.js',
        'catfoodSpec.js',
        '__tests__/catfood.js',
      ])('reports the unformatted fixture as %s', async (filePath) => {
        const result = await lint(preset, catfood, filePath);

        expectPluginReports(result, CATFOOD_REPORTS[preset]);
      });

      it('accepts the formatted fixture', async () => {
        const result = await lint(preset, dogfood, 'dogfood.spec.js');

        expectPluginReports(result, 0);
      });

      it('fixes the unformatted fixture by only adding newlines', async () => {
        const result = await lint(preset, catfood, 'catfood.test.js', true);

        expectOnlyNewlinesAdded(result.output);
        expectPluginReports(result, 0);
      });
    },
  );
});
