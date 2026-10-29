/**
 * @fileoverview Enforces padding line around test/it blocks
 * @author Dan Green-Leipciger
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { RuleTester } = require('eslint');
const rule = require('../../../lib').rules['padding-around-test-blocks'];

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

fit('bar', () => {
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

xtest('weird', () => {});

test
  .skip('skippy skip', () => {});

xit('bar foo', () => {});
`;

const invalid = `
const foo = 'bar';
const bar = 'baz';
it('foo', () => {
  // stuff
});
fit('bar', () => {
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
});xtest('weird', () => {});
test
  .skip('skippy skip', () => {});
xit('bar foo', () => {});
`;

ruleTester.run('padding-around-test-blocks', rule, {
  valid: [valid],
  invalid: [
    {
      code: invalid,
      filename: 'src/component.test.jsx',
      errors: 11,
      output: valid,
    },
    {
      code: invalid,
      filename: 'src/component.test.js',
      errors: [
        {
          messageId: 'missingPaddingBefore',
          data: { token: 'it' },
          line: 4,
          column: 1
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'it' },
          line: 7,
          column: 1
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'fit' },
          line: 10,
          column: 1
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'test' },
          line: 11,
          column: 1
        },
        {
          messageId: 'missingPaddingBefore',
          data: { token: 'test' },
          line: 16,
          column: 3
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'test' },
          line: 19,
          column: 3
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'it' },
          line: 21,
          column: 3
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'test' },
          line: 22,
          column: 3
        },
        {
          messageId: 'missingPaddingBefore',
          data: { token: 'xtest' },
          line: 23,
          column: 4
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'xtest' },
          line: 24,
          column: 1
        },
        {
          messageId: 'missingPaddingAfter',
          data: { token: 'test' },
          line: 26,
          column: 1
        },
      ],
      output: valid,
    },
  ],
});
