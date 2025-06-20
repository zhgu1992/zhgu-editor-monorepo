# @editor 项目架构说明

## 项目概述

`@editor` 是一个基于 Web 技术开发的图形编辑器框架，提供了丰富的编辑、渲染和交互功能。整个项目采用模块化设计，通过组合不同的功能模块实现复杂的编辑功能。

## 核心目录结构

```
src/
├── assets/         # 静态资源文件
├── const/          # 常量定义
├── editor/         # 编辑器核心类
├── event/          # 事件系统
├── interface/      # 接口定义
├── mode/           # 编辑模式和状态
│   ├── behavior/   # 行为实现
│   ├── UIElement/  # 编辑器UI元素
│   └── state/      # 状态实现
├── node/           # 节点系统
│   ├── dataNode/   # 数据节点
│   └── customNode/ # 自定义节点实现
├── render/         # 渲染系统
├── utils/          # 工具函数
├── view/           # 视图层
└── viewport/       # 视口管理
```

## 核心概念

### Editor

`Editor` 是整个编辑器的核心类，继承自 `View`，负责初始化和管理编辑器的各种模式、状态和功能。

### Mode & State

- **Mode**: 编辑器的工作模式，如编辑模式、预览模式等
- **State**: 在特定模式下的工作状态，如默认状态、创建元素状态等

### Behavior

`Behavior` 定义了特定状态下的交互行为，如拖拽、调整大小、创建元素等操作。每个行为都是一个继承自 `BehaviorNode` 的类。

### CustomNode

`CustomNode` 是用于渲染特定 UI 元素的节点，如选择框、控制点等。这些节点不属于实际内容，但在编辑过程中提供视觉反馈和交互点。

### CollectionUIManager

`CollectionUIManager` 负责管理和协调一组 `CustomNode`，通常用于处理选择、调整大小等操作的可视化表示。

## State 开发流程

开发一个新的 State 功能通常遵循以下步骤：

### 1. 开发 CustomNode

首先创建特定功能所需的自定义节点。这些节点将提供视觉表示和交互热区。

```typescript
// 示例：创建一个新的自定义节点
import { CustomNode } from '../../node/customNode/CustomNode';

export class MyCustomNode extends CustomNode {
  constructor(id: string, collectionUIManager, view, options = {}) {
    super(id, view, options);
    // 初始化代码
  }

  // 实现自定义方法和属性
}
```

### 2. 开发 Behavior

创建行为类来处理与自定义节点的交互逻辑。

```typescript
// 示例：创建一个新的行为
import { BehaviorNode } from '../behavior/baseBehavior';

export class MyBehavior extends BehaviorNode {
  constructor(view, collectionUIManager) {
    super(view, 'my-behavior', collectionUIManager);
  }

  onEnter() {
    super.onEnter();
    // 注册事件监听器
    this.view.eventManager.on('mousemove', this.handleMouseMove);
  }

  onExit() {
    super.onExit();
    // 移除事件监听器
    this.view.eventManager.off('mousemove', this.handleMouseMove);
  }

  handleMouseMove = e => {
    // 处理鼠标移动逻辑
  };
}
```

### 3. 开发 State

最后，创建一个 State 类，将 CustomNode 和 Behavior 关联起来。

```typescript
// 示例：创建一个新的状态
import { ActiveStateNode } from '../state/baseState';
import { MyBehavior } from '../behavior/myBehavior';
import { MyCustomNode } from '../customNode/myCustomNode';

export class MyState extends ActiveStateNode {
  constructor(view) {
    super(view, 'my-state');
  }

  initBehaviors() {
    // 注册行为
    const myBehavior = new MyBehavior(this.view, this.collectionUIManager);
    this.registerBehavior(myBehavior);
  }

  registerCustomNode() {
    super.registerCustomNode();

    // 注册自定义节点
    const myCustomNode = new MyCustomNode('my-custom-node', this.collectionUIManager, this.view);

    this.collectionUIManager.addCustomNode(myCustomNode);
  }
}
```

