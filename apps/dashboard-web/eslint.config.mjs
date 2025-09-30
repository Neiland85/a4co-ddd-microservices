import js from '@eslint/js';
import nextConfig from 'eslint-config-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import security from 'eslint-plugin-security';

export default [
  js.configs.recommended,
  nextConfig,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2022: true,
        node: true,
      },
    },
    plugins: {
      security,
    },
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
  },
  {
    files: ['app/**/*.tsx', 'pages/**/*.tsx'],
    rules: {
      'import/no-default-export': 'off',
      'import/prefer-default-export': 'error',
    },
  },
];
