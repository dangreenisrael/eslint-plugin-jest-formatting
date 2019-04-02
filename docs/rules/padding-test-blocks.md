# padding-test-blocks

Enforces a single like of padding between test blocks with a describe (padding-test-blocks)

## Rule Details

This rule aims to improve test readability by enforcing a single space between test blocks within a describe.

Examples of **incorrect** code for this rule:

```js
describe('foo',()=>{
  test('foo', ()=>{})
  test('bar', ()=>{})
})
```

```js
describe('foo',()=>{
  it('foo', ()=>{})
  it('bar', ()=>{})
})
```

```js
describe('foo',()=>{
  it('foo', ()=>{})


  it('bar', ()=>{})
})
```

Examples of **correct** code for this rule:

```js
describe('foo',()=>{
  test('foo', ()=>{})

  test('bar', ()=>{})
})
```

```js
describe('foo',()=>{
  it('foo', ()=>{})

  it('bar', ()=>{})
})
```

```js
describe('foo',()=>{
  it('foo', ()=>{})

  it('bar', ()=>{})
})
```

## When Not To Use It

If you don't care about spacing between test/it blocks
