<template>
  <div class="custom-card art-custom-card sales-mapping-country">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.salesMappingCountry.title') }}</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" class="sales-mapping-chart"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { EChartsOption } from 'echarts'
  import { useChart } from '@/composables/useChart'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const { chartRef, initChart, isDark } = useChart()

  const chartData = [
    { value: 1048, name: 'Beijing', itemStyle: { color: 'rgba(99, 102, 241, 0.9)' } },
    { value: 735, name: 'Shanghai', itemStyle: { color: 'rgba(134, 239, 172, 0.9)' } },
    { value: 580, name: 'Guangzhou', itemStyle: { color: 'rgba(253, 224, 71, 0.9)' } },
    { value: 484, name: 'Shenzhen', itemStyle: { color: 'rgba(248, 113, 113, 0.9)' } },
    { value: 300, name: 'Chengdu', itemStyle: { color: 'rgba(125, 211, 252, 0.9)' } }
  ]

  const options: () => EChartsOption = () => ({
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
  })

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    initChart(options())
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
