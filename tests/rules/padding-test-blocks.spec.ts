/**
 * @fileoverview Enforces a single line of padding between test blocks with a describe
 * @author Dan Green-Leipciger
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
const rule = require("../../src/rules/padding-test-blocks");

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6
  }
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const invalidIts = `
describe('foo',()=>{
  it('foo', ()=>{})
  it('bar', ()=>{})
})
`;

const validIts = `
describe('foo',()=>{
  it('foo', ()=>{})

  it('bar', ()=>{})
})
`;

const invalidTests = `
describe('foo',()=>{
  test('foo', ()=>{})
  test('bar', ()=>{})
})
`;

const validTests = `
describe('foo',()=>{
  test('foo', ()=>{})

  test('bar', ()=>{})
})
`;

const invalidNestedDescribes = `
describe('foo',()=>{
  test('foo', ()=>{})
  describe('bar', ()=>{})
})
`;

const validNestedDescribes = `
describe('foo',()=>{
  test('foo', ()=>{})

  describe('bar', ()=>{})
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
          message: rule.message,
          type: "ExpressionStatement"
        }
      ]
    },
    {
      code: invalidTests,
      output: validTests,
      errors: [
        {
          message: rule.message,
          type: "ExpressionStatement"
        }
      ]
    },
    {
      code: invalidNestedDescribes,
      output: validNestedDescribes,
      errors: [
        {
          message: rule.message,
          type: "ExpressionStatement"
        }
      ]
    }
  ]
});
