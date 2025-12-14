// Shared ESLint rules for all packages - permissive for development
module.exports = {
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-require-imports': 'warn',
  '@typescript-eslint/explicit-function-return-types': 'off',
  '@typescript-eslint/no-namespace': 'warn',
  'no-prototype-builtins': 'warn',
  'no-console': 'warn',
  'prefer-template': 'warn',
  'react-hooks/exhaustive-deps': 'warn',
};
