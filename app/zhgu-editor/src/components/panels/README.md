# 可配置右侧面板组件

本目录包含了可配置的右侧面板组件系统，允许根据 metaData.ts 配置动态显示不同的编辑功能面板。

## 组件架构

### 核心组件

- **ConfigurableRightPanel**: 主面板组件，根据配置动态组合子面板
- **CollapsibleSection**: 可折叠区域容器，包装各个功能面板

### 功能面板组件

- **BaseAttributePanel**: 基础属性面板（位置、尺寸、旋转、透明度、圆角等）
- **AppearancePanel**: 外观面板（填充、描边）
- **TextPanel**: 文本属性面板（字体、字号、样式、对齐）
- **EffectsPanel**: 效果面板（阴影、模糊、混合模式）
- **PageColorPanel**: 页面颜色面板（背景色、颜色预设）
- **ExportPanel**: 导出面板（格式选择、分辨率设置）

## 配置系统

### 模块级配置 (IModuleMetaData)

控制整个功能模块的显示/隐藏：

```typescript
interface IModuleMetaData {
  baseAttribute: number;  // 1=显示, 0=隐藏
  appearance: number;     // 外观
  text: number;          // 文本属性
  fill: number;          // 填充
  stroke: number;        // 描边
  shadow: number;        // 阴影
  blur: number;          // 模糊
  export: number;        // 导出
  // ... 其他配置
}
```

### 属性级配置 (IMetaData)

控制具体属性的显示/启用状态：

```typescript
interface IMetaDataConfig {
  enabled?: boolean;     // 是否启用编辑
  isVisible: boolean;    // 是否显示
}

interface IMetaData {
  x: IMetaDataConfig;
  y: IMetaDataConfig;
  w: IMetaDataConfig;
  h: IMetaDataConfig;
  rotation: IMetaDataConfig;
  // ... 其他属性
}
```

## 使用示例

### 基本使用（自动配置）

```typescript
import ConfigurableRightPanel from './ConfigurableRightPanel';

// 默认用法：根据选中节点自动配置
<ConfigurableRightPanel
  onShowShortcutHelp={handleShortcutHelp}
  // 无需传递配置，组件会自动：
  // 1. 无选择时：只显示页面颜色（EMPTY_SELECTION_META_DATA）
  // 2. 有选择时：调用 node.getMetaData() 获取配置
  // 3. 获取失败时：使用 DEFAULT_MODULE_META_DATA 作为 fallback
/>
```

### 强制覆盖配置

```typescript
// 如果需要强制使用特定配置（忽略节点自带配置）
const GRAPHIC_EDIT_CONFIG = {
  ...DEFAULT_MODULE_META_DATA,
  baseAttribute: 1,      // 显示基础属性
  appearance: 1,         // 显示外观
  fill: 1,              // 显示填充
  stroke: 1,            // 显示描边
  text: 0,              // 隐藏文本属性
  export: 0,            // 隐藏导出
};

<ConfigurableRightPanel
  onShowShortcutHelp={handleShortcutHelp}
  overrideModuleConfig={GRAPHIC_EDIT_CONFIG}  // 强制覆盖
/>
```

### 节点元数据格式

```typescript
// 节点的 getMetaData() 方法应该返回以下格式：
interface NodeMetaData {
  moduleConfig?: Partial<IModuleMetaData>;
  metaDataConfig?: Partial<IMetaData>;
}

// 示例：文本节点的元数据
const textNodeMetaData = {
  moduleConfig: {
    baseAttribute: 1,      // 显示基础属性
    text: 1,              // 显示文本属性
    fill: 1,              // 显示填充（文本颜色）
    stroke: 0,            // 隐藏描边
    shadow: 0,            // 隐藏阴影
    export: 0,            // 隐藏导出
  },
  metaDataConfig: {
    rotation: { enabled: false, isVisible: false }, // 禁用旋转
  }
};
```

### 配置优先级

```typescript
// 配置的优先级（从高到低）：
// 1. overrideModuleConfig (强制覆盖)
// 2. node.getMetaData().moduleConfig (节点自带配置)
// 3. 无选择时使用 EMPTY_SELECTION_META_DATA
// 4. 有选择但获取失败时使用 DEFAULT_MODULE_META_DATA

<ConfigurableRightPanel
  onShowShortcutHelp={handleShortcutHelp}
  overrideModuleConfig={FORCE_CONFIG}      // 最高优先级
  overrideMetaDataConfig={FORCE_META}      // 最高优先级
/>
```

## 扩展指南

### 添加新的功能面板

1. 在 `panels/` 目录下创建新组件
2. 在 `ConfigurableRightPanel` 中导入并添加配置逻辑
3. 在 `metaData.ts` 中添加相应的配置项
4. 更新 `index.ts` 导出

### 自定义面板样式

所有面板组件都使用 Tailwind CSS，可以通过修改 className 来自定义样式。

### 添加事件处理

各个面板组件通过 props 接收事件处理函数，可以在父组件中统一处理业务逻辑。

## 设计原则

1. **组件化**: 每个功能模块独立为一个组件
2. **配置驱动**: 通过配置文件控制显示逻辑
3. **可复用**: 组件可以在不同场景下组合使用
4. **类型安全**: 使用 TypeScript 确保配置的类型安全
5. **扩展性**: 容易添加新的功能面板和配置项 