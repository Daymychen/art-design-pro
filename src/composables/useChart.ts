import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { ref, watch, nextTick, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '@/store/modules/setting'
import { getCssVar } from '@/utils/ui'

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
  themeColor: getCssVar('--el-color-primary-light-1')
})

interface UseChartOptions {
  /** 初始化选项 */
  initOptions?: EChartsOption
  /** 延迟初始化时间(ms) */
  initDelay?: number
  /** IntersectionObserver阈值 */
  threshold?: number
  /** 是否自动响应主题变化 */
  autoTheme?: boolean
}

export function useChart(options: UseChartOptions = {}) {
  const { initOptions, initDelay = 0, threshold = 0.1, autoTheme = true } = options

  const settingStore = useSettingStore()
  const { isDark, menuOpen, menuType } = storeToRefs(settingStore)

  const chartRef = ref<HTMLElement>()
  let chart: echarts.ECharts | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let pendingOptions: EChartsOption | null = null
  let resizeTimeoutId: number | null = null
  let resizeFrameId: number | null = null
  let isDestroyed = false

  // 使用 requestAnimationFrame 优化 resize 处理
  const requestAnimationResize = () => {
    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId)
    }
    resizeFrameId = requestAnimationFrame(() => {
      handleResize()
      resizeFrameId = null
    })
  }

  // 防抖的resize处理（用于窗口resize事件）
  const debouncedResize = () => {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId)
    }
    resizeTimeoutId = window.setTimeout(() => {
      requestAnimationResize()
      resizeTimeoutId = null
    }, 100)
  }

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    // 立即调用一次，快速响应
    nextTick(() => {
      requestAnimationResize()
    })

    // 使用更短的延迟时间，确保图表正确适应宽度变化
    const delays = [50, 100, 200, 350]
    delays.forEach((delay) => {
      setTimeout(() => {
        requestAnimationResize()
      }, delay)
    })
  })

  // 菜单类型变化触发
  watch(menuType, () => {
    // 立即调用一次，快速响应
    nextTick(() => {
      requestAnimationResize()
    })

    // 菜单类型变化也使用多延迟处理
    setTimeout(() => {
      const delays = [50, 100, 200]
      delays.forEach((delay) => {
        setTimeout(() => {
          requestAnimationResize()
        }, delay)
      })
    }, 0)
  })

  // 主题变化时重新设置图表选项
  if (autoTheme) {
    watch(isDark, () => {
      if (chart && !isDestroyed) {
        // 使用 requestAnimationFrame 优化主题更新
        requestAnimationFrame(() => {
          if (chart && !isDestroyed) {
            const currentOptions = chart.getOption()
            if (currentOptions) {
              updateChart(currentOptions as EChartsOption)
            }
          }
        })
      }
    })
  }

  // 坐标轴线样式
  const getAxisLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: {
      color: isDark.value ? '#444' : '#EDEDED',
      width: 1
    }
  })

  // 分割线样式
  const getSplitLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: {
      color: isDark.value ? '#444' : '#EDEDED',
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

  // 创建IntersectionObserver
  const createIntersectionObserver = () => {
    if (intersectionObserver || !chartRef.value) return

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && pendingOptions && !isDestroyed) {
            // 使用 requestAnimationFrame 确保在下一帧初始化图表
            requestAnimationFrame(() => {
              if (!isDestroyed && pendingOptions) {
                try {
                  // 元素变为可见，初始化图表
                  if (!chart) {
                    chart = echarts.init(entry.target as HTMLElement)
                  }
                  chart.setOption(pendingOptions)
                  pendingOptions = null

                  // 清理观察器
                  cleanupIntersectionObserver()
                } catch (error) {
                  console.error('图表初始化失败:', error)
                }
              }
            })
          }
        })
      },
      { threshold }
    )

    intersectionObserver.observe(chartRef.value)
  }

  // 清理IntersectionObserver
  const cleanupIntersectionObserver = () => {
    if (intersectionObserver) {
      intersectionObserver.disconnect()
      intersectionObserver = null
    }
  }

  // 检查容器是否可见
  const isContainerVisible = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
  }

  // 初始化图表
  const initChart = (options: EChartsOption = {}) => {
    if (!chartRef.value || isDestroyed) return

    const mergedOptions = { ...initOptions, ...options }

    try {
      if (isContainerVisible(chartRef.value)) {
        // 容器可见，正常初始化
        const initFn = () => {
          if (!chart && chartRef.value && !isDestroyed) {
            chart = echarts.init(chartRef.value)
          }
          if (chart && !isDestroyed) {
            chart.setOption(mergedOptions)
            pendingOptions = null
          }
        }

        if (initDelay > 0) {
          setTimeout(initFn, initDelay)
        } else {
          initFn()
        }
      } else {
        // 容器不可见，保存选项并设置监听器
        pendingOptions = mergedOptions
        createIntersectionObserver()
      }
    } catch (error) {
      console.error('图表初始化失败:', error)
    }
  }

  // 更新图表
  const updateChart = (options: EChartsOption) => {
    if (isDestroyed) return

    try {
      if (!chart) {
        // 如果图表不存在，先初始化
        initChart(options)
        return
      }
      chart.setOption(options)
    } catch (error) {
      console.error('图表更新失败:', error)
    }
  }

  // 处理窗口大小变化
  const handleResize = () => {
    if (chart && !isDestroyed) {
      try {
        chart.resize()
      } catch (error) {
        console.error('图表resize失败:', error)
      }
    }
  }

  // 销毁图表
  const destroyChart = () => {
    isDestroyed = true

    if (chart) {
      try {
        chart.dispose()
      } catch (error) {
        console.error('图表销毁失败:', error)
      } finally {
        chart = null
      }
    }

    cleanupIntersectionObserver()

    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId)
      resizeTimeoutId = null
    }

    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId)
      resizeFrameId = null
    }

    pendingOptions = null
  }

  // 获取图表实例
  const getChartInstance = () => chart

  // 获取图表是否已初始化
  const isChartInitialized = () => chart !== null

  onMounted(() => {
    window.addEventListener('resize', debouncedResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debouncedResize)
  })

  onUnmounted(() => {
    destroyChart()
  })

  return {
    isDark,
    chartRef,
    initChart,
    updateChart,
    handleResize,
    destroyChart,
    getChartInstance,
    isChartInitialized,
    getAxisLineStyle,
    getSplitLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    useChartOps
  }
}
