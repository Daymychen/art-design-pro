<template>
  <div class="custom-card sales-mapping-country">
    <div class="custom-card-header">
      <span class="title custom-text">Sales Mapping by Country</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" class="sales-mapping-chart"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useECharts } from '@/utils/echarts/useECharts'
  import type { EChartsOption } from 'echarts'
  import { useSettingStore } from '@/store/modules/setting'

  const chartRef = ref<HTMLDivElement>()
  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)

  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  const chartData = [
    { value: 1048, name: 'Beijing', itemStyle: { color: 'rgba(99, 102, 241, 0.9)' } },
    { value: 735, name: 'Shanghai', itemStyle: { color: 'rgba(134, 239, 172, 0.9)' } },
    { value: 580, name: 'Guangzhou', itemStyle: { color: 'rgba(253, 224, 71, 0.9)' } },
    { value: 484, name: 'Shenzhen', itemStyle: { color: 'rgba(248, 113, 113, 0.9)' } },
    { value: 300, name: 'Chengdu', itemStyle: { color: 'rgba(125, 211, 252, 0.9)' } }
  ]

  const initChart = () => {
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Sales Mapping',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ]
    }
    setOptions(option)
  }

  onMounted(() => {
    initChart()
  })

  onUnmounted(() => {
    removeResize()
  })
</script>

<style lang="scss" scoped>
  .sales-mapping-country {
    height: 330px;

    .sales-mapping-chart {
      width: 100%;
      height: 260px;
    }
  }
</style>
