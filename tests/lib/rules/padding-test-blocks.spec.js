/**
 * @fileoverview Enforces a single line of padding between test blocks with a describe
 * @author Dan Green-Leipciger
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/padding-test-blocks");
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
test('foo', ()=>{})
test('bar', ()=>{})
`;

const validTests = `
test('foo', ()=>{})

test('bar', ()=>{})
`;

const invalidNestedDescribes = `
test('foo', ()=>{})
describe('bar', ()=>{

})
`;

const validNestedDescribes = `
test('foo', ()=>{})

describe('bar', ()=>{

})
`;

const ruleTester = new RuleTester();
ruleTester.run("padding-between-test-blocks", rule, {
  valid: [validIts, validTests, validNestedDescribes],
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
          message: rule.afterMessage,
          type: "ExpressionStatement"
        }
      ]
    },
    {
      code: invalidTests,
      output: validTests,
      errors: [
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        }
      ]
    },
    {
      code: invalidNestedDescribes,
      output: validNestedDescribes,
      errors: [
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        }
      ]
    }
  ]
});
