/**
 * @fileoverview Enforces a single like of padding between test blocks with a describe
 * @author Dan
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const message = "`test` blocks must have 1 line between them";
module.exports = {
  message,
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

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const correctTestPadding = (firstNode, secondNode) => {
      if (secondNode.loc.start.line - firstNode.loc.end.line !== 2) {
        context.report({
          node: secondNode,
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
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Identifier(node) {
        if (node.name !== "describe") {
          return;
        }
        const describeBlock = node.parent.arguments[1].body;
        const itStatements = describeBlock.body;
        itStatements.reduce((firstNode, secondNode) => {
          if (!firstNode) {
            // Skip the first node as it is *not* between 2 test blocks
            return secondNode;
          }
          correctTestPadding(firstNode, secondNode);
          return secondNode;
        }, undefined);
      }
    };
  }
};
