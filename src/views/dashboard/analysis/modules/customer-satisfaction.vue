<template>
  <div class="custom-card art-custom-card customer-satisfaction">
    <div class="custom-card-header">
      <span class="title">客户满意度</span>
    </div>
    <div class="custom-card-body">
      <ArtLineChart
        height="100%"
        :data="chartData"
        :xAxisData="xAxisData"
        :showLegend="true"
        :showAxisLabel="true"
        :showAxisLine="false"
        :showSplitLine="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { LineDataItem } from '@/types/component/chart'

  const AREA_STYLE_CONFIG = {
    startOpacity: 0.08,
    endOpacity: 0
  } as const

  /**
   * X 轴数据配置
   * 表示一周的天数（周一到周日）
   */
  const xAxisData = ['1', '2', '3', '4', '5', '6', '7']

  /**
   * 客户满意度图表数据
   * 对比上个月和本月的满意度趋势
   */
  const chartData = computed<LineDataItem[]>(() => [
    {
      name: '上个月',
      data: [65, 72, 68, 75, 82, 78, 85],
      areaStyle: AREA_STYLE_CONFIG
    },
    {
      name: '本月',
      data: [78, 85, 82, 88, 92, 89, 95],
      areaStyle: AREA_STYLE_CONFIG
    }
  ])
</script>

<style lang="scss" scoped>
  .customer-satisfaction {
    height: 400px;

    .custom-card-body {
      height: calc(100% - 145px);
      padding: 60px 20px 10px;
    }
  }

  @media screen and (max-width: $device-phone) {
    .customer-satisfaction {
      height: 300px;

      .custom-card-body {
        height: calc(100% - 100px);
        padding-top: 20px;
      }
    }
  }
</style>
