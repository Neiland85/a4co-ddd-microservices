module.exports = {
  root: true,
  extends: ['../../.eslintrc.cjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist', 'node_modules', '*.spec.ts', '*.test.ts'],
};