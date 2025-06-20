# ZHGU Editor - React应用层

基于 React + TypeScript + Vite 构建的现代化图形设计编辑器应用，集成了@zhgu/editor核心编辑器。

## 🏗️ 整体架构

### 应用结构
```
App (根组件)
├── TopBar (顶部菜单栏)
├── MainContent
│   ├── Toolbar (左侧垂直工具栏)
│   ├── LeftPanel (左侧面板)
│   │   ├── PageList (页面列表)
│   │   └── LayerTree (图层树 - 递归结构)
│   ├── Canvas (中央画布区域)
│   └── RightPanel (右侧属性面板)
│       └── ConfigurableRightPanel (可配置属性面板)
│           ├── BaseAttributePanel (位置和尺寸)
│           ├── AppearancePanel (外观属性)
│           ├── TextPanel (文本属性)
│           ├── EffectsPanel (效果属性)
│           ├── PageColorPanel (页面颜色)
│           └── ExportPanel (导出设置)
├── StatusBar (底部状态栏)
└── ShortcutHelp (快捷键帮助)
```

### 状态管理架构
- **Zustand Store**: 统一的全局状态管理
- **Editor实例**: 核心编辑器实例，管理所有业务逻辑
- **UI状态**: 工具选择、画布状态、调试模式等
- **数据代理**: 通过getter方法获取editor真实数据

## 🔄 Editor初始化流程

### 两阶段初始化设计

由于@zhgu/editor需要DOM容器才能完成初始化，采用了两阶段初始化策略：

#### Phase 1: 创建Editor实例 (App.tsx)
```typescript
// 应用启动时立即执行
useEffect(() => {
  createEditor();
}, [createEditor]);

// Store中的实现
createEditor: async () => {
  set({ initState: EditorInitState.CREATING });
  const editor = new Editor();
  set({ 
    editor, 
    initState: EditorInitState.WAITING_CANVAS 
  });
}
```

#### Phase 2: 绑定DOM容器 (Canvas.tsx)
```typescript
// Canvas挂载后触发第二阶段
useEffect(() => {
  if (initState === EditorInitState.WAITING_CANVAS && canvasContainerRef.current) {
    bindCanvas('app'); // 传入canvas容器ID
  }
}, [initState, bindCanvas]);

// Store中的实现
bindCanvas: async (canvasId?: string) => {
  await editor.init(canvasId); // 绑定DOM容器
  editor.loadFile(file); // 加载初始数据
  editor.initEditorMode(); // 初始化编辑模式
  set({ initState: EditorInitState.READY });
}
```

### 初始化状态流转
```
IDLE → CREATING → WAITING_CANVAS → READY
                ↓
              ERROR (出错时)
```

## 📊 数据更新流程

### 数据获取机制

#### 1. 真实数据获取
所有UI组件通过Store的getter方法获取editor真实数据：

```typescript
// 页面数据
getPages: () => editor.pages || []

// 当前页面
getCurrentPage: () => editor.scene.currentPage || null

// 选中节点
getSelectedNodes: () => editor.eventManager?.selectedNodes || []

// 悬停节点
getHoveredNode: () => editor.eventManager?.hoverNode || null
```

#### 2. 事件监听机制
组件通过监听editor事件来响应数据变化：

```typescript
// 监听选中状态变化
eventManager.on(ESelectEventType.SelectChange, handleSelectionChange);

// 监听撤销重做
eventManager.on(EHistoryEvent.UndoRedo, handleUndoRedoChange);

// 监听节点变化
eventManager.on(ENodeChangeType.NodeChange, handleNodeChange);
```

### 数据流向

#### 单向数据流
```
Editor实例 → Store getter方法 → UI组件 → 用户操作 → Editor API → 数据更新
```

#### 具体流程示例
1. **用户选择节点**: Canvas → Editor.eventManager → 触发SelectChange事件
2. **UI响应更新**: LeftPanel/RightPanel 监听事件 → 重新获取数据 → 更新显示
3. **属性修改**: RightPanel → Editor API → 触发NodeChange事件 → UI更新

## 🎯 已完成的核心功能