### 4. 注册并使用新 State

最后，在 StateFactory 中注册新状态，并在适当的时候激活它。

```typescript
// 在 StateFactory 中注册
StateFactory.register(EEditorStateName.MyState, (view, mode) => {
  return new MyState(view);
});

// 在需要时激活状态
editor.changeEditorState(EEditorStateName.MyState);
```

## 开发注意事项

1. **事件处理**: 确保在 Behavior 的 `onExit` 方法中移除所有添加的事件监听器，避免内存泄漏。

2. **热区设计**: 自定义节点的热区应考虑用户体验，提供足够大的交互区域。

3. **状态切换**: 状态之间的切换应当平滑，注意保存和恢复必要的上下文信息。

4**组件复用**: 尽可能复用现有组件，保持代码一致性和可维护性。

## 最佳实践

- 遵循项目的命名规范和代码风格
- 为复杂的功能添加详细注释
- 合理拆分功能模块，避免单个文件过大
- 使用 TypeScript 接口确保类型安全
- 在进行大规模修改前先编写测试用例

## 使用示例指南

以下是一个完整的示例，展示如何初始化编辑器、加载数据、处理交互和调试热区：

```typescript
import { Editor } from '@zhgu/editor';
import { createHelloWorldFileData } from './mockFunc';
import { GUI } from 'dat.gui'; // 可选，用于调试UI

// 1. 创建编辑器实例
const editor = new Editor();

// 2. 初始化编辑器
await editor.init();

// 3. 加载文件数据
const file = createHelloWorldFileData();
editor.loadFile(file);

// 4. 渲染内容
editor.render();

// 5. 初始化编辑模式（包括状态、行为等）
editor.initEditorMode();

// 可选：将编辑器实例暴露到全局，方便调试
window.editor = editor;

// 可选：创建调试面板
const gui = new GUI();
const data = {
  FillColor: [255, 255, 255],
  StrokeWeight: 0,
  StrokePaints: [255, 0, 0],
  debugArea: false,
  undo: () => {
    editor.undoHistory();
  },
  redo: () => {
    editor.redoHistory();
  },
};

// 监听颜色变化并应用到节点
let _begin = true;
gui
  .addColor(data, 'FillColor')
  .onChange(value => {
    if (_begin) {
      _begin = false;
      editor.startCompressTransaction();
    }
    const node = editor.scene.node('5');
    const diff = node.changeFillPaintColor({
      r: value[0], // 红色通道
      g: value[1], // 绿色通道
      b: value[2], // 蓝色通道
      a: 1, // 透明度通道
    });
    editor.applyTransaction([diff]);
  })
  .onFinishChange(() => {
    editor.commitHistory();
    _begin = true;
  });

// 添加撤销和重做按钮
gui.add(data, 'undo');
gui.add(data, 'redo');

// 添加热区调试开关
gui.add(data, 'debugArea').onChange(v => {
  // 开启热区调试模式，可视化交互区域
  editor.getCurrentState()?.showArea(v);
});
```

### 关键步骤说明

1. **初始化**：`editor.init()` 初始化编辑器，必须在使用其他功能前调用。

2. **加载数据**：`editor.loadFile(file)` 加载编辑器内容数据。

3. **渲染**：`editor.render()` 触发内容渲染。

4. **状态管理**：`editor.initEditorMode()` 初始化编辑模式和状态。

5. **交互处理**：

   - 使用 `editor.applyTransaction([diff])` 应用节点变更
   - 调用 `editor.startCompressTransaction()` 和 `editor.commitHistory()` 包裹多个操作，保证撤销/重做的原子性

6. **热区调试**：通过 `editor.getCurrentState()?.showArea(v)` 可以可视化交互热区，这对于开发和调试非常有用。

7. **历史记录**：使用 `editor.undoHistory()` 和 `editor.redoHistory()` 实现撤销和重做功能。

开发过程中，合理利用这些API可以快速构建和调试您的自定义编辑功能。
