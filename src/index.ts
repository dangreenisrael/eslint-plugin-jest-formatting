/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import { createRule, PaddingType, StatementType } from './rules/padding';

export const rules = {
  'padding-around-after-all-blocks': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.AfterAllToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.AfterAllToken,
      nextStatementType: StatementType.Any,
    },
  ),
  'padding-around-after-each-blocks': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.AfterEachToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.AfterEachToken,
      nextStatementType: StatementType.Any,
    },
  ),
  'padding-around-before-all-blocks': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.BeforeAllToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.BeforeAllToken,
      nextStatementType: StatementType.Any,
    },
  ),
  'padding-around-before-each-blocks': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.BeforeEachToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.BeforeEachToken,
      nextStatementType: StatementType.Any,
    },
  ),
  'padding-around-describe-blocks': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.DescribeToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.DescribeToken,
      nextStatementType: StatementType.Any,
    },
  ),
  'padding-around-expect-groups': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.ExpectToken,
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.ExpectToken,
      nextStatementType: StatementType.Any,
    },
    {
      paddingType: PaddingType.Any,
      prevStatementType: StatementType.ExpectToken,
      nextStatementType: StatementType.ExpectToken,
    },
  ),
  'padding-around-test-blocks': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: [StatementType.TestToken, StatementType.ItToken],
    },
    {
      paddingType: PaddingType.Always,
      prevStatementType: [StatementType.TestToken, StatementType.ItToken],
      nextStatementType: StatementType.Any,
    },
  ),
  // ===========================================================================
  // DEPRECATED
  'padding-before-after-all-blocks': createRule({
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.AfterAllToken,
  }),
  // DEPRECATED
  'padding-before-after-each-blocks': createRule({
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.AfterEachToken,
  }),
  // DEPRECATED
  'padding-before-before-all-blocks': createRule({
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.BeforeAllToken,
  }),
  // DEPRECATED
  'padding-before-before-each-blocks': createRule({
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.BeforeEachToken,
  }),
  // DEPRECATED
  'padding-before-describe-blocks': createRule({
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.DescribeToken,
  }),
  // DEPRECATED
  'padding-before-expect-statements': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: StatementType.ExpectToken,
    },
    {
      paddingType: PaddingType.Any,
      prevStatementType: StatementType.ExpectToken,
      nextStatementType: StatementType.ExpectToken,
    },
  ),
  // DEPRECATED
  'padding-before-test-blocks': createRule({
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: [StatementType.TestToken, StatementType.ItToken],
  }),
  // DEPRECATED
  'padding-before-all': createRule(
    {
      paddingType: PaddingType.Always,
      prevStatementType: StatementType.Any,
      nextStatementType: [
        StatementType.AfterAllToken,
        StatementType.AfterEachToken,
        StatementType.BeforeAllToken,
        StatementType.BeforeEachToken,
        StatementType.DescribeToken,
        StatementType.ExpectToken,
        StatementType.ItToken,
        StatementType.TestToken,
      ],
    },
    {
      paddingType: PaddingType.Any,
      prevStatementType: StatementType.ExpectToken,
      nextStatementType: StatementType.ExpectToken,
    },
  ),
};

export const configs = {
  recommended: {
    plugins: ['jest-formatting'],
    rules: {
      'jest-formatting/padding-around-after-all-blocks': 2,
      'jest-formatting/padding-around-after-each-blocks': 2,
      'jest-formatting/padding-around-before-all-blocks': 2,
      'jest-formatting/padding-around-before-each-blocks': 2,
      'jest-formatting/padding-around-describe-blocks': 2,
      'jest-formatting/padding-around-test-blocks': 2,
    },
  },
  strict: {
    plugins: ['jest-formatting'],
    rules: {
      'jest-formatting/padding-around-after-all-blocks': 2,
      'jest-formatting/padding-around-after-each-blocks': 2,
      'jest-formatting/padding-around-before-all-blocks': 2,
      'jest-formatting/padding-around-before-each-blocks': 2,
      'jest-formatting/padding-around-expect-groups': 2,
      'jest-formatting/padding-around-describe-blocks': 2,
      'jest-formatting/padding-around-test-blocks': 2,
    },
  },
};
