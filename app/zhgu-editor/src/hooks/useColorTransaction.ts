import { useCallback } from 'react';
import { useEditorStore } from '../store';

interface ColorData {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface UseColorTransactionOptions {
  nodeId?: string;
  type?: 'fill' | 'stroke';
}

export const useColorTransaction = (options: UseColorTransactionOptions = {}) => {
  const editor = useEditorStore(state => state.editor);
  const getSelectedNodes = useEditorStore(state => state.getSelectedNodes);

  const startColorTransaction = useCallback(() => {
    if (!editor) return;

    try {
      console.log('开始颜色修改事务');
      editor.startCompressTransaction();
    } catch (error) {
      console.error('开始颜色事务失败:', error);
    }
  }, [editor]);

  const applyColorChange = useCallback(
    (color: string) => {
      if (!editor) return;

      try {
        // 将hex颜色转换为RGBA
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const colorData: ColorData = { r, g, b, a: 1 };

        // 获取要修改的节点
        const targetNodeId = options.nodeId;
        const selectedNodes = getSelectedNodes();

        if (targetNodeId) {
          // 使用指定的节点ID
          const node = editor.scene.node(targetNodeId);
          if (node) {
            let diff;
            if (options.type === 'stroke') {
              // 描边颜色修改（如果API支持的话）
              diff = node.changeStrokePaintColor(colorData);
            } else {
              // 填充颜色修改
              diff = node.changeFillPaintColor(colorData);
            }
            if (diff) {
              editor.applyTransaction([diff]);
            }
          }
        } else if (selectedNodes.length > 0) {
          // 使用选中的节点
          const diffs = selectedNodes
            .map(node => {
              if (options.type === 'stroke') {
                return node.changeStrokePaintColor?.(colorData);
              } else {
                return node.changeFillPaintColor?.(colorData);
              }
            })
            .filter(Boolean);

          if (diffs.length > 0) {
            editor.applyTransaction(diffs);
          }
        }

        console.log('应用颜色修改:', color, colorData);
      } catch (error) {
        console.error('应用颜色修改失败:', error);
      }
    },
    [editor, options.nodeId, options.type, getSelectedNodes, startColorTransaction]
  );

  const commitColorTransaction = useCallback(() => {
    if (!editor) return;

    try {
      console.log('提交颜色修改事务');
      editor.commitHistory();
    } catch (error) {
      console.error('提交颜色事务失败:', error);
    }
  }, [editor]);

  return {
    startColorTransaction,
    applyColorChange,
    commitColorTransaction,
  };
};
