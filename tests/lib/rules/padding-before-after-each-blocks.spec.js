/**
 * @fileoverview Enforces single line padding before afterEach blocks
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib').rules['padding-before-after-each-blocks'];

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const invalid = `
const someText = 'abc';
afterEach(() => {
});

describe('someText', () => {
  const something = 'abc';
  // A comment
  afterEach(() => {
    // stuff
  });
});

describe('someText', () => {
  const something = 'abc';
  afterEach(() => {
    // stuff
  });
});
`;

const valid = `
const someText = 'abc';

afterEach(() => {
});

describe('someText', () => {
  const something = 'abc';

  // A comment
  afterEach(() => {
    // stuff
  });
});

describe('someText', () => {
  const something = 'abc';

  afterEach(() => {
    // stuff
  });
});
`;

ruleTester.run('padding-before-after-each-blocks', rule, {
  valid: [valid],
  invalid: [
    {
      code: invalid,
      errors: 3,
      filename: 'src/component.test.jsx',
      output: valid,
    },
    {
      code: invalid,
      filename: 'src/component.test.js',
      errors: [
        {
          message: 'Expected blank line before this statement.',
          line: 3,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 9,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 16,
          column: 3
        },
      ]
    },
  ]
});
