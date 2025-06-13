import React, { useState, useCallback, useMemo } from 'react';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';

export interface ColorButtonProps {
  color: string;
  onChange: (color: string) => void;
  onStart?: () => void;
  onFinish?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const sizeMap = {
  small: {
    width: '24px',
    height: '24px',
  },
  medium: {
    width: '32px',
    height: '32px',
  },
  large: {
    width: '40px',
    height: '40px',
  },
};

export const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  onChange,
  onStart,
  onFinish,
  size = 'medium',
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 当前显示的颜色：编辑中使用编辑颜色，否则使用传入的颜色
  const displayColor = editingColor || color;

  // 开始编辑颜色
  const handleStartEdit = useCallback(() => {
    if (disabled || isEditing) return;

    setIsEditing(true);
    setEditingColor(color); // 使用当前颜色作为编辑起点
    setShowPicker(true);
    onStart?.();
  }, [color, disabled, isEditing, onStart]);

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
    setShowPicker(false);
    onFinish?.();

    // 延迟清除编辑状态，让外部有时间更新
    setTimeout(() => {
      setEditingColor(null);
    }, 50);
  }, [isEditing, onFinish]);

  // 点击外部关闭
  const handleClickOutside = useCallback(() => {
    handleFinishEdit();
  }, [handleFinishEdit]);

  // 使用 useMemo 缓存按钮样式，减少样式重新计算
  const buttonStyle = useMemo(
    () => ({
      width: sizeMap[size].width,
      height: sizeMap[size].height,
      backgroundColor: displayColor,
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      padding: 0,
      // 防止布局抖动的关键CSS
      contain: 'layout style paint size' as const,
      isolation: 'isolate' as const,
      // 强制使用 GPU 加速，避免重绘
      transform: 'translateZ(0)',
      willChange: 'auto' as const,
      // 确保固定尺寸，防止内容改变导致的布局移动
      boxSizing: 'border-box' as const,
    }),
    [displayColor, size, disabled]
  );

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleStartEdit} style={buttonStyle} />
      {showPicker && (
        <div
          style={{
            position: 'absolute',
            zIndex: 2,
            top: '100%',
            left: 0,
            marginTop: '8px',
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            onClick={handleClickOutside}
          />
          <SketchPicker color={displayColor} onChange={handleColorChange} onChangeComplete={handleFinishEdit} />
        </div>
      )}
    </div>
  );
};
