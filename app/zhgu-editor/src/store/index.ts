import { create } from 'zustand';
import { createHelloWorldFileData } from '../mock/mockFunc.ts';
import type { IBaseNode } from '@zhgu/editor';
import { Editor } from '@zhgu/editor';

// 图层类型定义
export interface Layer {
  id: string;
  name: string;
  type: 'rectangle' | 'text' | 'group';
  visible: boolean;
  locked: boolean;
  children?: Layer[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

// 页面类型定义
export interface Page {
  id: string;
  name: string;
  layers: Layer[];
}

// 工具类型定义
export type ToolType =
  | 'select'
  | 'move'
  | 'rectangle'
  | 'text'
  | 'ai'
  | 'pen'
  | 'edit'
  | 'copy'
  | 'comment'
  | 'component'
  | 'search';

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

  // 页面相关
  pages: Page[];
  currentPageId: string;

  // 图层相关
  selectedLayerIds: string[];

  // 工具相关
  currentTool: ToolType;

  // 画布相关
  canvasZoom: number;
  canvasOffsetX: number;
  canvasOffsetY: number;

  // 调试模式
  debugMode: boolean;

  // Actions
  // Editor操作
  createEditor: () => Promise<void>; // 第一阶段：创建editor实例
  bindCanvas: (canvasId?: string) => void; // 第二阶段：绑定canvas
  setInitState: (state: EditorInitState) => void;
  setInitError: (error: string | null) => void;

  // 从editor同步数据
  syncFromEditor: () => void;

  // 页面操作
  addPage: () => void;
  deletePage: (pageId: string) => void;
  switchPage: (pageId: string) => void;

  // 图层操作
  addLayer: (layer: Omit<Layer, 'id'>) => void;
  deleteLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  selectLayer: (layerId: string, multi?: boolean) => void;
  renameLayer: (layerId: string, name: string) => void;

  // 获取真实数据的getter
  getPages: () => IBaseNode[];
  getCurrentPage: () => IBaseNode | null;
  getSelectedNodes: () => IBaseNode[];

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

// 创建默认页面
const createDefaultPage = (): Page => ({
  id: 'page-1',
  name: '页面 1',
  layers: [
    {
      id: 'layer-1',
      name: '矩形 1',
      type: 'rectangle',
      visible: true,
      locked: false,
      x: 100,
      y: 100,
      width: 200,
      height: 150,
    },
    {
      id: 'layer-2',
      name: '矩形 2',
      type: 'rectangle',
      visible: true,
      locked: false,
      x: 350,
      y: 100,
      width: 180,
      height: 180,
    },
  ],
});

export const useEditorStore = create<EditorState>((set, get) => ({
  // 初始状态
  editor: null,
  initState: EditorInitState.IDLE,
  initError: null,
  pages: [createDefaultPage()],
  currentPageId: 'page-1',
  selectedLayerIds: [],
  currentTool: 'select',
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

      // 渲染
      editor.render();

      // 初始化编辑模式
      editor.initEditorMode();

      // 同步初始数据
      get().syncFromEditor();

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

  setInitState: (state: EditorInitState) => {
    set({ initState: state });
  },

  setInitError: (error: string | null) => {
    set({ initError: error });
  },

  // 从editor同步数据到store
  syncFromEditor: () => {
    const { editor } = get();
    if (!editor) return;

    try {
      // 基于实际的Editor API进行数据同步
      // 获取选中的节点
      const selectedNodes = editor.eventManager?.selectedNodes || [];

      console.log(
        '数据同步完成，选中节点:',
        selectedNodes.map(n => n.id)
      );
    } catch (error) {
      console.error('数据同步失败:', error);
    }
  },

  // 页面操作 - 目前主要更新store，后续可以扩展到editor
  addPage: () => {
    console.log('添加页面');
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name: `页面 ${get().pages.length + 1}`,
      layers: [],
    };

    // 更新store
    set(state => ({
      pages: [...state.pages, newPage],
      currentPageId: newPage.id,
    }));

    // 未来可以同步到editor
    const { editor } = get();
    if (editor && get().initState === EditorInitState.READY) {
      // editor API扩展后可以添加页面管理
      console.log('同步页面到editor（待实现）');
    }
  },

  deletePage: (pageId: string) => {
    console.log('删除页面:', pageId);
    const pages = get().pages.filter(page => page.id !== pageId);
    if (pages.length === 0) {
      const defaultPage = createDefaultPage();
      set({ pages: [defaultPage], currentPageId: defaultPage.id });
    } else {
      const currentPageId = get().currentPageId === pageId ? pages[0].id : get().currentPageId;
      set({ pages, currentPageId });
    }
  },

  switchPage: (pageId: string) => {
    console.log('切换页面:', pageId);
    set({ currentPageId: pageId, selectedLayerIds: [] });
  },

  // 图层操作
  addLayer: layerData => {
    console.log('添加图层:', layerData);
    const layer: Layer = {
      ...layerData,
      id: `layer-${Date.now()}`,
    };

    set(state => ({
      pages: state.pages.map(page =>
        page.id === state.currentPageId ? { ...page, layers: [...page.layers, layer] } : page
      ),
    }));
  },

  deleteLayer: (layerId: string) => {
    console.log('删除图层:', layerId);
    set(state => ({
      pages: state.pages.map(page =>
        page.id === state.currentPageId ? { ...page, layers: page.layers.filter(layer => layer.id !== layerId) } : page
      ),
      selectedLayerIds: state.selectedLayerIds.filter(id => id !== layerId),
    }));
  },

  toggleLayerVisibility: (layerId: string) => {
    console.log('切换图层可见性:', layerId);
    set(state => ({
      pages: state.pages.map(page =>
        page.id === state.currentPageId
          ? {
              ...page,
              layers: page.layers.map(layer => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)),
            }
          : page
      ),
    }));
  },

  toggleLayerLock: (layerId: string) => {
    console.log('切换图层锁定:', layerId);
    set(state => ({
      pages: state.pages.map(page =>
        page.id === state.currentPageId
          ? {
              ...page,
              layers: page.layers.map(layer => (layer.id === layerId ? { ...layer, locked: !layer.locked } : layer)),
            }
          : page
      ),
    }));
  },

  selectLayer: (layerId: string, multi = false) => {
    console.log('选择图层:', layerId, '多选:', multi);
    if (!layerId) {
      set({ selectedLayerIds: [] });
      return;
    }

    set(state => {
      const newSelectedIds = multi
        ? state.selectedLayerIds.includes(layerId)
          ? state.selectedLayerIds.filter(id => id !== layerId)
          : [...state.selectedLayerIds, layerId]
        : [layerId];

      return { selectedLayerIds: newSelectedIds };
    });
  },

  renameLayer: (layerId: string, name: string) => {
    console.log('重命名图层:', layerId, '新名称:', name);
    set(state => ({
      pages: state.pages.map(page =>
        page.id === state.currentPageId
          ? {
              ...page,
              layers: page.layers.map(layer => (layer.id === layerId ? { ...layer, name } : layer)),
            }
          : page
      ),
    }));
  },

  // 获取真实数据的getter方法
  getPages: () => {
    const { editor, initState } = get();
    if (!editor || initState !== EditorInitState.READY) return [];

    try {
      // editor.pages返回INode[]，需要转换为IBaseNode[]
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
      // editor.scene.currentPage返回INode，需要转换为IBaseNode
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

  // 工具操作
  setCurrentTool: (tool: ToolType) => {
    console.log('切换工具:', tool);
    set({ currentTool: tool });

    const { editor, initState } = get();
    if (editor && initState === EditorInitState.READY) {
      // 根据工具类型切换编辑器状态
      switch (tool) {
        case 'rectangle':
          editor.changeEditorState('CreateRectTangle');
          break;
        case 'select':
        default:
          editor.goToDefaultState('Default');
          break;
      }
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
