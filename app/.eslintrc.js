module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "plugin:react/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/space-before-function-paren': 'off'
  },
};
