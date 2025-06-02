<script setup lang="ts">
import { h, Fragment } from 'vue'
import ScrollbarToggle from './ScrollbarToggle.vue'


const components = [
  ScrollbarToggle
]

// 使用 h 函数渲染所有组件
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