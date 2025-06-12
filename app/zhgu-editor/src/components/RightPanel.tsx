import React from 'react';
import ConfigurableRightPanel from './ConfigurableRightPanel';

interface RightPanelProps {
  onShowShortcutHelp: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ onShowShortcutHelp }) => {
  return (
    <ConfigurableRightPanel
      onShowShortcutHelp={onShowShortcutHelp}
      // 不传递配置，让组件根据选中节点动态获取
    />
  );
};

export default RightPanel;
