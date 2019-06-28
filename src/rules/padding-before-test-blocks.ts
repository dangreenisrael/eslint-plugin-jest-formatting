import padding from './padding';

export default {
  ...padding,
  create(context) {
    const ctx = Object.create(context, {
      options: {
        value: [
          {blankLine: 'always', prev: '*', next: 'test'},
          {blankLine: 'always', prev: '*', next: 'it'},
        ]
      }
    });

    return padding.create(ctx);
  },
};
