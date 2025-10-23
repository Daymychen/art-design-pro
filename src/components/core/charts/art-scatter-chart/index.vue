<!-- 散点图 -->
<template>
  <div
    ref="chartRef"
    class="relative w-full"
    :style="{ height: props.height }"
    v-loading="props.loading"
  >
  </div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from '@/utils/echarts'
  import { getCssVar } from '@/utils/ui'
  import { useChartOps, useChartComponent } from '@/composables/useChart'
  import type { ScatterChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtScatterChart' })

  const props = withDefaults(defineProps<ScatterChartProps>(), {
    // 基础配置
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    // 数据配置
    data: () => [{ value: [0, 0] }, { value: [0, 0] }],
    symbolSize: 14,

    // 轴线显示配置
    showAxisLabel: true,
    showAxisLine: true,
    showSplitLine: true,

    // 交互配置
    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  // 使用新的图表组件抽象
  const {
    chartRef,
    isDark,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle,
    getAnimationConfig,
    getTooltipStyle
  } = useChartComponent({
    props,
    checkEmpty: () => {
      return !props.data?.length || props.data.every((item) => item.value.every((val) => val === 0))
    },
    watchSources: [() => props.data, () => props.colors, () => props.symbolSize],
    generateOptions: (): EChartsOption => {
      const computedColor = props.colors[0] || getCssVar('--el-color-primary')

      return {
        grid: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
          containLabel: true
        },
        tooltip: props.showTooltip
          ? getTooltipStyle('item', {
              formatter: (params: { value: [number, number] }) => {
                const [x, y] = params.value
                return `X: ${x}<br/>Y: ${y}`
              }
            })
          : undefined,
        xAxis: {
          type: 'value',
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisTick: getAxisTickStyle(),
          splitLine: getSplitLineStyle(props.showSplitLine)
        },
        yAxis: {
          type: 'value',
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisTick: getAxisTickStyle(),
          splitLine: getSplitLineStyle(props.showSplitLine)
        },
        series: [
          {
            type: 'scatter',
            data: props.data,
            symbolSize: props.symbolSize,
            itemStyle: {
              color: computedColor,
              shadowBlur: 6,
              shadowColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              shadowOffsetY: 2
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 12,
                shadowColor: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
              },
              scale: true
            },
            ...getAnimationConfig()
          }
        ]
      }
    }
  })
</script>
