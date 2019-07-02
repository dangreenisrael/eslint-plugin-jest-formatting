/**
 * @fileoverview Rule to require or disallow newlines between jest functions,
 *   based on eslint/padding-line-between-statements by Toru Nagashima
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require('eslint/lib/util/ast-utils');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const LT = `[${Array.from(astUtils.LINEBREAKS).join('')}]`;
const PADDING_LINE_SEQUENCE = new RegExp(
  String.raw`^(\s*?${LT})\s*${LT}(\s*;?)$`,
  'u',
);

/**
 * Creates tester which check if an expression node has a certain name
 *
 * @param {string} name The Jest function name to test.
 * @returns {Object} the created tester.
 * @private
 */
function newJestTokenTester(name) {
  return {
    test: (node, sourceCode) => {
      const token = sourceCode.getFirstToken(node);

      return (
        node.type === 'ExpressionStatement' &&
        token.type === 'Identifier' &&
        token.value === name
      );
    },
  };
}

/**
 * Gets the actual last token.
 *
 * If a semicolon is semicolon-less style's semicolon, this ignores it.
 * For example:
 *
 *     foo()
 *     ;[1, 2, 3].forEach(bar)
 *
 * @param {SourceCode} sourceCode The source code to get tokens.
 * @param {ASTNode} node The node to get.
 * @returns {Token} The actual last token.
 * @private
 */
function getActualLastToken(sourceCode, node) {
  const semiToken = sourceCode.getLastToken(node);
  const prevToken = sourceCode.getTokenBefore(semiToken);
  const nextToken = sourceCode.getTokenAfter(semiToken);
  const isSemicolonLessStyle = Boolean(
    prevToken &&
      nextToken &&
      prevToken.range[0] >= node.range[0] &&
      astUtils.isSemicolonToken(semiToken) &&
      semiToken.loc.start.line !== prevToken.loc.end.line &&
      semiToken.loc.end.line === nextToken.loc.start.line,
  );

  return isSemicolonLessStyle ? prevToken : semiToken;
}

/**
 * This returns the concatenation of the first 2 captured strings.
 * @param {string} _ Unused. Whole matched string.
 * @param {string} trailingSpaces The trailing spaces of the first line.
 * @param {string} indentSpaces The indentation spaces of the last line.
 * @returns {string} The concatenation of trailingSpaces and indentSpaces.
 * @private
 */
function replacerToRemovePaddingLines(_, trailingSpaces, indentSpaces) {
  return trailingSpaces + indentSpaces;
}

/**
 * Check and report statements for `any` configuration.
 * It does nothing.
 *
 * @returns {void}
 * @private
 */
function verifyForAny() {}

/**
 * Check and report statements for `never` configuration.
 * This autofix removes blank lines between the given 2 statements.
 * However, if comments exist between 2 blank lines, it does not remove those
 * blank lines automatically.
 *
 * @param {RuleContext} context The rule context to report.
 * @param {ASTNode} _ Unused. The previous node to check.
 * @param {ASTNode} nextNode The next node to check.
 * @param {Array<Token[]>} paddingLines The array of token pairs that blank
 * lines exist between the pair.
 * @returns {void}
 * @private
 */
function verifyForNever(context, _, nextNode, paddingLines) {
  if (paddingLines.length === 0) {
    return;
  }

  context.report({
    node: nextNode,
    message: 'Unexpected blank line before this statement.',
    fix(fixer) {
      if (paddingLines.length >= 2) {
        return null;
      }

      const prevToken = paddingLines[0][0];
      const nextToken = paddingLines[0][1];
      const start = prevToken.range[1];
      const end = nextToken.range[0];
      const text = context
        .getSourceCode()
        .text.slice(start, end)
        .replace(PADDING_LINE_SEQUENCE, replacerToRemovePaddingLines);

      return fixer.replaceTextRange([start, end], text);
    },
  });
}

/**
 * Check and report statements for `always` configuration.
 * This autofix inserts a blank line between the given 2 statements.
 * If the `prevNode` has trailing comments, it inserts a blank line after the
 * trailing comments.
 *
 * @param {RuleContext} context The rule context to report.
 * @param {ASTNode} prevNode The previous node to check.
 * @param {ASTNode} nextNode The next node to check.
 * @param {Array<Token[]>} paddingLines The array of token pairs that blank
 * lines exist between the pair.
 * @returns {void}
 * @private
 */
function verifyForAlways(context, prevNode, nextNode, paddingLines) {
  if (paddingLines.length > 0) {
    return;
  }

  context.report({
    node: nextNode,
    message: 'Expected blank line before this statement.',
    fix(fixer) {
      const sourceCode = context.getSourceCode();
      let prevToken = getActualLastToken(sourceCode, prevNode);
      const nextToken =
        sourceCode.getFirstTokenBetween(prevToken, nextNode, {
          includeComments: true,

          /**
           * Skip the trailing comments of the previous node.
           * This inserts a blank line after the last trailing comment.
           *
           * For example:
           *
           *     foo(); // trailing comment.
           *     // comment.
           *     bar();
           *
           * Get fixed to:
           *
           *     foo(); // trailing comment.
           *
           *     // comment.
           *     bar();
           *
           * @param {Token} token The token to check.
           * @returns {boolean} `true` if the token is not a trailing comment.
           * @private
           */
          filter(token) {
            if (astUtils.isTokenOnSameLine(prevToken, token)) {
              prevToken = token;
              return false;
            }
            return true;
          },
        }) || nextNode;
      const insertText = astUtils.isTokenOnSameLine(prevToken, nextToken)
        ? '\n\n'
        : '\n';

      return fixer.insertTextAfter(prevToken, insertText);
    },
  });
}

