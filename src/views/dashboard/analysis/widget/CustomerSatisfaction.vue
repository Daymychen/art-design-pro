<template>
  <div class="custom-card art-custom-card customer-satisfaction">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.customerSatisfaction.title') }}</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" style="height: 300px; margin-top: 10px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
  import { useECharts } from '@/utils/echarts/useECharts'
  import * as echarts from 'echarts'
  import { useSettingStore } from '@/store/modules/setting'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const store = useSettingStore()
  const isDark = computed(() => store.isDark)

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)

  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)

  // 监听 isDark 的变化
  watch(
    isDark,
    () => {
      updateChart()
    },
    { immediate: true }
  )

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  function updateChart() {
    if (chartRef.value) {
      const option = {
        grid: {
          top: 30,
          right: 20,
          bottom: 50,
          left: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          confine: true
        },
        legend: {
          data: [
            t('analysis.customerSatisfaction.legend.lastMonth'),
            t('analysis.customerSatisfaction.legend.thisMonth')
          ],
          bottom: 0,
          textStyle: {
            fontSize: 12,
            color: isDark.value ? '#808290' : '#222B45'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false } // 隐藏 x 轴标签
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: {
            show: false // 将 show 设置为 false 以去除水平线条
          }
        },
        series: [
          {
            name: t('analysis.customerSatisfaction.legend.lastMonth'),
            type: 'line',
            smooth: true,
            data: [1800, 2800, 1800, 2300, 2600, 2500, 3500],
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0,157,255,0.33)' },
                { offset: 1, color: 'rgba(255,255,255,0)' }
              ])
            },
            lineStyle: {
              width: 2,
              color: '#0086E1'
            },
            symbol: 'none',
            itemStyle: {
              color: '#0095FF'
            }
          },
          {
            name: t('analysis.customerSatisfaction.legend.thisMonth'),
            type: 'line',
            smooth: true,
            data: [4800, 3500, 4300, 3700, 4500, 3500, 5500],
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(7,224,152,0.33)' },
                { offset: 1, color: 'rgba(255,255,255,0)' }
              ])
            },
            lineStyle: {
              width: 2,
              color: '#04C283'
            },
            symbol: 'none',
            itemStyle: {
              color: '#07E098'
            }
          }
        ]
      }

      setOptions(option)
    }
  }

  onMounted(() => {
    updateChart()
  })

  onUnmounted(() => {
    removeResize()
  })
</script>
<style lang="scss" scoped>
  .custom-card {
    height: 400px;

    &-body {
      padding: 10px 0;
    }
  }

  @media (max-width: $device-notebook) {
    .custom-card {
      height: 350px;

      &-body {
        > div {
          height: 260px !important;
        }
      }
    }
  }
</style>
