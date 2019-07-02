import padding from './padding';

export default {
  ...padding,
  create(context) {
    const ctx = Object.create(context, {
      options: {
        value: [
          {blankLine: 'always', prev: '*', next: 'expect'},
          {blankLine: 'any', prev: 'expect', next: 'expect'}
        ]
      }
    });

    return padding.create(ctx);
  },
};
