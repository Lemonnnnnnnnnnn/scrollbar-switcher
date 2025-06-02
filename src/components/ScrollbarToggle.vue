<template>
  <div class="scrollbar-toggle-container">
    <button 
      class="scrollbar-toggle-btn"
      @click="toggleScrollbar"
      :class="{ 'hidden': isScrollbarHidden }"
      :title="isScrollbarHidden ? '显示滚动条' : '隐藏滚动条'"
    >
      <svg v-if="isScrollbarHidden" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ScrollbarManager } from '../utils/ScrollbarManager'

const isScrollbarHidden = ref(false)
const scrollbarManager = ScrollbarManager.getInstance()

// 切换滚动条显示状态
const toggleScrollbar = () => {
  isScrollbarHidden.value = scrollbarManager.toggle()
}

// 更新状态的函数
const updateStatus = () => {
  isScrollbarHidden.value = scrollbarManager.isScrollbarHidden()
}

// 组件挂载时初始化状态
onMounted(() => {
  updateStatus()
})

// 组件卸载时清理
onUnmounted(() => {
  scrollbarManager.reset()
})
</script>

<style scoped module>
.scrollbar-toggle-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999999;
  pointer-events: auto;
}

.scrollbar-toggle-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
}

.scrollbar-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.scrollbar-toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.scrollbar-toggle-btn.hidden {
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
}

.scrollbar-toggle-btn.hidden:hover {
  background: linear-gradient(135deg, #e53e3e 0%, #9c2626 100%);
}

.icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scrollbar-toggle-container {
    bottom: 15px;
    right: 15px;
  }
  
  .scrollbar-toggle-btn {
    width: 45px;
    height: 45px;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
}

/* 确保按钮在所有页面都可见 */
.scrollbar-toggle-btn {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style> 