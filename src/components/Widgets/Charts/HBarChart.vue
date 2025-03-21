<template>
  <div ref="chartRef" class="h-bar-chart" :style="{ height: props.height }"></div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from 'echarts'
  import { useChart, useChartOps } from '@/composables/useChart'
  import { getCssVariable } from '@/utils/colors'
  import * as echarts from 'echarts'

  const {
    chartRef,
    isDark,
    initChart,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle
  } = useChart()

  interface Props {
    data?: number[]
    xAxisData?: string[]
    color?: string
    height?: string
    barWidth?: string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [0, 0, 0, 0, 0, 0, 0],
    xAxisData: () => [],
    color: '',
    height: useChartOps().chartHeight,
    barWidth: '36%'
  })

  const options: () => EChartsOption = () => {
    const computedColor =
      props.color ||
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: getCssVariable('--el-color-primary')
        },
        {
          offset: 1,
          color: getCssVariable('--el-color-primary-light-3')
        }
      ])

    return {
      grid: {
        top: 10,
        right: 10,
        bottom: 0,
        left: 0,
        containLabel: true
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'value',
        axisTick: getAxisTickStyle(),
        axisLine: getAxisLineStyle(),
        axisLabel: getAxisLabelStyle(),
        splitLine: getSplitLineStyle()
      },
      yAxis: {
        type: 'category',
        data: props.xAxisData,
        axisTick: getAxisTickStyle(),
        axisLabel: getAxisLabelStyle(),
        axisLine: getAxisLineStyle()
      },
      series: [
        {
          data: props.data,
          type: 'bar',
          itemStyle: {
            color: computedColor,
            borderRadius: 4
          },
          barWidth: props.barWidth
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
