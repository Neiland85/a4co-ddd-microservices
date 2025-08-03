/**
 * Configuración ESLint para Auditoría de Performance
 * Específica para a4co-ddd-microservices
 */

module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'sonarjs',
    'complexity',
    'react',
    'react-hooks'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es2023: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // COMPLEJIDAD CICLOMÁTICA
    'complexity': ['error', { max: 8 }],
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-params': ['error', 4],
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3],
    'max-statements': ['error', 20],
    'max-statements-per-line': ['error', { max: 1 }],

    // SONARJS - COMPLEJIDAD COGNITIVA
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': ['error', 5],
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/no-small-switch': 'error',
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-collapsible-if': 'error',
    'sonarjs/no-nested-template-literals': 'error',

    // TYPESCRIPT - RENDIMIENTO
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',

    // REACT - RENDIMIENTO
    'react/no-array-index-key': 'error',
    'react/no-unsafe': 'error',
    'react/prefer-stateless-function': 'error',
    'react/no-redundant-should-component-update': 'error',
    'react/no-this-in-sfc': 'error',
    'react/no-unstable-nested-components': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-useless-fragment': 'error',

    // REACT HOOKS - RENDIMIENTO
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // IMPORTS - PERFORMANCE
    'no-restricted-imports': ['error', {
      patterns: [
        // Prevenir imports completos de librerías grandes
        {
          group: ['lodash', '!lodash/*'],
          message: 'Importa funciones específicas de lodash para mejor tree-shaking: import { func } from "lodash/func"'
        },
        {
          group: ['@mui/material', '!@mui/material/*'],
          message: 'Importa componentes específicos: import { Button } from "@mui/material/Button"'
        },
        {
          group: ['react-icons', '!react-icons/*'],
          message: 'Importa iconos específicos: import { FaIcon } from "react-icons/fa"'
        }
      ]
    }],

    // ANTI-PATTERNS PERFORMANCE
    'no-console': 'error',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'prefer-destructuring': ['error', {
      array: true,
      object: true
    }, {
      enforceForRenamedProperties: false
    }],

    // ASYNC/AWAIT PERFORMANCE
    'no-return-await': 'error',
    'require-await': 'error',
    'prefer-promise-reject-errors': 'error',

    // REGEX PERFORMANCE
    'no-regex-spaces': 'error',
    'no-control-regex': 'error',
    'no-invalid-regexp': 'error'
  },
  overrides: [
    // DOMAIN LAYER - MÁXIMA SIMPLICIDAD
    {
      files: ['**/domain/**/*.ts', '**/domain/**/*.tsx'],
      rules: {
        'complexity': ['error', { max: 6 }],
        'max-lines-per-function': ['error', { max: 30 }],
        'max-params': ['error', 3],
        'sonarjs/cognitive-complexity': ['error', 10],
        '@typescript-eslint/no-explicit-any': 'error',
        'max-lines': ['error', { max: 200 }],
        // Domain debe ser puro - sin console, sin side effects
        'no-console': 'error',
        'no-process-env': 'error'
      }
    },
    // APPLICATION LAYER - COMPLEJIDAD MODERADA
    {
      files: ['**/application/**/*.ts', '**/application/**/*.tsx'],
      rules: {
        'complexity': ['error', { max: 10 }],
        'max-lines-per-function': ['error', { max: 40 }],
        'max-params': ['error', 3 }],
        'sonarjs/cognitive-complexity': ['error', 12],
        'max-lines': ['error', { max: 250 }]
      }
    },
    // INFRASTRUCTURE LAYER - PUEDE SER MÁS COMPLEJA
    {
      files: ['**/infrastructure/**/*.ts', '**/infrastructure/**/*.tsx'],
      rules: {
        'complexity': ['error', { max: 15 }],
        'max-lines-per-function': ['error', { max: 60 }],
        'max-params': ['error', 5 }],
        'sonarjs/cognitive-complexity': ['error', 20],
        'max-lines': ['error', { max: 400 }]
      }
    },
    // PRESENTATION LAYER - COMPONENTES REACT
    {
      files: ['**/presentation/**/*.tsx', '**/components/**/*.tsx'],
      rules: {
        'complexity': ['error', { max: 12 }],
        'max-lines-per-function': ['error', { max: 50 }],
        'max-lines': ['error', { max: 300 }],
        // Reglas específicas para componentes React
        'react/jsx-no-constructed-context-values': 'error',
        'react/no-unstable-nested-components': 'error',
        'react/jsx-no-useless-fragment': 'error'
      }
    },
    // HANDLERS Y CONTROLLERS - COMPLEJIDAD LIMITADA
    {
      files: ['**/handlers/**/*.ts', '**/controllers/**/*.ts'],
      rules: {
        'complexity': ['error', { max: 8 }],
        'max-lines-per-function': ['error', { max: 30 }],
        'max-params': ['error', 3 }],
        'sonarjs/cognitive-complexity': ['error', 10]
      }
    },
    // TESTS - REGLAS MÁS FLEXIBLES
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'complexity': 'off',
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'max-nested-callbacks': 'off'
      }
    },
    // ARCHIVOS DE CONFIGURACIÓN
    {
      files: ['**/*.config.ts', '**/*.config.js', '**/config/**/*.ts'],
      rules: {
        'complexity': 'off',
        'max-lines': ['error', { max: 500 }],
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    // ARCHIVOS V0DEV - PROTOTIPOS (REGLAS MÁS ESTRICTAS PARA REFACTOR)
    {
      files: ['**/v0dev/**/*.tsx', '**/v0dev/**/*.ts'],
      rules: {
        'complexity': ['error', { max: 6 }], // Más estricto para forzar refactor
        'max-lines': ['error', { max: 200 }], // Más estricto
        'max-lines-per-function': ['error', { max: 30 }],
        'sonarjs/cognitive-complexity': ['error', 8],
        // Marcar como warnings para migración gradual
        'no-console': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    }
  ]
};