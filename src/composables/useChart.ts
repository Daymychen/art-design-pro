import { echarts, type EChartsOption } from '@/utils/echarts'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '@/store/modules/setting'
import { getCssVar } from '@/utils/ui'
import type { BaseChartProps, ChartThemeConfig, UseChartOptions } from '@/types/component/chart'

// 图表主题配置
export const useChartOps = (): ChartThemeConfig => ({
  /** */
  chartHeight: '16rem',
  /** 字体大小 */
  fontSize: 13,
  /** 字体颜色 */
  fontColor: '#999',
  /** 主题颜色 */
  themeColor: getCssVar('--el-color-primary-light-1'),
  /** 颜色组 */
  colors: [
    getCssVar('--el-color-primary-light-1'),
    '#4ABEFF',
    '#EDF2FF',
    '#14DEBA',
    '#FFAF20',
    '#FA8A6C',
    '#FFAF20'
  ]
})

// 常量定义
const RESIZE_DELAYS = [50, 100, 200, 350] as const
const MENU_RESIZE_DELAYS = [50, 100, 200] as const
const RESIZE_DEBOUNCE_DELAY = 100

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
  let emptyStateDiv: HTMLElement | null = null

  // 清理定时器的统一方法
  const clearTimers = () => {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId)
      resizeTimeoutId = null
    }
    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId)
      resizeFrameId = null
    }
  }

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
    }, RESIZE_DEBOUNCE_DELAY)
  }

  // 多延迟resize处理 - 统一方法
  const multiDelayResize = (delays: readonly number[]) => {
    // 立即调用一次，快速响应
    nextTick(requestAnimationResize)

    // 使用延迟时间，确保图表正确适应变化
    delays.forEach((delay) => {
      setTimeout(requestAnimationResize, delay)
    })
  }

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => multiDelayResize(RESIZE_DELAYS))

  // 菜单类型变化触发
  watch(menuType, () => {
    nextTick(requestAnimationResize)
    setTimeout(() => multiDelayResize(MENU_RESIZE_DELAYS), 0)
  })

  // 主题变化时重新设置图表选项
  if (autoTheme) {
    watch(isDark, () => {
      // 更新空状态样式
      emptyStateManager.updateStyle()

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

  // 样式生成器 - 统一的样式配置
  const createLineStyle = (color: string, width = 1, type?: 'solid' | 'dashed') => ({
    color,
    width,
    ...(type && { type })
  })

  // 坐标轴线样式
  const getAxisLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: createLineStyle(isDark.value ? '#444' : '#EDEDED')
  })

  // 分割线样式
  const getSplitLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: createLineStyle(isDark.value ? '#444' : '#EDEDED', 1, 'dashed')
  })

  // 坐标轴标签样式
  const getAxisLabelStyle = (show: boolean = true) => {
    const { fontColor, fontSize } = useChartOps()
    return {
      show,
      color: fontColor,
      fontSize
    }
  }

  // 坐标轴刻度样式
  const getAxisTickStyle = () => ({
    show: false
  })

  // 获取动画配置
  const getAnimationConfig = (animationDelay: number = 50, animationDuration: number = 1500) => ({
    animationDelay: (idx: number) => idx * animationDelay + 200,
    animationDuration: (idx: number) => animationDuration - idx * 50,
    animationEasing: 'quarticOut' as const
  })

  // 获取统一的 tooltip 配置
  const getTooltipStyle = (trigger: 'item' | 'axis' = 'axis', customOptions: any = {}) => ({
    trigger,
    backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark.value ? '#333' : '#ddd',
    borderWidth: 1,
    textStyle: {
      color: isDark.value ? '#fff' : '#333'
    },
    ...customOptions
  })

  // 获取统一的图例配置
  const getLegendStyle = (
    position: 'bottom' | 'top' | 'left' | 'right' = 'bottom',
    customOptions: any = {}
  ) => {
    const baseConfig = {
      textStyle: {
        color: isDark.value ? '#fff' : '#333'
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      ...customOptions
    }

    // 根据位置设置不同的配置
    switch (position) {
      case 'bottom':
        return {
          ...baseConfig,
          bottom: 0,
          left: 'center',
          orient: 'horizontal',
          icon: 'roundRect'
        }
      case 'top':
        return {
          ...baseConfig,
          top: 0,
          left: 'center',
          orient: 'horizontal',
          icon: 'roundRect'
        }
      case 'left':
        return {
          ...baseConfig,
          left: 0,
          top: 'center',
          orient: 'vertical',
          icon: 'roundRect'
        }
      case 'right':
        return {
          ...baseConfig,
          right: 0,
          top: 'center',
          orient: 'vertical',
          icon: 'roundRect'
        }
      default:
        return baseConfig
    }
  }

  // 根据图例位置计算 grid 配置
  const getGridWithLegend = (
    showLegend: boolean,
    legendPosition: 'bottom' | 'top' | 'left' | 'right' = 'bottom',
    baseGrid: any = {}
  ) => {
    const defaultGrid = {
      top: 15,
      right: 15,
      bottom: 8,
      left: 0,
      containLabel: true,
      ...baseGrid
    }

    if (!showLegend) {
      return defaultGrid
    }

    // 根据图例位置调整 grid
    switch (legendPosition) {
      case 'bottom':
        return {
          ...defaultGrid,
          bottom: 40
        }
      case 'top':
        return {
          ...defaultGrid,
          top: 40
        }
      case 'left':
        return {
          ...defaultGrid,
          left: 120
        }
      case 'right':
        return {
          ...defaultGrid,
          right: 120
        }
      default:
        return defaultGrid
    }
  }

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

                  // 触发自定义事件，让组件处理动画逻辑
                  const event = new CustomEvent('chartVisible', {
                    detail: { options: pendingOptions }
                  })
                  entry.target.dispatchEvent(event)

                  pendingOptions = null
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

  // 图表初始化核心逻辑
  const performChartInit = (options: EChartsOption) => {
    if (!chart && chartRef.value && !isDestroyed) {
      chart = echarts.init(chartRef.value)
    }
    if (chart && !isDestroyed) {
      chart.setOption(options)
      pendingOptions = null
    }
  }

  // 空状态管理器
  const emptyStateManager = {
    create: () => {
      if (!chartRef.value || emptyStateDiv) return

      emptyStateDiv = document.createElement('div')
      emptyStateDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: ${isDark.value ? '#666' : '#999'};
        background: transparent;
        z-index: 10;
      `
      emptyStateDiv.innerHTML = `<span>暂无数据</span>`

      // 确保父容器有相对定位
      if (
        chartRef.value.style.position !== 'relative' &&
        chartRef.value.style.position !== 'absolute'
      ) {
        chartRef.value.style.position = 'relative'
      }

      chartRef.value.appendChild(emptyStateDiv)
    },

    remove: () => {
      if (emptyStateDiv && chartRef.value) {
        chartRef.value.removeChild(emptyStateDiv)
        emptyStateDiv = null
      }
    },

    updateStyle: () => {
      if (emptyStateDiv) {
        emptyStateDiv.style.color = isDark.value ? '#666' : '#999'
      }
    }
  }

  // 初始化图表
  const initChart = (options: EChartsOption = {}, isEmpty: boolean = false) => {
    if (!chartRef.value || isDestroyed) return

    const mergedOptions = { ...initOptions, ...options }

    try {
      if (isEmpty) {
        // 处理空数据情况 - 显示自定义空状态div
        if (chart) {
          chart.clear()
        }
        emptyStateManager.create()
        return
      } else {
        // 有数据时移除空状态div
        emptyStateManager.remove()
      }

      if (isContainerVisible(chartRef.value)) {
        // 容器可见，正常初始化
        if (initDelay > 0) {
          setTimeout(() => performChartInit(mergedOptions), initDelay)
        } else {
          performChartInit(mergedOptions)
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

    // 清理空状态div
    emptyStateManager.remove()
    cleanupIntersectionObserver()
    clearTimers()
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
    emptyStateManager,
    getAxisLineStyle,
    getSplitLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    useChartOps,
    getGridWithLegend
  }
}

// 高级图表组件抽象
interface UseChartComponentOptions<T extends BaseChartProps> {
  /** Props响应式对象 */
  props: T
  /** 图表配置生成函数 */
  generateOptions: () => EChartsOption
  /** 空数据检查函数 */
  checkEmpty?: () => boolean
  /** 自定义监听的响应式数据 */
  watchSources?: (() => any)[]
  /** 自定义可视事件处理 */
  onVisible?: () => void
  /** useChart选项 */
  chartOptions?: UseChartOptions
}

export function useChartComponent<T extends BaseChartProps>(options: UseChartComponentOptions<T>) {
  const {
    props,
    generateOptions,
    checkEmpty,
    watchSources = [],
    onVisible,
    chartOptions = {}
  } = options

  const chart = useChart(chartOptions)
  const { chartRef, initChart, isDark, emptyStateManager } = chart

  // 检查是否为空数据
  const isEmpty = computed(() => {
    if (props.isEmpty) return true
    if (checkEmpty) return checkEmpty()
    return false
  })

  // 更新图表
  const updateChart = () => {
    nextTick(() => {
      if (isEmpty.value) {
        // 处理空数据情况 - 显示自定义空状态div
        if (chart.getChartInstance()) {
          chart.getChartInstance()?.clear()
        }
        emptyStateManager.create()
      } else {
        // 有数据时移除空状态div并初始化图表
        emptyStateManager.remove()
        initChart(generateOptions())
      }
    })
  }

  // 处理图表进入可视区域时的逻辑
  const handleChartVisible = () => {
    if (onVisible) {
      onVisible()
    } else {
      updateChart()
    }
  }

  // 设置数据监听
  const setupWatchers = () => {
    // 监听自定义数据源
    if (watchSources.length > 0) {
      watch(watchSources, updateChart, { deep: true })
    }

    // 监听主题变化
    watch(isDark, () => {
      emptyStateManager.updateStyle()
      updateChart()
    })
  }

  // 设置生命周期
  const setupLifecycle = () => {
    onMounted(() => {
      updateChart()

      // 监听图表可见事件
      if (chartRef.value) {
        chartRef.value.addEventListener('chartVisible', handleChartVisible)
      }
    })

    onBeforeUnmount(() => {
      // 清理事件监听器
      if (chartRef.value) {
        chartRef.value.removeEventListener('chartVisible', handleChartVisible)
      }
      // 清理空状态div
      emptyStateManager.remove()
    })
  }

  // 初始化
  setupWatchers()
  setupLifecycle()

  return {
    ...chart,
    isEmpty,
    updateChart,
    handleChartVisible
  }
}
