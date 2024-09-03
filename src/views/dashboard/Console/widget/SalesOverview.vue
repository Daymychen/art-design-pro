<template>
  <div class="region sales-overview console-box">
    <div class="card-header">
      <div class="title">
        <h4>销售概述</h4>
        <p>今年增长<span>+15%</span></p>
      </div>
    </div>
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<script lang="ts">
  import echarts from '@/plugins/echarts'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { hexToRgba } from '@/utils/utils'
  import { useSettingStore } from '@/store/modules/setting'
  import { SystemThemeEnum } from '@/enums/appEnum'

  export default defineComponent({
    setup() {
      const chartRef = ref<HTMLDivElement>()
      const { setOptions, removeResize } = useECharts(chartRef as Ref<HTMLDivElement>)

      const store = useSettingStore()
      const theme = computed(() => store.systemThemeType)
      const isLight = theme.value === SystemThemeEnum.LIGHT

      onMounted(() => {
        createChart()
      })

      onUnmounted(() => {
        removeResize()
      })

      const getCssVariable = (str: string) => {
        return getComputedStyle(document.documentElement).getPropertyValue(str)
      }

      const createChart = () => {
        setOptions({
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
            data: ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
            axisLabel: {
              show: true,
              color: '#999',
              // rotate: 30,
              margin: 20,
              interval: 0,
              fontSize: 13,
              fontWeight: 'bold'
            },
            axisLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              color: '#999',
              fontSize: 13,
              fontWeight: 'bold'
            },
            axisLine: {
              show: isLight ? true : false,
              lineStyle: {
                color: '#E8E8E8',
                width: 1
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: isLight ? '#e8e8e8' : '#333',
                width: 1,
                type: 'dashed'
              }
            }
          },
          series: [
            {
              name: '销售',
              // color: '#2c90ff',
              color: getCssVariable('--main-color'),
              type: 'line',
              stack: '总量',
              data: [80, 40, 300, 200, 500, 250, 160, 304, 180],
              smooth: true,
              symbol: 'none', //去掉圆点
              itemStyle: {
                lineStyle: {
                  width: 2.6
                }
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    // color: 'rgba(44,144,255,0.1)'
                    // 跟随系统
                    color: hexToRgba(getCssVariable('--el-color-primary'), 0.2).rgba
                  },
                  {
                    offset: 1,
                    // color: 'rgba(44,144,255,0.01)'
                    // 跟随系统
                    color: hexToRgba(getCssVariable('--el-color-primary'), 0.01).rgba
                  }
                ])
              }
            }
          ]
        })
      }

      return {
        chartRef
      }
    }
  })
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
