import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface TextPanelProps {
  selectedNodes: any[];
}

const TextPanel: React.FC<TextPanelProps> = ({ selectedNodes }) => {
  const hasTextNodes = selectedNodes.some(node => node.type === 'text');

  if (!hasTextNodes) {
    return null;
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-gray-700">文本</span>

      {/* 字体 */}
      <div className="grid grid-cols-2 gap-2">
        <select className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400">
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times">Times</option>
          <option value="Courier">Courier</option>
        </select>
        <input
          type="number"
          placeholder="字号"
          defaultValue="16"
          className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* 文本样式 */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-gray-100 rounded border">
          <Bold size={12} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded border">
          <Italic size={12} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded border">
          <Underline size={12} />
        </button>
      </div>

      {/* 文本对齐 */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-gray-100 rounded border">
          <AlignLeft size={12} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded border">
          <AlignCenter size={12} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded border">
          <AlignRight size={12} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded border">
          <AlignJustify size={12} />
        </button>
      </div>
    </div>
  );
};

export default TextPanel;
