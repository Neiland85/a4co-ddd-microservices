/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
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
  ],
  rules: {
    // Next.js específicas
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-sync-scripts': 'error',

    // React específicas
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
      },
    ],

    // Accesibilidad
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],

    // Seguridad
    'security/detect-object-injection': 'warn',
    'security/detect-unsafe-regex': 'error',

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
