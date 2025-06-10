import React from 'react';
import {
  MousePointer2,
  Hand,
  Square,
  PenTool,
  Type,
  Edit3,
  Copy,
  MessageCircle,
  Component,
  Search,
} from 'lucide-react';
import { useEditorStore, type ToolType } from '../store';

const Toolbar: React.FC = () => {
  const { currentTool, setCurrentTool } = useEditorStore();

  const tools = [
    { id: 'select' as ToolType, icon: MousePointer2, label: '选择工具', shortcut: 'V' },
    { id: 'move' as ToolType, icon: Hand, label: '抓手工具', shortcut: 'H' },
    { id: 'rectangle' as ToolType, icon: Square, label: '矩形工具', shortcut: 'R' },
    { id: 'pen' as ToolType, icon: PenTool, label: '钢笔工具', shortcut: 'P' },
    { id: 'text' as ToolType, icon: Type, label: '文本工具', shortcut: 'T' },
    { id: 'edit' as ToolType, icon: Edit3, label: '编辑工具', shortcut: 'E' },
    { id: 'copy' as ToolType, icon: Copy, label: '复制工具', shortcut: 'C' },
    { id: 'comment' as ToolType, icon: MessageCircle, label: '评论工具', shortcut: 'M' },
    { id: 'component' as ToolType, icon: Component, label: '组件工具', shortcut: 'K' },
    { id: 'search' as ToolType, icon: Search, label: '搜索工具', shortcut: 'F' },
  ];

  const handleToolSelect = (tool: ToolType) => {
    setCurrentTool(tool);
    console.log(`选择工具: ${tool}`);
  };

  return (
    <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-2 gap-1">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors group relative ${
            currentTool === tool.id ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-gray-200 text-gray-600'
          }`}
          onClick={() => handleToolSelect(tool.id)}
          title={`${tool.label} (${tool.shortcut})`}
        >
          <tool.icon size={18} />

          {/* 工具提示 */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {tool.label} ({tool.shortcut})
          </div>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
