import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    js.configs.recommended,
    // Ignore test files and build outputs
    {
        ignores: ['**/*.test.ts', '**/*.spec.ts', 'dist/**', 'node_modules/**'],
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['**/*.test.ts', '**/*.spec.ts'],
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
                process: 'readonly',
                Buffer: 'readonly',
                console: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/require-await': 'off',
        },
    },
    // Test files configuration
    {
        files: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
        },
    },
];
