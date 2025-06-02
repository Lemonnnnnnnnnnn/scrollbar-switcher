# 架构设计文档

## Entry-Components 二级架构概述

本项目采用简化的 Entry-Components 二级架构设计，去除了复杂的组件注册系统，通过 Entry 层直接管理功能组件。

## 架构层次

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

## 核心设计原则

### 1. 简化架构

**删除复杂的注册系统：**
```typescript
// ❌ 之前的复杂方式
export const FEATURE_COMPONENTS: FeatureComponentConfig[] = [
  {
    component: ScrollbarToggle,
    name: 'scrollbar-toggle',
    enabled: true,
    props: {}
  }
]
```

**采用直接引用方式：**
```vue
<!-- ✅ 现在的简单方式 -->
<script setup lang="ts">
import ScrollbarToggle from './ScrollbarToggle.vue'

const components = [
  ScrollbarToggle
  // 直接添加更多组件
]
</script>
```

### 2. Entry 层管理

**ScrollbarEntry.vue 负责：**
- 引用和管理相关功能组件
- 使用 h 函数进行声明式渲染
- 处理多组件的组合逻辑

```vue
<script setup lang="ts">
import { h, Fragment } from 'vue'
import ScrollbarToggle from './ScrollbarToggle.vue'

const components = [
  ScrollbarToggle
  // 可以轻松添加更多组件
  // KeyboardShortcuts,
  // ScrollbarSettings
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

### 3. 自动化构建

**CSS 内联处理：**
- Vite 配置自动将 CSS 内联到 JS 中
- 删除独立的 CSS 文件输出
- 适合 Tampermonkey 单文件需求

**Tampermonkey 头部注入：**
```typescript
// vite.config.ts 中的自动注入
{
  name: 'tampermonkey-header',
  generateBundle(options, bundle) {
    // 删除 CSS 文件
    Object.keys(bundle).forEach(key => {
      if (key.endsWith('.css')) {
        delete bundle[key]
      }
    })
    
    // 注入 Tampermonkey 头部
    const header = `// ==UserScript==
// @name         Scrollbar Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Toggle webpage scrollbar visibility
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    `
    chunk.code = header + chunk.code + '\n})();'
  }
}
```

## 架构优势

### 1. 简单易懂
- **无注册系统**: 不需要学习复杂的组件注册 API
- **直接引用**: 在 Entry 组件中直接 import 和使用
- **清晰层次**: 只有两层：Entry 和 Components

### 2. 易于扩展

**添加新组件只需两步：**

1. **创建组件文件：**
```vue
<!-- src/components/KeyboardShortcuts.vue -->
<template>
  <div style="display: none;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ScrollbarManager } from '../utils/ScrollbarManager'

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'h') {
    event.preventDefault()
    ScrollbarManager.getInstance().toggle()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
</script>
```

2. **在 Entry 中添加：**
```vue
<!-- src/components/ScrollbarEntry.vue -->
<script setup lang="ts">
import ScrollbarToggle from './ScrollbarToggle.vue'
import KeyboardShortcuts from './KeyboardShortcuts.vue'  // 导入新组件

const components = [
  ScrollbarToggle,
  KeyboardShortcuts  // 添加到数组中
]
</script>
```

### 3. 构建优化
- **单文件输出**: 所有资源打包成一个 JS 文件
- **自动头部**: 构建时自动添加 Tampermonkey 头部
- **CSS 内联**: 样式自动内联，无需额外文件

## 文件职责说明

### main.ts - 应用入口
```typescript
// 职责：
// 1. 引用 App 组件
// 2. 应用启动配置
// 3. 错误处理
// 
// 不包含：
// - 具体功能逻辑
// - 组件管理
// - 业务代码
```

### App.vue - 根组件
```vue
<!-- 职责：
1. 引用 Entry 组件
2. 使用 h 函数渲染
3. 作为应用根节点

不包含：
- 具体功能逻辑
- 组件管理逻辑
- 业务代码
-->
```

### ScrollbarEntry.vue - Entry 层
```vue
<!-- 职责：
1. 管理所有滚动条相关功能组件
2. 使用 h 函数组合渲染
3. 处理多组件协调

不包含：
- 具体业务逻辑
- 样式定义
- 状态管理
-->
```

### ScrollbarToggle.vue - 功能组件
```vue
<!-- 职责：
1. 滚动条切换的具体实现
2. UI 交互逻辑
3. 状态管理

不包含：
- 其他功能的逻辑
- 全局配置
- 组件管理
-->
```

### appConfig.ts - 配置管理
```typescript
// 职责：
// 1. 应用基础配置
// 2. Tampermonkey 脚本配置
// 3. 配置生成工具
// 
// 不包含：
// - 组件注册逻辑
// - 业务逻辑
// - 渲染逻辑
```

## 与之前架构的对比

### 之前的复杂架构
```
main.ts → App.vue → appConfig.ts → 组件注册系统 → 功能组件
                        ↓
                   复杂的配置接口
                   动态启用/禁用
                   props 传递系统
```

**问题：**
- 学习成本高
- 配置复杂
- 过度设计

### 现在的简化架构
```
main.ts → App.vue → ScrollbarEntry.vue → 功能组件
```

**优势：**
- 学习成本低
- 配置简单
- 恰到好处

## 扩展示例

### 添加设置面板组件

1. **创建设置组件：**
```vue
<!-- src/components/SettingsPanel.vue -->
<template>
  <div class="settings-panel" v-if="showPanel">
    <div class="settings-content">
      <h3>滚动条设置</h3>
      <label>
        <input type="checkbox" v-model="autoHide"> 自动隐藏
      </label>
      <button @click="closePanel">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showPanel = ref(false)
const autoHide = ref(true)

const closePanel = () => {
  showPanel.value = false
}

// 暴露方法给父组件
defineExpose({
  show: () => showPanel.value = true
})
</script>
```

2. **在 Entry 中集成：**
```vue
<!-- src/components/ScrollbarEntry.vue -->
<script setup lang="ts">
import { h, Fragment, ref } from 'vue'
import ScrollbarToggle from './ScrollbarToggle.vue'
import SettingsPanel from './SettingsPanel.vue'

const components = [
  ScrollbarToggle,
  SettingsPanel
]

// 可以在这里处理组件间的通信
const settingsPanelRef = ref()

const renderComponents = () => {
  return h(Fragment, [
    h(ScrollbarToggle, {
      onOpenSettings: () => settingsPanelRef.value?.show()
    }),
    h(SettingsPanel, {
      ref: settingsPanelRef
    })
  ])
}
</script>
```

## 总结

Entry-Components 二级架构通过以下方式优化了开发体验：

1. **简化复杂度**: 去除不必要的注册系统
2. **提高效率**: 直接在 Entry 层管理组件
3. **降低门槛**: 新手更容易理解和上手
4. **保持灵活**: 仍然支持复杂的组合和交互
5. **优化构建**: 自动化的 CSS 内联和头部注入

这种架构特别适合 Tampermonkey 脚本这类功能相对集中、不需要过度复杂化的项目。 