/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import { makeRule } from './utils';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

export const rules = {
  'padding-around-after-all-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'afterAll' },
    { blankLine: 'always', prev: 'afterAll', next: '*' },
  ]),
  'padding-around-after-each-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'afterEach' },
    { blankLine: 'always', prev: 'afterEach', next: '*' },
  ]),
  'padding-around-before-all-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'beforeAll' },
    { blankLine: 'always', prev: 'beforeAll', next: '*' },
  ]),
  'padding-around-before-each-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'beforeEach' },
    { blankLine: 'always', prev: 'beforeEach', next: '*' },
  ]),
  'padding-around-describe-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'describe' },
    { blankLine: 'always', prev: 'describe', next: '*' },
  ]),
  'padding-around-test-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: ['test', 'it'] },
    { blankLine: 'always', prev: ['test', 'it'], next: '*' },
  ]),
  // Deprecated
  'padding-before-after-all-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'afterAll' },
  ]),
  'padding-before-after-each-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'afterEach' },
  ]),
  'padding-before-before-all-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'beforeAll' },
  ]),
  'padding-before-before-each-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'beforeEach' },
  ]),
  'padding-before-describe-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'describe' },
  ]),
  'padding-before-expect-statements': makeRule([
    { blankLine: 'always', prev: '*', next: 'expect' },
    { blankLine: 'any', prev: 'expect', next: 'expect' },
  ]),
  'padding-around-expect-groups': makeRule([
    { blankLine: 'always', prev: '*', next: 'expect' },
    { blankLine: 'always', prev: 'expect', next: '*' },
    { blankLine: 'any', prev: 'expect', next: 'expect' },
  ]),
  'padding-before-test-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: ['test', 'it'] },
  ]),
  'padding-before-all': makeRule([
    {
      blankLine: 'always',
      prev: '*',
      next: [
        'afterAll',
        'afterEach',
        'beforeAll',
        'beforeEach',
        'describe',
        'expect',
        'it',
        'test',
      ],
    },
    { blankLine: 'any', prev: 'expect', next: 'expect' },
  ]),
};

export const configs = {
  recommended: {
    plugins: ['jest-formatting'],
    rules: {
      'jest-formatting/padding-around-after-all-blocks': 2,
      'jest-formatting/padding-around-after-each-blocks': 2,
      'jest-formatting/padding-around-before-all-blocks': 2,
      'jest-formatting/padding-around-before-each-blocks': 2,
      'jest-formatting/padding-around-describe-blocks': 2,
      'jest-formatting/padding-around-test-blocks': 2,
    },
  },
  strict: {
    plugins: ['jest-formatting'],
    rules: {
      'jest-formatting/padding-around-after-all-blocks': 2,
      'jest-formatting/padding-around-after-each-blocks': 2,
      'jest-formatting/padding-around-before-all-blocks': 2,
      'jest-formatting/padding-around-before-each-blocks': 2,
      'jest-formatting/padding-around-expect-groups': 2,
      'jest-formatting/padding-around-describe-blocks': 2,
      'jest-formatting/padding-around-test-blocks': 2,
    },
  },
};
