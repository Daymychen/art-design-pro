<template>
  <div ref="chartRef" class="k-line-chart" :style="{ height: props.height }"></div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from 'echarts'
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

  interface KLineDataItem {
    time: string
    open: number
    close: number
    high: number
    low: number
  }

  interface Props {
    data?: KLineDataItem[]
    height?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [
      { time: '2024-01-01', open: 20, close: 23, high: 25, low: 18 },
      { time: '2024-01-02', open: 23, close: 21, high: 24, low: 20 },
      { time: '2024-01-03', open: 21, close: 25, high: 26, low: 21 }
    ],
    height: useChartOps().chartHeight
  })

  const options: () => EChartsOption = () => {
    return {
      grid: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: (params: any) => {
          const item = params[0]
          const data = item.data
          return `
            时间：${data[0]}<br/>
            开盘：${data[1]}<br/>
            收盘：${data[2]}<br/>
            最低：${data[3]}<br/>
            最高：${data[4]}<br/>
          `
        }
      },
      xAxis: {
        type: 'category',
        axisTick: getAxisTickStyle(),
        data: props.data.map((item) => item.time),
        axisLabel: getAxisLabelStyle(),
        axisLine: getAxisLineStyle()
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: getAxisLabelStyle(),
        axisLine: getAxisLineStyle(),
        splitLine: getSplitLineStyle()
      },
      series: [
        {
          type: 'candlestick',
          data: props.data.map((item) => [item.open, item.close, item.low, item.high]),
          itemStyle: {
            color: '#4C87F3', // 上涨颜色
            color0: '#8BD8FC', // 下跌颜色
            borderColor: '#4C87F3', // 上涨边框颜色
            borderColor0: '#8BD8FC' // 下跌边框颜色
          }
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
