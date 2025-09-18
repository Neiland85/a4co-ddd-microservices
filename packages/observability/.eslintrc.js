module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  plugins: ['node'],
  extends: [
    '../../.eslintrc.js',
    'plugin:node/recommended',
  ],
  rules: {
    // TypeScript específicas para observabilidad
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // Node.js específicas
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unpublished-import': 'off',

    // Import específicas para observabilidad
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/*.spec.ts', '**/*.config.ts', 'vitest.config.ts'],
        peerDependencies: true,
      },
    ],

    // Seguridad específica para observabilidad (logs, métricas, trazas)
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-possible-timing-attacks': 'warn', // Importante para métricas
    'security/detect-pseudoRandomBytes': 'error',

    // Promise específicas para async operations
    'promise/prefer-await-to-then': 'error',
    'promise/prefer-await-to-callbacks': 'error',
    'promise/catch-or-return': 'error',

    // Unicorn específicas para observabilidad
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/no-process-exit': 'off', // Puede ser necesario en casos de error crítico

    // Desactivar reglas de React para librerías puras
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-has-content': 'off',

    // Calidad de código para observabilidad
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'no-console': 'off', // Permitido en librerías de logging
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'security/detect-object-injection': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['index.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['src/logger/**/*.ts', 'src/metrics/**/*.ts'],
      rules: {
        'no-console': 'off', // Permitido en módulos de logging
      },
    },
  ],
};
