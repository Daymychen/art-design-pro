import { ref, computed, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'

/**
 * 布局高度配置
 */
interface LayoutHeightOptions {
  /** 额外的间距（默认 15px） */
  extraSpacing?: number
  /** 是否自动更新 CSS 变量（默认 true） */
  updateCssVar?: boolean
  /** CSS 变量名称（默认 '--art-full-height'） */
  cssVarName?: string
}

/**
 * 布局高度管理
 * 用于动态计算和管理页面容器的高度
 *
 * 使用场景：
 * - 需要让内容区域自适应剩余高度
 * - 需要响应头部高度变化
 * - 需要在窗口大小变化时重新计算高度
 *
 * @example
 * ```vue
 * <script setup>
 * const { containerMinHeight, headerRef, contentHeaderRef } = useLayoutHeight()
 * </script>
 *
 * <template>
 *   <header ref="headerRef">头部</header>
 *   <div ref="contentHeaderRef">内容头部</div>
 *   <div :style="{ minHeight: containerMinHeight }">内容区域</div>
 * </template>
 * ```
 */
export function useLayoutHeight(options: LayoutHeightOptions = {}) {
  const { extraSpacing = 15, updateCssVar = true, cssVarName = '--art-full-height' } = options

  // 元素引用
  const headerRef = ref<HTMLElement>()
  const contentHeaderRef = ref<HTMLElement>()

  // 使用 VueUse 自动监听元素尺寸变化
  const { height: headerHeight } = useElementSize(headerRef)
  const { height: contentHeaderHeight } = useElementSize(contentHeaderRef)

  // 计算容器最小高度（响应式）
  const containerMinHeight = computed(() => {
    const totalHeight = headerHeight.value + contentHeaderHeight.value + extraSpacing
    return `calc(100vh - ${totalHeight}px)`
  })

  if (updateCssVar) {
    watch(
      containerMinHeight,
      (newHeight) => {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(cssVarName, newHeight)
        })
      },
      { immediate: true }
    )
  }

  return {
    /** 容器最小高度（响应式） */
    containerMinHeight,
    /** 头部元素引用 */
    headerRef,
    /** 内容头部元素引用 */
    contentHeaderRef,
    /** 头部高度（响应式） */
    headerHeight,
    /** 内容头部高度（响应式） */
    contentHeaderHeight
  }
}

/**
 * 通过 ID 自动查找元素的布局高度管理
 * 适用于无法直接获取元素引用的场景
 *
 * @param headerIds 头部元素的 ID 数组
 * @param options 配置选项
 *
 * @example
 * ```vue
 * <script setup>
 * const { containerMinHeight } = useAutoLayoutHeight(['app-header', 'app-content-header'])
 * </script>
 *
 * <template>
 *   <div :style="{ minHeight: containerMinHeight }">
 *     内容区域
 *   </div>
 * </template>
 * ```
 */
export function useAutoLayoutHeight(
  headerIds: string[] = ['app-header', 'app-content-header'],
  options: LayoutHeightOptions = {}
) {
  const { extraSpacing = 15, updateCssVar = true, cssVarName = '--art-full-height' } = options

  // 创建元素引用
  const headerRef = ref<HTMLElement>()
  const contentHeaderRef = ref<HTMLElement>()

  // 使用 VueUse 自动监听元素尺寸变化
  const { height: headerHeight } = useElementSize(headerRef)
  const { height: contentHeaderHeight } = useElementSize(contentHeaderRef)

  // 计算容器最小高度（响应式）
  const containerMinHeight = computed(() => {
    const totalHeight = headerHeight.value + contentHeaderHeight.value + extraSpacing
    return `calc(100vh - ${totalHeight}px)`
  })

  if (updateCssVar) {
    watch(
      containerMinHeight,
      (newHeight) => {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(cssVarName, newHeight)
        })
      },
      { immediate: true }
    )
  }

  // 在 DOM 挂载后查找元素
  onMounted(() => {
    if (typeof document !== 'undefined') {
      // 使用 nextTick 确保 DOM 完全渲染
      requestAnimationFrame(() => {
        const header = document.getElementById(headerIds[0])
        const contentHeader = document.getElementById(headerIds[1])

        if (header) {
          headerRef.value = header
        }
        if (contentHeader) {
          contentHeaderRef.value = contentHeader
        }
      })
    }
  })

  return {
    /** 容器最小高度（响应式） */
    containerMinHeight,
    /** 头部元素引用 */
    headerRef,
    /** 内容头部元素引用 */
    contentHeaderRef,
    /** 头部高度（响应式） */
    headerHeight,
    /** 内容头部高度（响应式） */
    contentHeaderHeight
  }
}
