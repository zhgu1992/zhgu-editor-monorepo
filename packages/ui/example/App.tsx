import React from 'react';
import DraggableNumberInputDemo from './DraggableNumberInputDemo';
import { ColorButton } from '../src';

const App: React.FC = () => {
  const [color, setColor] = React.useState('#1890ff');

  return (
    <div style={{ padding: '20px' }}>
      <h1>ColorButton 示例</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div>
          <h3>小尺寸</h3>
          <ColorButton color={color} onChange={setColor} size="small" />
        </div>
        <div>
          <h3>中尺寸</h3>
          <ColorButton color={color} onChange={setColor} size="medium" />
        </div>
        <div>
          <h3>大尺寸</h3>
          <ColorButton color={color} onChange={setColor} size="large" />
        </div>
        <div>
          <h3>禁用状态</h3>
          <ColorButton color={color} onChange={setColor} disabled />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>当前颜色: {color}</p>
      </div>
      <hr style={{ margin: '32px 0' }} />
      <DraggableNumberInputDemo />
    </div>
  );
};

export default App;
