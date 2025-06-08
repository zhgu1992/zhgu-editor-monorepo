import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 添加忽略配置（放在最前面）
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/*.d.ts',
      'coverage/**',
      '**/__tests__/**', // 如果需要忽略测试文件
      'public/**', // 如果需要忽略静态资源
      '*.config.js', // 忽略配置文件
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended,
  {
    rules: {
      // todo 先关掉，后续需要打开
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      // TS增强规则
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'warn',
      eqeqeq: 'error',
      // 自动修复的格式规则（由Prettier处理）
      'max-len': 'off',
      // todo 先关掉，后续需要打开
      '@typescript-eslint/no-unused-vars': 'off',
      // todo 先关掉，后续需要打开
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          // 'ts-ignore': 'allow-with-description', // 允许带描述的忽略
          // todo 先关掉，后续需要打开
          'ts-ignore': false, // 允许ts-ignore
          'ts-expect-error': 'allow-with-description', // 同样处理 @ts-expect-error
          'ts-nocheck': true, // 禁止 @ts-nocheck（默认）
          'ts-check': false, // 允许 @ts-check（默认）
        },
      ],
    },
  },
]);
