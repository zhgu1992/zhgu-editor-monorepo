# @zhgu/ui 组件库

这是一个专为 zhgu 项目设计的 React 组件库，提供了一系列可复用的 UI 组件。

## 📦 安装

```bash
# 在 monorepo 中，组件库已经作为 workspace 依赖
pnpm install
```

## 🚀 快速开始

```tsx
import { ColorButton, DraggableNumberInput } from '@zhgu/ui';

function App() {
  const [color, setColor] = useState('#1890ff');
  const [value, setValue] = useState(100);

  return (
    <div>
      <ColorButton color={color} onChange={setColor} />
      <DraggableNumberInput 
        label="X" 
        value={value} 
        onChange={setValue} 
      />
    </div>
  );
}
```

## 📋 组件列表

### ColorButton 颜色选择器

一个支持点击弹出颜色选择器的按钮组件。

#### 特性
- 🎨 支持多种尺寸（small、medium、large）
- 🔒 支持禁用状态
- 📱 响应式设计
- ⚡ 高性能渲染优化

#### 使用示例

```tsx
import { ColorButton } from '@zhgu/ui';

function ColorPickerExample() {
  const [color, setColor] = useState('#1890ff');

  return (
    <div>
      {/* 基础用法 */}
      <ColorButton color={color} onChange={setColor} />
      
      {/* 不同尺寸 */}
      <ColorButton color={color} onChange={setColor} size="small" />
      <ColorButton color={color} onChange={setColor} size="medium" />
      <ColorButton color={color} onChange={setColor} size="large" />
      
      {/* 禁用状态 */}
      <ColorButton color={color} onChange={setColor} disabled />
      
      {/* 带回调事件 */}
      <ColorButton 
        color={color} 
        onChange={setColor}
        onStart={() => console.log('开始选择颜色')}
        onFinish={() => console.log('完成颜色选择')}
      />
    </div>
  );
}
```

#### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | `string` | - | 当前颜色值（十六进制格式） |
| `onChange` | `(color: string) => void` | - | 颜色变化回调 |
| `onStart` | `() => void` | - | 开始选择颜色时的回调 |
| `onFinish` | `() => void` | - | 完成颜色选择时的回调 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用 |

### DraggableNumberInput 可拖拽数字输入框

一个支持拖拽调整数值的数字输入框组件。

#### 特性
- 🖱️ 支持鼠标拖拽调整数值
- ⌨️ 支持键盘输入
- 📊 支持数值范围限制
- 🎯 支持步长设置
- 🔄 支持混合状态显示

#### 使用示例

```tsx
import { DraggableNumberInput } from '@zhgu/ui';

function NumberInputExample() {
  const [x, setX] = useState(100);
  const [y, setY] = useState(200);
  const [opacity, setOpacity] = useState(0.8);

  return (
    <div>
      {/* 基础用法 */}
      <DraggableNumberInput 
        label="X" 
        value={x} 
        onChange={setX} 
      />
      
      {/* 带范围和步长 */}
      <DraggableNumberInput 
        label="Y" 
        value={y} 
        onChange={setY}
        min={0}
        max={1000}
        step={5}
      />
      
      {/* 混合状态 */}
      <DraggableNumberInput 
        label="透明度" 
        value={opacity} 
        onChange={setOpacity}
        min={0}
        max={1}
        step={0.1}
        mixed={true}
      />
      
      {/* 带回调事件 */}
      <DraggableNumberInput 
        label="旋转" 
        value={rotation} 
        onChange={setRotation}
        onStart={() => console.log('开始拖拽')}
        onFinish={() => console.log('结束拖拽')}
      />
    </div>
  );
}
```

#### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | - | 标签文本 |
| `value` | `number` | - | 当前数值 |
| `onChange` | `(value: number) => void` | - | 数值变化回调 |
| `onStart` | `() => void` | - | 开始拖拽时的回调 |
| `onFinish` | `() => void` | - | 结束拖拽时的回调 |
| `step` | `number` | `10` | 拖拽步长 |
| `min` | `number` | `-Infinity` | 最小值 |
| `max` | `number` | `Infinity` | 最大值 |
| `className` | `string` | `''` | 自定义类名 |
| `mixed` | `boolean` | `false` | 是否为混合状态 |

## 🛠️ 开发指南

### 项目结构

```
packages/ui/
├── src/
│   ├── components/          # 组件目录
│   │   ├── ComponentName/   # 每个组件一个目录
│   │   │   ├── index.tsx    # 组件主文件
│   │   │   ├── types.ts     # 类型定义（可选）
│   │   │   └── styles.css   # 样式文件（可选）
│   │   └── ...
│   └── index.ts            # 导出文件
├── example/                # 示例和文档
├── package.json
└── README.md
```

### 开发新组件

1. **创建组件目录**
   ```bash
   mkdir src/components/NewComponent
   ```

2. **创建组件文件**
   ```tsx
   // src/components/NewComponent/index.tsx
   import React from 'react';
   
   export interface NewComponentProps {
     // 定义组件属性
   }
   
   export const NewComponent: React.FC<NewComponentProps> = (props) => {
     // 组件实现
     return <div>New Component</div>;
   };
   ```

3. **更新导出文件**
   ```tsx
   // src/index.ts
   export * from './components/NewComponent';
   ```

4. **添加示例**
   ```tsx
   // example/NewComponentDemo.tsx
   import React from 'react';
   import { NewComponent } from '../src';
   
   const NewComponentDemo: React.FC = () => {
     return (
       <div>
         <h2>NewComponent 示例</h2>
         <NewComponent />
       </div>
     );
   };
   
   export default NewComponentDemo;
   ```

### 开发规范

#### 1. 组件设计原则

- **单一职责**：每个组件只负责一个功能
- **可复用性**：组件应该易于在不同场景下复用
- **可配置性**：通过 props 提供足够的配置选项
- **类型安全**：使用 TypeScript 提供完整的类型定义

#### 2. 代码规范

- 使用函数式组件和 Hooks
- 使用 TypeScript 进行类型检查
- 遵循 React 最佳实践
- 添加必要的注释和文档

#### 3. 性能优化

- 使用 `React.memo` 优化渲染性能
- 合理使用 `useCallback` 和 `useMemo`
- 避免不必要的重渲染
- 优化样式计算和布局

#### 4. 样式规范

- 优先使用内联样式或 CSS-in-JS
- 保持样式的一致性和可维护性
- 支持主题定制
- 确保响应式设计

#### 5. 测试规范

- 为每个组件编写单元测试
- 测试组件的各种状态和交互
- 确保测试覆盖率

### 构建和发布

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm type-check

# 清理构建文件
pnpm clean
```

### 示例开发

在 `example/` 目录下开发组件示例：

```bash
# 启动示例开发服务器
pnpm dev
```

访问 `http://localhost:5173` 查看组件示例。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../../LICENSE) 文件了解详情。

## 🔗 相关链接

- [项目主页](../../README.md)
- [类型定义包](../type/)
- [编辑器包](../editor/)
- [渲染包](../render/) 