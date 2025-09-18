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
  rules: {
    // TypeScript específicas para utilidades compartidas
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',

    // Import específicas
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/*.spec.ts', '**/*.config.ts'],
      },
    ],

    // Seguridad
    'security/detect-object-injection': 'error',
    'security/detect-unsafe-regex': 'error',

    // Desactivar reglas de React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/alt-text': 'off',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'security/detect-object-injection': 'off',
      },
    },
    {
      files: ['index.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
