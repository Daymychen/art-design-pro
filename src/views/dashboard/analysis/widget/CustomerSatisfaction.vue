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

  // 图表数据配置
  const chartData = computed<LineDataItem[]>(() => [
    {
      name: '上个月',
      data: [65, 72, 68, 75, 82, 78, 85],
      areaStyle: {
        startOpacity: 0.08,
        endOpacity: 0
      }
    },
    {
      name: '本月',
      data: [78, 85, 82, 88, 92, 89, 95],
      areaStyle: {
        startOpacity: 0.08,
        endOpacity: 0
      }
    }
  ])

  // X轴数据
  const xAxisData = ['1', '2', '3', '4', '5', '6', '7']
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
