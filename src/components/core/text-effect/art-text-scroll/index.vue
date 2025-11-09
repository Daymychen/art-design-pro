<!-- 文字滚动 -->
<template>
  <div
    ref="containerRef"
    class="relative overflow-hidden rounded-custom-sm border flex-c box-border text-sm"
    :class="themeClasses"
    :style="containerStyle"
  >
    <div class="flex-cc absolute left-0 h-full w-9 z-10" :style="{ backgroundColor: bgColor }">
      <ArtSvgIcon icon="ri:volume-down-line" class="text-lg" />
    </div>

    <div
      ref="contentRef"
      class="whitespace-nowrap inline-block transition-opacity duration-600 [&_a]:text-danger [&_a:hover]:underline [&_a:hover]:text-danger/80 px-9"
      :class="[contentClass, { 'opacity-0': !isReady, 'opacity-100': isReady }]"
      :style="contentStyle"
      @click="handleContentClick"
    >
      <!-- 原始内容 -->
      <span ref="textRef" class="inline-block">
        <slot>
          <span v-html="text"></span>
        </slot>
      </span>
      <!-- 克隆内容用于无缝循环 -->
      <span v-if="shouldClone" class="inline-block" :style="cloneSpacing">
        <slot>
          <span v-html="text"></span>
        </slot>
      </span>
    </div>

    <div
      v-if="showClose"
      class="flex-cc absolute right-0 h-full w-9 c-p"
      :style="{ backgroundColor: bgColor }"
      @click="handleClose"
    >
      <ArtSvgIcon icon="ri:close-fill" class="text-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    useElementSize,
    useRafFn,
    useElementHover,
    useDebounceFn,
    useTimeoutFn
  } from '@vueuse/core'
  import { useSettingStore } from '@/store/modules/setting'

  type ThemeType =
    | 'theme'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'

  /**
   * 文本滚动组件属性接口
   */
  export interface TextScrollProps {
    /** 滚动文本内容 */
    text?: string
    /** 主题类型 */
    type?: ThemeType
    /** 滚动方向 */
    direction?: 'left' | 'right' | 'up' | 'down'
    /** 滚动速度，单位：像素/秒 */
    speed?: number
    /** 容器宽度 */
    width?: string
    /** 容器高度 */
    height?: string
    /** 鼠标悬停时是否暂停滚动 */
    pauseOnHover?: boolean
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 始终滚动（即使文字未溢出） */
    alwaysScroll?: boolean
  }

  const props = withDefaults(defineProps<TextScrollProps>(), {
    text: '',
    direction: 'left',
    speed: 80,
    width: '100%',
    height: '36px',
    pauseOnHover: true,
    type: 'theme',
    showClose: false,
    alwaysScroll: true
  })

  const emit = defineEmits<{
    close: []
  }>()

  const handleClose = () => {
    emit('close')
  }

  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)

  const containerRef = ref<HTMLElement>()
  const contentRef = ref<HTMLElement>()
  const textRef = ref<HTMLElement>()
  const isReady = ref(false)

  const currentPosition = ref(0)
  const textSize = ref(0)
  const containerSize = ref(0)
  const shouldClone = ref(false)

  const isHorizontal = computed(() => props.direction === 'left' || props.direction === 'right')
  const isReverse = computed(() => props.direction === 'right' || props.direction === 'down')

  // 使用 VueUse 的 useElementSize 监听容器尺寸变化
  const { width: containerWidth, height: containerHeight } = useElementSize(containerRef)

  // 使用 VueUse 的 useElementHover 检测鼠标悬停
  const isHovered = useElementHover(containerRef)

  // 计算是否应该暂停动画
  const isPaused = computed(() => {
    // 如果未启用 alwaysScroll，且文字未超出容器，则暂停滚动
    if (!props.alwaysScroll && textSize.value <= containerSize.value) {
      return true
    }
    return props.pauseOnHover && isHovered.value
  })

  // 主题样式映射
  const themeClasses = computed(() => {
    const themeMap: Record<ThemeType, string> = {
      theme: 'text-theme/90 !border-theme/50',
      primary: 'text-primary/90 !border-primary/50',
      secondary: 'text-secondary/90 !border-secondary/50',
      error: 'text-error/90 !border-error/50',
      info: 'text-info/90 !border-info/50',
      success: 'text-success/90 !border-success/50',
      warning: 'text-warning/90 !border-warning/50',
      danger: 'text-danger/90 !border-danger/50'
    }
    return themeMap[props.type] || themeMap.theme
  })

  // 背景色
  const bgColor = computed(
    () =>
      `color-mix(in oklch, var(--color-${props.type}) ${isDark.value ? '25' : '10'}%, var(--art-color))`
  )

  const containerStyle = computed(() => ({
    width: props.width,
    height: props.height,
    backgroundColor: bgColor.value
  }))

  const contentClass = computed(() => {
    if (!isHorizontal.value) {
      return 'flex flex-col'
    }
    return ''
  })

  const contentStyle = computed(() => {
    const transform = isHorizontal.value
      ? `translateX(${currentPosition.value}px)`
      : `translateY(${currentPosition.value}px)`

    return {
      transform,
      willChange: 'transform'
    }
  })

  // 克隆元素的间距
  const cloneSpacing = computed(() => {
    const spacing = '2em'
    return isHorizontal.value ? { marginLeft: spacing } : { marginTop: spacing }
  })

  const measureSizes = () => {
    if (!containerRef.value || !textRef.value) return

    const text = textRef.value

    if (isHorizontal.value) {
      containerSize.value = containerWidth.value
      textSize.value = text.offsetWidth
    } else {
      containerSize.value = containerHeight.value
      textSize.value = text.offsetHeight
    }

    const isOverflow = textSize.value > containerSize.value
    shouldClone.value = isOverflow

    // 居中显示
    currentPosition.value = (containerSize.value - textSize.value) / 2

    // 测量完成后才显示内容
    if (!isReady.value) {
      isReady.value = true
    }
  }

  // 使用 VueUse 的 useDebounceFn 防抖测量
  const debouncedMeasure = useDebounceFn(measureSizes, 150)

  let lastTimestamp = 0

  // 使用 VueUse 的 useRafFn 替代手动 requestAnimationFrame
  const { pause, resume } = useRafFn(
    ({ timestamp }) => {
      if (!lastTimestamp) lastTimestamp = timestamp

      if (!isPaused.value) {
        const delta = (timestamp - lastTimestamp) / 1000
        const distance = props.speed * delta
        const spacing = textSize.value * 0.1

        currentPosition.value += isReverse.value ? distance : -distance

        // 循环边界检测
        if (isReverse.value) {
          if (currentPosition.value > containerSize.value) {
            currentPosition.value = -(textSize.value + spacing)
          }
        } else {
          if (currentPosition.value < -(textSize.value + spacing)) {
            currentPosition.value = containerSize.value
          }
        }
      }

      lastTimestamp = timestamp
    },
    { immediate: false }
  )

  const handleContentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A') {
      e.stopPropagation()
    }
  }

  // 监听容器尺寸变化
  watch([containerWidth, containerHeight], () => {
    debouncedMeasure()
  })

  // 监听属性变化
  watch(
    () => [props.direction, props.speed, props.text],
    () => {
      measureSizes()
      lastTimestamp = 0
    }
  )

  // 使用 VueUse 的 useTimeoutFn 替代 setTimeout
  const { start: startMeasure } = useTimeoutFn(() => {
    measureSizes()
    // 测量完成后立即开始动画
    resume()
  }, 100)

  onMounted(() => {
    startMeasure()
  })

  onBeforeUnmount(() => {
    pause()
  })
</script>
