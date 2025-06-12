import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className="border-b border-gray-100">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
        onClick={onToggle}
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {isExpanded ? (
          <ChevronDown size={14} className="text-gray-400" />
        ) : (
          <ChevronRight size={14} className="text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
