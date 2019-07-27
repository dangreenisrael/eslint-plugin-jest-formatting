# padding-around-expect-statements

## Rule Details

This rule enforces a line of padding before _and_ after 1 or more `expect` statements

Note that it does _not_ enforce a line of padding between an `expect` and a closing bracket in a block statement

Examples of **incorrect** code for this rule:

```js
test('thing one', () => {
  let abc = 123;
  expect(abc).toEqual(123);
  expect(123).toEqual(abc);
  abc = 456;
  expect(abc).toEqual(456);
});
```

Examples of **correct** code for this rule:

```js
test('thing one', () => {
  let abc = 123;

  expect(abc).toEqual(123);
  expect(123).toEqual(abc);

  abc = 456;

  expect(abc).toEqual(456);
});
```
