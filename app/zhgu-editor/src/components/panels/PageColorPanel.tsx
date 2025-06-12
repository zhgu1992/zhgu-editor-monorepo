import React, { useState, useMemo, useCallback } from 'react';
import ColorButton from './ColorButton';

interface PageColorPanelProps {
  onPageColorChange: (color: string) => void;
}

const PageColorPanel: React.FC<PageColorPanelProps> = ({ onPageColorChange }) => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const colorPresets = useMemo(
    () => [
      '#ffffff',
      '#f8f9fa',
      '#e9ecef',
      '#dee2e6',
      '#495057',
      '#212529',
      '#007bff',
      '#28a745',
      '#ffc107',
      '#dc3545',
      '#6f42c1',
      '#e83e8c',
    ],
    []
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setBackgroundColor(color);
      onPageColorChange(color);
    },
    [onPageColorChange]
  );

  const handlePresetClick = useCallback(
    (color: string) => {
      setBackgroundColor(color);
      onPageColorChange(color);
    },
    [onPageColorChange]
  );

  return (
    <div className="space-y-4">
      {/* 背景色 */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700 text-left">背景色</div>
        <div className="flex items-center gap-3">
          <ColorButton color={backgroundColor} onChange={handleColorChange} size="medium" title="选择背景色" />
          {/* 统一样式的颜色字符串显示区域 */}
          <span
            className="text-xs text-gray-500 font-mono tabular-nums"
            style={{
              minWidth: '55px',
              display: 'inline-block',
              textAlign: 'right',
            }}
          >
            {backgroundColor.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 导出包含背景色 */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          defaultChecked
          className="w-3 h-3"
          onChange={e => console.log('导出包含背景色:', e.target.checked)}
        />
        <span className="text-xs text-gray-600">导出包含背景色</span>
      </label>

      {/*/!* 页面颜色预设 *!/*/}
      {/*<div className="space-y-2">*/}
      {/*  <div className="text-xs text-gray-600 text-left">页面颜色预设</div>*/}
      {/*  <div className="grid grid-cols-6 gap-2">*/}
      {/*    {colorPresets.map(color => (*/}
      {/*      <button*/}
      {/*        key={color}*/}
      {/*        className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"*/}
      {/*        style={{ backgroundColor: color }}*/}
      {/*        onClick={() => handlePresetClick(color)}*/}
      {/*        title={color}*/}
      {/*      />*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default PageColorPanel;
