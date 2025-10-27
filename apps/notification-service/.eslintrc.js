module.exports = {
  extends: ['../../eslint.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Configuración permisiva para desarrollo
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
