# padding-before-expect-statements

## Rule Details

This rule enforces a line of padding before non-consecutive expect statements

Examples of **incorrect** code for this rule:

```js
const something = 123;
expect(something).toEqual(123);
expect(something).toBeGreaterThan(0);
```

Examples of **correct** code for this rule:

```js
const something = 123;

expect(something).toEqual(123);
expect(something).toBeGreaterThan(0);
```
