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
    // TypeScript específicas para librerías
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // Import específicas para librerías
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/*.spec.ts', '**/*.config.ts', 'vite.config.ts'],
        peerDependencies: true,
      },
    ],

    // Seguridad para librerías compartidas
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-unsafe-regex': 'error',

    // Unicorn específicas para librerías
    'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
    'unicorn/no-anonymous-default-export': 'error',

    // Desactivar reglas de React para librerías puras
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-has-content': 'off',

    // Promise específicas
    'promise/prefer-await-to-then': 'error',
    'promise/prefer-await-to-callbacks': 'error',

    // Calidad de código para librerías
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'security/detect-object-injection': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['index.ts', '*.d.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
