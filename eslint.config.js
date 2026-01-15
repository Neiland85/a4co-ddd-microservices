import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  /**
   * -------------------------------------------------
   *  BLOQUE 1 — IGNORADOS ABSOLUTOS (NO NEGOCIABLE)
   * -------------------------------------------------
   */
  {
    ignores: [
      // Infra / build
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.turbo/**',

      // 🔥 Código generado (NUNCA se lintan)
      '**/generated/**',
      '**/prisma/**',
      '**/.prisma/**',

      // 🔥 TESTS (fase auditoría)
      '**/__tests__/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.test.ts',
      '**/*.test.tsx',

      // Tooling / noise
      '**/.storybook/**',
      '**/eslint-rules/**',
      '**/feature-flags/**',

      // Configs
      '**/tailwind.config.*',
      '**/tailwind.preset.*',
    ],
  },

  /**
   * -------------------------------------------------
   *  BLOQUE 2 — BACKEND (SOLO TS REAL DE PRODUCCIÓN)
   * -------------------------------------------------
   */
  {
    files: [
      'apps/**/src/**/*.ts',
      'packages/**/src/**/*.ts',
    ],
    ignores: [
      '**/src/**/generated/**',
      '**/src/**/prisma/**',
    ],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
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
      '@typescript-eslint/no-explicit-any': 'off',

      // Relajadas por fase audit / estabilización
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },

  /**
   * -------------------------------------------------
   *  BLOQUE 3 — SCRIPTS / CONFIG
   * -------------------------------------------------
   */
  {
    files: [
      '**/*.config.{ts,js,mjs,cjs}',
      'scripts/**/*.{ts,js}',
      'tools/**/*.{ts,js}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  }
);
