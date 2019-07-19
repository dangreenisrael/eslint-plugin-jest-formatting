/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import { makeRule } from './utils';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

export const rules = {
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
