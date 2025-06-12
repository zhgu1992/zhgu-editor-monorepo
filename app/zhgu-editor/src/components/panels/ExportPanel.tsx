import React from 'react';
import { Download, Settings } from 'lucide-react';

interface ExportPanelProps {
  onExport: (format: string) => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onExport }) => {
  const exportFormats = [
    { format: 'PNG', label: 'PNG' },
    { format: 'JPG', label: 'JPG' },
    { format: 'SVG', label: 'SVG' },
    { format: 'PDF', label: 'PDF' },
  ];

  return (
    <div className="space-y-3">
      {/* 导出格式选择 */}
      <div className="space-y-2">
        <div className="text-xs text-gray-600">导出格式</div>
        <div className="grid grid-cols-2 gap-2">
          {exportFormats.map(item => (
            <button
              key={item.format}
              className="px-3 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => onExport(item.format)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 导出设置 */}
      <div className="space-y-2">
        <div className="text-xs text-gray-600">导出设置</div>

        {/* 分辨率 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">分辨率</span>
          <select
            className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
            onChange={e => console.log('分辨率变更:', e.target.value)}
          >
            <option value="1x">1x</option>
            <option value="2x">2x</option>
            <option value="3x">3x</option>
            <option value="4x">4x</option>
          </select>
        </div>

        {/* 质量 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">质量</span>
          <select
            className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
            onChange={e => console.log('质量变更:', e.target.value)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      {/* 导出按钮 */}
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        onClick={() => onExport('default')}
      >
        <Download size={12} />
        导出当前页面
      </button>

      {/* 批量导出 */}
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
        onClick={() => console.log('批量导出')}
      >
        <Settings size={12} />
        批量导出所有页面
      </button>
    </div>
  );
};

export default ExportPanel;
