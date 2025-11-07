<!-- 全局组件 -->
<template>
  <component
    v-for="componentConfig in enabledComponents"
    :key="componentConfig.key"
    :is="componentConfig.component"
  />
</template>

<script setup lang="ts">
  import { getEnabledGlobalComponents } from '@/config/modules/component'
  defineOptions({ name: 'ArtGlobalComponent' })
  const enabledComponents = computed(() => getEnabledGlobalComponents())
</script>
