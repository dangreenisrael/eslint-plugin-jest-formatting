/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import { Linter, Rule } from 'eslint';
import {
  Config,
  createRule,
  PaddingType,
  StatementType,
} from './rules/padding';

// The plugin's name and version are read from package.json so that ESLint
// (9+) can use them for caching and in the config inspector.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

const packageName: string = packageJson.name;
const packageVersion: string = packageJson.version;

const paddingConfigs: { [name: string]: Config[] } = {
  afterAll: [
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.AfterAllToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.AfterAllToken,
      nextStatementType: StatementType.Any,
    },
  ],
  afterEach: [
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.AfterEachToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.AfterEachToken,
      nextStatementType: StatementType.Any,
    },
  ],
  beforeAll: [
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.BeforeAllToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.BeforeAllToken,
      nextStatementType: StatementType.Any,
    },
  ],
  beforeEach: [
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.BeforeEachToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.BeforeEachToken,
      nextStatementType: StatementType.Any,
    },
  ],
  describe: [
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: [
        StatementType.DescribeToken,
        StatementType.FdescribeToken,
        StatementType.XdescribeToken,
      ],
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: [
        StatementType.DescribeToken,
        StatementType.FdescribeToken,
        StatementType.XdescribeToken,
      ],
      nextStatementType: StatementType.Any,
    },
  ],
  expect: [
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.ExpectToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.ExpectToken,
      nextStatementType: StatementType.Any,
    },
    {
      paddingType: PaddingType.Any,
      prevStatementType: StatementType.ExpectToken,
      nextStatementType: StatementType.ExpectToken,
    },
  ],
  test: [
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: [
        StatementType.TestToken,
        StatementType.ItToken,
        StatementType.FitToken,
        StatementType.XitToken,
        StatementType.XtestToken,
      ],
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: [
        StatementType.TestToken,
        StatementType.ItToken,
        StatementType.FitToken,
        StatementType.XitToken,
        StatementType.XtestToken,
      ],
      nextStatementType: StatementType.Any,
    },
  ],
};

const rules: { [name: string]: Rule.RuleModule } = {
  'padding-around-after-all-blocks': createRule(paddingConfigs.afterAll),
  'padding-around-after-each-blocks': createRule(paddingConfigs.afterEach),
  'padding-around-before-all-blocks': createRule(paddingConfigs.beforeAll),
  'padding-around-before-each-blocks': createRule(paddingConfigs.beforeEach),
  'padding-around-describe-blocks': createRule(paddingConfigs.describe),
  'padding-around-expect-groups': createRule(paddingConfigs.expect),
  'padding-around-test-blocks': createRule(paddingConfigs.test),
  'padding-around-all': createRule(
    [].concat(...Object.keys(paddingConfigs).map((k) => paddingConfigs[k])),
  ),
};

// The legacy (eslintrc) configs only apply the rules to files matching these
// globs. Flat configs do not scope by file; see `createFlatConfig` below.
const testFileGlobs = [
  '**/*.test.*',
  '**/*_test.*',
  '**/*Test.*',
  '**/*.spec.*',
  '**/*_spec.*',
  '**/*Spec.*',
  '**/__tests__/*',
];

const recommendedRules: Linter.RulesRecord = {
  'jest-formatting/padding-around-after-all-blocks': 2,
  'jest-formatting/padding-around-after-each-blocks': 2,
  'jest-formatting/padding-around-before-all-blocks': 2,
  'jest-formatting/padding-around-before-each-blocks': 2,
  'jest-formatting/padding-around-describe-blocks': 2,
  'jest-formatting/padding-around-test-blocks': 2,
};

const strictRules: Linter.RulesRecord = {
  'jest-formatting/padding-around-all': 2,
};

// Minimal flat config shape. @types/eslint 7 predates flat config, so this is
// declared locally rather than imported.
interface FlatConfig {
  name: string;
  // eslint-disable-next-line no-use-before-define -- FlatConfig and Plugin reference each other
  plugins: { 'jest-formatting': Plugin };
  rules: Linter.RulesRecord;
}

interface Plugin {
  meta: { name: string; version: string };
  rules: { [name: string]: Rule.RuleModule };
  configs: {
    recommended: Linter.Config;
    strict: Linter.Config;
    'flat/recommended': FlatConfig;
    'flat/strict': FlatConfig;
  };
}

const plugin: Plugin = {
  meta: { name: packageName, version: packageVersion },
  rules,
  configs: {} as Plugin['configs'],
};

// Legacy eslintrc config: `extends: ['plugin:jest-formatting/recommended']`
const createLegacyConfig = (
  configRules: Linter.RulesRecord,
): Linter.Config => ({
  plugins: ['jest-formatting'],
  overrides: [
    {
      files: [...testFileGlobs],
      rules: configRules,
    },
  ],
});

// Flat config (ESLint 9+): `jestFormatting.configs['flat/recommended']`
//
// Unlike the legacy configs, no `files` globs are set. In flat config a
// `files` pattern opts matching files *into* linting, and `**/*.test.*` would
// pull in Jest snapshots (`foo.test.ts.snap`) and other non-JS files. Users
// who want to scope the rules add their own `files` to the config object.
// This mirrors eslint-plugin-jest's flat configs.
const createFlatConfig = (
  configName: string,
  configRules: Linter.RulesRecord,
): FlatConfig => ({
  name: `jest-formatting/${configName}`,
  plugins: { 'jest-formatting': plugin },
  rules: configRules,
});

plugin.configs = {
  recommended: createLegacyConfig(recommendedRules),
  strict: createLegacyConfig(strictRules),
  'flat/recommended': createFlatConfig('recommended', recommendedRules),
  'flat/strict': createFlatConfig('strict', strictRules),
};

export = plugin;
