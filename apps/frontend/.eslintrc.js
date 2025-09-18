module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
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
    '../../.eslintrc.js',
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    // Next.js específicas
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-sync-scripts': 'error',
    '@next/next/no-unwanted-polyfillio': 'error',

    // React específicas mejoradas
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.tsx'],
      },
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],

    // Hooks específicas
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accesibilidad mejorada
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/alt-text': [
      'error',
      {
        elements: ['img', 'object', 'area', 'input[type="image"]'],
        img: ['Image'],
        object: ['Object'],
        area: ['Area'],
        'input[type="image"]': ['InputImage'],
      },
    ],

    // Seguridad para frontend
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',

    // Import específicas para Next.js
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowNew: false,
        allowLiteral: false,
        allowObject: true,
      },
    ],

    // Unicorn ajustes para frontend
    'unicorn/prefer-module': 'off', // Next.js usa CommonJS en algunos archivos
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          props: true,
          Props: true,
          ref: true,
          Ref: true,
          args: true,
          env: true,
          dev: true,
          prod: true,
          params: true,
          Params: true,
        },
      },
    ],

    // Performance
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
  },
  overrides: [
    {
      files: ['pages/**/*.tsx', 'pages/**/*.ts', 'app/**/*.tsx', 'app/**/*.ts'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
    {
      files: ['**/*.stories.tsx', '**/*.stories.ts'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'security/detect-object-injection': 'off',
      },
    },
    {
      files: ['next.config.js', 'next.config.mjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
};
