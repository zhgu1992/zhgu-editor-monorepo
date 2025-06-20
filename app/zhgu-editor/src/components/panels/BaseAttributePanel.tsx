import React, { useEffect, useState } from 'react';
import type { IMetaData, IBaseNode } from '@zhgu/editor';
import { DraggableNumberInput } from '@zhgu/ui';
import { useEditorStore, EditorInitState } from '../../store';
import { ENodeChangeType, ESelectEventType } from '@zhgu/editor';
import type { ElementChange } from '@zhgu/type';

interface BaseAttributePanelProps {
  selectedNodes: IBaseNode[];
  metaData?: IMetaData;
  sectionKey?: keyof IMetaData;
  onLayoutChange: (property: string, value: number | string) => void;
}

const BaseAttributePanel: React.FC<BaseAttributePanelProps> = ({
  selectedNodes,
  metaData,
  sectionKey,
  onLayoutChange,
}) => {
  // 局部刷新用
  const [, forceUpdate] = useState({});

  const editor = useEditorStore(state => state.editor);

  useEffect(() => {
    // 业务层获取 editor/eventManager
    const { editor, initState } = useEditorStore.getState();
    if (!editor || initState !== EditorInitState.READY) return;
    const eventManager = editor.eventManager;
    if (!eventManager) return;

    const handleBaseAttrChange = () => {
      forceUpdate({});
    };

    eventManager.on(ENodeChangeType.BaseAttributeChange, handleBaseAttrChange);
    return () => {
      eventManager.off(ENodeChangeType.BaseAttributeChange, handleBaseAttrChange);
    };
  }, []);

  // 事务开始
  const handleLayoutStart = () => {
    if (!editor) return;
    try {
      editor.startCompressTransaction();
    } catch (e) {
      console.error('开始属性修改事务失败', e);
    }
  };

  // 属性变更
  const handleLayoutChange = (property: string, value: number | string) => {
    if (!editor || selectedNodes.length === 0) return;
    const [nodeId, key] = property.split('.');
    const node = selectedNodes.find(n => n.id === nodeId);
    if (!node) return;

    let diffs: ElementChange[] = [];
    if (key === 'x' || key === 'y') {
      const newPos = { x: node.x, y: node.y, [key]: Number(value) };
      diffs = editor.selectHelper.changeAbsolutePosition(selectedNodes, newPos);
    } else if (key === 'w' || key === 'h') {
      const newSize = { [key]: Number(value) };
      diffs = editor.selectHelper.changeSize(selectedNodes, newSize);
    } else if (key === 'rotation') {
      diffs = editor.selectHelper.changeRotation(selectedNodes, Number(value));
    }

    if (diffs.length > 0) {
      editor.applyTransaction(diffs);
      // TODO: 目前通过emit SelectChange事件强制刷新右侧面板，后续应优化selectedNodes的响应式机制
      if (editor.eventManager && editor.eventManager.emit) {
        editor.eventManager.emit(ESelectEventType.SelectChange, { data: selectedNodes });
      }
    }
  };

  // 事务结束
  const handleLayoutEnd = () => {
    if (!editor) return;
    try {
      editor.commitHistory();
    } catch (e) {
      console.error('提交属性修改事务失败', e);
    }
  };

  // 如果当前section被禁用，不渲染任何内容
  if (metaData?.[sectionKey!]?.enabled === false) {
    return null;
  }

  if (selectedNodes.length === 0) {
    return <div className="text-xs text-gray-500 text-center py-4">选择图层以编辑属性</div>;
  }

  // 只取第一个节点用于展示（多选时只渲染一份，值用第一个节点，mixed用metaData）
  const node = selectedNodes[0];

  return (
    <div className="space-y-4">
      {/* 多选时可加提示 */}
      {selectedNodes.length > 1 && (
        <div className="text-xs font-medium text-gray-600 pb-2 border-b border-gray-100">
          已多选 {selectedNodes.length} 个对象
        </div>
      )}

      {/* 位置 */}
      {metaData?.x?.isVisible && metaData?.y?.isVisible && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <DraggableNumberInput
              label={metaData.x.title || 'x'}
              value={Number(Number(node.x).toFixed(2))}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.x`, value)}
              onFinish={handleLayoutEnd}
              min={metaData.x.min}
              max={metaData.x.max}
              step={metaData.x.step}
              mixed={metaData.x.mixed}
            />
            <DraggableNumberInput
              label={metaData.y.title || 'y'}
              value={Number(Number(node.y).toFixed(2))}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.y`, value)}
              onFinish={handleLayoutEnd}
              min={metaData.y.min}
              max={metaData.y.max}
              step={metaData.y.step}
              mixed={metaData.y.mixed}
            />
          </div>
        </div>
      )}

      {/* 尺寸 */}
      {metaData?.w?.isVisible && metaData?.h?.isVisible && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <DraggableNumberInput
              label={metaData.w.title || 'w'}
              value={Number(Number(node.w).toFixed(2))}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.w`, value)}
              onFinish={handleLayoutEnd}
              min={metaData.w.min}
              max={metaData.w.max}
              step={metaData.w.step}
              mixed={metaData.w.mixed}
            />
            <DraggableNumberInput
              label={metaData.h.title || 'h'}
              value={Number(Number(node.h).toFixed(2))}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.h`, value)}
              onFinish={handleLayoutEnd}
              min={metaData.h.min}
              max={metaData.h.max}
              step={metaData.h.step}
              mixed={metaData.h.mixed}
            />
          </div>
        </div>
      )}

      {/* 旋转 */}
      {metaData?.rotation?.isVisible && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <DraggableNumberInput
              label={metaData.rotation.title || 'rotation'}
              value={Number(Number(node.rotation).toFixed(2))}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.rotation`, value)}
              onFinish={handleLayoutEnd}
              min={metaData.rotation.min}
              max={metaData.rotation.max}
              step={metaData.rotation.step}
              mixed={metaData.rotation.mixed}
            />
            <div></div> {/* 占位，保持网格布局 */}
          </div>
        </div>
      )}

      {/* 圆角 */}
      {node.type === 'rectangle' && metaData?.cornerRadius?.isVisible && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700 text-left">
            {metaData.cornerRadius.title || 'Corner Radius'}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DraggableNumberInput
              label={metaData.cornerRadius.title || 'topLeft'}
              value={(node as any).rectangleTopLeftCornerRadius || 0}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.rectangleTopLeftCornerRadius`, value)}
              onFinish={handleLayoutEnd}
              min={0}
              max={Infinity}
              step={1}
            />
            <DraggableNumberInput
              label={metaData.cornerRadius.title || 'topRight'}
              value={(node as any).rectangleTopRightCornerRadius || 0}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.rectangleTopRightCornerRadius`, value)}
              onFinish={handleLayoutEnd}
              min={0}
              max={Infinity}
              step={1}
            />
            <DraggableNumberInput
              label={metaData.cornerRadius.title || 'bottomLeft'}
              value={(node as any).rectangleBottomLeftCornerRadius || 0}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.rectangleBottomLeftCornerRadius`, value)}
              onFinish={handleLayoutEnd}
              min={0}
              max={Infinity}
              step={1}
            />
            <DraggableNumberInput
              label={metaData.cornerRadius.title || 'bottomRight'}
              value={(node as any).rectangleBottomRightCornerRadius || 0}
              onStart={handleLayoutStart}
              onChange={value => handleLayoutChange(`${node.id}.rectangleBottomRightCornerRadius`, value)}
              onFinish={handleLayoutEnd}
              min={0}
              max={Infinity}
              step={1}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseAttributePanel;
