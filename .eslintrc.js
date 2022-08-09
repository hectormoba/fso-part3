module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:node/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
