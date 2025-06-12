# ZHGU Editor - React应用层

基于 React + TypeScript + Vite 构建的现代化图形设计编辑器应用，集成了@zhgu/editor核心编辑器。

## 🎉 核心架构

### 两阶段初始化系统
实现了从模拟数据到真实@zhgu/editor集成的完整数据驱动架构：

#### 1. **TypeScript配置优化**
- ✅ 简化TS配置：从3个配置文件合并为1个，继承monorepo根配置
- ✅ 修复装饰器编译问题：从SWC切换到标准React插件支持@autobind

#### 2. **两阶段初始化架构**
- ✅ **Phase 1**: App启动时创建Editor实例（无DOM依赖）
- ✅ **Phase 2**: Canvas挂载后绑定DOM容器完成初始化
- ✅ 完整的状态管理：IDLE → CREATING → WAITING_CANVAS → READY → ERROR
- ✅ 错误处理和加载状态完善

#### 3. **真实Editor API集成**
- ✅ **完全移除模拟数据**：删除所有Mock Page/Layer接口
- ✅ **真实数据获取**：
  - `getPages()` - 获取editor.pages真实页面数据
  - `getCurrentPage()` - 获取editor.scene.currentPage
  - `getSelectedNodes()` - 获取editor选中节点
- ✅ **Editor操作代理**：selectNodes(), clearSelection(), undo/redo等

#### 4. **组件架构重构**
- ✅ **LeftPanel重构**：支持递归图层树，基于IBaseNode真实数据
- ✅ **Canvas简化**：移除模拟渲染，editor完全控制画布
- ✅ **Store优化**：Zustand性能优势，统一状态管理
- ✅ **类型安全**：正确导入IBaseNode，类型断言处理兼容性

#### 5. **开发者体验提升**
- ✅ **DebugPanel组件**：统一调试面板，显示鼠标坐标、画布状态、选择信息等
- ✅ **快捷键支持**：L键切换调试模式，完整快捷键系统
- ✅ **错误边界**：完善的错误处理和用户提示

### 当前架构优势
- 🚀 **真实数据驱动**：UI完全基于editor的真实数据，无模拟逻辑
- ⚡ **高性能**：Zustand状态管理，避免Context性能问题
- 🔧 **完整初始化**：两阶段设计解决DOM依赖，确保editor正确绑定
- 🌳 **递归图层**：支持复杂嵌套结构，真实反映设计文档层级
- 🛡️ **类型安全**：TypeScript严格检查，运行时错误处理完善

## UI 需求详细描述

### 1. 整体布局
- **三栏式布局**：左侧层级面板 + 中央画布区域 + 右侧属性面板
- **顶部工具栏**：包含各种设计工具和操作选项
- **色彩方案**：主要采用蓝白配色，现代化扁平设计风格

### 2. 左侧层级面板
- **页面管理区域**：页面列表，支持页面切换和添加/删除功能
- **图层树结构**：层级结构显示、图层重命名、可见性开关、锁定功能、拖拽排序

### 3. 顶部工具栏
- **设计工具集**：选择工具、移动工具、矩形工具、文本工具等
- **视图控制**：缩放比例显示
- **协作功能**：分享按钮、用户头像等

### 4. 中央画布区域
- **无限画布**：支持拖拽平移和缩放操作
- **图形元素渲染**：支持各种几何图形的显示和编辑
- **选择框和控制点**：选中元素时显示变换控制点

### 5. 右侧属性面板
- **动态属性面板**：根据选中元素类型显示不同属性
- **可配置系统**：基于metaData的动态面板组合

## 🏗️ 技术架构详解

### Editor初始化流程

#### 两阶段初始化设计原理
由于@zhgu/editor需要DOM容器才能完成初始化，设计了两阶段初始化：

```typescript
// Phase 1: 创建Editor实例
store.createEditor = async () => {
  const editor = new Editor();
  set({ editor, initState: EditorInitState.WAITING_CANVAS });
};

// Phase 2: 绑定DOM容器
store.bindCanvas = async (canvasId: string) => {
  await editor.init(canvasId);
  set({ initState: EditorInitState.READY });
};
```

### Zustand数据流动机制

```typescript
interface EditorStore {
  // 核心状态
  editor: Editor | null;
  initState: EditorInitState;
  
  // UI状态  
  currentTool: EEditorStateName;
  canvasZoom: number;
  debugMode: boolean;
  
  // 数据获取方法
  getPages: () => IBaseNode[];
  getCurrentPage: () => IBaseNode | null;
  getSelectedNodes: () => IBaseNode[];
  
  // 操作方法
  selectNodes: (nodes: IBaseNode[]) => void;
  undoHistory: () => void;
  redoHistory: () => void;
}
```

### 组件层次结构

```
App
├── Toolbar (顶部工具栏)
├── MainContent
│   ├── LeftPanel (左侧面板)
│   │   ├── PageList (页面列表)
│   │   └── LayerTree (图层树)
│   ├── Canvas (中央画布)
│   └── RightPanel (右侧面板)
│       ├── ConfigurableRightPanel
│       │   ├── BaseAttributePanel
│       │   ├── AppearancePanel
│       │   ├── TextPanel
│       │   └── EffectsPanel
│       └── DebugPanel
└── ErrorBoundary
```

## 🎨 可配置右侧面板系统

### 元数据驱动配置
- **模块级配置**：控制整个功能模块的显示/隐藏
- **属性级配置**：控制具体属性的显示/启用状态
- **动态组合**：根据选中节点类型动态显示相应面板

### 颜色选择器架构
- **ColorButton**：通用UI组件，内置状态管理
- **ColorPickerPortal**：纯颜色选择器组件
- **useColorTransaction**：颜色修改事务管理
- **三事件流程**：start → change → finish

## 🔧 开发工具

### 调试面板
- **快捷键**: `L` 键切换调试模式
- **显示信息**：鼠标坐标、画布状态、选中节点信息、编辑器状态

### 性能监控
- Zustand状态变化追踪
- 组件渲染次数统计
- Editor操作性能分析

## 🚀 构建与部署

### 开发环境
```bash
pnpm dev              # 启动开发服务器
```

### 生产构建
```bash
pnpm build            # 构建生产版本
pnpm preview          # 预览生产版本
```

## 📝 核心Hooks

### useEditorStore
编辑器状态管理hook，提供editor实例和所有操作方法。

### useColorTransaction
颜色修改事务hook，支持start-change-finish三阶段操作：
```typescript
const colorTransaction = useColorTransaction({ type: 'fill' });

// 开始修改
colorTransaction.startColorTransaction();
// 应用修改
colorTransaction.applyColorChange(color);
// 提交修改
colorTransaction.commitColorTransaction();
```

## 🎯 设计原则

1. **数据驱动**：基于editor实例的真实数据
2. **组件化**：高内聚、低耦合的模块设计
3. **可配置性**：元数据驱动的动态界面
4. **类型安全**：完整的TypeScript类型定义
5. **性能优化**：Zustand状态管理，避免不必要渲染

---

> 📖 更多详细信息请参考[项目根目录README](../../README.md)和[@zhgu/editor文档](../../packages/editor/src/README.md)。
