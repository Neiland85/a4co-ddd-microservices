const config = {
  extends: [
    '../../.eslintrc.js',
    'plugin:@next/next/recommended', 
    'next/core-web-vitals',
    'next/typescript',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y', 'security'],
  parserOptions: {
  project: './tsconfig.json',
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
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
},
  overrides: [
    {
      files: ['app/**/*.tsx', 'pages/**/*.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
    {
      files: ['.eslintrc.js', '*.config.js', '*.config.ts'],
      env: {
        node: true,
      },
      globals: {
        module: 'readonly', // Asegura que 'module' esté definido como global
        exports: 'readonly',
        require: 'readonly',
      },
    },
  ],
};

module.exports = config;