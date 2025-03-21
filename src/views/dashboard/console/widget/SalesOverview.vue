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
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
  import echarts from '@/plugins/echarts'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { hexToRgba } from '@/utils/colors'
  import { useSettingStore } from '@/store/modules/setting'
  import { SystemThemeEnum } from '@/enums/appEnum'
  import { getCssVariable } from '@/utils/colors'

  const chartRef = ref<HTMLDivElement>()
  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)

  const store = useSettingStore()
  const theme = computed(() => store.systemThemeType)
  const isLight = computed(() => theme.value === SystemThemeEnum.LIGHT)
  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  onMounted(() => {
    createChart()
  })

  onUnmounted(() => {
    removeResize()
  })
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
        axisLabel: {
          show: true,
          color: '#999',
          margin: 20,
          interval: 0,
          fontSize: 13
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
          fontSize: 13
        },
        axisLine: {
          show: isLight.value ? true : false,
          lineStyle: {
            color: '#E8E8E8',
            width: 1
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isLight.value ? '#e8e8e8' : '#444',
            width: 1,
            type: 'dashed'
          }
        }
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
    })
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
