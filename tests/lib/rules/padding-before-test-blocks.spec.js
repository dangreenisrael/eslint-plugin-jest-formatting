/**
 * @fileoverview Enforces a single line of padding between test blocks with a describe
 * @author Dan Green-Leipciger
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/padding-before-test-blocks");
const RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6
  }
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
test('foo', ()=>{

})
test('bar', ()=>{

})
`;

const validTests = `
test('foo', ()=>{

})

test('bar', ()=>{

})
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
ruleTester.run("padding-between-test-blocks", rule, {
  valid: [validIts, validTests, validPaddedWithComments],
  invalid: [
    {
      code: invalidIts,
      output: validIts,
      errors: [
        {
          message: rule.beforeMessage,
          type: "ExpressionStatement"
        },
        {
          message: rule.beforeMessage,
          type: "ExpressionStatement"
        }
      ]
    },
    {
      code: invalidTests,
      output: validTests,
      errors: [
        {
          message: rule.beforeMessage,
          type: "ExpressionStatement"
        }
      ]
    }
  ]
});
