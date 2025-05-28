<template>
  <div class="custom-card art-custom-card visitor-insights">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.visitorInsights.title') }}</span>
    </div>
    <div class="card-body">
      <div ref="chartRef" style="height: 250px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useChart } from '@/composables/useChart'
  import { EChartsOption } from 'echarts'

  const { t } = useI18n()

  const { chartRef, isDark, initChart } = useChart()

  const { width } = useWindowSize()

  const options: () => EChartsOption = () => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 20,
        right: 20,
        bottom: width.value < 600 ? 80 : 40,
        left: 20,
        containLabel: true
      },
      legend: {
        data: [
          t('analysis.visitorInsights.legend.loyalCustomers'),
          t('analysis.visitorInsights.legend.newCustomers')
        ],
        bottom: 0,
        left: 'center',
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          fontSize: 12,
          color: isDark.value ? '#808290' : '#222B45'
        },
        icon: 'roundRect',
        itemStyle: {
          borderRadius: 4
        }
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: isDark.value ? '#808290' : '#7B91B0' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
            width: 0.8
          }
        },
        axisLabel: { color: isDark.value ? '#808290' : '#7B91B0' }
      },
      series: [
        {
          name: t('analysis.visitorInsights.legend.loyalCustomers'),
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [260, 200, 150, 130, 180, 270, 340, 380, 300, 220, 170, 130],
          lineStyle: {
            color: '#2B8DFA',
            width: 3
          },
          itemStyle: {
            color: '#2B8DFA'
          }
        },
        {
          name: t('analysis.visitorInsights.legend.newCustomers'),
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [280, 350, 300, 250, 230, 210, 240, 280, 320, 350, 300, 200],
          lineStyle: {
            color: '#49BEFF',
            width: 3
          },
          itemStyle: {
            color: '#49BEFF'
          }
        }
      ]
    }
  }

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    initChart(options())
  })
</script>

<style lang="scss" scoped>
  .visitor-insights {
    height: 330px;
  }

  @media (max-width: $device-notebook) {
    .visitor-insights {
      height: 280px;

      .card-body {
        > div {
          height: 210px !important;
        }
      }
    }
  }

  @media (max-width: $device-phone) {
    .visitor-insights {
      height: 315px;

      .card-body {
        > div {
          height: 240px !important;
        }
      }
    }
  }
</style>
