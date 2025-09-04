// import tseslint from '@electron-toolkit/eslint-config-ts'
// import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
// import eslintPluginVue from 'eslint-plugin-vue'
// import vueParser from 'vue-eslint-parser'
import { defineConfigWithEslint } from '@whbw/eslint-config'

export default defineConfigWithEslint(
  {
    vue: true
  },
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  {
    rules: {
      'vue/component-name-in-template-casing': [
        'error',
        ['PascalCase', 'kebab-case', 'camelCase'],
        {
          ignores: ['slot', 'component'],

          // Force auto-import components to be PascalCase
          registeredComponentsOnly: false
        }
      ]
    }
  }
)
// export default tseslint.config(
//   { ignores: ['**/node_modules', '**/dist', '**/out'] },
//   tseslint.configs.recommended,
//   eslintPluginVue.configs['flat/recommended'],
//   {
//     files: ['**/*.vue'],
//     languageOptions: {
//       parser: vueParser,
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true
//         },
//         extraFileExtensions: ['.vue'],
//         parser: tseslint.parser
//       }
//     }
//   },
//   {
//     files: ['**/*.{ts,mts,tsx,vue}'],
//     rules: {
//       'vue/require-default-prop': 'off',
//       'vue/multi-word-component-names': 'off',
//       'vue/block-lang': [
//         'error',
//         {
//           script: {
//             lang: 'ts'
//           }
//         }
//       ],
//       'no-unused-vars': 'off'
//     }
//   },
//   eslintConfigPrettier
// )
