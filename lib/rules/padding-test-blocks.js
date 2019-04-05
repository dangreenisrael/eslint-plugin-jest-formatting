/**
 * @fileoverview Enforces a single like of padding between test blocks with a describe
 * @author Dan
 */
"use strict";

const { padBothSides } = require("../utils");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const beforeMessage =
  "You need a newline before an `it` or `test` block when it comes after another expression";
const afterMessage =
  "You need a newline after an `it` or `test` block when it comes after another expression";
const expressionName = node =>
  node.expression && node.expression.callee && node.expression.callee.name;
const isTestBlock = node =>
  expressionName(node) === "test" || expressionName(node) === "it";

module.exports = {
  meta: {
    docs: {
      description:
        "Enforces a single line of padding between test blocks within a describe",
      category: "Formatting",
      recommended: true
    },
    fixable: "whitespace", // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },
  beforeMessage,
  afterMessage,
  create(context) {
    const filePath = context && context.getFilename();
    const isTestFile =
      filePath.includes("test") ||
      filePath.includes("spec") ||
      filePath.includes("<input>");
    return {
      ExpressionStatement(node) {
        if (!isTestFile || !isTestBlock(node)) {
          return;
        }
        padBothSides(context, node, isTestBlock, beforeMessage, afterMessage);
      }
    };
  }
};
