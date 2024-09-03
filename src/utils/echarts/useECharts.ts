import { unref, Ref, nextTick } from 'vue'
import { EChartsOption } from 'echarts'
import echarts from '@/plugins/echarts'
import { defaultOpstions } from './defaultOpstions'

export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'light'
) {
  let chartInstance: echarts.ECharts

  // 初始化echarts
  function initCharts() {
    const el = unref(elRef)
    if (!el || !unref(el)) {
      return
    }
    addResize()
    chartInstance = echarts.init(el, theme)
  }

  // 配置
  function setOptions(options: EChartsOption | any) {
    // 默认配置
    if (!options.grid) {
      options.grid = defaultOpstions.grid
    }

    if (!options.tooltip) {
      options.tooltip = defaultOpstions.tooltip
    }

    if (options.yAxis) {
      const { axisLine, axisTick } = defaultOpstions.yAxis

      if (!options.yAxis.axisLine) {
        options.yAxis.axisLine = axisLine
      }
      if (!options.yAxisaxisTick) {
        options.yAxis.axisTick = axisTick
      }
    }

    if (options.xAxis) {
      const { axisLine, splitLine, axisTick } = defaultOpstions.xAxis

      if (!options.xAxis.axisLine) {
        options.xAxis.axisLine = axisLine
      }
      if (!options.xAxis.splitLine) {
        options.xAxis.splitLine = splitLine
      }
      if (!options.xAxis.axisTick) {
        options.xAxis.axisTick = axisTick
      }
      if (!options.xAxis.axisTick) {
        options.xAxis.axisTick = axisTick
      }
    }

    if (unref(elRef).offsetHeight === 0) {
      setTimeout(() => {
        setOptions(options)
      }, 30)
      return
    }

    nextTick(() => {
      setTimeout(() => {
        if (!chartInstance) {
          initCharts()
          if (!chartInstance) return
        }
        // clear && chartInstance.clear()

        chartInstance.setOption(options)
      }, 30)
    })
  }

  // 监听窗口大小变化
  function addResize() {
    window.addEventListener('resize', () => {
      chartInstance.resize()
    })
  }

  // 移除监听
  function removeResize() {
    window.removeEventListener('resize', addResize)
  }

  return {
    setOptions,
    addResize,
    removeResize,
    echarts
  }
}
