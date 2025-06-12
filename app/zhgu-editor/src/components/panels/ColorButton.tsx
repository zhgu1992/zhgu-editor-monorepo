import React, { useState, useRef, useMemo, useCallback } from 'react';
import ColorPickerPortal from './ColorPickerPortal';
import type { ColorResult } from 'react-color';

interface ColorButtonProps {
  color: string;
  onChange: (color: string) => void;
  onStart?: () => void;
  onFinish?: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  title?: string;
}

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  onChange,
  onStart,
  onFinish,
  size = 'medium',
  className = '',
  title = '选择颜色',
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 统一使用 medium 尺寸标准，提供更一致的视觉体验
  const sizeClasses = useMemo(
    () => ({
      small: 'w-7 h-7', // 28px - 用于次要位置
      medium: 'w-8 h-8', // 32px - 标准尺寸，推荐使用
      large: 'w-8 h-8', // 32px - 与medium保持一致，避免视觉不协调
    }),
    []
  );

  // 当前显示的颜色：编辑中使用编辑颜色，否则使用传入的颜色
  const displayColor = editingColor || color;

  // 开始编辑颜色
  const handleStartEdit = useCallback(() => {
    if (isEditing) return;

    setIsEditing(true);
    setEditingColor(color); // 使用当前颜色作为编辑起点
    onStart?.();
  }, [color, onStart, isEditing]);

  // 颜色变化处理
  const handleColorChange = useCallback(
    (colorResult: ColorResult) => {
      const newColor = colorResult.hex;
      setEditingColor(newColor);
      onChange(newColor);
    },
    [onChange]
  );

  // 完成编辑
  const handleFinishEdit = useCallback(() => {
    if (!isEditing) return;

    setIsEditing(false);
    onFinish?.();

    // 延迟清除编辑状态，让外部有时间更新
    setTimeout(() => {
      setEditingColor(null);
    }, 50);
  }, [onFinish, isEditing]);

  // 打开颜色选择器
  const handleTogglePicker = useCallback(() => {
    if (!showPicker) {
      handleStartEdit();
    }
    setShowPicker(prev => !prev);
  }, [showPicker, handleStartEdit]);

  // 关闭颜色选择器
  const handleClosePicker = useCallback(() => {
    setShowPicker(false);
    handleFinishEdit();
  }, [handleFinishEdit]);

  // 使用 useMemo 缓存按钮样式，减少样式重新计算
  const buttonStyle = useMemo(
    () => ({
      backgroundColor: displayColor,
      // 防止布局抖动的关键CSS
      contain: 'layout style paint size' as const,
      isolation: 'isolate' as const,
      // 强制使用 GPU 加速，避免重绘
      transform: 'translateZ(0)',
      willChange: 'auto' as const,
      // 确保固定尺寸，防止内容改变导致的布局移动
      boxSizing: 'border-box' as const,
    }),
    [displayColor]
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleTogglePicker}
        className={`
          ${sizeClasses[size]}
          border border-gray-300 rounded cursor-pointer overflow-hidden
          transform-gpu backface-hidden
          hover:border-gray-400 transition-colors duration-150
          flex-shrink-0
          ${className}
        `}
        style={buttonStyle}
        title={title}
      />

      {showPicker && (
        <ColorPickerPortal
          color={displayColor}
          onChange={handleColorChange}
          onClose={handleClosePicker}
          triggerRef={buttonRef}
        />
      )}
    </>
  );
};

export default ColorButton;
