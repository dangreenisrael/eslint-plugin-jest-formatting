/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import { makeRule } from './utils';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

export const rules = {
  'padding-before-describe-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: 'describe' },
  ]),
  'padding-before-test-blocks': makeRule([
    { blankLine: 'always', prev: '*', next: ['test', 'it'] },
  ]),
};
