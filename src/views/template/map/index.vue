<template>
  <div class="page-content mb-5" element-loading-text="加载中...">
    <ArtMapChart />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'TemplateMap' })

  /**
   * 异步加载地图组件
   * 减少初始加载体积
   */
  const ArtMapChart = defineAsyncComponent(
    () => import('@/components/core/charts/art-map-chart/index.vue')
  )
</script>
