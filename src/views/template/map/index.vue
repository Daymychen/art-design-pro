<template>
  <div class="page-content" v-loading="loading" element-loading-text="加载中...">
    <ArtMapChart @onRenderComplete="onLoaded" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const loading = ref(true)
  const onLoaded = () => {
    loading.value = false
  }

  const ArtMapChart = defineAsyncComponent(() => import('@/components/core/charts/ArtMapChart.vue'))
</script>

<style lang="scss" scoped>
  .page-content {
    height: 100%;
  }
</style>
