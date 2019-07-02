/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import padding from './rules/padding';
import paddingBeforeDescribeBlocks from './rules/padding-before-describe-blocks';
import paddingBeforeTestBlocks from './rules/padding-before-test-blocks';
import paddingBeforeExpectStatements from "./rules/padding-before-expect-statements";

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules

export const rules = {
  padding,
  'padding-before-describe-blocks': paddingBeforeDescribeBlocks,
  'padding-before-test-blocks': paddingBeforeTestBlocks,
  'padding-before-expect-statements': paddingBeforeExpectStatements,
};
