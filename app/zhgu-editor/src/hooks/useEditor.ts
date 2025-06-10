import { useEditorStore, EditorInitState } from '../store';
import type { Editor } from '@zhgu/editor';

/**
 * 获取Editor实例和相关状态的Hook
 */
export const useEditor = () => {
  const { editor, initState, initError } = useEditorStore();

  return {
    editor,
    initState,
    initError,
    isReady: initState === EditorInitState.READY,
    isLoading: initState === EditorInitState.CREATING || initState === EditorInitState.WAITING_CANVAS,
    hasError: initState === EditorInitState.ERROR,
  };
};

/**
 * 安全地使用Editor实例的Hook
 * 只有在Editor就绪时才返回实例
 */
export const useSafeEditor = () => {
  const { editor, isReady } = useEditor();

  return isReady ? editor : null;
};

/**
 * 获取Editor数据的Hook
 * 可以传入selector函数来获取特定数据
 */
export const useEditorData = <T>(selector: (editor: Editor) => T, defaultValue: T): T => {
  const { editor, isReady } = useEditor();

  if (!isReady || !editor) {
    return defaultValue;
  }

  try {
    return selector(editor);
  } catch (error) {
    console.error('获取Editor数据失败:', error);
    return defaultValue;
  }
};
