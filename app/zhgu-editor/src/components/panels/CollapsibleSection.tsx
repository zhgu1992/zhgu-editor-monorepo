import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { IMetaData } from '@zhgu/editor';

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  metaData?: IMetaData;
  sectionKey?: keyof IMetaData;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  metaData,
  sectionKey,
}) => {
  // 获取当前section的配置
  const sectionConfig = sectionKey && metaData ? metaData[sectionKey] : undefined;

  // 如果配置了不可见，则不渲染
  if (sectionConfig?.isVisible === false) {
    return null;
  }

  // 克隆子组件并注入metaData
  const childrenWithMetaData = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        // @ts-ignore
        metaData,
        sectionKey,
      });
    }
    return child;
  });

  return (
    <div className="border-b border-gray-100">
      <button
        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 ${
          sectionConfig?.enabled === false ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onToggle}
        disabled={sectionConfig?.enabled === false}
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {isExpanded ? (
          <ChevronDown size={14} className="text-gray-400" />
        ) : (
          <ChevronRight size={14} className="text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="px-4 pb-4">{childrenWithMetaData}</div>}
    </div>
  );
};

export default CollapsibleSection;
