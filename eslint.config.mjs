import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      // TS增强规则
      '@typescript-eslint/consistent-type-imports': 'error',
      // 最佳实践
      'no-console': 'warn',
      eqeqeq: 'error',
      // 自动修复的格式规则（由Prettier处理）
      'max-len': 'off',
    },
  },
]);
