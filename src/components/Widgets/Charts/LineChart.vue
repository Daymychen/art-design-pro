<template>
  <div ref="chartRef" class="line-chart" :style="{ height: props.height }"></div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import type { EChartsOption } from 'echarts'
  import { getCssVariable, hexToRgba } from '@/utils/utils'
  import { useChart, useChartOps } from '@/composables/useChart'
  const {
    chartRef,
    initChart,
    isDark,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle
  } = useChart()

  interface Props {
    data: number[]
    xAxisData: string[]
    height?: string
    color?: string
    lineWidth?: number
    showAreaColor?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: useChartOps().chartHeight,
    data: () => [0, 0, 0, 0, 0, 0, 0],
    xAxisData: () => ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
    color: '',
    lineWidth: 3,
    showAreaColor: false
  })

  const options: () => EChartsOption = () => {
    const computedColor = props.color || useChartOps().themeColor

    return {
      grid: {
        top: 15,
        right: 15,
        bottom: 0,
        left: 0,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
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
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: props.lineWidth,
            color: computedColor
          },
          areaStyle: props.showAreaColor
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: props.color
                      ? hexToRgba(props.color, 0.2).rgba
                      : hexToRgba(getCssVariable('--el-color-primary'), 0.2).rgba
                  },
                  {
                    offset: 1,
                    color: props.color
                      ? hexToRgba(props.color, 0.01).rgba
                      : hexToRgba(getCssVariable('--el-color-primary'), 0.01).rgba
                  }
                ])
              }
            : undefined
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

<style lang="scss" scoped>
  .line-chart {
    width: calc(100% + 10px);
  }
</style>
