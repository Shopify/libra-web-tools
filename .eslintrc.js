module.exports = {
  extends: [
    'plugin:shopify/typescript',
    'plugin:shopify/typescript-type-checking',
    'plugin:shopify/react',
    'plugin:shopify/jest',
    'plugin:shopify/prettier',
  ],
  parserOptions: {
    project: [
      'packages/tsconfig.json',
      'packages/tsconfig_base.json',
      'test/tsconfig.eslint.json',
    ],
  },
  rules: {},
  overrides: [
    {
      files: [
        '**/test/**/*.ts',
        '**/test/**/*.tsx',
        '**/tests/**/*.ts',
        '**/tests/**/*.tsx',
      ],
      rules: {
        // We disable `import/no-extraneous-dependencies` for test files because it
        // would force releases of `@shopify/react-testing` (and similar devDependencies)
        // to cause unnecessary package bumps in every package that consumes them.
        // Test files with extraneous dependencies won't cause runtime errors in production.
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
