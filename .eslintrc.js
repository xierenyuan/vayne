module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  'globals': {
    'describe': false
  },
  'rules': {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': [2, 'never'],
    'max-len': [2, 200, 2],
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    'padded-blocks': 0,
    'no-var': 0
  }
}
