import React, { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { IModuleMetaData, IMetaData } from '@zhgu/editor';
import { IBaseNode, ENodeChangeType } from '@zhgu/editor';
import { ESelectEventType, EHistoryEvent } from '@zhgu/editor';
import { useEditorStore, EditorInitState } from '../store';
import HelpMenu from './HelpMenu';
import CollapsibleSection from './panels/CollapsibleSection';
import BaseAttributePanel from './panels/BaseAttributePanel';
import AppearancePanel from './panels/AppearancePanel';
import TextPanel from './panels/TextPanel';
import EffectsPanel from './panels/EffectsPanel';
import PageColorPanel from './panels/PageColorPanel';
import ExportPanel from './panels/ExportPanel';

interface NodeMetaData {
  moduleConfig?: IModuleMetaData;
  metaDataConfig?: IMetaData;
}

interface ConfigurableRightPanelProps {
  onShowShortcutHelp: () => void;
  overrideModuleConfig?: IModuleMetaData;
  overrideMetaDataConfig?: IMetaData;
}

const ConfigurableRightPanel: React.FC<ConfigurableRightPanelProps> = ({
  onShowShortcutHelp,
  overrideModuleConfig,
  overrideMetaDataConfig,
}) => {
  const { initState, getSelectedNodes } = useEditorStore();

  const [expandedSections, setExpandedSections] = useState({
    baseAttribute: true,
    appearance: true,
    text: false,
    effects: false,
    pageColors: true,
    export: true,
  });

  // 强制更新状态，用于响应选中状态变化
  const [, forceUpdate] = useState({});

  // 监听editor事件，响应选中状态变化
  useEffect(() => {
    const { editor } = useEditorStore.getState();

    if (!editor || initState !== EditorInitState.READY) {
      return;
    }

    const eventManager = editor.eventManager;
    if (!eventManager) {
      return;
    }

    const handleSelectionChange = () => {
      forceUpdate({});
    };

    const handleUndoRedoChange = () => {
      forceUpdate({});
    };

    // 监听选中状态变化和撤销重做
    eventManager.on(ESelectEventType.SelectChange, handleSelectionChange);
    eventManager.on(EHistoryEvent.UndoRedo, handleUndoRedoChange);

    return () => {
      eventManager.off(ESelectEventType.SelectChange, handleSelectionChange);
      eventManager.off(EHistoryEvent.UndoRedo, handleUndoRedoChange);
    };
  }, [initState]);

  // 如果editor未就绪，显示加载状态
  if (initState !== EditorInitState.READY) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-sm">属性面板加载中...</div>
        </div>
      </div>
    );
  }

  // 获取真实数据
  const selectedNodes = getSelectedNodes();
  const { editor } = useEditorStore.getState();
  const { moduleConfig, metaDataConfig } = editor!.selectHelper.getMetaDataByNodes(selectedNodes);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLayoutChange = (property: string, value: any) => {
    console.log(`布局变更: ${property} = ${value}`);
  };

  const handlePageColorChange = (color: string) => {
    console.log('页面颜色变更:', color);
  };

  const handleExport = (format: string) => {
    console.log('导出格式:', format);
  };

  // 根据模块配置决定显示哪些面板
  const shouldShowBaseAttribute = moduleConfig && moduleConfig.baseAttribute === 1;
  const shouldShowAppearance = moduleConfig && moduleConfig.appearance === 1;
  const shouldShowText = moduleConfig && moduleConfig.text === 1;
  const shouldShowEffects = moduleConfig && (moduleConfig.shadow === 1 || moduleConfig.blur === 1);
  const shouldShowExport = moduleConfig && moduleConfig.export === 1;

  // 页面颜色只在无选择时显示
  const shouldShowPageColor = selectedNodes.length === 0;

  const shouldShowFill = moduleConfig && moduleConfig.fill === 1;
  const shouldShowStroke = moduleConfig && moduleConfig.stroke === 1;
  const shouldShowShadow = moduleConfig && moduleConfig.shadow === 1;
  const shouldShowBlur = moduleConfig && moduleConfig.blur === 1;

  // 调试信息
  console.log('RightPanel 最终配置状态:', {
    selectedNodesCount: selectedNodes.length,
    selectedNodeIds: selectedNodes.map(n => n.id),
    moduleConfig,
    metaDataConfig,
    shouldShowBaseAttribute,
    shouldShowAppearance,
    shouldShowFill,
    shouldShowStroke,
    panelsToShow: {
      position: shouldShowBaseAttribute,
      color: shouldShowAppearance && (shouldShowFill || shouldShowStroke),
      text: shouldShowText && selectedNodes.some(node => node.type === 'text'),
      effects: shouldShowEffects,
      export: shouldShowExport,
    },
  });

  console.log('=== 面板渲染决策 ===', {
    渲染位置和尺寸面板: shouldShowBaseAttribute ? '是' : '否',
    渲染物体颜色面板: shouldShowAppearance && (shouldShowFill || shouldShowStroke) ? '是' : '否',
    渲染文本面板: shouldShowText && selectedNodes.some(node => node.type === 'text') ? '是' : '否',
    渲染效果面板: shouldShowEffects ? '是' : '否',
    渲染页面颜色面板: shouldShowPageColor ? '是 (无选择时)' : '否 (有选择时)',
    渲染导出面板: shouldShowExport ? '是' : '否',
  });

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* 标题 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-800">属性面板</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 位置和尺寸 */}
        {shouldShowBaseAttribute && (
          <CollapsibleSection
            title="位置和尺寸"
            isExpanded={expandedSections.baseAttribute}
            onToggle={() => toggleSection('baseAttribute')}
            metaData={metaDataConfig}
            sectionKey="baseAttribute"
          >
            <BaseAttributePanel
              selectedNodes={selectedNodes}
              metaData={metaDataConfig}
              onLayoutChange={handleLayoutChange}
            />
          </CollapsibleSection>
        )}

        {/* 物体颜色 */}
        {shouldShowAppearance && (shouldShowFill || shouldShowStroke) && (
          <CollapsibleSection
            title="物体颜色"
            isExpanded={expandedSections.appearance}
            onToggle={() => toggleSection('appearance')}
            metaData={metaDataConfig}
            sectionKey="appearance"
          >
            <AppearancePanel
              selectedNodes={selectedNodes}
              fillEnabled={shouldShowFill}
              strokeEnabled={shouldShowStroke}
            />
            <TextPanel selectedNodes={selectedNodes} />
          </CollapsibleSection>
        )}

        {/* 文本属性 */}
        {shouldShowText && selectedNodes.some(node => node.type === 'text') && (
          <CollapsibleSection
            title="文本"
            isExpanded={expandedSections.text}
            onToggle={() => toggleSection('text')}
            metaData={metaDataConfig}
            sectionKey="text"
          >
            <TextPanel selectedNodes={selectedNodes} />
          </CollapsibleSection>
        )}

        {/*/!* 效果 *!/*/}
        {/*{shouldShowEffects && (*/}
        {/*  <CollapsibleSection*/}
        {/*    title="效果"*/}
        {/*    isExpanded={expandedSections.effects}*/}
        {/*    onToggle={() => toggleSection('effects')}*/}
        {/*  >*/}
        {/*    <EffectsPanel selectedNodes={selectedNodes} shadowEnabled={shouldShowShadow} blurEnabled={shouldShowBlur} />*/}
        {/*  </CollapsibleSection>*/}
        {/*)}*/}

        {/* 页面颜色 - 只在无选择时显示 */}
        {shouldShowPageColor && (
          <CollapsibleSection
            title="页面颜色"
            isExpanded={expandedSections.pageColors}
            onToggle={() => toggleSection('pageColors')}
            metaData={metaDataConfig}
            sectionKey="pageColor"
          >
            <PageColorPanel onPageColorChange={handlePageColorChange} />
          </CollapsibleSection>
        )}

        {/*/!* 导出 *!/*/}
        {/*{shouldShowExport && (*/}
        {/*  <CollapsibleSection*/}
        {/*    title="导出"*/}
        {/*    isExpanded={expandedSections.export}*/}
        {/*    onToggle={() => toggleSection('export')}*/}
        {/*  >*/}
        {/*    <ExportPanel onExport={handleExport} />*/}
        {/*  </CollapsibleSection>*/}
        {/*)}*/}
      </div>

      {/* 底部操作区 */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
            onClick={() => console.log('添加新属性')}
          >
            <Plus size={12} />
            添加属性
          </button>

          {/* 帮助按钮 */}
          <HelpMenu onShortcutHelp={onShowShortcutHelp} />
        </div>
      </div>
    </div>
  );
};

export default ConfigurableRightPanel;
