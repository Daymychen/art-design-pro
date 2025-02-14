<template>
  <div class="custom-card art-custom-card volume-service-level">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.volumeServiceLevel.title') }}</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const store = useSettingStore()
  const isDark = computed(() => store.isDark)

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>)

  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  // 模拟数据
  const chartData = [
    { volume: 800, services: 400 },
    { volume: 1000, services: 600 },
    { volume: 750, services: 300 },
    { volume: 600, services: 250 },
    { volume: 450, services: 200 },
    { volume: 500, services: 300 }
  ]

  // 将图表选项提取为一个计算属性
  const chartOption = computed(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: [
        t('analysis.volumeServiceLevel.legend.volume'),
        t('analysis.volumeServiceLevel.legend.services')
      ],
      bottom: 20,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: {
        fontSize: 12,
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    grid: {
      left: '20',
      right: '20',
      bottom: '60',
      top: '30',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map((_, index) => `${index + 1}`),
      axisLine: {
        show: true,
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          width: 0.8
        }
      },
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false }
    },
    series: [
      {
        name: t('analysis.volumeServiceLevel.legend.volume'),
        type: 'bar',
        stack: 'total',
        data: chartData.map((item) => item.volume),
        itemStyle: {
          color: '#0095FF',
          borderRadius: [0, 0, 4, 4]
        },
        barWidth: '15'
      },
      {
        name: t('analysis.volumeServiceLevel.legend.services'),
        type: 'bar',
        stack: 'total',
        data: chartData.map((item) => item.services),
        itemStyle: {
          color: '#00E096',
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '50%'
      }
    ]
  }))

  // 监听 isDark 的变化
  watch(isDark, () => {
    setOptions(chartOption.value)
  })

  onMounted(() => {
    setOptions(chartOption.value)
  })
</script>

<style lang="scss" scoped>
  .volume-service-level {
    height: 330px;

    .custom-card-body {
      padding: 20px;
    }

    .chart-container {
      height: 250px;
    }
  }
</style>
