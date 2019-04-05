/**
 * @fileoverview Enforces single line padding around describe blocks
 * @author Dan Green-Leipciger
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/padding-describe-blocks");
const RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6
  }
});
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const validTopLevel = `
describe('foo',()=>{});

foo();
bar();
const thing="ok";

describe('bar',()=>{});

describe('baz',()=>{});

baz();
`;

const invalidTopLevel = `
describe('foo',()=>{});
foo();
bar();
const thing="ok";
describe('bar',()=>{});
describe('baz',()=>{});
baz();
`;

const validBlockLevel = `{
describe('foo',()=>{});

foo();
bar();

describe('bar',()=>{

});

describe('baz',()=>{});

baz();
}`;

const invalidBlockLevel = `{
describe('foo',()=>{});
foo();
bar();
describe('bar',()=>{

});
describe('baz',()=>{});
baz();
}`;

const ruleTester = new RuleTester();
ruleTester.run("padding-describe-blocks", rule, {
  valid: [validTopLevel, validBlockLevel],
  invalid: [
    {
      code: invalidTopLevel,
      output: validTopLevel,
      errors: [
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        },
        {
          message: rule.beforeMessage,
          type: "ExpressionStatement"
        },
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        },
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        }
      ]
    },
    {
      code: invalidBlockLevel,
      output: validBlockLevel,
      errors: [
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        },
        {
          message: rule.beforeMessage,
          type: "ExpressionStatement"
        },
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        },
        {
          message: rule.afterMessage,
          type: "ExpressionStatement"
        }
      ]
    }
  ]
});
