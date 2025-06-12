import React from 'react';
import type { IModuleMetaData, IMetaData } from '@zhgu/editor';
import { DEFAULT_MODULE_META_DATA, DEFAULT_META_DATA } from '@zhgu/editor';
import ConfigurableRightPanel from '../ConfigurableRightPanel';

// 示例1: 图形编辑模式 - 只显示基础属性、外观和效果
const GRAPHIC_EDIT_CONFIG: IModuleMetaData = {
  ...DEFAULT_MODULE_META_DATA,
  baseAttribute: 1, // 显示基础属性
  appearance: 1, // 显示外观
  fill: 1, // 显示填充
  stroke: 1, // 显示描边
  shadow: 1, // 显示阴影
  blur: 1, // 显示模糊
  text: 0, // 隐藏文本属性
  export: 0, // 隐藏导出
};

// 示例2: 文本编辑模式 - 主要显示文本相关属性
const TEXT_EDIT_CONFIG: IModuleMetaData = {
  ...DEFAULT_MODULE_META_DATA,
  baseAttribute: 1, // 显示基础属性
  text: 1, // 显示文本属性
  fill: 1, // 显示填充（文本颜色）
  stroke: 0, // 隐藏描边
  shadow: 0, // 隐藏阴影
  blur: 0, // 隐藏模糊
  export: 0, // 隐藏导出
};

// 示例3: 导出模式 - 只显示导出相关功能
const EXPORT_CONFIG: IModuleMetaData = {
  ...DEFAULT_MODULE_META_DATA,
  baseAttribute: 0, // 隐藏基础属性
  appearance: 0, // 隐藏外观
  fill: 0, // 隐藏填充
  stroke: 0, // 隐藏描边
  text: 0, // 隐藏文本属性
  shadow: 0, // 隐藏阴影
  blur: 0, // 隐藏模糊
  export: 1, // 显示导出
};

// 示例4: 自定义属性配置 - 某些属性被禁用
const CUSTOM_META_CONFIG: IMetaData = {
  ...DEFAULT_META_DATA,
  x: { enabled: false, isVisible: true }, // X坐标显示但禁用编辑
  y: { enabled: false, isVisible: true }, // Y坐标显示但禁用编辑
  w: { enabled: true, isVisible: true }, // 宽度可编辑
  h: { enabled: true, isVisible: true }, // 高度可编辑
  rotation: { enabled: true, isVisible: false }, // 旋转隐藏
};

interface PanelConfigExamplesProps {
  onShowShortcutHelp: () => void;
  mode: 'graphic' | 'text' | 'export' | 'custom';
}

const PanelConfigExamples: React.FC<PanelConfigExamplesProps> = ({ onShowShortcutHelp, mode }) => {
  const getConfig = () => {
    switch (mode) {
      case 'graphic':
        return { overrideModuleConfig: GRAPHIC_EDIT_CONFIG };
      case 'text':
        return { overrideModuleConfig: TEXT_EDIT_CONFIG };
      case 'export':
        return { overrideModuleConfig: EXPORT_CONFIG };
      case 'custom':
        return {
          overrideModuleConfig: DEFAULT_MODULE_META_DATA,
          overrideMetaDataConfig: CUSTOM_META_CONFIG,
        };
      default:
        return { overrideModuleConfig: DEFAULT_MODULE_META_DATA };
    }
  };

  const config = getConfig();

  return (
    <ConfigurableRightPanel
      onShowShortcutHelp={onShowShortcutHelp}
      overrideModuleConfig={config.overrideModuleConfig}
      overrideMetaDataConfig={config.overrideMetaDataConfig}
    />
  );
};

export default PanelConfigExamples;
