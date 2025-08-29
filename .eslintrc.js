module.exports = {
  root: true,
  env: {
    node: true,
    'uni-app': true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'warn',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'none',
        tabWidth: 2,
        useTabs: false
      }
    ]
  },
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    __uniConfig: 'readonly'
  }
}