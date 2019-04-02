# padding-describe-blocks

## Rule Details

This rule enforces single line padding around describe blocks 

Examples of **incorrect** code for this rule:

```js

describe('foo', () => {
  // stuff
})
describe('bar', ()=>{
  // more stuff
})

```

Examples of **correct** code for this rule:

```js

describe('foo', () => {
  // stuff
})

describe('bar', ()=>{
  // more stuff
})

```