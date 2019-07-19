import { Rule } from 'eslint';
import padding from './rules/padding';

type TokenIdentifier =
  | '*'
  | 'afterAll'
  | 'afterEach'
  | 'beforeAll'
  | 'beforeEach'
  | 'describe'
  | 'expect'
  | 'it'
  | 'test';

interface RuleOption {
  blankLine: 'always' | 'any' | 'never';
  prev: TokenIdentifier | TokenIdentifier[];
  next: TokenIdentifier | TokenIdentifier[];
}

// Returns a rule that wraps a call to padding.create and adds the given options
// to the RuleContext so users don't have to.
export const makeRule = (options: RuleOption[]): Rule.RuleModule => {
  return {
    meta: {
      fixable: 'whitespace',
    },
    create(context: Rule.RuleContext) {
      // Copy the RuleContext and overwrite options; it's frozen and
      // we can't set them directly.
      const ctx = Object.create(context, { options: { value: options } });

      // Freeze it again
      Object.freeze(ctx);

      // Call the original create method with new context
      return padding.create(ctx);
    },
  };
};
