/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const paddingBeforeDescribeBlocks = require('./rules/padding-before-describe-blocks')
const paddingBeforeTestBlocks = require('./rules/padding-before-test-blocks')

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules

module.exports.rules = {
    'padding-before-describe-blocks':paddingBeforeDescribeBlocks,
    'padding-before-test-blocks':paddingBeforeTestBlocks,
}

