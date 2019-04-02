/**
 * @fileoverview Enforces single line padding around describe blocks
 * @author Dan Green-Leipciger
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const setPaddingBetweenNodes = ({
  context,
  problemNode,
  firstNode,
  secondNode,
  message
}) => {
  context.report({
    node: problemNode,
    message,
    fix: function(fixer) {
      return [
        fixer.removeRange([
          firstNode.end,
          secondNode.start - secondNode.loc.start.column
        ]),
        fixer.insertTextAfter(firstNode, "\n\n")
      ];
    }
  });
};

const getLeftSibling = node => {
  const siblings = node.parent.body;
  return siblings.find(s => s.end === node.start - 1);
};

const getRightSibling = node => {
  const siblings = node.parent.body;
  return siblings.find(s => s.start === node.end + 1);
};

const getStartLine = node => node && node.loc.start.line;
const getEndLine = node => node && node.loc.start.line;

const beforeMessage =
  "You need a newline before a describe block when it comes after another expression";
const afterMessage =
  "You need a newline after a describe block when it comes before another expression";

const isNotDescribe = node => node.expression.callee.name !== "describe";

const shouldFixGap = (bottomNode, topNode) =>
  getStartLine(topNode) - getEndLine(bottomNode) !== 2;

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
        if (isNotDescribe(node)) {
          return;
        }
        const leftSibling = getLeftSibling(node);
        const rightSibling = getRightSibling(node);

        if (
          leftSibling &&
          isNotDescribe(leftSibling) &&
          shouldFixGap(leftSibling, node)
        ) {
          setPaddingBetweenNodes({
            context,
            problemNode: node,
            firstNode: leftSibling,
            secondNode: node,
            message: beforeMessage
          });
        }

        if (rightSibling && shouldFixGap(node, rightSibling)) {
          setPaddingBetweenNodes({
            context,
            problemNode: node,
            firstNode: node,
            secondNode: rightSibling,
            message: afterMessage
          });
        }
      }
    };
  }
};
