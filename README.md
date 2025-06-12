# ZHGU Monorepo - 图形设计编辑器

基于 Vite + React + TypeScript 构建的现代化图形设计编辑器 Monorepo，类似 Figma 的界面和交互体验。

## 📋 项目状态与TODO
右侧面板完全配置化
多选后右侧面板的显示
UI组件库搭建

### 🚀 已完成功能
- ✅ 核心编辑器架构(@zhgu/editor)
- ✅ React应用集成(zhgu-editor)
- ✅ 两阶段初始化系统
- ✅ 真实数据驱动的图层管理
- ✅ 可配置右侧面板系统
- ✅ 颜色选择器与事务系统
- ✅ TypeScript配置优化
- ✅ 调试模式与开发工具

### 🎯 当前优先级TODO
- [ ] **右侧面板完全配置化**
  - [ ] 所有面板组件支持metaData配置
  - [ ] 动态显示/隐藏逻辑完善
  - [ ] 面板配置测试用例
- [ ] **多选后右侧面板的显示**
  - [ ] 多选状态检测
  - [ ] 公共属性提取
  - [ ] 批量编辑支持
- [ ] **Lint & TypeScript & Prettier配置**
  - [ ] ESLint规则配置
  - [ ] TypeScript严格模式
  - [ ] Prettier代码格式化
- [ ] **Example工程重建**
  - [ ] 独立的示例项目
  - [ ] 完整的使用文档
  - [ ] API演示代码
- [ ] **Build系统优化**
  - [ ] Monorepo构建流程
  - [ ] 包依赖管理
  - [ ] 生产环境优化

### 🔮 未来规划
- [ ] 协作功能(实时编辑)
- [ ] 插件系统
- [ ] 组件库发布
- [ ] 性能优化
- [ ] 移动端适配

## 🏗️ 项目架构

```
zhgu-monorepo/
├── packages/                    # 核心包
│   ├── editor/                  # 编辑器核心包
│   │   ├── src/                # 核心源码
│   │   ├── example/            # 使用示例
│   │   └── README.md           # 编辑器文档
│   └── data/                   # 数据处理包
├── app/                        # 应用层
│   └── zhgu-editor/            # React编辑器应用
│       ├── src/                # 应用源码
│       │   ├── components/     # React组件
│       │   ├── hooks/          # 自定义Hooks
│       │   ├── store/          # 状态管理
│       │   └── mock/           # 模拟数据
│       └── README.md           # 应用文档
└── README.md                   # 项目总文档
```

## 📚 文档导航

### 核心文档
- [📖 编辑器核心架构](./packages/editor/src/README.md) - @zhgu/editor包详细文档
- [🎨 React应用架构](./app/zhgu-editor/README.md) - 完整的应用开发文档
- [🧩 UI组件系统](./packages/editor/src/mode/UIElement/README.md) - 编辑器UI元素
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

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Zustand** - 轻量级状态管理
- **Tailwind CSS** - 原子化CSS

### 编辑器技术
- **Canvas API** - 图形渲染
- **自定义事件系统** - 交互处理
- **数据结构设计** - 节点树管理
- **变换矩阵** - 几何计算

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

### 核心设计原则
1. **关注点分离**: UI逻辑与编辑器逻辑分离
2. **数据驱动**: 基于真实数据的响应式更新
3. **组件化**: 高内聚、低耦合的模块设计
4. **可扩展性**: 插件化的功能扩展机制
5. **类型安全**: 完整的TypeScript类型定义

## 🤝 开发贡献

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier规范
- 编写完整的组件和函数注释
- 提交前运行测试用例

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式(不影响代码运行)
refactor: 重构
test: 测试用例
chore: 构建过程或辅助工具的变动
```

## 📞 联系方式

- 项目维护者: ZHGU Team
- 技术栈: React + TypeScript + Canvas API

---

> 💡 **提示**: 查看各子目录的README文件获取更详细的技术文档和使用指南。