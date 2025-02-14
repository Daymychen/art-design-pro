<template>
  <div class="custom-card art-custom-card total-revenue">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.totalRevenue.title') }}</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" style="height: 300px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
  import type { Ref } from 'vue'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { useSettingStore } from '@/store/modules/setting'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const store = useSettingStore()
  const isDark = computed(() => store.isDark)

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)
  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)

  // 监听菜单状态变化
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  // 创建图表选项
  const createChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 20,
      right: 3,
      bottom: 40,
      left: 3,
      containLabel: true
    },
    legend: {
      data: [
        t('analysis.totalRevenue.legend.onlineSales'),
        t('analysis.totalRevenue.legend.offlineSales')
      ],
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 15,
      textStyle: {
        fontSize: 12,
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: isDark.value ? '#808290' : '#7B91B0'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          width: 0.8
        }
      },
      axisLabel: { color: isDark.value ? '#808290' : '#7B91B0' }
    },
    series: [
      {
        name: t('analysis.totalRevenue.legend.onlineSales'),
        type: 'bar',
        data: [12, 13, 5, 15, 10, 15, 18],
        barWidth: '15',
        itemStyle: {
          color: '#0095FF',
          borderRadius: [4, 4, 4, 4]
        }
      },
      {
        name: t('analysis.totalRevenue.legend.offlineSales'),
        type: 'bar',
        data: [10, 11, 20, 5, 11, 13, 10],
        barWidth: '15',
        itemStyle: {
          color: '#00E096',
          borderRadius: [4, 4, 4, 4]
        }
      }
    ]
  })

  // 初始化图表
  const initChart = () => {
    if (chartRef.value) {
      const option = createChartOption()
      setOptions(option)
    }
  }

  onMounted(() => {
    initChart()
  })

  // 监听暗黑模式变化
  watch(
    isDark,
    () => {
      initChart()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    removeResize()
  })
</script>

<style lang="scss" scoped>
  .custom-card {
    height: 400px;

    &-body {
      padding: 20px;
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
