<!-- 图表空状态 -->
<template>
  <div class="chart-empty-state">
    <i class="iconfont-sys" :style="{ fontSize: props.iconSize + 'px', color: props.iconColor }"
      >&#xe6da;</i
    >
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtChartEmpty' })

  interface Props {
    /** 图标大小 */
    iconSize?: number
    /** 图标颜色 */
    iconColor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    iconSize: 50,
    iconColor: 'var(--art-text-gray-300)'
  })
</script>

<style scoped lang="scss">
  .chart-empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .iconfont-sys {
      font-size: 50px;
      color: #ebeaee;
    }
  }
</style>
