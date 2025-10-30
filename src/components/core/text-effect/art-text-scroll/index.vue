<!-- 文字滚动组件，支持5种样式类型，两种滚动方向，可自定义 HTML 内容 -->
<template>
  <div ref="containerRef" class="text-scroll-container" :class="[`text-scroll--${props.type}`]">
    <div class="left-icon flex-c">
      <ArtSvgIcon icon="ri:volume-down-line" class="text-lg ml-1" />
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
    <div class="right-icon flex-c" @click="handleRightIconClick" v-if="showClose">
      <ArtSvgIcon icon="ri:close-fill" class="text-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useElementHover } from '@vueuse/core'

  defineOptions({ name: 'ArtTextScroll' })

  const emit = defineEmits(['close'])

  interface Props {
    /** 文本 */
    text: string
    /** 滚动速度 */
    speed?: number
    /** 滚动方向 左/右 */
    direction?: 'left' | 'right'
    /** 类型 默认/成功/警告/危险/信息 */
    type?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 是否启用打字机效果 */
    typewriter?: boolean
    /** 打字机速度 */
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
  $text-scroll-height: 34px;
  $icon-width: 40px;
  $border-radius: calc(var(--custom-radius) / 2 + 2px);

  $types: (
    default: primary,
    success: success,
    warning: warning,
    danger: danger,
    info: info
  );

  // 基础容器样式
  .text-scroll-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 16px;
    overflow: hidden;
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary-light-5);
    border-radius: $border-radius;

    // 左右图标公共样式
    .left-icon,
    .right-icon {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: $icon-width;
      height: $text-scroll-height;
      line-height: $text-scroll-height;
      text-align: center;
      background-color: var(--el-color-primary-light-9);

      .art-svg-icon {
        color: var(--main-color);
      }
    }

    .left-icon {
      left: 0;
    }

    .right-icon {
      right: 0;
      cursor: pointer;
      background-color: transparent;
    }

    // 滚动内容包装器
    .scroll-wrapper {
      flex: 1;
      margin-left: $text-scroll-height;
      overflow: hidden;
    }

    // 滚动内容
    .text-scroll-content {
      display: flex;
      height: $text-scroll-height;
      line-height: $text-scroll-height;
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
        color: var(--el-color-primary-light-2);
        text-align: center;

        :deep(a) {
          color: #fd4e4e;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        // 打字机光标效果
        &::after {
          content: '|';
          opacity: 0;
          animation: cursor 1s infinite;
        }
      }
    }

    // 动态生成类型样式
    @each $type, $color in $types {
      &.text-scroll--#{$type} {
        background-color: var(--el-color-#{$color}-light-9);
        border-color: var(--el-color-#{$color}-light-5);

        .left-icon,
        .right-icon {
          background-color: var(--el-color-#{$color}-light-9);

          .art-svg-icon {
            color: var(--el-color-#{$color});
          }
        }

        .scroll-item {
          color: var(--el-color-#{$color});
        }
      }
    }
  }

  // 滚动动画
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  // 光标动画
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
