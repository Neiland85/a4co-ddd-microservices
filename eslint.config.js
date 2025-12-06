import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const buildArtifactPatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/coverage/**',
  '**/.turbo/**',
  '**/turbo/**',
  '**/*.d.ts',
];

const transitionalIgnores = [
  '**/packages/observability/src/**',
  '**/packages/design-system/.storybook/**',
  '**/tests/visual/**',
  '**/feature-flags/**',
  '**/eslint-rules/**',

  // Tailwind configs que NO se deben lintar nunca
  '**/tailwind.config.js',
  '**/tailwind.preset.js'
];

export default tseslint.config(
  // --------------------------------------
  //  BLOQUE 1: GLOBAL IGNORES (NUEVO ESTÁNDAR)
  // --------------------------------------
  {
    ignores: [...buildArtifactPatterns, ...transitionalIgnores],
  },

  // --------------------------------------
  //  BLOQUE 2: ARCHIVOS PRINCIPALES DEL PROYECTO
  // --------------------------------------
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
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

        // IMPRESCINDIBLE para JSX puro en design-system
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },

  // --------------------------------------
  //  BLOQUE 3: TESTS
  // --------------------------------------
  {
    files: [
      '**/*.{test,spec}.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}'
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off'
    }
  },

  // --------------------------------------
  //  BLOQUE 4: CONFIG / SCRIPTS
  // --------------------------------------
  {
    files: [
      '**/*.config.{ts,js,mjs,cjs}',
      'scripts/**/*.{ts,js}',
      'tools/**/*.{ts,js}',
      'test/**/*.{ts,js}',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    }
  }
);

