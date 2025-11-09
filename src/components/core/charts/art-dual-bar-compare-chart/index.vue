<!-- 双向堆叠柱状图 -->
<template>
  <div ref="chartRef" :style="{ height: props.height }" v-loading="props.loading"> </div>
</template>

<script setup lang="ts">
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import type { EChartsOption, BarSeriesOption } from '@/plugins/echarts'
  import type { BidirectionalBarChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtDualBarCompareChart' })

  const props = withDefaults(defineProps<BidirectionalBarChartProps>(), {
    // 基础配置
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    // 数据配置
    positiveData: () => [],
    negativeData: () => [],
    xAxisData: () => [],
    positiveName: '正向数据',
    negativeName: '负向数据',
    barWidth: 16,
    yAxisMin: -100,
    yAxisMax: 100,

    // 样式配置
    showDataLabel: false,
    positiveBorderRadius: () => [10, 10, 0, 0],
    negativeBorderRadius: () => [0, 0, 10, 10],

    // 轴线显示配置
    showAxisLabel: true,
    showAxisLine: false,
    showSplitLine: false,

    // 交互配置
    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  // 创建系列配置的辅助函数
  const createSeriesConfig = (config: {
    name: string
    data: number[]
    borderRadius: number | number[]
    labelPosition: 'top' | 'bottom'
    colorIndex: number
    formatter?: (params: unknown) => string
  }): BarSeriesOption => {
    const { fontColor } = useChartOps()
    const animationConfig = getAnimationConfig()

    return {
      name: config.name,
      type: 'bar',
      stack: 'total',
      barWidth: props.barWidth,
      barGap: '-100%',
      data: config.data,
      itemStyle: {
        borderRadius: config.borderRadius,
        color: props.colors[config.colorIndex]
      },
      label: {
        show: props.showDataLabel,
        position: config.labelPosition,
        formatter:
          config.formatter ||
          ((params: unknown) => String((params as Record<string, unknown>).value)),
        color: fontColor,
        fontSize: 12
      },
      ...animationConfig
    }
  }

  // 使用图表组件抽象
  const {
    chartRef,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    getGridWithLegend
  } = useChartComponent({
    props,
    checkEmpty: () => {
      return (
        props.isEmpty ||
        !props.positiveData.length ||
        !props.negativeData.length ||
        (props.positiveData.every((val) => val === 0) &&
          props.negativeData.every((val) => val === 0))
      )
    },
    watchSources: [
      () => props.positiveData,
      () => props.negativeData,
      () => props.xAxisData,
      () => props.colors
    ],
    generateOptions: (): EChartsOption => {
      // 处理负向数据，确保为负值
      const processedNegativeData = props.negativeData.map((val) => (val > 0 ? -val : val))

      // 优化的Grid配置
      const gridConfig = {
        top: props.showLegend ? 50 : 20,
        right: 0,
        left: 0,
        bottom: 0, // 增加底部间距
        containLabel: true
      }

      const options: EChartsOption = {
        backgroundColor: 'transparent',
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        grid: getGridWithLegend(props.showLegend, props.legendPosition, gridConfig),

        // 优化的提示框配置
        tooltip: props.showTooltip
          ? {
              ...getTooltipStyle(),
              trigger: 'axis',
              axisPointer: {
                type: 'none' // 去除指示线
              }
            }
          : undefined,

        // 图例配置
        legend: props.showLegend
          ? {
              ...getLegendStyle(props.legendPosition),
              data: [props.negativeName, props.positiveName]
            }
          : undefined,

        // X轴配置
        xAxis: {
          type: 'category',
          data: props.xAxisData,
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          boundaryGap: true
        },

        // Y轴配置
        yAxis: {
          type: 'value',
          min: props.yAxisMin,
          max: props.yAxisMax,
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          axisLine: getAxisLineStyle(props.showAxisLine),
          splitLine: getSplitLineStyle(props.showSplitLine)
        },

        // 系列配置
        series: [
          // 负向数据系列
          createSeriesConfig({
            name: props.negativeName,
            data: processedNegativeData,
            borderRadius: props.negativeBorderRadius,
            labelPosition: 'bottom',
            colorIndex: 1,
            formatter: (params: unknown) =>
              String(Math.abs((params as Record<string, unknown>).value as number))
          }),
          // 正向数据系列
          createSeriesConfig({
            name: props.positiveName,
            data: props.positiveData,
            borderRadius: props.positiveBorderRadius,
            labelPosition: 'top',
            colorIndex: 0
          })
        ]
      }

      return options
    }
  })
</script>
