/**
 * This file should be IGNORED by jest-formatting due to the `overrides.files`
 * value in `recommended` and `strict` config. This file does not match the
 * globs.
 */

/* eslint-disable @typescript-eslint/no-empty-function */

beforeAll(() => {});
beforeEach(() => {});
afterAll(() => {});
afterEach(() => {});
describe('no padding on top', () => {
  it('has no padding above', () => {
    expect(true);
  });
  expect(true);
  expect(1);
  xit('has padding above', () => {
    expect(true);
  });
  it('also has padding above but not below', () => {
    expect(true);
  });
});
xdescribe('padding above', () => {
  it('has no padding above or below', () => {
    expect(true);
  });
  it('has no padding above or below', () => {
    expect(true);
  });
});
describe('padding above', () => {
  it('has no padding above or below', () => {
    expect(true);
  });
  it('has no padding above or below', () => {
    expect(true);
  });
});
