<template>
  <div class="card art-custom-card">
    <div class="chart" ref="chartRef"></div>
    <div class="text">
      <h3 class="box-title">用户概述</h3>
      <p class="subtitle">比上周 <span class="text-success">+23%</span></p>
      <p class="subtitle">我们为您创建了多个选项，可将它们组合在一起并定制为像素完美的页面</p>
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index">
        <p>{{ item.num }}</p>
        <p class="subtitle">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import { getCssVar } from '@/utils/ui'
  import { useChart } from '@/composables/useChart'
  import { EChartsOption } from 'echarts'

  const {
    chartRef,
    isDark,
    initChart,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle
  } = useChart()

  const list = [
    { name: '总用户量', num: '32k' },
    { name: '总访问量', num: '128k' },
    { name: '日访问量', num: '1.2k' },
    { name: '周同比', num: '+5%' }
  ]

  const options: () => EChartsOption = () => {
    return {
      grid: {
        top: 15,
        right: 0,
        bottom: 0,
        left: 0,
        containLabel: true
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        axisTick: getAxisTickStyle(),
        axisLine: getAxisLineStyle(true),
        axisLabel: getAxisLabelStyle(true)
      },
      yAxis: {
        axisLabel: getAxisLabelStyle(true),
        axisLine: getAxisLineStyle(!isDark.value),
        splitLine: getSplitLineStyle(true)
      },
      series: [
        {
          data: [160, 100, 150, 80, 190, 100, 175, 120, 160],
          type: 'bar',
          itemStyle: {
            borderRadius: 4,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: getCssVar('--el-color-primary-light-4')
              },
              {
                offset: 1,
                color: getCssVar('--el-color-primary')
              }
            ])
          },
          barWidth: '50%',
          animationDelay: (idx) => idx * 50 + 300,
          animationDuration: (idx) => 1500 - idx * 50,
          animationEasing: 'quarticOut' // 推荐动画： quarticOut exponentialOut quinticOut backOut
        }
      ]
    }
  }

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    initChart(options())
  })
</script>

<style lang="scss" scoped>
  .card {
    box-sizing: border-box;
    width: 100%;
    height: 420px;
    padding: 16px;

    .chart {
      box-sizing: border-box;
      width: 100%;
      height: 220px;
      padding: 20px 0 20px 20px;
      border-radius: calc(var(--custom-radius) / 2 + 4px) !important;
    }

    .text {
      margin-left: 3px;

      h3 {
        margin-top: 20px;
        font-size: 18px;
        font-weight: 500;
      }

      p {
        margin-top: 5px;
        font-size: 14px;

        &:last-of-type {
          height: 42px;
          margin-top: 5px;
        }
      }
    }

    .list {
      display: flex;
      justify-content: space-between;
      margin-left: 3px;

      > div {
        flex: 1;

        p {
          font-weight: 400;

          &:first-of-type {
            font-size: 24px;
            color: var(--art-gray-900);
          }

          &:last-of-type {
            font-size: 13px;
          }
        }
      }
    }
  }

  .dark {
    .card {
      .chart {
        background: none;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .dark {
      .card {
        .chart {
          padding: 15px 0 0 !important;
        }
      }
    }
  }
</style>
