export type IModuleMetaDataConfig = number;

// 基础属性相关的key
// 模块相关的key
export type TMetaDataKey = keyof typeof DEFAULT_META_DATA;
export type TModuleMetaDataKey = keyof typeof DEFAULT_MODULE_META_DATA;
export type IMetaData = Record<Exclude<TMetaDataKey, 'type'>, IMetaDataConfig> & {
  baseAttribute?: IMetaDataConfig;
  appearance?: IMetaDataConfig;
  text?: IMetaDataConfig;
  pageColor?: IMetaDataConfig;
  cornerRadius?: IMetaDataConfig;
  aspectRatio?: IMetaDataConfig;
};

export type IModuleMetaData = Record<Exclude<TModuleMetaDataKey, 'type'>, IModuleMetaDataConfig> & {
  type: string;
};

export type IMetaDataConfig = {
  // 是否禁用
  enabled?: boolean;
  // 是否显示
  isVisible: boolean;
  // 标题
  title?: string;
  // 是否混合状态
  mixed?: boolean;
  // 最小值
  min?: number;
  // 最大值
  max?: number;
  // 步长
  step?: number;
};

// 没有选中物体时的默认配置 - 只显示页面颜色
export const EMPTY_SELECTION_META_DATA = {
  type: 'empty',
  baseAttribute: 0,
  vectorEdit: 0,
  frameDirect: 0,
  responsive: 0,
  autoLayout: 0,
  grid: 0,
  appearance: 0,
  symbol: 0,
  instance: 0,
  fill: 0,
  stroke: 0,
  text: 0,
  shadow: 0,
  blur: 0,
  export: 0,
};

// 完整功能的默认配置 - 用于选中物体时的fallback
export const DEFAULT_MODULE_META_DATA = {
  type: 'default',
  // 基础属性 x y w h r
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
  // 矢量编辑
  x: {
    enabled: true,
    isVisible: true,
    mixed: false,
    min: -Infinity,
    max: Infinity,
    step: 10,
    title: 'x',
  },
  y: {
    enabled: true,
    isVisible: true,
    mixed: false,
    min: -Infinity,
    max: Infinity,
    step: 10,
    title: 'y',
  },
  w: {
    enabled: true,
    isVisible: true,
    mixed: false,
    min: 0,
    max: Infinity,
    step: 5,
    title: 'w',
  },
  h: {
    enabled: true,
    isVisible: true,
    mixed: false,
    min: 0,
    max: Infinity,
    step: 5,
    title: 'h',
  },
  rotation: {
    enabled: true,
    isVisible: true,
    mixed: false,
    min: 0,
    max: 360,
    step: 2,
    title: 'r',
  },
  // cornerRadius: {
  //   enabled: true,
  //   isVisible: true,
  // },
};
