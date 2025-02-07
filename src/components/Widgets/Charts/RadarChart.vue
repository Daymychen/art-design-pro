<template>
  <div ref="chartRef" class="radar-chart" :style="{ height: props.height }"></div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from 'echarts'
  import { useChart, useChartOps } from '@/composables/useChart'
  const { chartRef, initChart, isDark } = useChart()

  interface RadarDataItem {
    name: string
    value: number[]
  }

  interface Props {
    indicator?: Array<{ name: string; max: number }>
    data?: RadarDataItem[]
    height?: string
    colors?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    indicator: () => [
      { name: '销售', max: 100 },
      { name: '管理', max: 100 },
      { name: '技术', max: 100 },
      { name: '客服', max: 100 },
      { name: '开发', max: 100 }
    ],
    data: () => [
      {
        name: '预算分配',
        value: [80, 70, 90, 85, 75]
      },
      {
        name: '实际开销',
        value: [70, 75, 85, 80, 70]
      }
    ],
    height: useChartOps().chartHeight,
    colors: () => ['#67C23A', '#409EFF']
  })

  const options: () => EChartsOption = () => {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        data: props.data.map((item) => item.name),
        bottom: '0',
        textStyle: {
          color: isDark.value ? '#fff' : '#333'
        }
      },
      radar: {
        indicator: props.indicator,
        splitLine: {
          lineStyle: {
            color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        },
        axisLine: {
          lineStyle: {
            color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        },
        axisName: {
          color: '#999'
        }
      },
      series: [
        {
          type: 'radar',
          data: props.data.map((item, index) => ({
            name: item.name,
            value: item.value,
            symbolSize: 4,
            lineStyle: {
              width: 2,
              color: props.colors[index]
            },
            itemStyle: {
              color: props.colors[index]
            },
            areaStyle: {
              color: props.colors[index],
              opacity: 0.2
            }
          }))
        }
      ]
    }
  }

  watch(isDark, () => {
    return initChart(options())
  })

  onMounted(() => {
    return initChart(options())
  })
</script>
