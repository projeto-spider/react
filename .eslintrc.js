module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    semi: [2, "never"],
    quotes: [2, "single"],
    "no-console": "off",
    "vue/max-attributes-per-line": "off",
    "prettier/prettier": ["error", { semi: false, singleQuote: true }]
  },
  globals: {
    use: true
  }
};
