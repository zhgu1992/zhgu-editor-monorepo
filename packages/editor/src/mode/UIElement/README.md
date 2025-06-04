# UIElement

本目录包含编辑器的界面元素，负责提供视觉反馈和交互热区。
这些元素基于基础的 CustomNode 系统构建，但专注于编辑体验而非内容渲染。

## 目录结构

```
UIElement/
├── drag/           # 拖拽相关UI元素
├── selection/      # 选择相关UI元素
├── resizing/       # 调整大小UI元素
├── creation/       # 创建元素UI
└── common/         # 共享UI组件
```

## 与 node/customNode 的区别

- **node/customNode**: 提供基础自定义节点能力，偏底层实现
- **mode/UIElement**: 特定于编辑体验的界面元素，如控制点、选择框等

## 使用方式

UIElement 通常在 State 中注册并使用，用于提供特定状态下的交互界面。
例如，选择状态会注册选择框和控制点等UI元素。
