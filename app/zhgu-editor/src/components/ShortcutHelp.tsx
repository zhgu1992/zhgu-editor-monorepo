import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutHelpProps {
  show: boolean;
  onClose: () => void;
}

const ShortcutHelp: React.FC<ShortcutHelpProps> = ({ show, onClose }) => {
  const shortcuts = [
    {
      category: '通用',
      items: [
        { key: 'Ctrl + Z', desc: '撤销' },
        { key: 'Ctrl + Y', desc: '重做' },
        { key: 'Ctrl + C', desc: '复制' },
        { key: 'Ctrl + V', desc: '粘贴' },
        { key: 'Ctrl + S', desc: '保存' },
        { key: 'Delete', desc: '删除选中' },
        { key: 'L', desc: '切换调试模式' },
      ],
    },
    {
      category: '工具',
      items: [
        { key: 'V', desc: '选择工具' },
        { key: 'M', desc: '移动工具' },
        { key: 'R', desc: '矩形工具' },
        { key: 'F', desc: '画板工具' },
        { key: 'T', desc: '文本工具' },
        { key: 'Esc', desc: '取消选择' },
      ],
    },
    {
      category: '图层',
      items: [
        { key: 'Ctrl + G', desc: '编组' },
        { key: 'Ctrl + Shift + G', desc: '取消编组' },
      ],
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Keyboard size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold">快捷键</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {shortcuts.map(category => (
              <div key={category.category} className="space-y-3">
                <h3 className="font-medium text-gray-900 pb-2 border-b border-gray-100">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{shortcut.desc}</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            按 <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">?</kbd> 再次打开此帮助，按{' '}
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> 关闭
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortcutHelp;
