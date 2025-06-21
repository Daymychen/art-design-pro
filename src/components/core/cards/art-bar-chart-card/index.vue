<!-- 柱状图卡片 -->
<template>
  <div class="bar-chart-card art-custom-card" :style="{ height: `${height}rem` }">
    <div class="card-body">
      <div class="chart-header">
        <div class="metric">
          <p class="value">{{ value }}</p>
          <p class="label">{{ label }}</p>
        </div>
        <div
          class="percentage"
          :class="{ 'is-increase': percentage > 0, 'is-mini-chart': isMiniChart }"
        >
          {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
        </div>
        <div class="date" v-if="date" :class="{ 'is-mini-chart': isMiniChart }">{{ date }}</div>
      </div>
      <div
        ref="chartRef"
        class="chart-container"
        :class="{ 'is-mini-chart': isMiniChart }"
        :style="{ height: `calc(${height}rem - 5rem)` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useChartOps, useChartComponent } from '@/composables/useChart'
  import { EChartsOption } from 'echarts'

  defineOptions({ name: 'ArtBarChartCard' })

  interface Props {
    /** 数值 */
    value: number
    /** 标签 */
    label: string
    /** 百分比 +（绿色）-（红色） */
    percentage: number
    /** 日期 */
    date?: string
    /** 高度 */
    height?: number
    /** 颜色 */
    color?: string
    /** 图表数据 */
    chartData: number[]
    /** 柱状图宽度 */
    barWidth?: string
    /** 是否为迷你图表 */
    isMiniChart?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 11,
    barWidth: '26%'
  })

  // 使用新的图表组件抽象
  const { chartRef } = useChartComponent({
    props: {
      height: `${props.height}rem`,
      loading: false,
      isEmpty: !props.chartData?.length || props.chartData.every((val) => val === 0)
    },
    checkEmpty: () => !props.chartData?.length || props.chartData.every((val) => val === 0),
    watchSources: [() => props.chartData, () => props.color, () => props.barWidth],
    generateOptions: (): EChartsOption => {
      const computedColor = props.color || useChartOps().themeColor

      return {
        grid: {
          top: 0,
          right: 0,
          bottom: 15,
          left: 0
        },
        xAxis: {
          type: 'category',
          show: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            data: props.chartData,
            type: 'bar',
            barWidth: props.barWidth,
            itemStyle: {
              color: computedColor,
              borderRadius: 2
            }
          }
        ]
      }
    }
  })
</script>

<style lang="scss" scoped>
  .bar-chart-card {
    position: relative;
    overflow: hidden;
    color: #303133;
    background-color: var(--art-main-bg-color);
    border-radius: var(--custom-radius);
    transition: 0.3s;

    .chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 20px 20px 0;
      margin-bottom: 20px;
    }

    .metric {
      .value {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        line-height: 1.2;
        color: var(--art-text-gray-900);
      }

      .label {
        margin: 4px 0 0;
        font-size: 14px;
        color: var(--art-text-gray-600);
      }
    }

    .percentage {
      font-size: 14px;
      font-weight: 500;
      color: #f56c6c;

      &.is-increase {
        color: #67c23a;
      }

      &.is-mini-chart {
        position: absolute;
        bottom: 20px;
      }
    }

    .date {
      position: absolute;
      right: 20px;
      bottom: 20px;
      font-size: 12px;
      color: var(--art-text-gray-600);
    }

    .chart-container {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      width: calc(100% - 22px);
      height: 100px;
      margin: auto;

      &.is-mini-chart {
        position: absolute;
        inset: 25px 20px auto auto;
        width: 40%;
        height: 60px !important;
      }
    }
  }
</style>
