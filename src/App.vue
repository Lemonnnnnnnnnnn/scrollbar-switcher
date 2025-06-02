<script setup lang="ts">
import { h } from 'vue'
import Entry from './components/Entry.vue'

const renderApp = () => {
  return h(Entry)
}
</script>

<template>
  <component :is="renderApp" />
</template> 