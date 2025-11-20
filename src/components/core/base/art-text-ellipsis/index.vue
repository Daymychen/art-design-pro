<template>
  <ElText
    ref="textRef"
    :class="textClass"
    :type="type === 'default' ? '' : type"
    :size="size"
    :tag="tag"
    :truncated="!multiline"
    :line-clamp="multiline ? lineClamp : undefined"
    v-bind="$attrs"
    @mouseover.self="handleHover"
  >
    <slot>{{ text }}</slot>
  </ElText>
</template>

<script setup lang="ts">
  import { h, ref, onMounted, nextTick, watch } from 'vue'
  import { ElText } from 'element-plus'
  import { useTippy, type TippyOptions } from 'vue-tippy'

  export interface ArtTextEllipsisProps {
    /** 文本内容 */
    text?: string
    /** 文本类型 */
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
    /** 文本大小 */
    size?: 'large' | 'default' | 'small'
    /** 渲染的 HTML 标签 */
    tag?: string
    /** 是否多行省略 */
    multiline?: boolean
    /** 多行省略的行数 */
    lineClamp?: number
    /** Tooltip 配置 */
    tippyProps?: TippyOptions
    /** 自定义类名 */
    textClass?: string
  }

  defineOptions({
    name: 'ArtTextEllipsis',
    inheritAttrs: false
  })

  const props = withDefaults(defineProps<ArtTextEllipsisProps>(), {
    text: '',
    type: 'default',
    size: 'default',
    tag: 'span',
    multiline: false,
    lineClamp: 2,
    textClass: '',
    tippyProps: () => ({
      placement: 'top',
      maxWidth: 400,
      delay: 200,
      arrow: true,
      animation: 'fade',
      theme: 'custom'
    })
  })

  const slots = defineSlots<{
    default?: () => any
  }>()

  const textRef = ref<InstanceType<typeof ElText>>()
  const tippyFunc = ref<any>()

  /**
   * 判断文本是否溢出
   */
  const isTextEllipsis = (el: HTMLElement) => {
    if (!props.multiline) {
      // 单行省略判断
      return el.scrollWidth > el.clientWidth
    } else {
      // 多行省略判断
      return el.scrollHeight > el.clientHeight
    }
  }

  /**
   * 获取 Tippy 配置
   */
  const getTippyProps = (): TippyOptions => ({
    content: h('div', slots.default ? slots.default() : props.text),
    ...props.tippyProps
  })

  /**
   * 鼠标悬停处理
   */
  function handleHover(event: MouseEvent) {
    if (!tippyFunc.value) return

    if (isTextEllipsis(event.target as HTMLElement)) {
      tippyFunc.value.setProps(getTippyProps())
      tippyFunc.value.enable()
    } else {
      tippyFunc.value.disable()
    }
  }

  onMounted(() => {
    if (textRef.value?.$el) {
      tippyFunc.value = useTippy(textRef.value.$el, getTippyProps())
      // 默认禁用，只在需要时启用
      tippyFunc.value.disable()
    }
  })

  // 监听文本变化
  watch(
    () => props.text,
    () => {
      nextTick(() => {
        handleHover({ target: textRef.value?.$el } as MouseEvent)
      })
    }
  )

  // 监听行数变化
  watch(
    () => props.lineClamp,
    () => {
      nextTick(() => {
        handleHover({ target: textRef.value?.$el } as MouseEvent)
      })
    }
  )

  // 暴露方法供外部调用
  defineExpose({
    handleHover
  })
</script>

<style>
  /* 确保文本省略样式生效 */
  :deep(.el-text) {
    max-width: 100%;
  }

  /* 自定义 Tippy 主题样式 */
  .tippy-box[data-theme~='custom'] {
    padding: 8px 12px;
    font-size: 14px;
    line-height: 1.6;
    color: #fff;
    background-color: rgb(0 0 0 / 85%);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }

  .tippy-box[data-theme~='custom'][data-placement^='top'] > .tippy-arrow::before {
    border-top-color: rgb(0 0 0 / 85%);
  }

  .tippy-box[data-theme~='custom'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: rgb(0 0 0 / 85%);
  }

  .tippy-box[data-theme~='custom'][data-placement^='left'] > .tippy-arrow::before {
    border-left-color: rgb(0 0 0 / 85%);
  }

  .tippy-box[data-theme~='custom'][data-placement^='right'] > .tippy-arrow::before {
    border-right-color: rgb(0 0 0 / 85%);
  }

  /* 暗色模式适配 */
  .dark .tippy-box[data-theme~='custom'] {
    color: #1f2937;
    background-color: rgb(255 255 255 / 95%);
  }

  .dark .tippy-box[data-theme~='custom'][data-placement^='top'] > .tippy-arrow::before {
    border-top-color: rgb(255 255 255 / 95%);
  }

  .dark .tippy-box[data-theme~='custom'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: rgb(255 255 255 / 95%);
  }

  .dark .tippy-box[data-theme~='custom'][data-placement^='left'] > .tippy-arrow::before {
    border-left-color: rgb(255 255 255 / 95%);
  }

  .dark .tippy-box[data-theme~='custom'][data-placement^='right'] > .tippy-arrow::before {
    border-right-color: rgb(255 255 255 / 95%);
  }
</style>
