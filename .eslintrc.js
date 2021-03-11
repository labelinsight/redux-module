module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  env: {
    es2021: true,
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {},
  },
  rules: {},
}
