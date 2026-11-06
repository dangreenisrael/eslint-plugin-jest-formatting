const { FlatCompat } = require('@eslint/eslintrc');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const jestPlugin = require('eslint-plugin-jest');
const jestFormatting = require('eslint-plugin-jest-formatting');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  { ignores: ['lib/**', 'node_modules/**', 'tests/catfood.js'] },
  ...compat.extends('airbnb-base', 'plugin:import/typescript'),
  ...typescriptPlugin.configs['flat/recommended'],
  prettierRecommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: typescriptParser,
      sourceType: 'module',
    },
    rules: {
      camelcase: 'off',
      'no-plusplus': 'off',
      'import/extensions': 'off',
      // eslint-plugin-import crashes on ESLint 10 when this rule reports.
      'import/order': 'off',
      'no-shadow': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-shadow': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
  },
  {
    files: [
      '**/*{.test,_test,Test,.spec,_spec,Spec}.{js,jsx,mjs,cjs,mts,cts,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,mjs,cjs,mts,cts,ts,tsx}',
    ],
    ...jestFormatting.configs['flat/recommended'],
    plugins: {
      ...jestFormatting.configs['flat/recommended'].plugins,
      jest: jestPlugin,
    },
    languageOptions: { globals: jestPlugin.environments.globals.globals },
  },
];
