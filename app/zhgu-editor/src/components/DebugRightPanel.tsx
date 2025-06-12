import React, { useState } from 'react';
import { useEditorStore } from '../store';
import ConfigurableRightPanel from './ConfigurableRightPanel';

const DebugRightPanel: React.FC = () => {
  const { getSelectedNodes } = useEditorStore();
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const selectedNodes = getSelectedNodes();

  const handleShowShortcutHelp = () => {
    console.log('显示快捷键帮助');
  };

  return (
    <div className="flex h-full">
      {/* 左侧调试信息 */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-sm font-medium mb-4">调试面板</h3>

        <button
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="w-full mb-4 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          {showDebugInfo ? '隐藏' : '显示'}调试信息
        </button>

        {showDebugInfo && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">选中节点数量</h4>
              <div className="text-xs text-gray-600">{selectedNodes.length} 个节点</div>
            </div>

            {selectedNodes.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">节点信息</h4>
                <div className="space-y-2">
                  {selectedNodes.map((node, index) => (
                    <div key={node.id || index} className="text-xs text-gray-600 p-2 bg-white rounded">
                      <div>
                        <strong>ID:</strong> {node.id || '未知'}
                      </div>
                      <div>
                        <strong>名称:</strong> {node.name || '未命名'}
                      </div>
                      <div>
                        <strong>类型:</strong> {node.type || '未知'}
                      </div>
                      <div>
                        <strong>getMetaData:</strong> {typeof (node as any).getMetaData === 'function' ? '✓' : '✗'}
                      </div>
                      {typeof (node as any).getMetaData === 'function' && (
                        <div className="mt-2 space-x-2">
                          <button
                            onClick={() => {
                              try {
                                const metaData = (node as any).getMetaData();
                                console.log('节点元数据:', metaData);
                              } catch (error) {
                                console.error('获取元数据失败:', error);
                              }
                            }}
                            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            打印元数据
                          </button>
                          <button
                            onClick={() => {
                              // 触发选中状态变化，强制右侧面板重新获取配置
                              const { selectNodes } = useEditorStore.getState();
                              selectNodes([node]);
                              console.log('手动触发选中状态变化');
                            }}
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            重新选中
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">配置状态</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  <strong>无选择时:</strong> 只显示页面颜色
                </div>
                <div>
                  <strong>有选择时:</strong> 显示位置+物体颜色 + node.getMetaData() 配置
                </div>
                <div>
                  <strong>强制显示:</strong> 位置、尺寸、物体颜色
                </div>
                <div>
                  <strong>Fallback:</strong> DEFAULT_MODULE_META_DATA
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">测试操作</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const { clearSelection } = useEditorStore.getState();
                    clearSelection();
                    console.log('清除选择，测试无选择状态');
                  }}
                  className="w-full text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  清除选择
                </button>
                <button
                  onClick={() => {
                    console.log('=== 右侧面板配置测试 ===');
                    console.log('当前选中节点数量:', selectedNodes.length);
                    selectedNodes.forEach((node, index) => {
                      console.log(`节点 ${index + 1}:`, {
                        id: node.id,
                        name: node.name,
                        type: node.type,
                        hasGetMetaData: typeof (node as any).getMetaData === 'function',
                      });
                    });
                  }}
                  className="w-full text-xs px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  打印配置状态
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 右侧面板 */}
      <div className="flex-1">
        <ConfigurableRightPanel onShowShortcutHelp={handleShowShortcutHelp} />
      </div>
    </div>
  );
};

export default DebugRightPanel;
