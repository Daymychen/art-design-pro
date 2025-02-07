<template>
  <div ref="chartRef" class="bar-chart" :style="{ height: props.height }"></div>
</template>

<script setup lang="ts">
  import { useChartOps, useChart } from '@/composables/useChart'
  import { getCssVariable } from '@/utils/utils'
  import { EChartsOption } from 'echarts'
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
    xAxisData: () => ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
    color: '',
    height: useChartOps().chartHeight,
    barWidth: '40%'
  })

  const options: () => EChartsOption = () => {
    const computedColor =
      props.color ||
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: getCssVariable('--el-color-primary-light-4')
        },
        {
          offset: 1,
          color: getCssVariable('--el-color-primary')
        }
      ])

    return {
      grid: {
        top: 15,
        right: 0,
        bottom: 0,
        left: 0,
        containLabel: true
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: props.xAxisData,
        axisTick: getAxisTickStyle(),
        axisLine: getAxisLineStyle(),
        axisLabel: getAxisLabelStyle()
      },
      yAxis: {
        axisLabel: getAxisLabelStyle(),
        axisLine: getAxisLineStyle(),
        splitLine: getSplitLineStyle()
      },
      series: [
        {
          data: props.data,
          type: 'bar',
          itemStyle: {
            borderRadius: 4,
            color: computedColor
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
