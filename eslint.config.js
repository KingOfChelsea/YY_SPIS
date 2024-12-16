import js from '@eslint/js'
import pluginVue, { rules } from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // 1. 增加忽略，multi-word 命名规则
  {
    rules:{
      'vue/multi-word-component-names':0,
    }
  }
]
