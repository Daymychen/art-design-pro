<template>
  <div class="page-content" v-loading="loading" element-loading-text="加载中...">
    <MapChart @onRenderComplete="onLoaded" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const loading = ref(true)
  const onLoaded = () => {
    loading.value = false
  }

  const MapChart = defineAsyncComponent(() => import('@/components/Widgets/Charts/MapChart.vue'))
</script>

<style lang="scss" scoped>
  .page-content {
    height: 100%;
  }
</style>
