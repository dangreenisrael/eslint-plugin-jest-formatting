/**
 * @fileoverview Rule to require or disallow newlines between jest functions
 *   Based on eslint/padding-line-between-statements by Toru Nagashima
 *   See: https://github.com/eslint/eslint/blob/master/lib/rules/padding-line-between-statements.js
 *
 *   STATEMENT_LIST_PARENTS, isTokenOnSameLine and isSemiColonToken borrowed from
 *   eslint ast-utils by Gyandeep Singh
 *   See: https://github.com/eslint/eslint/blob/master/lib/rules/utils/ast-utils.js
 */
import { AST, Rule, SourceCode } from 'eslint';
import { Node } from 'estree';

type StatementTypeTester = {
  [test: string]: (node: Node, sourceCode: SourceCode) => boolean;
};

type PaddingTypeTester = {
  [verify: string]: (
    context: Rule.RuleContext,
    prevNode: Node,
    nextNode: Node,
    paddingLines: AST.Token[][],
  ) => void;
};

const STATEMENT_LIST_PARENTS = new Set([
  'Program',
  'BlockStatement',
  'SwitchCase',
  'SwitchStatement',
]);

const isTokenOnSameLine = (
  left: Node | AST.Token,
  right: Node | AST.Token,
): boolean => left.loc.end.line === right.loc.start.line;

const isSemicolonToken = (token: AST.Token): boolean =>
  token.value === ';' && token.type === 'Punctuator';

// NOTE: Should probably be configurable
const isTestFile = (filename: string): boolean =>
  filename.includes('test') || filename.includes('spec');

/**
 * Creates tester which check if an expression node has a certain name
 */
function newJestTokenTester(name: string): StatementTypeTester {
  return {
    test: (node: Node, sourceCode: SourceCode): boolean => {
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
 */
function getActualLastToken(sourceCode: SourceCode, node: Node): AST.Token {
  const semiToken = sourceCode.getLastToken(node);
  const prevToken = sourceCode.getTokenBefore(semiToken);
  const nextToken = sourceCode.getTokenAfter(semiToken);
  const isSemicolonLessStyle = Boolean(
    prevToken &&
      nextToken &&
      prevToken.range[0] >= node.range[0] &&
      isSemicolonToken(semiToken) &&
      semiToken.loc.start.line !== prevToken.loc.end.line &&
      semiToken.loc.end.line === nextToken.loc.start.line,
  );

  return isSemicolonLessStyle ? prevToken : semiToken;
}

/**
 * Check and report statements for `always` configuration.
 * This autofix inserts a blank line between the given 2 statements.
 * If the `prevNode` has trailing comments, it inserts a blank line after the
 * trailing comments.
 */
function verifyForAlways(
  context: Rule.RuleContext,
  prevNode: Node,
  nextNode: Node,
  paddingLines: AST.Token[],
): void {
  if (paddingLines.length > 0) {
    return;
  }

  context.report({
    node: nextNode,
    message: 'Expected blank line before this statement.',
    fix(fixer: Rule.RuleFixer): Rule.Fix {
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
           */
          filter(token: AST.Token): boolean {
            if (isTokenOnSameLine(prevToken, token)) {
              prevToken = token;
              return false;
            }

            return true;
          },
        }) || nextNode;

      const insertText = isTokenOnSameLine(prevToken, nextToken)
        ? '\n\n'
        : '\n';

      return fixer.insertTextAfter(prevToken, insertText);
    },
  });
}

/**
 * Types of blank lines.
 * `any`  and `always` are defined.
 * Those have `verify` method to check and report statements.
 */
const PaddingTypes = {
  any: { verify: () => {} },
  always: { verify: verifyForAlways },
};

/**
 * Types of statements.
 * Those have `test` method to check it matches to the given statement.
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

export default <Rule.RuleModule>{
  meta: {
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
  create(context: Rule.RuleContext): Rule.RuleListener {
    const filename = context.getFilename();

    if (!isTestFile(filename)) {
      return {};
    }

    const sourceCode = context.getSourceCode();
    const configureList = context.options || [];
    let scopeInfo = null;

    function enterScope(): void {
      scopeInfo = { upper: scopeInfo, prevNode: null };
    }

    function exitScope(): void {
      scopeInfo = scopeInfo.upper;
    }

    /**
     * Checks whether the given node matches the given type.
     */
    function match(node: Node, type: string | string[]): boolean {
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
     */
    function getPaddingType(prevNode: Node, nextNode: Node): PaddingTypeTester {
      for (let i = configureList.length - 1; i >= 0; --i) {
        const { prev, next, blankLine } = configureList[i];

        if (match(prevNode, prev) && match(nextNode, next)) {
          return PaddingTypes[blankLine];
        }
      }

      return PaddingTypes.any;
    }

    /**
     * Gets padding line sequences between the given 2 statements.
     * Comments are separators of the padding line sequences.
     */
    function getPaddingLineSequences(
      prevNode: Node,
      nextNode: Node,
    ): AST.Token[][] {
      const pairs: AST.Token[][] = [];
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
     */
    function verify(node): void {
      const parentType = node.parent.type;
      const validParent = STATEMENT_LIST_PARENTS.has(parentType);

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
     */
    function verifyThenEnterScope(node: Node): void {
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
