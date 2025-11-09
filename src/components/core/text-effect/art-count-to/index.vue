<!-- 数字滚动 -->
<template>
  <span
    class="text-g-900 tabular-nums"
    :class="isRunning ? 'transition-opacity duration-300 ease-in-out' : ''"
  >
    {{ formattedValue }}
  </span>
</template>

<script setup lang="ts">
  import { computed, watch, nextTick, onUnmounted, shallowRef } from 'vue'
  import { useTransition, TransitionPresets } from '@vueuse/core'

  // 类型定义
  interface CountToProps {
    /** 目标值 */
    target: number
    /** 动画持续时间（毫秒） */
    duration?: number
    /** 是否自动开始 */
    autoStart?: boolean
    /** 小数位数 */
    decimals?: number
    /** 小数点符号 */
    decimal?: string
    /** 千分位分隔符 */
    separator?: string
    /** 前缀 */
    prefix?: string
    /** 后缀 */
    suffix?: string
    /** 缓动函数 */
    easing?: keyof typeof TransitionPresets
    /** 是否禁用动画 */
    disabled?: boolean
  }

  interface CountToEmits {
    started: [value: number]
    finished: [value: number]
    paused: [value: number]
    reset: []
  }

  interface CountToExpose {
    start: (target?: number) => void
    pause: () => void
    reset: (newTarget?: number) => void
    stop: () => void
    setTarget: (target: number) => void
    readonly isRunning: boolean
    readonly isPaused: boolean
    readonly currentValue: number
    readonly targetValue: number
    readonly progress: number
  }

  // 常量定义
  const EPSILON = Number.EPSILON
  const MIN_DURATION = 100
  const MAX_DURATION = 60000
  const MAX_DECIMALS = 10
  const DEFAULT_EASING = 'easeOutExpo'
  const DEFAULT_DURATION = 2000

  const props = withDefaults(defineProps<CountToProps>(), {
    target: 0,
    duration: DEFAULT_DURATION,
    autoStart: true,
    decimals: 0,
    decimal: '.',
    separator: '',
    prefix: '',
    suffix: '',
    easing: DEFAULT_EASING,
    disabled: false
  })

  const emit = defineEmits<CountToEmits>()

  // 工具函数
  const validateNumber = (value: number, name: string, defaultValue: number): number => {
    if (!Number.isFinite(value)) {
      console.warn(`[CountTo] Invalid ${name} value:`, value)
      return defaultValue
    }
    return value
  }

  const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(value, max))
  }

  const formatNumber = (
    value: number,
    decimals: number,
    decimal: string,
    separator: string
  ): string => {
    let result = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString()

    // 处理小数点符号
    if (decimal !== '.' && result.includes('.')) {
      result = result.replace('.', decimal)
    }

    // 处理千分位分隔符
    if (separator) {
      const parts = result.split(decimal)
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      result = parts.join(decimal)
    }

    return result
  }

  // 安全计算值
  const safeTarget = computed(() => validateNumber(props.target, 'target', 0))
  const safeDuration = computed(() =>
    clamp(validateNumber(props.duration, 'duration', DEFAULT_DURATION), MIN_DURATION, MAX_DURATION)
  )
  const safeDecimals = computed(() =>
    clamp(validateNumber(props.decimals, 'decimals', 0), 0, MAX_DECIMALS)
  )
  const safeEasing = computed(() => {
    const easing = props.easing
    if (!(easing in TransitionPresets)) {
      console.warn('[CountTo] Invalid easing value:', easing)
      return DEFAULT_EASING
    }
    return easing
  })

  // 状态管理
  const currentValue = shallowRef(0)
  const targetValue = shallowRef(safeTarget.value)
  const isRunning = shallowRef(false)
  const isPaused = shallowRef(false)
  const pausedValue = shallowRef(0)

  // 动画控制
  const transitionValue = useTransition(currentValue, {
    duration: safeDuration,
    transition: computed(() => TransitionPresets[safeEasing.value]),
    onStarted: () => {
      isRunning.value = true
      isPaused.value = false
      emit('started', targetValue.value)
    },
    onFinished: () => {
      isRunning.value = false
      isPaused.value = false
      emit('finished', targetValue.value)
    }
  })

  // 格式化显示值
  const formattedValue = computed(() => {
    const value = isPaused.value ? pausedValue.value : transitionValue.value

    if (!Number.isFinite(value)) {
      return `${props.prefix}0${props.suffix}`
    }

    const formattedNumber = formatNumber(value, safeDecimals.value, props.decimal, props.separator)
    return `${props.prefix}${formattedNumber}${props.suffix}`
  })

  // 私有方法
  const shouldSkipAnimation = (target: number): boolean => {
    const current = isPaused.value ? pausedValue.value : transitionValue.value
    return Math.abs(current - target) < EPSILON
  }

  const resetPauseState = (): void => {
    isPaused.value = false
    pausedValue.value = 0
  }

  // 公共方法
  const start = (target?: number): void => {
    if (props.disabled) {
      console.warn('[CountTo] Animation is disabled')
      return
    }

    const finalTarget = target !== undefined ? target : targetValue.value

    if (!Number.isFinite(finalTarget)) {
      console.warn('[CountTo] Invalid target value for start:', finalTarget)
      return
    }

    targetValue.value = finalTarget

    if (shouldSkipAnimation(finalTarget)) {
      return
    }

    // 从暂停值开始（如果存在）
    if (isPaused.value) {
      currentValue.value = pausedValue.value
      resetPauseState()
    }

    nextTick(() => {
      currentValue.value = finalTarget
    })
  }

  const pause = (): void => {
    if (!isRunning.value || isPaused.value) {
      return
    }

    isPaused.value = true
    pausedValue.value = transitionValue.value
    currentValue.value = pausedValue.value

    emit('paused', pausedValue.value)
  }

  const reset = (newTarget = 0): void => {
    const target = validateNumber(newTarget, 'reset target', 0)

    currentValue.value = target
    targetValue.value = target
    resetPauseState()

    emit('reset')
  }

  const setTarget = (target: number): void => {
    if (!Number.isFinite(target)) {
      console.warn('[CountTo] Invalid target value for setTarget:', target)
      return
    }

    targetValue.value = target

    if ((isRunning.value || props.autoStart) && !props.disabled) {
      start(target)
    }
  }

  const stop = (): void => {
    if (isRunning.value || isPaused.value) {
      currentValue.value = 0
      resetPauseState()
      emit('paused', 0)
    }
  }

  // 监听器
  watch(
    safeTarget,
    (newTarget) => {
      if (props.autoStart && !props.disabled) {
        start(newTarget)
      } else {
        targetValue.value = newTarget
      }
    },
    { immediate: props.autoStart && !props.disabled }
  )

  watch(
    () => props.disabled,
    (disabled) => {
      if (disabled && isRunning.value) {
        stop()
      }
    }
  )

  // 清理
  onUnmounted(() => {
    if (isRunning.value) {
      stop()
    }
  })

  // 暴露 API
  defineExpose<CountToExpose>({
    start,
    pause,
    reset,
    stop,
    setTarget,
    get isRunning() {
      return isRunning.value
    },
    get isPaused() {
      return isPaused.value
    },
    get currentValue() {
      return isPaused.value ? pausedValue.value : transitionValue.value
    },
    get targetValue() {
      return targetValue.value
    },
    get progress() {
      const current = isPaused.value ? pausedValue.value : transitionValue.value
      const target = targetValue.value
      if (target === 0) return current === 0 ? 1 : 0
      return Math.abs(current / target)
    }
  })
</script>
