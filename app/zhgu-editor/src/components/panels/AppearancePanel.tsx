import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Eye, Plus } from 'lucide-react';
import ColorButton from './ColorButton';
import { useColorTransaction } from '../../hooks/useColorTransaction';

interface AppearancePanelProps {
  selectedNodes: any[];
  fillEnabled: boolean;
  strokeEnabled: boolean;
}

const AppearancePanel: React.FC<AppearancePanelProps> = ({ selectedNodes, fillEnabled, strokeEnabled }) => {
  // 使用颜色事务hook
  const fillColorTransaction = useColorTransaction({ type: 'fill' });
  const strokeColorTransaction = useColorTransaction({ type: 'stroke' });

  // 从选中节点读取填充颜色
  const fillColor = useMemo(() => {
    if (selectedNodes.length === 0) return '#c0c0c0';

    const firstNode = selectedNodes[0];
    const fillPaints = firstNode.fillPaints;

    if (fillPaints && fillPaints.length > 0) {
      const firstPaint = fillPaints[0];
      if (firstPaint.type === 'SOLID' && firstPaint.color) {
        const { r, g, b } = firstPaint.color;
        // 将0-1范围的RGB值转换为0-255范围，然后转为hex
        const red = Math.round(r);
        const green = Math.round(g);
        const blue = Math.round(b);
        return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
      }
    }

    return '#c0c0c0'; // 默认颜色
  }, [selectedNodes]);

  // 从选中节点读取描边颜色
  const strokeColor = useMemo(() => {
    if (selectedNodes.length === 0) return '#000000';

    const firstNode = selectedNodes[0];
    const strokePaints = firstNode.strokePaints;

    if (strokePaints && strokePaints.length > 0) {
      const firstPaint = strokePaints[0];
      if (firstPaint.type === 'SOLID' && firstPaint.color) {
        const { r, g, b } = firstPaint.color;
        // 将0-1范围的RGB值转换为0-255范围，然后转为hex
        const red = Math.round(r);
        const green = Math.round(g);
        const blue = Math.round(b);
        return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
      }
    }

    return '#000000'; // 默认描边颜色
  }, [selectedNodes]);

  const [fillOpacity, setFillOpacity] = useState(100);

  // 填充颜色变化处理（业务逻辑）
  const handleFillColorChange = useCallback(
    (color: string) => {
      fillColorTransaction.applyColorChange(color);
    },
    [fillColorTransaction]
  );

  const handleFillColorStart = useCallback(() => {
    fillColorTransaction.startColorTransaction();
  }, [fillColorTransaction]);

  const handleFillColorFinish = useCallback(() => {
    fillColorTransaction.commitColorTransaction();
  }, [fillColorTransaction]);

  // 描边颜色变化处理（业务逻辑）
  const handleStrokeColorChange = useCallback(
    (color: string) => {
      strokeColorTransaction.applyColorChange(color);
    },
    [strokeColorTransaction]
  );

  const handleStrokeColorStart = useCallback(() => {
    strokeColorTransaction.startColorTransaction();
  }, [strokeColorTransaction]);

  const handleStrokeColorFinish = useCallback(() => {
    strokeColorTransaction.commitColorTransaction();
  }, [strokeColorTransaction]);

  // 输入框颜色变化处理
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // 同步输入框值
  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(fillColor.toUpperCase());
    }
  }, [fillColor, isInputFocused]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // 只有完整的hex颜色才应用到节点
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        fillColorTransaction.applyColorChange(value);
      }
    },
    [fillColorTransaction]
  );

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
    handleFillColorStart();
  }, [handleFillColorStart]);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    handleFillColorFinish();
  }, [handleFillColorFinish]);

  const handleFillOpacityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseInt(e.target.value);
    setFillOpacity(opacity);
    console.log('不透明度:', opacity + '%');
  }, []);

  if (selectedNodes.length === 0) {
    return <div className="text-xs text-gray-500 text-center py-4">选择图层以编辑外观</div>;
  }

  return (
    <div className="space-y-4">
      {/* 物体颜色 (填充) */}
      {fillEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">物体颜色</span>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('切换填充可见性')}>
              <Eye size={12} />
            </button>
          </div>

          {/* 颜色选择器和十六进制输入 */}
          <div className="flex items-center gap-3">
            <ColorButton
              color={fillColor}
              onChange={handleFillColorChange}
              onStart={handleFillColorStart}
              onFinish={handleFillColorFinish}
              size="medium"
              title="选择物体颜色"
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
      )}

      {/* 描边 */}
      {strokeEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">描边</span>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('添加描边')}>
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <ColorButton
              color={strokeColor}
              onChange={handleStrokeColorChange}
              onStart={handleStrokeColorStart}
              onFinish={handleStrokeColorFinish}
              size="medium"
              title="选择描边颜色"
            />
            <div className="grid grid-cols-2 gap-2 flex-1">
              <input
                type="number"
                placeholder="宽度"
                defaultValue="1"
                className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400 font-mono tabular-nums"
              />
              <select className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400">
                <option value="solid">实线</option>
                <option value="dashed">虚线</option>
                <option value="dotted">点线</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppearancePanel;
