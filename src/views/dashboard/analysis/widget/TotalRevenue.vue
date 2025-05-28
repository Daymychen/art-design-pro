<template>
  <div class="custom-card art-custom-card total-revenue">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.totalRevenue.title') }}</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" style="height: 300px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { EChartsOption } from 'echarts'
  import { useChart } from '@/composables/useChart'

  const { t } = useI18n()

  const { chartRef, isDark, initChart } = useChart()

  // 创建图表选项
  const options: () => EChartsOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 20,
      right: 3,
      bottom: 40,
      left: 3,
      containLabel: true
    },
    legend: {
      data: [
        t('analysis.totalRevenue.legend.onlineSales'),
        t('analysis.totalRevenue.legend.offlineSales')
      ],
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 15,
      textStyle: {
        fontSize: 12,
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: isDark.value ? '#808290' : '#7B91B0'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          width: 0.8
        }
      },
      axisLabel: { color: isDark.value ? '#808290' : '#7B91B0' }
    },
    series: [
      {
        name: t('analysis.totalRevenue.legend.onlineSales'),
        type: 'bar',
        data: [12, 13, 5, 15, 10, 15, 18],
        barWidth: '15',
        itemStyle: {
          color: '#0095FF',
          borderRadius: [4, 4, 4, 4]
        }
      },
      {
        name: t('analysis.totalRevenue.legend.offlineSales'),
        type: 'bar',
        data: [10, 11, 20, 5, 11, 13, 10],
        barWidth: '15',
        itemStyle: {
          color: '#95E0FB',
          borderRadius: [4, 4, 4, 4]
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
      padding: 20px;
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
