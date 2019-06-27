/**
 * @fileoverview Enforces single line padding around describe blocks
 * @author Dan Green-Leipciger
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib').rules['padding-before-describe-blocks'];

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const valid = `
foo();
bar();

const someText = 'abc';
const someObject = {
  one: 1,
  two: 2,
};

// A comment before describe
describe('someText', () => {
  describe('some condition', () => {
  });

  describe('some other condition', () => {
  });
});

describe('someObject', () => {
  // Another comment
  describe('some condition', () => {
    const anotherThing = 500;

    describe('yet another condition', () => {
    });
  });
});
`;

const invalid = `
foo();
bar();

const someText = 'abc';
const someObject = {
  one: 1,
  two: 2,
};
// A comment before describe
describe('someText', () => {
  describe('some condition', () => {
  });
  describe('some other condition', () => {
  });
});
describe('someObject', () => {
  // Another comment
  describe('some condition', () => {
    const anotherThing = 500;
    describe('yet another condition', () => {
    });
  });
});
`;

ruleTester.run('padding-describe-blocks', rule, {
  valid: [valid],
  invalid: [
    {
      code: invalid,
      errors: 4,
      output: valid,
    },
    {
      code: invalid,
      errors: [
        {
          message: 'Expected blank line before this statement.'
        },
        {
          message: 'Expected blank line before this statement.'
        },
        {
          message: 'Expected blank line before this statement.'
        },
        {
          message: 'Expected blank line before this statement.'
        }
      ]
    },
  ]
});
