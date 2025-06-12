import React, { useState, useCallback } from 'react';
import { Eye, Plus } from 'lucide-react';
import ColorButton from './ColorButton';

interface AppearancePanelProps {
  selectedNodes: any[];
  fillEnabled: boolean;
  strokeEnabled: boolean;
}

const AppearancePanel: React.FC<AppearancePanelProps> = ({ selectedNodes, fillEnabled, strokeEnabled }) => {
  const [fillColor, setFillColor] = useState('#c0c0c0');
  const [fillOpacity, setFillOpacity] = useState(100);
  const [strokeColor, setStrokeColor] = useState('#000000');

  const handleFillColorChange = useCallback((color: string) => {
    setFillColor(color);
    console.log('物体颜色:', color);
  }, []);

  const handleStrokeColorChange = useCallback((color: string) => {
    setStrokeColor(color);
    console.log('描边颜色:', color);
  }, []);

  const handleFillColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setFillColor(value);
    }
  }, []);

  const handleFillOpacityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseInt(e.target.value);
    setFillOpacity(opacity);
    console.log('不透明度:', opacity + '%');
  }, []);

  if (selectedNodes.length === 0) {
    return <div className="text-xs text-gray-500 text-center py-4">选择图层以编辑外观</div>;
  }

  return (
    <div className="space-y-4">
      {/* 物体颜色 (填充) */}
      {fillEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">物体颜色</span>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('切换填充可见性')}>
              <Eye size={12} />
            </button>
          </div>

          {/* 颜色选择器和十六进制输入 */}
          <div className="flex items-center gap-2">
            <ColorButton color={fillColor} onChange={handleFillColorChange} size="large" title="选择物体颜色" />
            {/* 固定样式的颜色输入框，防止布局抖动 */}
            <input
              type="text"
              value={fillColor.toUpperCase()}
              onChange={handleFillColorInputChange}
              placeholder="#000000"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400 font-mono tabular-nums"
              style={{
                minWidth: '100px',
                maxWidth: '100px',
              }}
            />
          </div>
          {/* 不透明度滑块 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12 flex-shrink-0">不透明度</span>
            <input
              type="range"
              min="0"
              max="100"
              value={fillOpacity}
              className="flex-1"
              onChange={handleFillOpacityChange}
            />
            <span className="text-xs text-gray-500 w-8 flex-shrink-0 text-right font-mono tabular-nums">
              {fillOpacity}%
            </span>
          </div>
        </div>
      )}

      {/* 描边 */}
      {strokeEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">描边</span>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('添加描边')}>
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <ColorButton color={strokeColor} onChange={handleStrokeColorChange} size="medium" title="选择描边颜色" />
            <div className="grid grid-cols-2 gap-1 flex-1">
              <input
                type="number"
                placeholder="宽度"
                defaultValue="1"
                className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400 font-mono tabular-nums"
              />
              <select className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400">
                <option value="solid">实线</option>
                <option value="dashed">虚线</option>
                <option value="dotted">点线</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppearancePanel;
