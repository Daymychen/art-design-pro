<template>
  <div ref="chartRef" class="ring-chart" :style="{ height: props.height }"></div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from 'echarts'
  import { useChart, useChartOps } from '@/composables/useChart'
  const { chartRef, initChart, isDark } = useChart()

  interface Props {
    data?: Array<{ value: number; name: string }>
    height?: string
    color?: string[]
    radius?: string[]
    borderRadius?: number
    centerText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [
      { value: 35, name: '分类1' },
      { value: 25, name: '分类2' },
      { value: 20, name: '分类3' },
      { value: 20, name: '分类4' }
    ],
    height: useChartOps().chartHeight,
    color: () => [],
    radius: () => ['50%', '80%'],
    borderRadius: 10,
    centerText: ''
  })

  const options: () => EChartsOption = () => {
    const opt: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'
      },
      series: [
        {
          name: '数据占比',
          type: 'pie',
          radius: props.radius,
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: props.borderRadius
          },
          label: {
            show: false,
            formatter: '{b}\n{d}%',
            position: 'outside',
            color: '#999'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 25,
            smooth: true
          },
          data: props.data,
          color: props.color
        }
      ]
    }

    if (props.centerText) {
      opt.title = {
        text: props.centerText,
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 500,
          color: '#ADB0BC'
        }
      }
    }

    return opt
  }

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    initChart(options())
  })
</script>
