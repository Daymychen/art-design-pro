<!-- 环型图卡片 -->
<template>
  <div class="donut-chart-card art-custom-card" :style="{ height: `${height}rem` }">
    <div class="card-body">
      <div class="card-content">
        <div class="data-section">
          <p class="title">{{ title }}</p>
          <div>
            <p class="value">{{ formatNumber(value) }}</p>
            <div class="percentage" :class="{ 'is-increase': percentage > 0 }">
              {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
              <span v-if="percentageLabel">{{ percentageLabel }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item current" v-if="currentValue">{{ currentValue }}</span>
            <span class="legend-item previous" v-if="previousValue">{{ previousValue }}</span>
          </div>
        </div>
        <div class="chart-section">
          <div ref="chartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { EChartsOption } from 'echarts'
  import { useChartOps, useChartComponent } from '@/composables/useChart'

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

<style lang="scss" scoped>
  .donut-chart-card {
    overflow: hidden;
    color: #303133;
    background-color: var(--art-main-bg-color);
    border-radius: var(--custom-radius);
    transition: 0.3s;

    .card-body {
      box-sizing: border-box;
      display: flex;
      height: 100%;
      padding: 20px;
    }

    .card-content {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      width: 100%;
    }

    .data-section {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .chart-section {
      display: flex;
      flex: 1;
      align-items: center;
      max-width: 200px;
      height: 100%;
    }

    .title {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
      color: var(--art-text-gray-900);
    }

    .value {
      margin: 0;
      margin-top: 10px;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
      color: var(--art-text-gray-900);
    }

    .percentage {
      margin-top: 5px;
      font-size: 12px;
      font-weight: 500;
      color: #f56c6c;

      &.is-increase {
        color: #67c23a;
      }
    }

    .chart-container {
      width: 100%;
      height: 120px;
    }

    .chart-legend {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      font-size: 12px;
      color: #909399;

      .legend-item {
        position: relative;
        padding-left: 16px;

        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          width: 8px;
          height: 8px;
          content: '';
          border-radius: 50%;
          transform: translateY(-50%);
        }

        &.current::before {
          background-color: var(--main-color);
        }

        &.previous::before {
          background-color: #e6e8f7;
        }
      }
    }
  }
</style>
