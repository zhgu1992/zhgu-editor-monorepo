import { create } from 'zustand';
import { createHelloWorldFileData } from '../mock/mockFunc.ts';
import type { IBaseNode } from '@zhgu/editor';
import { Editor, EEditorStateName } from '@zhgu/editor';

// 工具类型定义
type ToolType = EEditorStateName;

// 初始化状态枚举
export enum EditorInitState {
  IDLE = 'idle',
  CREATING = 'creating', // 正在创建editor实例
  WAITING_CANVAS = 'waiting_canvas', // 等待canvas挂载
  READY = 'ready', // 完全就绪
  ERROR = 'error',
}

// 全局状态类型定义
interface EditorState {
  // Editor相关
  editor: Editor | null;
  initState: EditorInitState;
  initError: string | null;

  // 工具相关
  currentTool: ToolType;

  // 画布相关
  canvasZoom: number;
  canvasOffsetX: number;
  canvasOffsetY: number;

  // 调试模式
  debugMode: boolean;

  // Editor操作
  createEditor: () => Promise<void>; // 第一阶段：创建editor实例
  bindCanvas: (canvasId?: string) => void; // 第二阶段：绑定canvas

  // 获取真实数据的getter方法
  getPages: () => IBaseNode[];
  getCurrentPage: () => IBaseNode | null;
  getSelectedNodes: () => IBaseNode[];
  getHoveredNode: () => IBaseNode | null;

  // 页面操作（调用editor API）
  addPage: () => void;
  deletePage: (pageId: string) => void;
  switchPage: (pageId: string) => void;

  // 图层操作（调用editor API）
  deleteLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  renameLayer: (layerId: string, name: string) => void;

  // 工具操作
  setCurrentTool: (tool: ToolType) => void;

  // 画布操作
  setCanvasZoom: (zoom: number) => void;
  setCanvasOffset: (x: number, y: number) => void;

  // Editor操作代理方法
  selectNodes: (nodes: IBaseNode[]) => void;
  clearSelection: () => void;
  undoHistory: () => void;
  redoHistory: () => void;

  // 调试模式控制
  toggleDebugMode: () => void;
  setDebugMode: (enabled: boolean) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // 初始状态
  editor: null,
  initState: EditorInitState.IDLE,
  initError: null,
  currentTool: EEditorStateName.Default,
  canvasZoom: 1,
  canvasOffsetX: 0,
  canvasOffsetY: 0,
  debugMode: false,

  // Editor操作
  createEditor: async () => {
    try {
      set({ initState: EditorInitState.CREATING, initError: null });
      console.log('开始创建Editor实例...');

      const editor = new Editor();
      // 先不调用init，等canvas准备好后再调用

      set({
        editor,
        initState: EditorInitState.WAITING_CANVAS,
        initError: null,
      });

      console.log('Editor实例创建成功，等待Canvas挂载...');

      // 存储到window对象，方便调试
      // @ts-ignore
      window.editor = editor;
    } catch (error) {
      console.error('Editor创建失败:', error);
      set({
        initState: EditorInitState.ERROR,
        initError: error instanceof Error ? error.message : '创建失败',
      });
    }
  },

  bindCanvas: async (canvasId?: string) => {
    const { editor, initState } = get();

    if (!editor || initState !== EditorInitState.WAITING_CANVAS) {
      console.warn('Editor未准备好或状态错误');
      return;
    }

    try {
      console.log('初始化Editor并绑定Canvas...');

      // 调用Editor的init方法，传入canvas容器ID
      await editor.init(canvasId);

      // 加载文件数据
      const file = createHelloWorldFileData();
      editor.loadFile(file);

      // 初始化编辑模式
      editor.initEditorMode();

      set({ initState: EditorInitState.READY });
      console.log('Editor完全就绪！');
    } catch (error) {
      console.error('Editor初始化失败:', error);
      set({
        initState: EditorInitState.ERROR,
        initError: error instanceof Error ? error.message : '初始化失败',
      });
    }
  },

  // 获取真实数据的getter方法
  getPages: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return [];

