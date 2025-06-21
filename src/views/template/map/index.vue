<template>
  <div class="page-content" element-loading-text="加载中...">
    <ArtMapChart />
  </div>
</template>

<script setup lang="ts">
  const ArtMapChart = defineAsyncComponent(
    () => import('@/components/core/charts/art-map-chart/index.vue')
  )
</script>

<style lang="scss" scoped>
  .page-content {
    height: 100%;
  }
</style>
