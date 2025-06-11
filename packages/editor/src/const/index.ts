export const COLOR_CONFIG = {
  primary(alpha?: number) {
    return { r: 39, g: 148, b: 251, a: alpha ?? 1 };
  },
  'light/purple/50': { r: 247, g: 243, b: 253, a: 1 },
  'light/purple/100': { r: 239, g: 230, b: 253, a: 1 },
  'light/purple/500': { r: 164, g: 107, b: 245, a: 1 },
  'light/purple/600': { r: 129, g: 58, b: 230, a: 1 },

  'dark/purple/500': { r: 164, g: 107, b: 245, a: 1 },
  'dark/purple/700': { r: 179, g: 133, b: 251, a: 1 },
};

export const HOVER_BOX_ID = 'hover-box';

export const CREATION_CURSOR = {
  cross: 'cursor-crosshair',
  pen: 'cursor-pen',
  appoint: 'cursor-select-appoint', // 新增点样式
  default: 'cursor-default', // 默认选择样式
  closePath: 'cursor-close-path', // 闭合路径样式
};

export enum EEditorStateName {
  Default = 'Default',
  Move = 'Move',
  CreateRectTangle = 'CreateRectTangle',
  CreateFrame = 'CreateFrame',
}

export enum EModeName {
  Editor = 'Editor',
}

export enum ERenderGroupKey {
  Render = 'render',
  Name = 'name',
  Hover = 'hover',
  Select = 'select',
  Custom = 'custom',
  Top = 'top',
}

export * from './defaultEvent';
