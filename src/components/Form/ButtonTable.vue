<!-- 表格按钮，支持文字和图标 -->
<template>
  <div :class="['btn-text', buttonColor]" @click="handleClick">
    <i v-if="iconContent" class="iconfont-sys" v-html="iconContent" :style="iconStyle"></i>
    <span v-if="props.text">{{ props.text }}</span>
  </div>
</template>

<script setup lang="ts">
  import { BgColorEnum } from '@/enums/appEnum'
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      text?: string
      type?: 'add' | 'edit' | 'delete' | 'more'
      icon?: string // 自定义图标
      iconClass?: BgColorEnum // 自定义按钮背景色、文字颜色
      iconColor?: string // 外部传入的图标文字颜色
      iconBgColor?: string // 外部传入的图标背景色
    }>(),
    {}
  )

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  // 默认按钮配置：type 对应的图标和默认颜色
  const defaultButtons = [
    { type: 'add', icon: '&#xe602;', color: BgColorEnum.PRIMARY },
    { type: 'edit', icon: '&#xe642;', color: BgColorEnum.SECONDARY },
    { type: 'delete', icon: '&#xe783;', color: BgColorEnum.ERROR },
    { type: 'more', icon: '&#xe6df;', color: '' }
  ] as const

  // 计算最终使用的图标：优先使用外部传入的 icon，否则根据 type 获取默认图标
  const iconContent = computed(() => {
    return props.icon || defaultButtons.find((btn) => btn.type === props.type)?.icon || ''
  })

  // 计算按钮的背景色：优先使用外部传入的 iconClass，否则根据 type 选默认颜色
  const buttonColor = computed(() => {
    return props.iconClass || defaultButtons.find((btn) => btn.type === props.type)?.color || ''
  })

  // 计算图标的颜色与背景色，支持外部传入
  const iconStyle = computed(() => {
    return {
      ...(props.iconColor ? { color: props.iconColor } : {}),
      ...(props.iconBgColor ? { backgroundColor: props.iconBgColor } : {})
    }
  })

  const handleClick = () => {
    emit('click')
  }
</script>

<style scoped lang="scss">
  .btn-text {
    display: inline-block;
    min-width: 34px;
    height: 34px;
    padding: 0 10px;
    margin-right: 10px;
    font-size: 13px;
    line-height: 34px;
    color: #666;
    cursor: pointer;
    background-color: rgba(var(--art-gray-200-rgb), 0.7);
    border-radius: 6px;

    &:hover {
      color: var(--main-color);
      background-color: rgba(var(--art-gray-300-rgb), 0.5);
    }
  }
</style>
