module.exports = {
  extends: ['../../eslint.config.js'],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: ['../../eslint.config.js', 'plugin:jsx-a11y/recommended', 'plugin:storybook/recommended'],
  rules: {
    // TypeScript específicas para design system
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-exports': 'error',

    // React específicas para componentes
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.tsx'],
      },
    ],

    // Accesibilidad estricta para design system
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',

    // Import específicas
    'import/no-default-export': 'off', // Los componentes usan export default
    'import/prefer-default-export': 'error',

    // Seguridad
    'security/detect-object-injection': 'warn',
    'security/detect-unsafe-regex': 'error',

    // Desactivar reglas de Node.js
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
  },
  overrides: [
    {
      files: ['**/*.stories.tsx', '**/*.stories.ts'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'security/detect-object-injection': 'off',
      },
    },
  ],
};
