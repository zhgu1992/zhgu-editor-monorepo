import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Download,
  Copy,
  Share2,
  HelpCircle,
  Palette,
  Square,
  Circle,
  Triangle,
  Image as ImageIcon,
  Type,
  Layers,
  Zap,
  MoreHorizontal,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  Printer,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { useEditorStore, EditorInitState } from '../store';
import HelpMenu from './HelpMenu';

interface RightPanelProps {
  onShowShortcutHelp: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ onShowShortcutHelp }) => {
  const { initState, getPages, getCurrentPage, getSelectedNodes } = useEditorStore();

  const [expandedSections, setExpandedSections] = useState({
    layout: true,
    appearance: true,
    effects: false,
    pageColors: true,
    export: true,
  });

  // 获取真实数据
  const pages = getPages();
  const currentPage = getCurrentPage();
  const selectedNodes = getSelectedNodes();

  // 如果editor未就绪，显示加载状态
  if (initState !== EditorInitState.READY) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-sm">属性面板加载中...</div>
        </div>
      </div>
    );
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLayoutChange = (property: string, value: any) => {
    console.log(`布局变更: ${property} = ${value}`);
  };

  const handlePageColorChange = (color: string) => {
    console.log('页面颜色变更:', color);
  };

  const handleExport = (format: string) => {
    console.log('导出格式:', format);
  };

  // 渲染属性输入组件
  const PropertyInput: React.FC<{
    label: string;
    value: string | number;
    onChange: (value: any) => void;
    type?: 'text' | 'number' | 'color';
  }> = ({ label, value, onChange, type = 'text' }) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs text-gray-600 w-16">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-20 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
      />
    </div>
  );

  // 渲染可折叠区域
  const CollapsibleSection: React.FC<{
    title: string;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }> = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-100">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
        onClick={() => toggleSection(sectionKey)}
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronDown size={14} className="text-gray-400" />
        ) : (
          <ChevronRight size={14} className="text-gray-400" />
        )}
      </button>
      {expandedSections[sectionKey] && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* 标题 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-800">属性面板</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 高级布局属性 */}
        <CollapsibleSection title="高级布局" sectionKey="layout">
          {selectedNodes.length > 0 ? (
            <div className="space-y-3">
              {selectedNodes.map((node, index) => (
                <div key={node.id} className="space-y-2">
                  {selectedNodes.length > 1 && (
                    <div className="text-xs font-medium text-gray-600 pb-1 border-b border-gray-100">{node.name}</div>
                  )}

                  {/* 位置属性 */}
                  <div className="grid grid-cols-2 gap-2">
                    <PropertyInput
                      label="X"
                      value={(node as any).x || 0}
                      onChange={value => handleLayoutChange(`${node.id}.x`, value)}
                      type="number"
                    />
                    <PropertyInput
                      label="Y"
                      value={(node as any).y || 0}
                      onChange={value => handleLayoutChange(`${node.id}.y`, value)}
                      type="number"
                    />
                  </div>

                  {/* 尺寸属性 */}
                  <div className="grid grid-cols-2 gap-2">
                    <PropertyInput
                      label="宽度"
                      value={(node as any).width || 0}
                      onChange={value => handleLayoutChange(`${node.id}.width`, value)}
                      type="number"
                    />
                    <PropertyInput
                      label="高度"
                      value={(node as any).height || 0}
                      onChange={value => handleLayoutChange(`${node.id}.height`, value)}
                      type="number"
                    />
                  </div>

                  {/* 旋转和透明度 */}
                  <div className="grid grid-cols-2 gap-2">
                    <PropertyInput
                      label="旋转"
                      value={0}
                      onChange={value => handleLayoutChange(`${node.id}.rotation`, value)}
                      type="number"
                    />
                    <PropertyInput
                      label="透明度"
                      value={100}
                      onChange={value => handleLayoutChange(`${node.id}.opacity`, value)}
                      type="number"
                    />
                  </div>

                  {/* 圆角 */}
                  {node.type === 'rectangle' && (
                    <div className="grid grid-cols-2 gap-2">
                      <PropertyInput
                        label="圆角"
                        value={0}
                        onChange={value => handleLayoutChange(`${node.id}.borderRadius`, value)}
                        type="number"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-4">选择图层以编辑属性</div>
          )}
        </CollapsibleSection>

        {/* 外观属性 */}
        <CollapsibleSection title="外观" sectionKey="appearance">
          {selectedNodes.length > 0 ? (
            <div className="space-y-4">
              {/* 填充 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">填充</span>
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('切换填充可见性')}>
                    <Eye size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#c0c0c0"
                    onChange={e => console.log('填充颜色:', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue="#C0C0C0"
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">不透明度</span>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-12" />
                  </div>
                </div>
              </div>

              {/* 描边 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">描边</span>
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('添加描边')}>
                    <Plus size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#000000"
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-1 flex-1">
                    <input
                      type="number"
                      placeholder="宽度"
                      defaultValue="1"
                      className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                    />
                    <select className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400">
                      <option value="solid">实线</option>
                      <option value="dashed">虚线</option>
                      <option value="dotted">点线</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 文本属性（仅文本图层） */}
              {selectedNodes.some(node => node.type === 'text') && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-700">文本</span>

                  {/* 字体 */}
                  <div className="grid grid-cols-2 gap-2">
                    <select className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400">
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times">Times</option>
                      <option value="Courier">Courier</option>
                    </select>
                    <input
                      type="number"
                      placeholder="字号"
                      defaultValue="16"
                      className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* 文本样式 */}
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded border">
                      <Bold size={12} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded border">
                      <Italic size={12} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded border">
                      <Underline size={12} />
                    </button>
                  </div>

                  {/* 文本对齐 */}
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded border">
                      <AlignLeft size={12} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded border">
                      <AlignCenter size={12} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded border">
                      <AlignRight size={12} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded border">
                      <AlignJustify size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-4">选择图层以编辑外观</div>
          )}
        </CollapsibleSection>

        {/* 效果 */}
        <CollapsibleSection title="效果" sectionKey="effects">
          {selectedNodes.length > 0 ? (
            <div className="space-y-3">
              {/* 阴影 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">阴影</span>
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('添加阴影')}>
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 text-center py-3 border border-dashed border-gray-300 rounded">
                  点击添加阴影效果
                </div>
              </div>

              {/* 模糊 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">模糊</span>
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => console.log('添加模糊')}>
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* 混合模式 */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-700">混合模式</span>
                <select className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400">
                  <option value="normal">正常</option>
                  <option value="multiply">正片叠底</option>
                  <option value="screen">滤色</option>
                  <option value="overlay">叠加</option>
                  <option value="soft-light">柔光</option>
                  <option value="hard-light">强光</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-4">选择图层以添加效果</div>
          )}
        </CollapsibleSection>

        {/* 页面颜色 */}
        <CollapsibleSection title="页面颜色" sectionKey="pageColors">
          <div className="space-y-3">
            {/* 背景色 */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">背景色</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#ffffff"
                  onChange={e => handlePageColorChange(e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-xs text-gray-500">#FFFFFF</span>
              </div>
            </div>

            {/* 导出包含背景色 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-3 h-3"
                onChange={e => console.log('导出包含背景色:', e.target.checked)}
              />
              <span className="text-xs text-gray-600">导出包含背景色</span>
            </label>

            {/* 显示页面颜色预设 */}
            <div className="space-y-2">
              <div className="text-xs text-gray-600">页面颜色预设</div>
              <div className="grid grid-cols-6 gap-2">
                {[
                  '#ffffff',
                  '#f8f9fa',
                  '#e9ecef',
                  '#dee2e6',
                  '#495057',
                  '#212529',
                  '#007bff',
                  '#28a745',
                  '#ffc107',
                  '#dc3545',
                  '#6f42c1',
                  '#e83e8c',
                ].map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePageColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 导出 */}
        <CollapsibleSection title="导出" sectionKey="export">
          <div className="space-y-3">
            {/* 导出格式选择 */}
            <div className="space-y-2">
              <div className="text-xs text-gray-600">导出格式</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { format: 'PNG', label: 'PNG' },
                  { format: 'JPG', label: 'JPG' },
                  { format: 'SVG', label: 'SVG' },
                  { format: 'PDF', label: 'PDF' },
                ].map(item => (
                  <button
                    key={item.format}
                    className="px-3 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => handleExport(item.format)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 导出设置 */}
            <div className="space-y-2">
              <div className="text-xs text-gray-600">导出设置</div>

              {/* 分辨率 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">分辨率</span>
                <select
                  className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  onChange={e => console.log('分辨率变更:', e.target.value)}
                >
                  <option value="1x">1x</option>
                  <option value="2x">2x</option>
                  <option value="3x">3x</option>
                  <option value="4x">4x</option>
                </select>
              </div>

              {/* 质量 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">质量</span>
                <select
                  className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  onChange={e => console.log('质量变更:', e.target.value)}
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
            </div>

            {/* 导出按钮 */}
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              onClick={() => handleExport('default')}
            >
              <Download size={12} />
              导出当前页面
            </button>

            {/* 批量导出 */}
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
              onClick={() => console.log('批量导出')}
            >
              <Settings size={12} />
              批量导出所有页面
            </button>
          </div>
        </CollapsibleSection>
      </div>

      {/* 底部操作区 */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
            onClick={() => console.log('添加新属性')}
          >
            <Plus size={12} />
            添加属性
          </button>

          {/* 帮助按钮 */}
          <HelpMenu onShortcutHelp={onShowShortcutHelp} />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
