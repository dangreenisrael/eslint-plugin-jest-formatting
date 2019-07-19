# padding-before-test-blocks

## Rule Details

This rule enforces a line of padding before test/it blocks

Examples of **incorrect** code for this rule:

```js
test('foo', () => {});
test('bar', () => {});
```

```js
it('foo', () => {});
it('bar', () => {});
```

Examples of **correct** code for this rule:

```js
test('foo', () => {});

test('bar', () => {});
```

```js
it('foo', () => {});

it('bar', () => {});
```
