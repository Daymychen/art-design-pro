<!-- 环型图卡片 -->
<template>
  <div class="art-card overflow-hidden" :style="{ height: `${height}rem` }">
    <div class="flex box-border h-full p-5 pr-2">
      <div class="flex w-full items-start gap-5">
        <div class="flex-b h-full flex-1 flex-col">
          <p class="m-0 text-xl font-medium leading-tight text-g-900">
            {{ title }}
          </p>
          <div>
            <p class="m-0 mt-2.5 text-xl font-medium leading-tight text-g-900">
              {{ formatNumber(value) }}
            </p>
            <div
              class="mt-1.5 text-xs font-medium"
              :class="percentage > 0 ? 'text-success' : 'text-danger'"
            >
              {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
              <span v-if="percentageLabel">{{ percentageLabel }}</span>
            </div>
          </div>
          <div class="mt-2 flex gap-4 text-xs text-g-600">
            <div v-if="currentValue" class="flex-cc">
              <div class="size-2 bg-theme/100 rounded mr-2"></div>
              {{ currentValue }}
            </div>
            <div v-if="previousValue" class="flex-cc">
              <div class="size-2 bg-g-400 rounded mr-2"></div>
              {{ previousValue }}
            </div>
          </div>
        </div>
        <div class="flex-c h-full max-w-40 flex-1">
          <div ref="chartRef" class="h-30 w-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type EChartsOption } from '@/plugins/echarts'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'

  defineOptions({ name: 'ArtDonutChartCard' })

  interface Props {
    /** 数值 */
    value: number
    /** 标题 */
    title: string
    /** 百分比 */
    percentage: number
    /** 百分比标签 */
    percentageLabel?: string
    /** 当前年份 */
    currentValue?: string
    /** 去年年份 */
    previousValue?: string
    /** 高度 */
    height?: number
    /** 颜色 */
    color?: string
    /** 半径 */
    radius?: [string, string]
    /** 数据 */
    data: [number, number]
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 9,
    radius: () => ['70%', '90%'],
    data: () => [0, 0]
  })

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // 使用新的图表组件抽象
  const { chartRef } = useChartComponent({
    props: {
      height: `${props.height}rem`,
      loading: false,
      isEmpty: props.data.every((val) => val === 0)
    },
    checkEmpty: () => props.data.every((val) => val === 0),
    watchSources: [
      () => props.data,
      () => props.color,
      () => props.radius,
      () => props.currentValue,
      () => props.previousValue
    ],
    generateOptions: (): EChartsOption => {
      const computedColor = props.color || useChartOps().themeColor

      return {
        series: [
          {
            type: 'pie',
            radius: props.radius,
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            data: [
              {
                value: props.data[0],
                name: props.currentValue,
                itemStyle: { color: computedColor }
              },
              {
                value: props.data[1],
                name: props.previousValue,
                itemStyle: { color: '#e6e8f7' }
              }
            ]
          }
        ]
      }
    }
  })
</script>
