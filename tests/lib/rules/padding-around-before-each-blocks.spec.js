/**
 * @fileoverview Enforces single line padding around beforeEach blocks
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib').rules['padding-around-before-each-blocks'];

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
beforeEach(() => {
});
describe('someText', () => {
  const something = 'abc';
  // A comment
  beforeEach(() => {
    // stuff
  });
  beforeEach(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';
  beforeEach(() => {
    // stuff
  });
});
`;

const valid = `
const someText = 'abc';

beforeEach(() => {
});

describe('someText', () => {
  const something = 'abc';

  // A comment
  beforeEach(() => {
    // stuff
  });

  beforeEach(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';

  beforeEach(() => {
    // stuff
  });
});
`;

ruleTester.run('padding-before-before-each-blocks', rule, {
  valid: [valid],
  invalid: [
    {
      code: invalid,
      filename: 'src/component.test.jsx',
      errors: 5,
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
          line: 5,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 8,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 11,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 18,
          column: 3
        },
      ],
      output: valid,
    },
  ]
});
