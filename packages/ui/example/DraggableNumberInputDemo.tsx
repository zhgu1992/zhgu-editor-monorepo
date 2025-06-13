import React, { useState } from 'react';
import { DraggableNumberInput } from '../src/components/DraggableNumberInput';

const DraggableNumberInputDemo: React.FC = () => {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(100);
  const [value3, setValue3] = useState(0);
  // 混合状态演示
  const [mixed, setMixed] = useState(true);

  return (
    <div style={{ padding: 24 }}>
      <h2>DraggableNumberInput 组件演示</h2>
      <div style={{ margin: '16px 0' }}>
        <strong>1. 默认用法：</strong>
        <DraggableNumberInput label="X" value={value1} onChange={setValue1} />
      </div>
      <div style={{ margin: '16px 0' }}>
        <strong>2. 自定义 step/min/max：</strong>
        <DraggableNumberInput label="Y" value={value2} onChange={setValue2} step={5} min={90} max={110} />
      </div>
      <div style={{ margin: '16px 0' }}>
        <strong>3. 混合状态：</strong>
        <DraggableNumberInput label="Z" value={value3} onChange={setValue3} mixed={mixed} />
        <button style={{ marginLeft: 12 }} onClick={() => setMixed(m => !m)}>
          切换混合状态
        </button>
      </div>
    </div>
  );
};

export default DraggableNumberInputDemo;
