<template>
  <div class="card art-custom-card">
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
  import * as echarts from 'echarts'
  import { hexToRgba, getCssVar } from '@/utils/ui'
  import { EChartsOption } from 'echarts'
  import { useChart } from '@/composables/useChart'

  const {
    chartRef,
    isDark,
    initChart,
    updateChart,
    getAxisLabelStyle,
    getAxisLineStyle,
    getAxisTickStyle,
    getSplitLineStyle
  } = useChart()

  // 定义真实数据
  const realData = [50, 25, 40, 20, 70, 35, 65, 30, 35, 20, 40, 44]

  // 初始化动画函数
  const initChartWithAnimation = () => {
    // 首先初始化图表，数据为0
    initChart(options(true))
    updateChart(options(false))
  }

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    initChartWithAnimation()
  })

  const options: (isInitial?: boolean) => EChartsOption = (isInitial) => {
    const isInit = isInitial || false
    return {
      // 添加动画配置
      animation: true,
      animationDuration: 0,
      animationDurationUpdate: 0,
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
        type: 'value',
        min: 0,
        max: realData.reduce((prev, curr) => Math.max(prev, curr), 0),
        axisLabel: getAxisLabelStyle(true),
        axisLine: getAxisLineStyle(!isDark.value),
        splitLine: getSplitLineStyle(true)
      },
      series: [
        {
          name: '访客',
          color: getCssVar('--main-color'),
          type: 'line',
          stack: '总量',
          data: isInit ? new Array(12).fill(0) : realData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2.2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: hexToRgba(getCssVar('--el-color-primary'), 0.15).rgba
              },
              {
                offset: 1,
                color: hexToRgba(getCssVar('--el-color-primary'), 0.01).rgba
              }
            ])
          },
          animationDuration: 0,
          animationDurationUpdate: 1500
        }
      ]
    }
  }
</script>

<style lang="scss" scoped>
  .card {
    box-sizing: border-box;
    width: 100%;
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
