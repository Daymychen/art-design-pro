<!-- 文字滚动组件，支持5种样式类型，两种滚动方向，可自定义 HTML 内容 -->
<template>
  <div ref="containerRef" class="text-scroll-container" :class="[`text-scroll--${props.type}`]">
    <div class="left-icon">
      <i class="iconfont-sys">&#xe64a;</i>
    </div>
    <div class="scroll-wrapper">
      <div
        class="text-scroll-content"
        :class="{ scrolling: shouldScroll }"
        :style="scrollStyle"
        ref="scrollContent"
      >
        <div class="scroll-item" v-html="sanitizedContent"></div>
        <div class="scroll-item" v-html="sanitizedContent"></div>
      </div>
    </div>
    <div class="right-icon" @click="handleRightIconClick" v-if="showClose">
      <i class="iconfont-sys">&#xe83a;</i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useElementHover } from '@vueuse/core'

  const emit = defineEmits(['close'])

  interface Props {
    text: string
    speed?: number
    direction?: 'left' | 'right'
    type?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    showClose?: boolean
    typewriter?: boolean
    typewriterSpeed?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    speed: 70,
    direction: 'left',
    type: 'default',
    showClose: false,
    typewriter: false,
    typewriterSpeed: 100
  })

  // 状态管理
  const containerRef = ref<HTMLElement | null>(null)
  const isHovered = useElementHover(containerRef)
  const scrollContent = ref<HTMLElement | null>(null)
  const animationDuration = ref(0)

  // 添加打字机效果相关的响应式变量
  const currentText = ref('')
  let typewriterTimer: ReturnType<typeof setTimeout> | null = null

  // 添加打字机完成状态
  const isTypewriterComplete = ref(false)

  // 修改滚动状态计算属性
  const shouldScroll = computed(() => {
    if (props.typewriter) {
      return !isHovered.value && isTypewriterComplete.value
    }
    return !isHovered.value
  })

  // 修改 sanitizedContent 计算属性
  const sanitizedContent = computed(() => (props.typewriter ? currentText.value : props.text))

  // 修改 scrollStyle 计算属性
  const scrollStyle = computed(() => ({
    '--animation-duration': `${animationDuration.value}s`,
    '--animation-play-state': shouldScroll.value ? 'running' : 'paused',
    '--animation-direction': props.direction === 'left' ? 'normal' : 'reverse'
  }))

  // 计算动画持续时间
  const calculateDuration = () => {
    if (scrollContent.value) {
      const contentWidth = scrollContent.value.scrollWidth / 2
      animationDuration.value = contentWidth / props.speed
    }
  }

  // 处理右图标点击事件
  const handleRightIconClick = () => {
    emit('close')
  }

  // 修改打字机效果实现
  const startTypewriter = () => {
    let index = 0
    currentText.value = ''
    isTypewriterComplete.value = false // 重置状态

    const type = () => {
      if (index < props.text.length) {
        currentText.value += props.text[index]
        index++
        typewriterTimer = setTimeout(type, props.typewriterSpeed)
      } else {
        isTypewriterComplete.value = true // 打字完成后设置状态
      }
    }

    type()
  }

  // 生命周期钩子
  onMounted(() => {
    calculateDuration()
    window.addEventListener('resize', calculateDuration)

    if (props.typewriter) {
      startTypewriter()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateDuration)
    if (typewriterTimer) {
      clearTimeout(typewriterTimer)
    }
  })

  // 监听文本变化，重新启动打字机效果
  watch(
    () => props.text,
    () => {
      if (props.typewriter) {
        if (typewriterTimer) {
          clearTimeout(typewriterTimer)
        }
        startTypewriter()
      }
    }
  )
</script>

<style scoped lang="scss">
  .text-scroll-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 16px;
    overflow: hidden;
    background-color: var(--el-color-primary-light-9) !important;
    border: 1px solid var(--main-color);
    border-radius: calc(var(--custom-radius) / 2 + 2px) !important;

    .left-icon,
    .right-icon {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 2;
      width: 40px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      background-color: var(--el-color-primary-light-9) !important;

      i {
        color: var(--main-color);
      }
    }

    .left-icon {
      left: 0;
    }

    .right-icon {
      right: 0;
      cursor: pointer;
      background-color: transparent !important;
    }

    .scroll-wrapper {
      flex: 1;
      margin-left: 34px;
      overflow: hidden;
    }

    .text-scroll-content {
      display: flex;
      height: 34px;
      line-height: 34px;
      white-space: nowrap;
      animation: scroll linear infinite;
      animation-duration: var(--animation-duration);
      animation-play-state: var(--animation-play-state);
      animation-direction: var(--animation-direction);

      .scroll-item {
        display: inline-block;
        min-width: 100%;
        padding: 0 10px;
        font-size: 14px;
        color: var(--el-color-primary-light-2) !important;
        text-align: left;
        text-align: center;

        :deep(a) {
          color: #fd4e4e !important;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @keyframes scroll {
      0% {
        transform: translateX(0);
      }

      100% {
        transform: translateX(-100%);
      }
    }

    // 添加类型样式
    &.text-scroll--default {
      background-color: var(--el-color-primary-light-9) !important;
      border-color: var(--el-color-primary);

      .left-icon i {
        color: var(--el-color-primary) !important;
      }

      .scroll-item {
        color: var(--el-color-primary) !important;
      }
    }

    &.text-scroll--success {
      background-color: var(--el-color-success-light-9) !important;
      border-color: var(--el-color-success);

      .left-icon {
        background-color: var(--el-color-success-light-9) !important;

        i {
          color: var(--el-color-success);
        }
      }

      .scroll-item {
        color: var(--el-color-success) !important;
      }
    }

    &.text-scroll--warning {
      background-color: var(--el-color-warning-light-9) !important;
      border-color: var(--el-color-warning);

      .left-icon {
        background-color: var(--el-color-warning-light-9) !important;

        i {
          color: var(--el-color-warning);
        }
      }

      .scroll-item {
        color: var(--el-color-warning) !important;
      }
    }

    &.text-scroll--danger {
      background-color: var(--el-color-danger-light-9) !important;
      border-color: var(--el-color-danger);

      .left-icon {
        background-color: var(--el-color-danger-light-9) !important;

        i {
          color: var(--el-color-danger);
        }
      }

      .scroll-item {
        color: var(--el-color-danger) !important;
      }
    }

    &.text-scroll--info {
      background-color: var(--el-color-info-light-9) !important;
      border-color: var(--el-color-info);

      .left-icon {
        background-color: var(--el-color-info-light-9) !important;

        i {
          color: var(--el-color-info);
        }
      }

      .scroll-item {
        color: var(--el-color-info) !important;
      }
    }
  }

  // 添加打字机效果的光标样式
  .text-scroll-content .scroll-item {
    &::after {
      content: '|';
      opacity: 0;
      animation: cursor 1s infinite;
    }
  }

  @keyframes cursor {
    0%,
    100% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }
  }
</style>
