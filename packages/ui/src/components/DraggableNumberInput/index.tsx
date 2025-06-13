import React, { useRef, useState, useCallback } from 'react';

// 黑色ew-resize SVG光标（base64编码，兼容性更好）
const blackEwResizeCursor =
  'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yIDEyaDIwIi8+PHBhdGggZD0iTTYgOGwtNCA0IDQgNCIvPjxwYXRoIGQ9Ik0xOCA4bDQgNC00IDQiLz48L2c+PC9zdmc+") 12 12, ew-resize';

// 隐藏number input的上下箭头，禁止hover/focus高亮
const inputNumberStyle: React.CSSProperties = {
  width: 48,
  border: 'none',
  outline: 'none',
  background: 'none',
  color: '#222',
  fontSize: 15,
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
  padding: 0,
  margin: 0,
  textAlign: 'left',
  appearance: 'textfield',
  MozAppearance: 'textfield',
  WebkitAppearance: 'none',
  boxShadow: 'none',
  cursor: 'default',
};

export interface DraggableNumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onStart?: () => void;
  onFinish?: () => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  mixed?: boolean; // 混合状态
}

const DRAG_ACTIVATE_THRESHOLD = 3; // 只有水平移动超过3px才激活

export const DraggableNumberInput: React.FC<DraggableNumberInputProps> = ({
  label,
  value,
  onChange,
  onStart,
  onFinish,
  step = 10,
  min = -Infinity,
  max = Infinity,
  className = '',
  mixed = false,
}) => {
  const [dragging, setDragging] = useState(false);
  const [activated, setActivated] = useState(false); // 是否已激活拖动
  const [hover, setHover] = useState(false); // hover状态用于边框色
  const [inputValue, setInputValue] = useState(value.toString());
  const activatedRef = useRef(false); // 用于解决闭包问题
  const startX = useRef(0);
  const startY = useRef(0);
  const startValue = useRef(value);

  // 保持inputValue和外部value同步
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // 阻止选中
      setDragging(true);
      setActivated(false);
      activatedRef.current = false;
      startX.current = e.clientX;
      startY.current = e.clientY;
      startValue.current = value;
      document.body.style.cursor = blackEwResizeCursor;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      onStart?.();
    },
    [value, onStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        document.body.style.cursor = blackEwResizeCursor;
      }
      const deltaX = e.clientX - startX.current;
      const deltaY = e.clientY - startY.current;
      if (!activatedRef.current && Math.abs(deltaX) > DRAG_ACTIVATE_THRESHOLD) {
        setActivated(true);
        activatedRef.current = true;
      }
      if (activatedRef.current) {
        // 每移动 10px 改变一个 step
        const steps = Math.round(deltaX / 10);
        let newValue = startValue.current + steps * step;
        newValue = Math.max(min, Math.min(max, newValue));
        onChange(newValue);
      }
    },
    [onChange, step, min, max, dragging]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setActivated(false);
    activatedRef.current = false;
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    onFinish?.();
  }, [handleMouseMove, onFinish]);

  // hover只在X区域生效
  const handleXMouseEnter = () => {
    setHover(true);
    if (!dragging) document.body.style.cursor = 'ew-resize';
  };
  const handleXMouseLeave = () => {
    setHover(false);
    if (dragging) return;
    document.body.style.cursor = '';
  };

  // input相关
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputBlur = () => {
    const num = Number(inputValue);
    if (!isNaN(num) && num !== value) {
      const newValue = Math.max(min, Math.min(max, num));
      onChange(newValue);
    } else {
      setInputValue(value.toString()); // 恢复原值
    }
  };
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none', // 兼容Safari
        width: 120,
        background: '#fafafa',
        border: `1px solid ${hover ? '#bdbdbd' : '#e0e0e0'}`,
        borderRadius: 4,
        padding: '2px 10px 2px 8px',
        height: 32,
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          position: 'relative',
          cursor: 'ew-resize',
          color: dragging ? '#000' : '#888',
          fontWeight: 500,
          fontSize: 15,
          transition: 'color 0.15s',
          marginRight: 8,
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleXMouseEnter}
        onMouseLeave={handleXMouseLeave}
      >
        {label}
      </span>
      {mixed ? (
        <span
          style={{
            fontVariantNumeric: 'tabular-nums',
            color: '#bbb',
            background: 'none',
            borderRadius: 3,
            padding: '0 4px',
            pointerEvents: 'none',
            opacity: 0.7,
            fontWeight: 400,
            fontSize: 15,
          }}
        >
          混合
        </span>
      ) : (
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          min={min}
          max={max}
          step={step}
          style={{
            ...inputNumberStyle,
            cursor: dragging ? blackEwResizeCursor : 'default',
          }}
          inputMode="numeric"
          // 隐藏number input的上下箭头（Chrome/Safari/Edge）
          className="no-spinner"
        />
      )}
      {/* 内联样式隐藏number input的上下箭头，禁止hover/focus高亮 */}
      <style>{`
        input[type=number].no-spinner::-webkit-inner-spin-button,
        input[type=number].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number].no-spinner {
          -moz-appearance: textfield;
        }
        input[type=number].no-spinner:focus,
        input[type=number].no-spinner:hover {
          outline: none !important;
          box-shadow: none !important;
          background: none !important;
        }
      `}</style>
    </div>
  );
};

export default DraggableNumberInput;
