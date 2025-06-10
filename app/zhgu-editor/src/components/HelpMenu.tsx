import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle,
  Keyboard,
  BookOpen,
  MessageSquare,
  FileText,
  GraduationCap,
  GitBranch,
  ExternalLink,
} from 'lucide-react';

interface HelpMenuProps {
  onShortcutHelp: () => void;
}

const HelpMenu: React.FC<HelpMenuProps> = ({ onShortcutHelp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const helpItems = [
    {
      id: 'help-center',
      icon: BookOpen,
      label: '帮助中心',
      action: () => {
        console.log('打开帮助中心');
        setIsOpen(false);
      },
    },
    {
      id: 'faq',
      icon: MessageSquare,
      label: '常见问题',
      action: () => {
        console.log('打开常见问题');
        setIsOpen(false);
      },
    },
    {
      id: 'feedback',
      icon: MessageSquare,
      label: '意见反馈',
      action: () => {
        console.log('打开意见反馈');
        setIsOpen(false);
      },
    },
    {
      id: 'docs',
      icon: FileText,
      label: '用户文档',
      action: () => {
        console.log('打开用户文档');
        setIsOpen(false);
      },
    },
    {
      id: 'tutorial',
      icon: GraduationCap,
      label: '获取教程',
      action: () => {
        console.log('打开教程');
        setIsOpen(false);
      },
    },
    {
      id: 'opensource',
      icon: GitBranch,
      label: '开源计划指南',
      action: () => {
        console.log('打开开源计划指南');
        setIsOpen(false);
      },
    },
    {
      id: 'shortcuts',
      icon: Keyboard,
      label: '快捷键帮助',
      shortcut: 'Ctrl',
      action: () => {
        onShortcutHelp();
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* 问号按钮 */}
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          isOpen
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="帮助"
      >
        <HelpCircle size={16} />
      </button>

      {/* 帮助菜单 */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50">
          {/* 菜单标题 */}
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">帮助</h3>
          </div>

          {/* 菜单项 */}
          <div className="py-1">
            {helpItems.map(item => (
              <button
                key={item.id}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                onClick={item.action}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={14} className="text-gray-500" />
                  <span>{item.label}</span>
                </div>

                {item.shortcut && <span className="text-xs text-gray-400">{item.shortcut}</span>}

                {item.id !== 'shortcuts' && <ExternalLink size={12} className="text-gray-400" />}
              </button>
            ))}
          </div>

          {/* 底部分隔区域 */}
          <div className="border-t border-gray-100 mt-2 pt-2 px-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* 主题切换 */}
            <div className="flex items-center gap-2 mt-2">
              <button className="p-1 hover:bg-gray-100 rounded" title="浅色主题">
                ☀️
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" title="深色主题">
                🌙
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" title="系统主题">
                💻
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpMenu;
