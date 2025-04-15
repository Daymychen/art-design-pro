<template>
  <div class="line-chart-card art-custom-card" :style="{ height: `${height}rem` }">
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
        <div class="date" v-if="date" :class="{ 'is-mini-chart': isMiniChart }">
          {{ date }}
        </div>
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
  import * as echarts from 'echarts'
  import { getCssVariable, hexToRgba } from '@/utils/colors'
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
    showAreaColor?: boolean
    chartData: number[]
    isMiniChart?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 0,
    label: '',
    percentage: 0,
    date: '',
    height: 11,
    color: '',
    showAreaColor: false,
    chartData: () => [],
    isMiniChart: false
  })

  const options: () => EChartsOption = () => {
    const computedColor = props.color || useChartOps().themeColor

    return {
      grid: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      xAxis: {
        type: 'category',
        show: false,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: props.chartData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
            color: computedColor
          },
          areaStyle: props.showAreaColor
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: props.color
                      ? hexToRgba(props.color, 0.2).rgba
                      : hexToRgba(getCssVariable('--el-color-primary'), 0.2).rgba
                  },
                  {
                    offset: 1,
                    color: props.color
                      ? hexToRgba(props.color, 0.01).rgba
                      : hexToRgba(getCssVariable('--el-color-primary'), 0.01).rgba
                  }
                ])
              }
            : undefined
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
  .line-chart-card {
    position: relative;
    overflow: hidden;
    background-color: var(--art-main-bg-color);
    border-radius: var(--custom-radius);

    .chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 20px 20px 0;
      margin-bottom: 10px;
    }

    .metric {
      .value {
        font-size: 1.7rem;
        font-weight: 500;
        line-height: 1;
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
      box-sizing: border-box;
      width: 100%;
      height: 90px;

      &.is-mini-chart {
        position: absolute;
        top: 25px;
        right: 40px;
        left: auto;
        width: 40%;
        height: 60px !important;
      }
    }
  }
</style>
