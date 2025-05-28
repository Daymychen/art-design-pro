<template>
  <div class="custom-card art-custom-card customer-satisfaction">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.customerSatisfaction.title') }}</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" style="height: 300px; margin-top: 10px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import { useI18n } from 'vue-i18n'
  import { useChart } from '@/composables/useChart'
  const { t } = useI18n()

  const { chartRef, isDark, initChart } = useChart()

  const options: () => echarts.EChartsOption = () => ({
    grid: {
      top: 30,
      right: 20,
      bottom: 50,
      left: 20,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    legend: {
      data: [
        t('analysis.customerSatisfaction.legend.lastMonth'),
        t('analysis.customerSatisfaction.legend.thisMonth')
      ],
      bottom: 0,
      textStyle: {
        fontSize: 12,
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false } // 隐藏 x 轴标签
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: {
        show: false // 将 show 设置为 false 以去除水平线条
      }
    },
    series: [
      {
        name: t('analysis.customerSatisfaction.legend.lastMonth'),
        type: 'line',
        smooth: true,
        data: [1800, 2800, 1800, 2300, 2600, 2500, 3000],
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,157,255,0.33)' },
            { offset: 1, color: 'rgba(255,255,255,0)' }
          ])
        },
        lineStyle: {
          width: 2,
          color: '#0086E1'
        },
        symbol: 'none',
        itemStyle: {
          color: '#0095FF'
        }
      },
      {
        name: t('analysis.customerSatisfaction.legend.thisMonth'),
        type: 'line',
        smooth: true,
        data: [4000, 3500, 4300, 3700, 4500, 3500, 4000],
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(147,241,180,0.33)' },
            { offset: 1, color: 'rgba(255,255,255,0)' }
          ])
        },
        lineStyle: {
          width: 2,
          color: '#14DEB9'
        },
        symbol: 'none',
        itemStyle: {
          color: '#14DEB9'
        }
      }
    ]
  })

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    initChart(options())
  })
</script>
<style lang="scss" scoped>
  .custom-card {
    height: 400px;

    &-body {
      padding: 10px 0;
    }
  }

  @media (max-width: $device-notebook) {
    .custom-card {
      height: 350px;

      &-body {
        > div {
          height: 260px !important;
        }
      }
    }
  }
</style>
