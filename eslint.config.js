import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

// @vue/eslint-config-typescript bringt typescript-eslint mit und parst
// <script setup lang="ts">. Alle Komponenten sind migriert, daher ist nur
// noch lang="ts" erlaubt.
configureVueProject({ scriptLangs: ['ts'] })

export default defineConfigWithVueTs(
  {
    ignores: ['dist/**', 'node_modules/**', 'src/lib/lamejs.js'],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/attributes-order': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      // Wie bisher erlaubt: Aufrufe per Ternary oder && (z. B. paused ? resume() : start())
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowTernary: true, allowShortCircuit: true },
      ],
    },
  }
)