    try {
      return (editor.pages || []) as IBaseNode[];
    } catch (error) {
      console.error('获取页面数据失败:', error);
      return [];
    }
  },

  getCurrentPage: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return null;

    try {
      return (editor.scene.currentPage || null) as IBaseNode | null;
    } catch (error) {
      console.error('获取当前页面失败:', error);
      return null;
    }
  },

  getSelectedNodes: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return [];

    try {
      return editor.eventManager?.selectedNodes || [];
    } catch (error) {
      console.error('获取选中节点失败:', error);
      return [];
    }
  },

  getHoveredNode: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return null;

    try {
      return editor.eventManager?.hoverNode || null;
    } catch (error) {
      console.error('获取hover节点失败:', error);
      return null;
    }
  },

  // 页面操作 - 调用editor的真实API
  addPage: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) {
      console.warn('Editor未就绪，无法添加页面');
      return;
    }

    try {
      console.log('添加新页面');
      // 使用editor的createEmptyPage方法
      if (editor.createEmptyPage) {
        const newPage = editor.createEmptyPage();
        console.log('新页面已创建:', newPage?.id);
      } else {
        console.warn('editor.createEmptyPage方法不存在');
      }
    } catch (error) {
      console.error('添加页面失败:', error);
    }
  },

  deletePage: (pageId: string) => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) {
      console.warn('Editor未就绪，无法删除页面');
      return;
    }

    try {
      console.log('删除页面:', pageId);
      // 调用editor的删除页面API（如果存在）
      if (editor.deletePage) {
        editor.deletePage(pageId);
      } else {
        console.warn('editor.deletePage方法不存在');
      }
    } catch (error) {
      console.error('删除页面失败:', error);
    }
  },

  switchPage: (pageId: string) => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) {
      console.warn('Editor未就绪，无法切换页面');
      return;
    }

    try {
      console.log('切换页面:', pageId);
      // 调用editor的页面切换API（如果存在）
      if (editor.switchPage) {
        editor.switchPage(pageId);
      } else {
        console.warn('editor.switchPage方法不存在');
      }
    } catch (error) {
      console.error('切换页面失败:', error);
    }
  },

  // 图层操作 - 调用editor的真实API
  deleteLayer: (layerId: string) => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) {
      console.warn('Editor未就绪，无法删除图层');
      return;
    }

    try {
      console.log('删除图层:', layerId);
      // 调用editor的删除节点API（如果存在）
      if ((editor as any).deleteNode) {
        (editor as any).deleteNode(layerId);
      } else {
        console.warn('editor.deleteNode方法不存在');
      }
    } catch (error) {
      console.error('删除图层失败:', error);
    }
  },

  toggleLayerVisibility: (layerId: string) => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) {
      console.warn('Editor未就绪，无法切换图层可见性');
      return;
    }

    try {
      console.log('切换图层可见性:', layerId);
      // 调用editor的节点可见性API（如果存在）
      // 需要先获取节点，然后调用其方法
      const currentPage = editor.scene?.currentPage;
      if (currentPage && currentPage.children) {
        const node = findNodeById(currentPage.children as any[], layerId);
        if (node && (node as any).setVisible) {
          (node as any).setVisible(!node.isVisible);
        }
      }
    } catch (error) {
      console.error('切换图层可见性失败:', error);
    }
  },

  toggleLayerLock: (layerId: string) => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) {
      console.warn('Editor未就绪，无法切换图层锁定');
      return;
    }

    try {
      console.log('切换图层锁定:', layerId);
      // 调用editor的节点锁定API（如果存在）
      const currentPage = editor.scene?.currentPage;
      if (currentPage && currentPage.children) {
        const node = findNodeById(currentPage.children as any[], layerId);
        if (node && (node as any).setLocked) {
          (node as any).setLocked(!(node as any).isLocked);
        }
      }
    } catch (error) {
      console.error('切换图层锁定失败:', error);
    }
  },

  renameLayer: (layerId: string, name: string) => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) {
      console.warn('Editor未就绪，无法重命名图层');
      return;
    }

    try {
      console.log('重命名图层:', layerId, '新名称:', name);
      // 调用editor的节点重命名API（如果存在）
      const currentPage = editor.scene?.currentPage;
      if (currentPage && currentPage.children) {
        const node = findNodeById(currentPage.children as any[], layerId);
        if (node && (node as any).setName) {
          (node as any).setName(name);
        }
      }
    } catch (error) {
      console.error('重命名图层失败:', error);
    }
  },

  // 工具操作
  setCurrentTool: (tool: EEditorStateName) => {
    console.log('切换工具:', tool);
    set({ currentTool: tool });

    const { editor, initState } = get();
    if (editor && initState === EditorInitState.READY) {
      // 根据工具类型切换编辑器状态
      editor.changeEditorState(tool);
    }
  },

  // 画布操作
  setCanvasZoom: (zoom: number) => {
    console.log('设置画布缩放:', zoom);
    set({ canvasZoom: zoom });

    // 同步到editor viewport
    const { editor, initState } = get();
    if (editor && initState === EditorInitState.READY && editor.viewPort) {
      // 可能需要调用editor.viewPort的缩放方法
      console.log('同步缩放到editor viewport');
    }
  },

  setCanvasOffset: (x: number, y: number) => {
    console.log('设置画布偏移:', x, y);
    set({ canvasOffsetX: x, canvasOffsetY: y });

    // 同步到editor viewport
    const { editor, initState } = get();
    if (editor && initState === EditorInitState.READY && editor.viewPort) {
      // 可能需要调用editor.viewPort的偏移方法
      console.log('同步偏移到editor viewport');
    }
  },

  // Editor操作代理方法
  selectNodes: (nodes: IBaseNode[]) => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return;

    try {
      if (editor.eventManager) {
        editor.eventManager.selectedNodes = nodes;
        console.log(
          '选择节点:',
          nodes.map(n => n.id)
        );
      }
    } catch (error) {
      console.error('选择节点失败:', error);
    }
  },

  clearSelection: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return;

    try {
      if (editor.eventManager) {
        editor.eventManager.selectedNodes = [];
        console.log('清空选择');
      }
    } catch (error) {
      console.error('清空选择失败:', error);
    }
  },

  undoHistory: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return;

    try {
      editor.undoHistory();
      console.log('撤销操作');
    } catch (error) {
      console.error('撤销失败:', error);
    }
  },

  redoHistory: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return;

    try {
      editor.redoHistory();
      console.log('重做操作');
    } catch (error) {
      console.error('重做失败:', error);
    }
  },

  // 调试模式控制
  toggleDebugMode: () => {
    set(state => ({
      debugMode: !state.debugMode,
    }));
  },

  setDebugMode: (enabled: boolean) => {
    set({ debugMode: enabled });
  },
}));

// 辅助函数：递归查找节点
function findNodeById(nodes: any[], id: string): any | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}
