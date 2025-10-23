<!-- 雷达图 -->
<template>
  <div
    ref="chartRef"
    class="relative w-full"
    :style="{ height: props.height }"
    v-loading="props.loading"
  ></div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from '@/utils/echarts'
  import { useChartOps, useChartComponent } from '@/composables/useChart'
  import type { RadarChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtRadarChart' })

  const props = withDefaults(defineProps<RadarChartProps>(), {
    // 基础配置
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    // 数据配置
    indicator: () => [],
    data: () => [],

    // 交互配置
    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  // 使用新的图表组件抽象
  const { chartRef, isDark, getAnimationConfig, getTooltipStyle } = useChartComponent({
    props,
    checkEmpty: () => {
      return !props.data?.length || props.data.every((item) => item.value.every((val) => val === 0))
    },
    watchSources: [() => props.data, () => props.indicator, () => props.colors],
    generateOptions: (): EChartsOption => {
      return {
        tooltip: props.showTooltip ? getTooltipStyle('item') : undefined,
        radar: {
          indicator: props.indicator,
          center: ['50%', '50%'],
          radius: '70%',
          axisName: {
            color: isDark.value ? '#ccc' : '#666',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: isDark.value ? '#444' : '#e6e6e6'
            }
          },
          axisLine: {
            lineStyle: {
              color: isDark.value ? '#444' : '#e6e6e6'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: isDark.value
                ? ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']
                : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.05)']
            }
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
                color: props.colors[index % props.colors.length]
              },
              itemStyle: {
                color: props.colors[index % props.colors.length]
              },
              areaStyle: {
                color: props.colors[index % props.colors.length],
                opacity: 0.1
              },
              emphasis: {
                areaStyle: {
                  opacity: 0.25
                },
                lineStyle: {
                  width: 3
                }
              }
            })),
            ...getAnimationConfig(200, 1800)
          }
        ]
      }
    }
  })
</script>
