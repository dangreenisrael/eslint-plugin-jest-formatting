/**
 * @fileoverview Enforces padding line around describe blocks
 * @author Dan Green-Leipciger
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib').rules['padding-around-describe-blocks'];

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

xdescribe('someObject', () => {
  // Another comment
  describe('some condition', () => {
    const anotherThing = 500;

    describe('yet another condition', () => { // A comment over here!
    });
  });
});

fdescribe('weird', () => {});

describe.skip('skip me', () => {});

const BOOP = "boop";

describe
  .skip('skip me too', () => {
    // stuff
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
xdescribe('someObject', () => {
  // Another comment
  describe('some condition', () => {
    const anotherThing = 500;
    describe('yet another condition', () => { // A comment over here!
    });
  });
});fdescribe('weird', () => {});
describe.skip('skip me', () => {});
const BOOP = "boop";
describe
  .skip('skip me too', () => {
    // stuff
  });
`;

ruleTester.run('padding-around-describe-blocks', rule, {
  valid: [valid],
  invalid: [
    {
      code: invalid,
      filename: 'src/component.test.jsx',
      errors: 8,
      output: valid,
    },
    {
      code: invalid,
      filename: 'src/component.test.js',
      errors: [
        {
          message: 'Expected blank line before this statement.',
          line: 11,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 14,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 17,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 21,
          column: 5
        },
        {
          message: 'Expected blank line before this statement.',
          line: 24,
          column: 4
        },
        {
          message: 'Expected blank line before this statement.',
          line: 25,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 26,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 27,
          column: 1
        },
      ],
      output: valid,
    },
  ]
});
