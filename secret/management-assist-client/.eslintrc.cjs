module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier'
  ],
  plugins: ['svelte', '@typescript-eslint', 'import', 'unused-imports'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  settings: {
    'svelte3/typescript': () => require('typescript')
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  rules: {
    eqeqeq: 2,
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'object',
          'type',
          'index'
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        pathGroups: [
          {
            pattern: '$env/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '$app/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '$api/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '$assets/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '$routes/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '$stores/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '$lib/*',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '$lib/components/**',
            group: 'internal',
            position: 'before'
          }
        ]
      }
    ],
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }
    ]
  }
}
