# padding-test-blocks

## Rule Details

This rule enforces at least one line of padding before test blocks with a describe (newling or comment).

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
