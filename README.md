# Scrollbar Switcher

一个用于控制网页滚动条显示/隐藏的 Tampermonkey 脚本，使用 TypeScript + Vue 3 开发。

## 功能特性

- 🎯 **智能切换**: 点击悬浮按钮即可切换滚动条显示状态
- 📱 **响应式设计**: 适配移动端和桌面端
- 🔧 **保持功能**: 隐藏滚动条的同时保持页面滚动功能
- 🎨 **美观界面**: 现代化的悬浮按钮设计
- ⚡ **高性能**: 基于 Vue 3 Composition API
- 🔄 **通用框架**: 可复用的 Tampermonkey 应用基础架构
- 🏗️ **Entry-Components 架构**: 简化的二级组件架构

## 项目结构

```
src/
├── core/
│   └── TampermonkeyApp.ts    # 通用的 Tampermonkey 应用基类
├── config/
│   └── appConfig.ts          # 应用配置和 Tampermonkey 配置
├── utils/
│   └── ScrollbarManager.ts   # 滚动条管理核心逻辑
├── components/
│   ├── ScrollbarToggle.vue   # 滚动条切换组件
│   └── ScrollbarEntry.vue    # Entry 层组件
├── types/
│   └── vue-shim.d.ts        # Vue类型声明
├── App.vue                   # 公共入口组件
└── main.ts                   # 应用入口
```

## 架构设计

### Entry-Components 二级架构

项目采用简化的二级架构设计：

```
┌─────────────────┐
│    main.ts      │  ← 入口层：应用启动和配置
└─────────────────┘
         │
         ▼
┌─────────────────┐
│    App.vue      │  ← 根组件：使用 h 函数渲染
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ ScrollbarEntry  │  ← Entry 层：功能组件管理
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Feature Components │  ← Components 层：具体功能组件
└─────────────────┘
```

### 核心特性

1. **简化架构**: 无需复杂的组件注册，直接在 Entry 组件中管理
2. **Entry 层**: `ScrollbarEntry.vue` 管理所有相关功能组件
3. **h 函数渲染**: 使用 Vue 3 的 h 函数进行声明式渲染
4. **CSS 内联**: 样式自动内联到 JS 中，适合 Tampermonkey
5. **自动头部**: 构建时自动添加 Tampermonkey 脚本头部

## 构建和使用

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

构建完成后，在 `dist/` 目录下会生成：
- `main.iife.js` - 包含完整 Tampermonkey 头部的脚本文件

### 4. 在 Tampermonkey 中使用

**简单方式：**
1. 打开 Tampermonkey 扩展
2. 创建新脚本
3. **直接复制 `dist/main.iife.js` 的全部内容**到脚本中
4. 保存并启用脚本

**手动方式：**
如果需要自定义头部配置，可以：
1. 创建新脚本并设置自己的头部
2. 只复制 `dist/main.iife.js` 中 `(function() {` 开始的部分

## 架构优势

### 1. 简化设计
- **无注册系统**: 不需要复杂的组件注册逻辑
- **Entry 层管理**: 在 `ScrollbarEntry.vue` 中直接管理相关组件
- **清晰层次**: Entry → Components 二级架构

### 2. 易于扩展

**添加新功能组件：**

1. **创建组件：**
```vue
<!-- src/components/KeyboardShortcuts.vue -->
<template>
  <div style="display: none;"></div>
</template>

<script setup lang="ts">
// 键盘快捷键逻辑
</script>
```

2. **在 Entry 中引用：**
```vue
<!-- src/components/ScrollbarEntry.vue -->
<script setup lang="ts">
import ScrollbarToggle from './ScrollbarToggle.vue'
import KeyboardShortcuts from './KeyboardShortcuts.vue'

const components = [
  ScrollbarToggle,
  KeyboardShortcuts  // 直接添加新组件
]
</script>
```

### 3. 自动化构建
- **CSS 内联**: 样式自动内联，无需手动处理
- **头部注入**: 自动添加 Tampermonkey 脚本头部
- **单文件输出**: 一个文件包含所有内容

## 配置管理

### 应用配置

```typescript
// src/config/appConfig.ts
export const APP_CONFIG = {
  containerId: 'scrollbar-switcher-app',
  containerClass: 'scrollbar-switcher-container',
  appName: 'Scrollbar Switcher',
  version: '1.0.0',
  description: 'Toggle webpage scrollbar visibility'
}
```

### Tampermonkey 配置

```typescript
export const TAMPERMONKEY_CONFIG = {
  name: 'Scrollbar Switcher',
  namespace: 'http://tampermonkey.net/',
  version: '1.0.0',
  description: 'Toggle webpage scrollbar visibility',
  author: 'Your Name',
  match: ['*://*/*'],
  grant: 'none',
  runAt: 'document-end'
}
```

## Entry 组件示例

```vue
<!-- src/components/ScrollbarEntry.vue -->
<script setup lang="ts">
import { h, Fragment } from 'vue'
import ScrollbarToggle from './ScrollbarToggle.vue'

// Entry 组件管理所有滚动条相关的功能组件
const components = [
  ScrollbarToggle
  // 可以在这里添加更多组件
  // KeyboardShortcuts,
  // ScrollbarSettings,
  // StatusIndicator
]

const renderComponents = () => {
  if (components.length === 1) {
    return h(components[0])
  }
  
  return h(Fragment, 
    components.map((component, index) => 
      h(component, { key: index })
    )
  )
}
</script>

<template>
  <component :is="renderComponents" />
</template>
```

## 在其他项目中复用

1. 复制通用框架文件：
   - `src/core/TampermonkeyApp.ts`
   - `src/App.vue`
   - `src/config/appConfig.ts` (作为模板)
   - `vite.config.ts` (构建配置)

2. 创建自己的 Entry 组件和功能组件

3. 修改配置文件中的应用信息

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **Vue 3**: 现代化的渐进式前端框架
- **Composition API**: Vue 3 的组合式 API
- **h 函数**: Vue 3 的声明式渲染函数
- **Vite**: 快速的构建工具
- **单文件组件**: Vue 的 SFC 格式

## 开发说明

- **简化架构**: Entry-Components 二级架构，易于理解和维护
- **自动构建**: CSS 内联和 Tampermonkey 头部自动注入
- **类型安全**: 完整的 TypeScript 类型定义
- **样式隔离**: 所有样式都是 scoped，不会影响页面其他元素
- **高 z-index**: 确保组件始终在最顶层
- **响应式设计**: 在不同设备上都有良好体验

## 许可证

MIT License 