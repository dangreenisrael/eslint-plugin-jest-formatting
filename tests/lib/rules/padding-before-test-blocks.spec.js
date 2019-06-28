/**
 * @fileoverview Enforces a single line of padding between test blocks with a describe
 * @author Dan Green-Leipciger
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { RuleTester } = require('eslint');
const rule = require('../../../lib').rules['padding-before-test-blocks'];

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
  },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const invalidIts = `
const foo = 'bar';
const bar = 'baz';
it('foo', ()=>{

})
it('bar', ()=>{

})
`;

const validIts = `
const foo = 'bar';
const bar = 'baz';

it('foo', ()=>{

})

it('bar', ()=>{

})
`;

const invalidTests = `
describe('foo', ()=>{
  test('foo', ()=>{

  })
  test('bar', ()=>{

  })
});
`;

const validTests = `
describe('foo', ()=>{
  test('foo', ()=>{

  })

  test('bar', ()=>{

  })
});
`;

const validPaddedWithComments = `
test('foo', ()=>{

})

/*
Some comment
*/
//Baz
it('bar', ()=>{

})
`;

const ruleTester = new RuleTester();
ruleTester.run('padding-between-test-blocks', rule, {
  valid: [validIts, validTests, validPaddedWithComments],
  invalid: [
    {
      code: invalidIts,
      output: validIts,
      errors: [
        {
          message: 'Expected blank line before this statement.',
        },
        {
          message: 'Expected blank line before this statement.',
        },
      ],
    },
    {
      code: invalidTests,
      output: validTests,
      errors: [
        {
          message: 'Expected blank line before this statement.'
        },
      ],
    },
  ],
});
