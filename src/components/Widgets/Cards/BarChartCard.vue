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
  import { useChart, useChartOps } from '@/composables/useChart'
  import { EChartsOption } from 'echarts'
  const { chartRef, isDark, initChart } = useChart()

  interface Props {
    value: number
    label: string
    percentage: number
    date?: string
    height?: number
    color?: string
    chartData: number[]
    barWidth?: string
    isMiniChart?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 0,
    label: '',
    percentage: 0,
    date: '',
    height: 11,
    color: '',
    chartData: () => [],
    barWidth: '26%',
    isMiniChart: false
  })

  const options: () => EChartsOption = () => {
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

  watch(isDark, () => {
    return initChart(options())
  })

  onMounted(() => {
    return initChart(options())
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
