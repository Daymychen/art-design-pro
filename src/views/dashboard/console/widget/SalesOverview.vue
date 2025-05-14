<template>
  <div class="region sales-overview art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">访问量</h4>
        <p class="subtitle">今年增长<span class="text-success">+15%</span></p>
      </div>
    </div>
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
  import echarts from '@/plugins/echarts'
  import { hexToRgba } from '@/utils/colors'
  import { getCssVariable } from '@/utils/colors'
  import { EChartsOption } from 'echarts'
  import { useChart } from '@/composables/useChart'

  const {
    chartRef,
    isDark,
    initChart,
    getAxisLabelStyle,
    getAxisLineStyle,
    getAxisTickStyle,
    getSplitLineStyle
  } = useChart()

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    initChart(options())
  })

  const options: () => EChartsOption = () => {
    return {
      grid: {
        left: '2.2%',
        right: '3%',
        bottom: '0%',
        top: '5px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月'
        ],
        axisTick: getAxisTickStyle(),
        axisLabel: getAxisLabelStyle(true),
        axisLine: getAxisLineStyle(true)
      },
      yAxis: {
        axisLabel: getAxisLabelStyle(true),
        axisLine: getAxisLineStyle(!isDark.value),
        splitLine: getSplitLineStyle(true)
      },
      series: [
        {
          name: '访客',
          color: getCssVariable('--main-color'),
          type: 'line',
          stack: '总量',
          data: [50, 25, 40, 20, 70, 35, 65, 30, 35, 20, 40, 44],
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2.6
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: hexToRgba(getCssVariable('--el-color-primary'), 0.2).rgba
              },
              {
                offset: 1,
                color: hexToRgba(getCssVariable('--el-color-primary'), 0.01).rgba
              }
            ])
          }
        }
      ]
    }
  }
</script>

<style lang="scss" scoped>
  .region {
    box-sizing: border-box;
    width: calc(58% - var(--console-margin));
    height: 420px;
    padding: 20px 0 30px;

    .card-header {
      padding: 0 18px !important;
    }

    .chart {
      width: 100%;
      height: calc(100% - 80px);
      margin-top: 30px;
    }
  }
</style>
