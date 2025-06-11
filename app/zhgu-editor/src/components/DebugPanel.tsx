import React from 'react';
import { useEditorStore, EditorInitState } from '../store';

interface DebugPanelProps {
  visible?: boolean;
  mousePosition?: { x: number; y: number };
  className?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ visible = true, mousePosition = { x: 0, y: 0 }, className = '' }) => {
  const { initState, canvasZoom, canvasOffsetX, canvasOffsetY, getSelectedNodes } = useEditorStore();

  if (!visible) {
    return null;
  }

  const selectedNodes = getSelectedNodes();

  // 获取状态文本
  const getStatusText = () => {
    switch (initState) {
      case EditorInitState.IDLE:
        return '空闲';
      case EditorInitState.CREATING:
        return '创建中';
      case EditorInitState.WAITING_CANVAS:
        return '等待画布';
      case EditorInitState.READY:
        return '就绪';
      case EditorInitState.ERROR:
        return '错误';
      default:
        return '未知';
    }
  };

  // 获取状态颜色
  const getStatusColor = () => {
    switch (initState) {
      case EditorInitState.READY:
        return 'text-green-600';
      case EditorInitState.ERROR:
        return 'text-red-600';
      case EditorInitState.CREATING:
      case EditorInitState.WAITING_CANVAS:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 z-50 min-w-[160px] ${className}`}
    >
      {/* 标题 */}
      <div className="font-medium text-gray-800 mb-2 pb-1 border-b border-gray-200">调试信息</div>

      {/* 鼠标坐标 */}
      <div className="space-y-1 mb-3">
        <div className="font-medium text-gray-600">鼠标坐标</div>
        <div className="ml-2">
          <div>X: {mousePosition.x}</div>
          <div>Y: {mousePosition.y}</div>
        </div>
      </div>

      {/* 画布状态 */}
      <div className="space-y-1 mb-3">
        <div className="font-medium text-gray-600">画布状态</div>
        <div className="ml-2">
          <div>
            偏移: ({Math.round(canvasOffsetX)}, {Math.round(canvasOffsetY)})
          </div>
          <div>缩放: {Math.round(canvasZoom * 100)}%</div>
        </div>
      </div>

      {/* 选择状态 */}
      <div className="space-y-1 mb-3">
        <div className="font-medium text-gray-600">选择状态</div>
        <div className="ml-2">
          <div>选中: {selectedNodes.length} 个对象</div>
        </div>
      </div>

      {/* Editor状态 */}
      <div className="space-y-1">
        <div className="font-medium text-gray-600">编辑器状态</div>
        <div className="ml-2">
          <div className={`font-medium ${getStatusColor()}`}>{getStatusText()}</div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
