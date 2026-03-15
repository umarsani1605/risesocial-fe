// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierConfig from 'eslint-config-prettier'

export default withNuxt([
  // prettier config goes first so eslint can override where needed
  prettierConfig,
  {
    rules: {
      // Quality & Bug-checking
      'no-unused-vars': 'warn',
      'no-undef': 'error', // overridden to 'off' for TS/Vue files below
      eqeqeq: 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-extra-boolean-cast': 'error',
      'no-unreachable': 'error',
      '@typescript-eslint/no-explicit-any': 'off',

      // Vue specific
      'vue/no-multiple-template-root': 'off', // Vue 3 supports fragments (multiple root elements)
      'vue/no-unused-components': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-unused-vars': 'error',
      'vue/require-prop-types': 'error',

      // Formatting rules turned off (handled by Prettier)
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/block-tag-newline': 'off',

      '@stylistic/comma-dangle': 'off',
      '@stylistic/semi': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/quotes': 'off',
      '@stylistic/arrow-parens': 'off',

      // Naming convention
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: []
        }
      ]
    }
  },
  // TypeScript handles undefined checks — no-undef cannot distinguish between
  // type-level and value-level identifiers, causing false positives for every
  // type annotation. Disable for TS/Vue files per @typescript-eslint recommendation.
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'no-undef': 'off'
    }
  }
])
