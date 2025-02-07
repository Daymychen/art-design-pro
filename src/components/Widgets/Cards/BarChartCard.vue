<template>
  <div class="bar-chart-card art-custom-card" :style="{ height: `${height}rem` }">
    <div class="card-body">
      <div class="chart-header">
        <div class="metric">
          <p class="value custom-text">{{ value }}</p>
          <p class="label custom-text">{{ label }}</p>
        </div>
        <div class="percentage custom-text" :class="{ 'is-increase': percentage > 0 }">
          {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
        </div>
      </div>
      <div
        ref="chartRef"
        class="chart-container"
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
    height?: number
    color?: string
    chartData: number[]
    barWidth?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 0,
    label: '',
    percentage: 0,
    height: 11,
    color: '',
    chartData: () => [],
    barWidth: '26%'
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
    }

    .chart-container {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      width: calc(100% - 22px);
      height: 100px;
      margin: auto;
    }
  }
</style>
