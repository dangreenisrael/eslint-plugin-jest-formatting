module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Jest 27 cannot resolve package `exports`, and ESLint publishes this
    // entry point only that way. Node's resolver finds it for any version.
    '^eslint/use-at-your-own-risk$': require.resolve(
      'eslint/use-at-your-own-risk',
    ),
  },
};
