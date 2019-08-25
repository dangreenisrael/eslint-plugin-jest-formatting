/**
 * @fileoverview Enforces a single line of padding between test blocks with a describe
 * @author Dan Green-Leipciger
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { RuleTester } = require('eslint');
const rule = require('../../../lib').rules['padding-before-test-blocks'];

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const valid = `
const foo = 'bar';
const bar = 'baz';

it('foo', () => {
  // stuff
});

it('bar', () => {
  // stuff
});

test('foo foo', () => {});

test('bar bar', () => {});

// Nesting
describe('other bar', () => {
  const thing = 123;

  test('is another bar w/ test', () => {
  });

  // With a comment
  it('is another bar w/ it', () => {
  });

  test.skip('skipping', () => {}); // Another comment

  it.skip('skipping too', () => {});
});

test('weird', () => {});

test
  .skip('skippy skip', () => {});
`;

const invalid = `
const foo = 'bar';
const bar = 'baz';
it('foo', () => {
  // stuff
});
it('bar', () => {
  // stuff
});
test('foo foo', () => {});
test('bar bar', () => {});

// Nesting
describe('other bar', () => {
  const thing = 123;
  test('is another bar w/ test', () => {
  });
  // With a comment
  it('is another bar w/ it', () => {
  });
  test.skip('skipping', () => {}); // Another comment
  it.skip('skipping too', () => {});
});test('weird', () => {});
test
  .skip('skippy skip', () => {});
`;

ruleTester.run('padding-before-test-blocks', rule, {
  valid: [valid],
  invalid: [
    {
      code: invalid,
      filename: 'src/component.test.jsx',
      errors: 10,
      output: valid,
    },
    {
      code: invalid,
      filename: 'src/component.test.js',
      errors: [
        {
          message: 'Expected blank line before this statement.',
          line: 4,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 7,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 10,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 11,
          column: 1
        },
        {
          message: 'Expected blank line before this statement.',
          line: 16,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 19,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 21,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 22,
          column: 3
        },
        {
          message: 'Expected blank line before this statement.',
          line: 23,
          column: 4
        },
        {
          message: 'Expected blank line before this statement.',
          line: 24,
          column: 1
        },
      ],
    },
  ],
});
