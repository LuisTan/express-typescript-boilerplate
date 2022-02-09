module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort', '@typescript-eslint'],
  rules: {
    'array-callback-return': 'error',
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': 'warn',
    'default-case': 'warn',
    'eol-last': 'warn',
    eqeqeq: 'error',
    indent: ['warn', 2, { SwitchCase: 1 }],
    'jsx-quotes': ['error', 'prefer-double'],
    'no-alert': 'warn',
    'no-duplicate-imports': 'error',
    'no-else-return': 'warn',
    'no-eval': 'error',
    'no-lonely-if': 'error',
    'no-multiple-empty-lines': 'warn',
    'no-nested-ternary': 'error',
    'no-self-compare': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-constructor': 'off',
    'no-useless-return': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-numeric-literals': 'error',
    'prettier/prettier': 'warn',
    'require-await': 'error',
    semi: ['error', 'always'],
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/quotes': ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    quotes: 'off',
    'no-console': 'warn',
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/naming-convention': 'off',
  },
};
