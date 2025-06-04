export type IModuleMetaDataConfig = number;

// 基础属性相关的key
// 模块相关的key
export type TMetaDataKey = keyof typeof DEFAULT_META_DATA;
export type TModuleMetaDataKey = keyof typeof DEFAULT_MODULE_META_DATA;
export type IMetaData = Record<Exclude<TMetaDataKey, 'type'>, IMetaDataConfig>;

export type IModuleMetaData = Record<Exclude<TModuleMetaDataKey, 'type'>, IModuleMetaDataConfig> & {
  type: string;
};

export type IMetaDataConfig = {
  // 是否禁用
  enabled?: boolean;
  // 是否显示
  isVisible: boolean;
};

export const DEFAULT_MODULE_META_DATA = {
  type: 'default',
  // 基础属性 x y w h
  baseAttribute: 1,
  // 矢量编辑
  vectorEdit: 0,
  // 画板选项
  frameDirect: 1,
  // 响应式
  responsive: 0,
  // 自动布局
  autoLayout: 0,
  // 网格布局
  grid: 0,
  // 图层渲染模式
  appearance: 1,
  // 引用组件 master
  symbol: 0,
  // 引用组件 instance
  instance: 0,
  // 填充
  fill: 1,
  // 描边
  stroke: 1,
  // 文本属性
  text: 0,
  // 阴影
  shadow: 1,
  // 模糊
  blur: 1,
  // 导出
  export: 1,
};

// 右侧面板基础属性 x, y, w, h这些 元数据默认值
export const DEFAULT_META_DATA = {
  // 圆
  arcData: {
    isVisible: false,
  },

  // 矢量编辑
  x: {
    enabled: true,
    isVisible: true,
  },
  y: {
    enabled: true,
    isVisible: true,
  },
  absolute: {
    enabled: true,
    isVisible: false,
  },
  autoLayoutBase: {
    // 自动布局frame才会展示的基础属性
    isVisible: false,
  },
  w: {
    // ? 可能单个属性被禁用
    enabled: true,
    isVisible: true,
  },
  h: {
    // ? 可能单个属性被禁用
    enabled: true,
    isVisible: true,
  },
  aspectRatio: {
    enabled: true,
    isVisible: true,
  },
  rotation: {
    enabled: true,
    isVisible: true,
  },
  cornerRadius: {
    enabled: true,
    isVisible: true,
  },
  rectangleRadius: {
    enabled: true,
    isVisible: true,
  },
  clipContent: {
    enabled: false,
    isVisible: false,
  },
  side: {
    enabled: false,
    isVisible: false,
  },

  horn: {
    enabled: false,
    isVisible: false,
  },

  // 直线
  line: {
    isVisible: false,
  },
  frameDirect: { isVisible: false },
};
