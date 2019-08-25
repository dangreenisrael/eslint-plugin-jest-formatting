/**
 * Require/fix newlines between jest functions
 *
 * Based on eslint/padding-line-between-statements by Toru Nagashima
 * See: https://github.com/eslint/eslint/blob/master/lib/rules/padding-line-between-statements.js
 *
 * Some helpers borrowed from eslint ast-utils by Gyandeep Singh
 * See: https://github.com/eslint/eslint/blob/master/lib/rules/utils/ast-utils.js
 */

import { AST, Rule, SourceCode } from 'eslint';
import { Node } from 'estree';
import * as astUtils from '../ast-utils';

// Statement types we'll respond to
export const enum StatementType {
  Any,
  AfterAllToken,
  AfterEachToken,
  BeforeAllToken,
  BeforeEachToken,
  DescribeToken,
  ExpectToken,
  ItToken,
  TestToken,
}

type StatementTypes = StatementType | StatementType[];

type StatementTester = (node: Node, sourceCode: SourceCode) => boolean;

// Padding type to apply between statements
export const enum PaddingType {
  Any,
  Always,
}

type PaddingTester = (
  prevNode: Node,
  nextNode: Node,
  sourceCode: SourceCode,
  context: Rule.RuleContext,
) => void;

type BoundPaddingTester = (
  sourceCode: SourceCode,
  context: Rule.RuleContext,
) => void;

// A configuration object for padding rule and the two statement types
export interface Config {
  paddingType: PaddingType;
  prevStatementType: StatementTypes;
  nextStatementType: StatementTypes;
}

// TODO: Remove this in favor of overrides in ESLint configuration
const isTestFile = (filename: string): boolean =>
  filename.includes('test') || filename.includes('spec');

// Creates a StatementTester to test an ExpressionStatement's first token name
const createTokenTester = (tokenName: string): StatementTester => {
  return (node: Node, sourceCode: SourceCode): boolean => {
    const token = sourceCode.getFirstToken(node);

    return (
      node.type === 'ExpressionStatement' &&
      token.type === 'Identifier' &&
      token.value === tokenName
    );
  };
};

// A mapping of StatementType to StatementTester for... testing statements
const statementTesters: { [T in StatementType]: StatementTester } = {
  [StatementType.Any]: () => true,
  [StatementType.AfterAllToken]: createTokenTester('afterAll'),
  [StatementType.AfterEachToken]: createTokenTester('afterEach'),
  [StatementType.BeforeAllToken]: createTokenTester('beforeAll'),
  [StatementType.BeforeEachToken]: createTokenTester('beforeEach'),
  [StatementType.DescribeToken]: createTokenTester('describe'),
  [StatementType.ExpectToken]: createTokenTester('expect'),
  [StatementType.ItToken]: createTokenTester('it'),
  [StatementType.TestToken]: createTokenTester('test'),
};

/**
 * Check and report statements for `PaddingType.Always configuration.
 * This autofix inserts a blank line between the given 2 statements.
 * If the `prevNode` has trailing comments, it inserts a blank line after the
 * trailing comments.
 */
const paddingAlwaysTester = (
  prevNode: Node,
  nextNode: Node,
  sourceCode: SourceCode,
  context: Rule.RuleContext,
): void => {
  const paddingLines = astUtils.getPaddingLineSequences(
    prevNode,
    nextNode,
    sourceCode,
  );

  // We've got some padding lines. Great.
  if (paddingLines.length > 0) {
    return;
  }

  // Missing padding line
  context.report({
    node: nextNode,
    message: 'Expected blank line before this statement.',
    fix(fixer: Rule.RuleFixer): Rule.Fix {
      let prevToken = astUtils.getActualLastToken(sourceCode, prevNode);
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
};

// A mapping of PaddingRule to PaddingTester
const paddingTesters: { [T in PaddingType]: PaddingTester } = {
  [PaddingType.Any]: () => true,
  [PaddingType.Always]: paddingAlwaysTester,
};

interface Scope {
  upper: Scope | null;
  prevNode: Node | null;
}

interface ScopeInfo {
  prevNode: Node | null;
  enter: () => void;
  exit: () => void;
}

const createScopeInfo = (): ScopeInfo => {
  return (() => {
    let scope: Scope = null;

    return {
      get prevNode() {
        return scope.prevNode;
      },
      set prevNode(node) {
        scope.prevNode = node;
      },
      enter() {
        scope = { upper: scope, prevNode: null };
      },
      exit() {
        scope = scope.upper;
      },
    };
  })();
};

const createRuleListener = (
  context: Rule.RuleContext,
  configs: Config[],
): Rule.RuleListener => {
  const sourceCode = context.getSourceCode();
  const scopeInfo = createScopeInfo();

  // TODO: Remove this in favor of overrides in ESLint configuration
  if (!isTestFile(context.getFilename())) {
    return {};
  }

  /**
   * Check whether the given node matches the statement type
   */
  const match = (node: Node, statementType: StatementTypes): boolean => {
    let innerStatementNode = node;

    // Dig into LabeledStatement body until it's not that anymore
    while (innerStatementNode.type === 'LabeledStatement') {
      innerStatementNode = innerStatementNode.body;
    }

    if (Array.isArray(statementType)) {
      return statementType.some(match.bind(null, innerStatementNode));
    }

    return statementTesters[statementType](innerStatementNode, sourceCode);
  };

  /**
   * Finds the last matched configure from paddingConfigs based on given nodes
   */
  const paddingTester = (
    prevNode: Node,
    nextNode: Node,
  ): BoundPaddingTester => {
    const bindNodes = (t: PaddingTester) => t.bind(null, prevNode, nextNode);

    for (let i = configs.length - 1; i >= 0; --i) {
      const {
        prevStatementType: prevType,
        nextStatementType: nextType,
        paddingType,
      } = configs[i];

      if (match(prevNode, prevType) && match(nextNode, nextType)) {
        return bindNodes(paddingTesters[paddingType]);
      }
    }

    return bindNodes(paddingTesters[PaddingType.Any]);
  };

  /**
   * Verify padding lines between the given node and the previous node.
   */
  const verifyNode = (node: Node): void => {
    // NOTE: ESLint types use ESTree which provides a Node type, however
    //  ESTree.Node doesn't support the parent property which is added by
    //  ESLint during traversal. Our best bet is to ignore the property access
    //  here as it's the only place that it's checked.
    // @ts-ignore
    if (!astUtils.isValidParent(node.parent.type)) {
      return;
    }

    if (scopeInfo.prevNode) {
      paddingTester(scopeInfo.prevNode, node)(sourceCode, context);
    }

    scopeInfo.prevNode = node;
  };

  return {
    Program: scopeInfo.enter,
    'Program:exit': scopeInfo.enter,
    BlockStatement: scopeInfo.enter,
    'BlockStatement:exit': scopeInfo.exit,
    SwitchStatement: scopeInfo.enter,
    'SwitchStatement:exit': scopeInfo.exit,
    ':statement': verifyNode,
    SwitchCase: node => {
      verifyNode(node);
      scopeInfo.enter();
    },
    'SwitchCase:exit': scopeInfo.exit,
  };
};

export const createRule = (...configs: Config[]): Rule.RuleModule => ({
  meta: {
    fixable: 'whitespace',
  },
  create(context: Rule.RuleContext) {
    return createRuleListener(context, configs);
  },
});
