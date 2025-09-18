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

    // Node.js específicas
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unpublished-import': 'off',

    // Seguridad específica para order service
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-object-injection': 'warn',
    'security/detect-possible-timing-attacks': 'error',

    // Desactivar reglas de React para backend
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-has-content': 'off',
  },
  overrides: [
    {
      files: ['*.e2e-spec.ts', '*.spec.ts'],
      rules: {
        'security/detect-object-injection': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
