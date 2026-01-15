/**
 * Compatibility ESLint config for tools that require legacy .eslintrc format (e.g., Codacy ESLint-legacy engine).
 * The monorepo uses ESLint v9 flat config (eslint.config.js) for local development.
 * This file is intentionally minimal and TypeScript-focused so external analyzers can run.
 */

module.exports = {
  root: true,
  ignorePatterns: [
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/coverage/**",
    "**/node_modules/**",
  ],
  env: {
    es2022: true,
    node: true,
    jest: true,
    browser: false,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    // Do not require project references; keeps analysis lightweight for external tools
    project: false,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        // Relax a few strict rules to avoid noisy reports from generated/infra code
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
      },
    },
  ],
};
