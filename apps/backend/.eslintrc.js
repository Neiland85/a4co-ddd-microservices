module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
  },
  plugins: ['node'],
  extends: [
    '../../.eslintrc.js',
    'plugin:node/recommended',
  ],
  rules: {
    // NestJS específicas
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // Node.js específicas
    'node/no-missing-import': 'off', // TypeScript maneja esto
    'node/no-extraneous-import': 'off', // pnpm workspaces
    'node/no-unsupported-features/es-syntax': 'off', // TypeScript compila
    'node/no-unpublished-import': 'off',

    // Seguridad para servicios
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',

    // Promise específicas para async/await en servicios
    'promise/always-return': 'off',
    'promise/prefer-await-to-then': 'error',
    'promise/prefer-await-to-callbacks': 'error',

    // Unicorn ajustes para backend
    'unicorn/no-process-exit': 'off',
    'unicorn/prefer-node-protocol': 'error',

    // Desactivar reglas de React para backend
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-has-content': 'off',
  },
  overrides: [
    {
      files: ['*.e2e-spec.ts', '*.int-spec.ts'],
      rules: {
        'security/detect-object-injection': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['main.ts', 'bootstrap.ts'],
      rules: {
        'unicorn/no-process-exit': 'off',
      },
    },
  ],
};
