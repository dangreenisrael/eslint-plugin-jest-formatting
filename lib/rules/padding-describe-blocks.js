/**
 * @fileoverview Enforces single line padding around describe blocks
 * @author Dan Green-Leipciger
 */
"use strict";

const { padBothSides } = require("../utils");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const beforeMessage =
  "You need a newline before a describe block when it comes after another expression";
const afterMessage =
  "You need a newline after a describe block when it comes before another expression";
const isDescribe = node =>
  node.expression && node.expression.callee.name === "describe";

module.exports = {
  meta: {
    docs: {
      description: "Enforces single line padding around describe blocks",
      category: "Fill me in",
      recommended: false
    },
    fixable: "whitespace", // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },
  beforeMessage,
  afterMessage,
  create(context) {
    return {
      ExpressionStatement(node) {
        if (!isDescribe(node)) {
          return;
        }
        padBothSides(context, node, isDescribe, beforeMessage, afterMessage);
      }
    };
  }
};