/**
 * Types of blank lines.
 * `any`, `never`, and `always` are defined.
 * Those have `verify` method to check and report statements.
 * @private
 */
const PaddingTypes = {
  any: { verify: verifyForAny },
  never: { verify: verifyForNever },
  always: { verify: verifyForAlways },
};

/**
 * Types of statements.
 * Those have `test` method to check it matches to the given statement.
 * @private
 */
const StatementTypes = {
  '*': { test: () => true },
  afterAll: newJestTokenTester('afterAll'),
  afterEach: newJestTokenTester('afterEach'),
  beforeAll: newJestTokenTester('beforeAll'),
  beforeEach: newJestTokenTester('beforeEach'),
  describe: newJestTokenTester('describe'),
  expect: newJestTokenTester('expect'),
  it: newJestTokenTester('it'),
  test: newJestTokenTester('test'),
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'require or disallow padding lines between jest statements',
      category: 'Stylistic Issues',
      recommended: false,
      // TODO: Link to page on GH wiki
      // url: 'https://eslint.org/docs/rules/padding-line-between-statements',
    },
    fixable: 'whitespace',
    schema: {
      definitions: {
        paddingType: {
          enum: Object.keys(PaddingTypes),
        },
        statementType: {
          anyOf: [
            { enum: Object.keys(StatementTypes) },
            {
              type: 'array',
              items: { enum: Object.keys(StatementTypes) },
              minItems: 1,
              uniqueItems: true,
              additionalItems: false,
            },
          ],
        },
      },
      type: 'array',
      items: {
        type: 'object',
        properties: {
          blankLine: { $ref: '#/definitions/paddingType' },
          prev: { $ref: '#/definitions/statementType' },
          next: { $ref: '#/definitions/statementType' },
        },
        additionalProperties: false,
        required: ['blankLine', 'prev', 'next'],
      },
      additionalItems: false,
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const configureList = context.options || [];
    let scopeInfo = null;

    /**
     * Processes to enter to new scope.
     * This manages the current previous statement.
     * @returns {void}
     * @private
     */
    function enterScope() {
      scopeInfo = {
        upper: scopeInfo,
        prevNode: null,
      };
    }

    /**
     * Processes to exit from the current scope.
     * @returns {void}
     * @private
     */
    function exitScope() {
      scopeInfo = scopeInfo.upper;
    }

    /**
     * Checks whether the given node matches the given type.
     *
     * @param {ASTNode} node The statement node to check.
     * @param {string|string[]} type The statement type to check.
     * @returns {boolean} `true` if the statement node matched the type.
     * @private
     */
    function match(node, type) {
      let innerStatementNode = node;

      while (innerStatementNode.type === 'LabeledStatement') {
        innerStatementNode = innerStatementNode.body;
      }

      if (Array.isArray(type)) {
        return type.some(match.bind(null, innerStatementNode));
      }

      return StatementTypes[type].test(innerStatementNode, sourceCode);
    }

    /**
     * Finds the last matched configure from configureList.
     *
     * @param {ASTNode} prevNode The previous statement to match.
     * @param {ASTNode} nextNode The current statement to match.
     * @returns {Object} The tester of the last matched configure.
     * @private
     */
    function getPaddingType(prevNode, nextNode) {
      for (let i = configureList.length - 1; i >= 0; --i) {
        const configure = configureList[i];
        const matched =
          match(prevNode, configure.prev) && match(nextNode, configure.next);

        if (matched) {
          return PaddingTypes[configure.blankLine];
        }
      }
      return PaddingTypes.any;
    }

    /**
     * Gets padding line sequences between the given 2 statements.
     * Comments are separators of the padding line sequences.
     *
     * @param {ASTNode} prevNode The previous statement to count.
     * @param {ASTNode} nextNode The current statement to count.
     * @returns {Array<Token[]>} The array of token pairs.
     * @private
     */
    function getPaddingLineSequences(prevNode, nextNode) {
      const pairs = [];
      let prevToken = getActualLastToken(sourceCode, prevNode);

      if (nextNode.loc.start.line - prevToken.loc.end.line >= 2) {
        do {
          const token = sourceCode.getTokenAfter(prevToken, {
            includeComments: true,
          });

          if (token.loc.start.line - prevToken.loc.end.line >= 2) {
            pairs.push([prevToken, token]);
          }

          prevToken = token;
        } while (prevToken.range[0] < nextNode.range[0]);
      }

      return pairs;
    }

    /**
     * Verify padding lines between the given node and the previous node.
     *
     * @param {ASTNode} node The node to verify.
     * @returns {void}
     * @private
     */
    function verify(node) {
      const parentType = node.parent.type;
      const validParent =
        astUtils.STATEMENT_LIST_PARENTS.has(parentType) ||
        parentType === 'SwitchStatement';

      if (!validParent) {
        return;
      }

      // Save this node as the current previous statement.
      const { prevNode } = scopeInfo;

      // Verify.
      if (prevNode) {
        const type = getPaddingType(prevNode, node);
        const paddingLines = getPaddingLineSequences(prevNode, node);

        type.verify(context, prevNode, node, paddingLines);
      }

      scopeInfo.prevNode = node;
    }

    /**
     * Verify padding lines between the given node and the previous node.
     * Then process to enter to new scope.
     *
     * @param {ASTNode} node The node to verify.
     * @returns {void}
     * @private
     */
    function verifyThenEnterScope(node) {
      verify(node);
      enterScope();
    }

    return {
      Program: enterScope,
      BlockStatement: enterScope,
      SwitchStatement: enterScope,
      'Program:exit': exitScope,
      'BlockStatement:exit': exitScope,
      'SwitchStatement:exit': exitScope,
      ':statement': verify,
      SwitchCase: verifyThenEnterScope,
      'SwitchCase:exit': exitScope,
    };
  },
};
