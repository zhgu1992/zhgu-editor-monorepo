import React from 'react';
import { Plus } from 'lucide-react';

interface EffectsPanelProps {
  selectedNodes: any[];
  shadowEnabled: boolean;
  blurEnabled: boolean;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({ selectedNodes, shadowEnabled, blurEnabled }) => {
  if (selectedNodes.length === 0) {
    return <div className="text-xs text-gray-500 text-center py-4">选择图层以添加效果</div>;
  }

  return (
    <div className="space-y-3">
      {/* 阴影 */}
      {shadowEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">阴影</span>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('添加阴影')}>
              <Plus size={12} />
            </button>
          </div>
          <div className="text-xs text-gray-500 text-center py-3 border border-dashed border-gray-300 rounded">
            点击添加阴影效果
          </div>
        </div>
      )}

      {/* 模糊 */}
      {blurEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">模糊</span>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('添加模糊')}>
              <Plus size={12} />
            </button>
          </div>
        </div>
      )}

      {/* 混合模式 */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-gray-700">混合模式</span>
        <select className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400">
          <option value="normal">正常</option>
          <option value="multiply">正片叠底</option>
          <option value="screen">滤色</option>
          <option value="overlay">叠加</option>
          <option value="soft-light">柔光</option>
          <option value="hard-light">强光</option>
        </select>
      </div>
    </div>
  );
};

export default EffectsPanel;
