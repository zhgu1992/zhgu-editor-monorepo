import React, { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { ColorResult } from 'react-color';
import { SketchPicker } from 'react-color';

interface ColorPickerPortalProps {
  color: string;
  onChange: (color: ColorResult) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const ColorPickerPortal: React.FC<ColorPickerPortalProps> = ({ color, onChange, onClose, triggerRef }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const pickerHeight = 400; // SketchPicker的大概高度，增加了50px
      const pickerWidth = 270; // SketchPicker的大概宽度，增加了45px

      let top = rect.bottom + 8;
      let left = rect.left;

      // 检查是否超出屏幕底部
      if (top + pickerHeight > window.innerHeight) {
        top = rect.top - pickerHeight - 8;
      }

      // 检查是否超出屏幕右侧
      if (left + pickerWidth > window.innerWidth) {
        left = window.innerWidth - pickerWidth - 16;
      }

      // 检查是否超出屏幕左侧
      if (left < 16) {
        left = 16;
      }

      return { top, left };
    }
    return null;
  }, [triggerRef]);

  const updatePosition = useCallback(() => {
    const newPosition = calculatePosition();
    if (newPosition) {
      setPosition(newPosition);
    }
  }, [calculatePosition]);

  // 使用 useLayoutEffect 在DOM渲染前同步计算位置
  useLayoutEffect(() => {
    const initialPosition = calculatePosition();
    if (initialPosition) {
      setPosition(initialPosition);
      setIsReady(true);
    }
  }, [calculatePosition]);

  useEffect(() => {
    // 监听窗口大小变化和滚动，更新位置
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition]);

  const handleClickOutside = useCallback(
    (event: Event) => {
      const target = event.target as Node;

      // 如果正在拖拽颜色选择器，不关闭
      if (isDragging) {
        return;
      }

      // 如果点击在触发按钮上，不关闭
      if (triggerRef.current && triggerRef.current.contains(target)) {
        return;
      }

      // 如果点击在颜色选择器内部，不关闭
      if (pickerRef.current && pickerRef.current.contains(target)) {
        return;
      }

      // 检查是否为颜色选择器相关的子元素（更深层的检查）
      let currentNode = target as Element;
      while (currentNode && currentNode !== document.body) {
        // 检查是否为 react-color 相关的元素
        if (
          currentNode.classList?.contains('sketch-picker') ||
          currentNode.classList?.contains('saturation-white') ||
          currentNode.classList?.contains('saturation-black') ||
          currentNode.classList?.contains('saturation-pointer') ||
          currentNode.classList?.contains('hue-horizontal') ||
          currentNode.classList?.contains('hue-pointer') ||
          currentNode.classList?.contains('alpha-horizontal') ||
          currentNode.classList?.contains('alpha-pointer') ||
          currentNode.classList?.contains('flexbox-fix') ||
          currentNode.getAttribute('data-reactroot') !== null
        ) {
          return;
        }

        // 如果父节点是颜色选择器容器，也不关闭
        if (pickerRef.current && pickerRef.current.contains(currentNode)) {
          return;
        }

        currentNode = currentNode.parentElement as Element;
      }

      // 其他情况都关闭
      onClose();
    },
    [onClose, triggerRef, isDragging]
  );

  // 监听鼠标拖拽状态
  const handleMouseDown = useCallback((event: Event) => {
    const target = event.target as Node;
    if (pickerRef.current && pickerRef.current.contains(target)) {
      setIsDragging(true);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    // 使用capture模式确保能正确捕获事件
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    // 监听拖拽状态
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('touchend', handleMouseUp, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('touchend', handleMouseUp, true);
    };
  }, [handleClickOutside, handleMouseDown, handleMouseUp]);

  // 使用 useMemo 缓存样式，减少重新计算
  const pickerStyle = useMemo(() => {
    if (!position || !isReady) {
      return {
        visibility: 'hidden' as const,
        opacity: 0,
        transform: 'translateZ(0)',
      };
    }

    return {
      top: position.top,
      left: position.left,
      willChange: 'transform' as const,
      transform: 'translateZ(0)',
      visibility: 'visible' as const,
      opacity: 1,
      transition: 'opacity 0.1s ease-out',
    };
  }, [position, isReady]);

  const portalContent = useMemo(
    () => (
      <>
        {/* 透明覆盖层，防止其他元素交互 */}
        <div className="fixed inset-0 z-[9998]" />

        {/* 颜色选择器 */}
        <div
          ref={pickerRef}
          className="fixed z-[9999] shadow-2xl rounded-lg overflow-hidden"
          style={pickerStyle}
          onMouseDown={e => {
            // 阻止事件冒泡，防止误触发外部点击事件
            e.stopPropagation();
          }}
        >
          <SketchPicker color={color} onChange={onChange} disableAlpha={false} />
        </div>
      </>
    ),
    [color, onChange, pickerStyle]
  );

  // 使用portal渲染到body
  return createPortal(portalContent, document.body);
};

export default ColorPickerPortal;
