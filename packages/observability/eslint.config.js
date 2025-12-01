import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  // Ignore test files and files with specific issues during CI
  {
    ignores: [
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        // Additional Node.js and TypeScript globals
        NodeJS: 'readonly',
        BufferEncoding: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Temporarily relaxed rules for observability package (work in progress)
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Disable rule that requires react-hooks plugin (not installed)
      'react-hooks/exhaustive-deps': 'off',
      // Calidad de código para observabilidad
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'off',
      'prefer-template': 'off',
      'no-console': 'off', // Permitido en librerías de logging
      'no-undef': 'off', // TypeScript handles this better
    },
  },
  {
    files: ['src/index.ts'],
    rules: {
      // Permitir default export en index
    },
  },
  {
    files: ['src/logger/**/*.ts', 'src/metrics/**/*.ts'],
    rules: {
      'no-console': 'off', // Permitido en módulos de logging
    },
  },
];
