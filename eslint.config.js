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
  '**/packages/design-system/d-user-registration/**',
  '**/packages/design-system/e-gamified-dashboard/**',
  '**/tests/visual/**',
  '**/f-modern-backoffice/**',
  '**/h-modern-dashboard/**',
  '**/feature-flags/**',
  '**/eslint-rules/**',
];

export default tseslint.config(
  {
    ignores: [...buildArtifactPatterns, ...transitionalIgnores],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
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
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
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
    },
  },
);
