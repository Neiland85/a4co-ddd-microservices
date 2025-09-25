/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    '../../.eslintrc.cjs',
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
    'plugin:security/recommended',
  ],
  rules: {
    // Next.js específicas
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-sync-scripts': 'error',

    // React específicas - relajadas temporalmente para build
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': 'off', // Desactivado temporalmente

    // Accesibilidad - relajada temporalmente para build
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',

    // Seguridad - relajadas temporalmente para build
    'security/detect-object-injection': 'warn',
    'security/detect-unsafe-regex': 'warn',

    // Desactivar reglas de Node.js para frontend
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
  },
  overrides: [
    {
      files: ['app/**/*.tsx', 'pages/**/*.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
