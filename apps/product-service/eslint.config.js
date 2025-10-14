const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
<<<<<<< HEAD
    files: ['**/*.ts', '**/*.js'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '**/*.d.ts',
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/*.bak',
      'jest.config.js',
    ],
=======
    files: ['**/*.ts'],
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
<<<<<<< HEAD
      globals: {
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',

        // Test globals
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
=======
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
<<<<<<< HEAD

      // Relaxed rules for faster development
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Disable problematic rules
      'no-undef': 'off', // TypeScript handles this
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-redeclare': 'off', // TypeScript handles this

      // Custom rules for this project
      'prefer-const': 'warn',
      'no-var': 'error',
=======
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    },
  },
];
