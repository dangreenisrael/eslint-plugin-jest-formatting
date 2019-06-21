/**
 * @fileoverview Enforces single line padding around describe blocks
 * @author Dan Green-Leipciger
 */
'use strict';

import { padBefore } from '../utils';
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const beforeMessage =
  'You need a newline or comment before a describe block when it comes after another expression';

const isDescribe = node =>
  node.expression &&
  node.expression.callee &&
  node.expression.callee.name === 'describe';

export default {
  meta: {
    docs: {
      description: 'Enforces at least a line of padding before describe blocks',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: 'whitespace', // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },
  beforeMessage,
  create(context) {
    const filePath = context && context.getFilename();
    const isTest =
      filePath.includes('test') ||
      filePath.includes('spec') ||
      filePath.includes('<input>');
    return {
      ExpressionStatement(node) {
        if (!isTest || !isDescribe(node)) {
          return;
        }
        padBefore({ context, node, beforeMessage });
      },
    };
  },
};