### ✅ Editor集成
- **完整初始化流程**: 两阶段初始化，解决DOM依赖问题
- **真实数据驱动**: 完全移除模拟数据，基于editor真实API
- **错误处理**: 完善的错误边界和加载状态
- **调试支持**: 全局editor实例暴露，方便调试

### ✅ 左侧面板 (LeftPanel)
- **页面管理**: 页面列表、添加/删除页面、页面切换
- **图层树**: 递归渲染复杂嵌套结构，支持无限层级
- **图层操作**: 重命名、显示/隐藏、锁定/解锁、删除
- **选择同步**: 与Canvas选择状态实时同步
- **悬停高亮**: 鼠标悬停时高亮对应图层

### ✅ 右侧面板 (ConfigurableRightPanel)
- **元数据驱动**: 根据选中节点类型动态显示面板
- **可配置系统**: 基于moduleConfig和metaDataConfig控制面板显示
- **面板组件**:
  - BaseAttributePanel: 位置和尺寸属性
  - AppearancePanel: 填充和描边颜色
  - TextPanel: 文本属性编辑
  - EffectsPanel: 阴影和模糊效果
  - PageColorPanel: 页面背景颜色
  - ExportPanel: 导出设置

### ✅ 中央画布 (Canvas)
- **Editor渲染**: 完全由editor控制画布渲染
- **事件处理**: 鼠标事件、键盘事件、画布交互
- **调试面板**: 显示鼠标坐标、画布状态等信息

### ✅ 状态管理 (Store)
- **Zustand集成**: 高性能状态管理
- **Editor代理**: 所有editor操作通过store代理
- **数据同步**: 实时同步editor状态到UI
- **工具管理**: 当前工具状态、画布缩放等

### ✅ 开发工具
- **调试模式**: L键切换，显示详细调试信息
- **快捷键系统**: 完整的快捷键支持
- **错误边界**: 完善的错误处理和用户提示
- **性能监控**: 状态变化追踪和性能分析

## 🎨 可配置属性面板系统

### 元数据驱动架构
```typescript
// 模块级配置 - 控制功能模块显示
interface IModuleMetaData {
  baseAttribute: number; // 位置和尺寸
  appearance: number;    // 外观属性
  text: number;          // 文本属性
  shadow: number;        // 阴影效果
  blur: number;          // 模糊效果
  export: number;        // 导出功能
}

// 属性级配置 - 控制具体属性
interface IMetaData {
  baseAttribute: { x: number, y: number, width: number, height: number };
  appearance: { fill: number, stroke: number };
  // ... 更多属性配置
}
```

### 动态面板组合
- **智能显示**: 根据选中节点类型自动显示相关面板
- **条件渲染**: 文本节点显示文本面板，图形节点显示外观面板
- **权限控制**: 通过配置控制功能的启用/禁用状态

## 🚀 技术特性

### 性能优化
- **Zustand状态管理**: 避免Context性能问题
- **虚拟化渲染**: 大量图层时使用虚拟滚动
- **事件优化**: 精确的事件监听和清理
- **组件懒加载**: 按需加载面板组件

### 类型安全
- **完整TypeScript**: 严格的类型检查
- **接口定义**: 完整的IBaseNode等类型定义
- **类型断言**: 安全的类型转换和兼容性处理

### 用户体验
- **加载状态**: 完善的加载和错误状态
- **快捷键**: 完整的快捷键支持
- **调试工具**: 开发者友好的调试面板
- **错误处理**: 用户友好的错误提示

## 🔧 开发指南

### 启动开发
```bash
pnpm dev              # 启动开发服务器
```

### 构建部署
```bash
pnpm build            # 构建生产版本
pnpm preview          # 预览生产版本
```

### 调试技巧
- **L键**: 切换调试模式
- **?键**: 显示快捷键帮助
- **Console**: 全局editor实例 (window.editor)
- **Store**: 使用Redux DevTools查看状态变化

## 📝 核心Hooks

### useEditorStore
编辑器状态管理hook，提供editor实例和所有操作方法。

### useColorTransaction
颜色修改事务hook，支持start-change-finish三阶段操作。

---

> 📖 更多详细信息请参考[项目根目录README](../../README.md)和[@zhgu/editor文档](../../packages/editor/src/README.md)。
