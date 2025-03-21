import { onMounted, onUnmounted, ref, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useSettingStore } from '@/store/modules/setting'
import { SystemThemeEnum } from '@/enums/appEnum'
import { getCssVariable } from '@/utils/colors'

interface ChartThemeConfig {
  chartHeight: string
  fontSize: number
  fontColor: string
  themeColor: string
}

// 图表主题配置
export const useChartOps = (): ChartThemeConfig => ({
  chartHeight: '16rem',
  fontSize: 13,
  fontColor: '#999',
  themeColor: getCssVariable('--el-color-primary-light-1')
})

export function useChart(initOptions?: EChartsOption) {
  const theme = computed(() => useSettingStore().systemThemeType)
  const isDark = computed(() => theme.value === SystemThemeEnum.DARK)

  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(() => {
        handleResize()
      }, delay)
    })
  })

  // 坐标轴线样式
  const getAxisLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: {
      color: isDark.value ? '#444' : '#e8e8e8',
      width: 1
    }
  })

  // 分割线样式
  const getSplitLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: {
      color: isDark.value ? '#444' : '#e8e8e8',
      width: 1,
      type: 'dashed' as const
    }
  })

  // 坐标轴标签样式
  const getAxisLabelStyle = (show: boolean = true) => ({
    show,
    color: useChartOps().fontColor,
    fontSize: useChartOps().fontSize
  })

  // 坐标轴刻度样式
  const getAxisTickStyle = () => ({
    show: false
  })

  const chartRef = ref<HTMLElement>()
  let chart: echarts.ECharts | null = null

  const initChart = (options: EChartsOption = {}) => {
    if (!chartRef.value) return

    chart = echarts.init(chartRef.value)
    chart.setOption({ ...initOptions, ...options })
  }

  const updateChart = (options: EChartsOption) => {
    chart?.setOption(options)
  }

  const handleResize = () => {
    chart?.resize()
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    chart?.dispose()
    window.removeEventListener('resize', handleResize)
  })

  return {
    isDark,
    chartRef,
    initChart,
    updateChart,
    handleResize,
    getAxisLineStyle,
    getSplitLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    useChartOps
  }
}
