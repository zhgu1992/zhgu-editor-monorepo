# ZHGU Monorepo - 图形设计编辑器

基于 Vite + React + TypeScript 构建的现代化图形设计编辑器 Monorepo，类似 Figma 的界面和交互体验。

### 🚀 已完成功能
- ✅ 核心编辑器架构(@zhgu/ui基础组件库、@zhgu/editor编辑层、@zhgu/data数据层、@zhgu/render渲染层)
- ✅ React应用集成(app/editor编辑器主页)

### 分层架构设计
```
┌─────────────────────┐
│   React应用层        │  zhgu-editor (用户界面、交互逻辑)
├─────────────────────┤
│   编辑器核心层       │  @zhgu/editor (状态管理、事件处理)
├─────────────────────┤
│   数据处理层        │  @zhgu/data (数据模型、变更管理)
├─────────────────────┤
│   渲染引擎层        │  @zhgu/render (Canvas/WebGL渲染)
├─────────────────────┤
│   类型定义层        │  @zhgu/type (TypeScript类型)
└─────────────────────┘
```

## 🏗️ 项目架构

```
zhgu-monorepo/
├── packages/                    # 核心包
│   ├── data/                   # 数据处理包
│   │   ├── src/
│   │   │   ├── change/         # 数据变更管理
│   │   │   ├── dataUtil/       # 数据工具函数
│   │   │   ├── interface/      # 数据接口定义
│   │   │   ├── nodes/          # 节点数据模型
│   │   │   └── utils/          # 工具函数(颜色、矩阵、几何等)
│   │   └── package.json
│   ├── editor/                 # 编辑器核心包
│   │   ├── src/
│   │   │   ├── editor/         # 编辑器核心逻辑
│   │   │   ├── event/          # 事件系统
│   │   │   ├── mode/           # 编辑模式管理
│   │   │   ├── node/           # 节点管理
│   │   │   ├── picker/         # 元素选择器
│   │   │   ├── render/         # 渲染管理器
│   │   │   ├── utils/          # 工具函数
│   │   │   ├── view/           # 视图管理
│   │   │   └── viewport/       # 视口管理
│   │   ├── example/            # 使用示例
│   │   └── README.md           # 编辑器文档
│   ├── render/                 # 渲染引擎包
│   │   ├── src/
│   │   │   └── WebGLRender.ts  # WebGL渲染器
│   │   └── example/            # 渲染示例
│   ├── type/                   # 类型定义包
│   │   └── src/
│   │       ├── editor/         # 编辑器类型
│   │       ├── element/        # 元素类型
│   │       ├── elementChange/  # 变更类型
│   │       └── global/         # 全局类型
│   ├── ui/                     # UI组件包
│   │   ├── src/
│   │   │   └── components/     # 通用UI组件
│   │   │       ├── ColorButton/    # 颜色按钮
│   │   │       └── DraggableNumberInput/  # 可拖拽数字输入
│   │   └── example/            # UI组件示例
│   └── utils/                  # 工具包
│       └── src/
│           ├── index.ts        # 工具函数导出
│           └── log.ts          # 日志工具
├── app/                        # 应用层
│   └── zhgu-editor/            # React编辑器应用
│       ├── src/
│       │   ├── components/     # React组件
│       │   │   ├── panels/     # 右侧面板组件
│       │   │   ├── Canvas.tsx  # 画布组件
│       │   │   ├── LeftPanel.tsx   # 左侧面板
│       │   │   ├── RightPanel.tsx  # 右侧面板
│       │   │   ├── Toolbar.tsx     # 工具栏
│       │   │   └── TopBar.tsx      # 顶部栏
│       │   ├── hooks/          # 自定义Hooks
│       │   ├── store/          # 状态管理
│       │   └── mock/           # 模拟数据
│       ├── package.json
│       └── README.md           # 应用文档
├── eslint.config.mjs           # ESLint配置
├── package.json                # 根包配置
├── pnpm-workspace.yaml         # pnpm工作区配置
└── README.md                   # 项目总文档
```

### 📦 包功能说明

#### 核心包 (packages/)
- **@zhgu/data**: 数据处理核心，包含数据模型、变更管理、工具函数
- **@zhgu/editor**: 编辑器核心引擎，包含模式管理、事件系统、渲染管理
- **@zhgu/render**: 渲染引擎，提供WebGL渲染能力
- **@zhgu/type**: 类型定义包，为整个项目提供TypeScript类型支持
- **@zhgu/ui**: 通用UI组件库，提供可复用的界面组件
- **@zhgu/utils**: 工具函数包，提供日志、通用工具等

#### 应用层 (app/)
- **zhgu-editor**: 基于React的完整编辑器应用，集成所有核心包

## 📚 文档导航

### 核心文档
- [📖 编辑器核心架构](./packages/editor/README.md) - @zhgu/editor包详细文档
- [🎨 React应用架构](./app/zhgu-editor/README.md) - 完整的应用开发文档
- [🧩 UI组件系统](./packages/ui/README.md) - UI组件库
- [⚙️ 可配置面板](./app/zhgu-editor/src/components/panels/README.md) - 右侧面板系统

### 快速开始
1. **安装依赖**: `pnpm install`
2. **启动开发**: `pnpm dev`
3. **构建项目**: `pnpm build`

## 🎯 核心特性

### 编辑器核心(@zhgu/editor)
- 🏗️ **模块化架构**: Mode/State/Behavior分离设计
- 🎨 **丰富的图形元素**: 矩形、圆形、文本、路径等
- 🔄 **状态管理**: 完整的撤销/重做系统
- 🎯 **事件系统**: 统一的交互事件处理
- 🖱️ **多种编辑模式**: 选择、创建、变换等

### React应用层(zhgu-editor)
- ⚡ **两阶段初始化**: 解决DOM依赖问题
- 🗂️ **真实数据驱动**: 基于editor实例的动态数据
- 🎛️ **可配置界面**: 元数据驱动的面板系统
- 🔧 **完整工具栏**: 设计工具集成
- 🐛 **调试支持**: 内置调试面板和快捷键


## 🔄 开发工作流

### 编辑器核心开发
```bash
cd packages/editor
pnpm dev              # 启动example开发环境
pnpm build            # 构建editor包
pnpm test             # 运行测试
```

### React应用开发
```bash
cd app/zhgu-editor
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 预览生产版本
```

### Monorepo管理
```bash
pnpm install          # 安装所有依赖
pnpm dev              # 启动所有开发环境
pnpm build:all        # 构建所有包
pnpm clean            # 清理构建产物
```

## 🏛️ 架构设计理念

### 分层架构
```
┌─────────────────────┐
│   React应用层        │  用户界面、交互逻辑
├─────────────────────┤
│   编辑器抽象层       │  状态管理、事件处理
├─────────────────────┤
│   渲染引擎层        │  Canvas渲染、几何计算
├─────────────────────┤
│   数据模型层        │  节点树、属性管理
└─────────────────────┘
```