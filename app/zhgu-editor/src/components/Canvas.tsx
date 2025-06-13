import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore, EditorInitState } from '../store';
import DebugPanel from './DebugPanel';
import { LogUtils } from '@zhgu/utils';

const Canvas: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { initState, bindCanvas, debugMode } = useEditorStore();

  // 第二阶段初始化：Canvas挂载后绑定editor
  useEffect(() => {
    if (initState === EditorInitState.WAITING_CANVAS && canvasContainerRef.current) {
      LogUtils.debug('Canvas已挂载，触发Editor第二阶段初始化...');
      // 传递canvas容器的ID
      bindCanvas('app');
    }
  }, [initState, bindCanvas]);

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  // 处理画布事件
  const handleCanvasEvent = (event: string) => {
    LogUtils.debug('画布事件:', event);
    // TODO: 实现画布事件处理逻辑
  };

  // 显示加载状态
  if (initState === EditorInitState.WAITING_CANVAS) {
    return (
      <div className="flex-1 bg-gray-100 overflow-hidden relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-12 w-12 border-4 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">正在初始化画布...</div>
        </div>
        {/* 隐藏的canvas容器用于初始化 */}
        <div id="app" ref={canvasContainerRef} className="absolute inset-0 opacity-0 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden relative flex flex-col">
      {/* 统一的调试面板 */}
      <DebugPanel visible={debugMode} mousePosition={mousePosition} />

      {/* Editor渲染的主画布区域 */}
      <div
        id="app"
        ref={canvasContainerRef}
        className="flex-1 relative"
        onMouseMove={handleMouseMove}
        style={{
          // editor会接管所有的渲染和交互
          cursor: 'default',
        }}
      >
        {/* Editor会在这里渲染canvas和所有内容 */}
      </div>
    </div>
  );
};

export default Canvas;
