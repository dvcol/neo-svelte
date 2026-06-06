export default {
  extends: ['@dvcol/stylelint-plugin-presets/config/svelte'],
  plugins: ['./scripts/stylelint-no-aliased-scss-import.js'],
  rules: {
    '@dvcol/progress': null,
    'neo/no-aliased-scss-import': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global'],
      },
    ],
  },
};
