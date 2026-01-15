import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * --------------------------------------
 *  IGNORADOS ABSOLUTOS
 * --------------------------------------
 */
const ignores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/coverage/**',
  '**/.turbo/**',
  '**/turbo/**',

  // Prisma / código generado
  '**/prisma/**',
  '**/.prisma/**',
  '**/generated/**',

  // Artefactos
  '**/*.d.ts',
  '**/*.min.js',
  '**/*.bundle.js',
  '**/*.wasm',

  // Configs y scripts
  '**/*.config.{js,cjs,mjs,ts}',
  '**/eslint.config.js',
  '**/jest.config.*',
  '**/scripts/**',
  '**/tools/**',

  // Tests FUERA de src
  '**/tests/**',
];

export default tseslint.config(
  {
    ignores,
  },

  /**
   * --------------------------------------
   *  CÓDIGO TYPESCRIPT REAL (SRC)
   * --------------------------------------
   */
  {
    files: ['apps/**/src/**/*.ts', 'packages/**/src/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
);
