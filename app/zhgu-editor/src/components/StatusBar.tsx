import React from 'react';
import { useEditorStore, EditorInitState } from '../store';
import { Mouse, Eye, Grid3x3, Ruler, Info, Wifi } from 'lucide-react';

const StatusBar: React.FC = () => {
  const { initState, getPages, getCurrentPage, getSelectedNodes, currentTool, canvasZoom } = useEditorStore();

  // 如果editor未就绪，显示简化状态
  if (initState !== EditorInitState.READY) {
    return (
      <div className="h-6 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Mouse size={12} />
            <span>加载中...</span>
          </div>
        </div>
        <div>编辑器正在初始化...</div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span>连接中</span>
        </div>
      </div>
    );
  }

  // 获取实际数据
  const pages = getPages();
  const currentPage = getCurrentPage();
  const selectedNodes = getSelectedNodes();

  const totalLayers = currentPage?.children?.length || 0;
  const visibleLayers = currentPage?.children?.filter((node: any) => node.visible !== false).length || 0;
  const currentPageIndex = pages.findIndex(p => p.id === currentPage?.id);

  const toolNames: Record<string, string> = {
    select: '选择工具',
    move: '移动工具',
    rectangle: '矩形工具',
    text: '文本工具',
    ai: 'AI工具',
  };

  return (
    <div className="h-6 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-600">
      {/* 左侧：工具和选择信息 */}
      <div className="flex items-center gap-4">
        {/* 当前工具 */}
        <div className="flex items-center gap-1">
          <Mouse size={12} />
          <span>{toolNames[currentTool] || currentTool}</span>
        </div>

        {/* 选择信息 */}
        {selectedNodes.length > 0 && (
          <div className="flex items-center gap-1">
            <span>已选择: {selectedNodes.length} 个对象</span>
          </div>
        )}

        {/* 页面信息 */}
        <div>
          页面 {currentPageIndex >= 0 ? currentPageIndex + 1 : 1} / {pages.length}
        </div>
      </div>

      {/* 中间：画布信息 */}
      <div className="flex items-center gap-4">
        {/* 缩放级别 */}
        <div>缩放: {Math.round(canvasZoom * 100)}%</div>

        {/* 图层统计 */}
        <div className="flex items-center gap-1">
          <Eye size={12} />
          <span>
            {visibleLayers}/{totalLayers} 图层可见
          </span>
        </div>

        {/* 网格状态 */}
        <button
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
          onClick={() => console.log('切换网格显示')}
          title="切换网格显示"
        >
          <Grid3x3 size={12} />
          <span>网格</span>
        </button>

        {/* 标尺状态 */}
        <button
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
          onClick={() => console.log('切换标尺显示')}
          title="切换标尺显示"
        >
          <Ruler size={12} />
          <span>标尺</span>
        </button>
      </div>

      {/* 右侧：系统信息 */}
      <div className="flex items-center gap-4">
        {/* 自动保存状态 */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>自动保存开启</span>
        </div>

        {/* 连接状态 */}
        <div className="flex items-center gap-1">
          <Wifi size={12} className="text-green-500" />
          <span>已连接</span>
        </div>

        {/* 帮助快捷键提示 */}
        <button
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
          onClick={() => console.log('显示帮助')}
          title="按 ? 键查看快捷键帮助"
        >
          <Info size={12} />
          <span>按 ? 查看帮助</span>
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
