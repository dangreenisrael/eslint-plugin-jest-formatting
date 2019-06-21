/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import paddingBeforeDescribeBlocks from './rules/padding-before-describe-blocks';
import paddingBeforeTestBlocks from './rules/padding-before-test-blocks';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules

export const rules = {
  'padding-before-describe-blocks': paddingBeforeDescribeBlocks,
  'padding-before-test-blocks': paddingBeforeTestBlocks,
};
