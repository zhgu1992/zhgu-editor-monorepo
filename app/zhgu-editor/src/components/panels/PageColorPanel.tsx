import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ColorButton } from '@zhgu/ui';
import { useBackgroundColorTransaction } from '../../hooks/useBackgroundColorTransaction';
import { useEditorStore } from '../../store';
import { colorToStr } from '@zhgu/data';

interface PageColorPanelProps {
  onPageColorChange: (color: string) => void;
}

const PageColorPanel: React.FC<PageColorPanelProps> = ({ onPageColorChange }) => {
  // 使用背景色事务hook
  const backgroundColorTransaction = useBackgroundColorTransaction();

  // 获取当前页面背景色
  const currentPage = useEditorStore(state => state.getCurrentPage());

  // 从当前页面读取背景色
  const backgroundColor = colorToStr(currentPage?.backgroundColor ?? { r: 0, g: 0, b: 0, a: 1 });

  // 输入框状态
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // 同步输入框值
  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(backgroundColor.toUpperCase());
    }
  }, [backgroundColor, isInputFocused]);

  // 背景色变化处理
  const handleColorChange = useCallback(
    (color: string) => {
      backgroundColorTransaction.applyBackgroundColorChange(color);
      onPageColorChange(color);
    },
    [backgroundColorTransaction, onPageColorChange]
  );

  const handleColorStart = useCallback(() => {
    backgroundColorTransaction.startBackgroundColorTransaction();
  }, [backgroundColorTransaction]);

  const handleColorFinish = useCallback(() => {
    backgroundColorTransaction.commitBackgroundColorTransaction();
  }, [backgroundColorTransaction]);

  // 输入框颜色变化处理
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // 只有完整的hex颜色才应用到页面
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        backgroundColorTransaction.applyBackgroundColorChange(value);
        onPageColorChange(value);
      }
    },
    [backgroundColorTransaction, onPageColorChange]
  );

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
    handleColorStart();
  }, [handleColorStart]);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    handleColorFinish();
  }, [handleColorFinish]);

  return (
    <div className="space-y-4">
      {/* 背景色 */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700 text-left">背景色</div>
        <div className="flex items-center gap-3">
          <ColorButton
            color={backgroundColor}
            onChange={handleColorChange}
            onStart={handleColorStart}
            onFinish={handleColorFinish}
            size="medium"
          />
          {/* 统一样式的颜色输入框 */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="#000000"
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400 font-mono tabular-nums"
            style={{
              minWidth: '90px',
              maxWidth: '90px',
            }}
          />
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
    </div>
  );
};

export default PageColorPanel;
