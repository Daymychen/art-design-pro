<template>
  <div class="custom-card visitor-insights">
    <div class="custom-card-header">
      <span class="title custom-text">Visitor Insights</span>
    </div>
    <div class="card-body">
      <div ref="chartRef" style="height: 250px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { useSettingStore } from '@/store/modules/setting'

  const store = useSettingStore()
  const isDark = computed(() => store.isDark)

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)
  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)
  const { width } = useWindowSize()

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  const getChartOption = computed(() => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 20,
        right: 20,
        bottom: width.value < 600 ? 80 : 40,
        left: 20,
        containLabel: true
      },
      legend: {
        data: ['Loyal Customers', 'New Customers', 'Unique Customers'],
        bottom: 0,
        left: 'center',
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          fontSize: 12,
          color: isDark.value ? '#808290' : '#222B45'
        },
        icon: 'roundRect',
        itemStyle: {
          borderRadius: 4
        }
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: isDark.value ? '#808290' : '#7B91B0' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
            width: 0.8
          }
        },
        axisLabel: { color: isDark.value ? '#808290' : '#7B91B0' }
      },
      series: [
        {
          name: 'Loyal Customers',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [260, 200, 150, 130, 180, 270, 340, 380, 300, 220, 170, 130],
          lineStyle: {
            color: '#EF4444',
            width: 3
          },
          itemStyle: {
            color: '#EF4444'
          }
        },
        {
          name: 'New Customers',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [280, 350, 300, 250, 230, 210, 240, 280, 320, 350, 300, 200],
          lineStyle: {
            color: '#3CD856',
            width: 3
          },
          itemStyle: {
            color: '#3CD856'
          }
        },
        {
          name: 'Unique Customers',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [340, 330, 270, 200, 180, 220, 270, 310, 290, 250, 210, 130],
          lineStyle: {
            color: '#A700FF',
            width: 3
          },
          itemStyle: {
            color: '#A700FF'
          }
        }
      ]
    }
  })

  watch(isDark, () => {
    setOptions(getChartOption.value)
  })

  onMounted(() => {
    setOptions(getChartOption.value)
  })

  onUnmounted(() => {
    removeResize()
  })
</script>

<style lang="scss" scoped>
  .visitor-insights {
    height: 330px;
  }

  @media (max-width: $device-notebook) {
    .visitor-insights {
      height: 280px;

      .card-body {
        > div {
          height: 210px !important;
        }
      }
    }
  }

  @media (max-width: $device-phone) {
    .visitor-insights {
      height: 315px;

      .card-body {
        > div {
          height: 240px !important;
        }
      }
    }
  }
</style>
