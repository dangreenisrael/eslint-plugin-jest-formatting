/**
 * @fileoverview Enforces single line padding around describe blocks
 * @author Dan Green-Leipciger
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib").rules['padding-before-describe-blocks'];
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
foo();
bar();
const thing="ok";

describe('bar',()=>{

});

describe('baz',()=>{

});
`;

const invalidTopLevel = `
foo();
bar();
const thing="ok";
describe('bar',()=>{

});
describe('baz',()=>{

});
`;

const validBlockLevel = `{
  foo();
  bar();

  describe('bar',()=>{

  });

  describe('baz',()=>{

  });
}`;

const invalidBlockLevel = `{
  foo();
  bar();
  describe('bar',()=>{

  });
  describe('baz',()=>{

  });
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
      code: invalidBlockLevel,
      output: validBlockLevel,
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
    }
  ]
});
