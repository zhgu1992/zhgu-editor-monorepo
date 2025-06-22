import { useCallback } from 'react';
import { useEditorStore } from '../store';
import type { RGBAColor } from '@zhgu/type';

export const useBackgroundColorTransaction = () => {
  const editor = useEditorStore(state => state.editor);

  const startBackgroundColorTransaction = useCallback(() => {
    if (!editor) return;

    try {
      console.log('开始背景色修改事务');
      editor.startCompressTransaction();
    } catch (error) {
      console.error('开始背景色事务失败:', error);
    }
  }, [editor]);

  const applyBackgroundColorChange = useCallback(
    (color: string) => {
      if (!editor) return;

      try {
        // 将hex颜色转换为RGBA
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const colorData: RGBAColor = { r, g, b, a: 1 };

        // 获取当前页面
        const currentPage = editor.scene.currentPage;
        if (currentPage) {
          // 调用Page的setBackgroundColor方法，它会返回一个diff
          const diff = currentPage.setBackgroundColor(colorData);
          if (diff) {
            // 应用diff到编辑器
            editor.applyTransaction([diff]);
          }
        }

        console.log('应用背景色修改:', color, colorData);
      } catch (error) {
        console.error('应用背景色修改失败:', error);
      }
    },
    [editor]
  );

  const commitBackgroundColorTransaction = useCallback(() => {
    if (!editor) return;

    try {
      console.log('提交背景色修改事务');
      editor.commitHistory();
    } catch (error) {
      console.error('提交背景色事务失败:', error);
    }
  }, [editor]);

  return {
    startBackgroundColorTransaction,
    applyBackgroundColorChange,
    commitBackgroundColorTransaction,
  };
};
