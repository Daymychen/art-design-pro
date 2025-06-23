<!-- 表格按钮 -->
<template>
  <div
    :class="['btn-text', buttonClass]"
    :style="{ backgroundColor: buttonBgColor, color: iconColor }"
    @click="handleClick"
  >
    <i v-if="iconContent" class="iconfont-sys" v-html="iconContent"></i>
  </div>
</template>

<script setup lang="ts">
  import { BgColorEnum } from '@/enums/appEnum'

  defineOptions({ name: 'ArtButtonTable' })

  interface Props {
    /** 按钮类型 */
    type?: 'add' | 'edit' | 'delete' | 'more'
    /** 按钮图标 */
    icon?: string
    /** 按钮样式类 */
    iconClass?: BgColorEnum
    /** icon 颜色 */
    iconColor?: string
    /** 按钮背景色 */
    buttonBgColor?: string
  }

  const props = withDefaults(defineProps<Props>(), {})

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  // 默认按钮配置
  const defaultButtons = {
    add: { icon: '&#xe602;', color: BgColorEnum.PRIMARY },
    edit: { icon: '&#xe642;', color: BgColorEnum.SECONDARY },
    delete: { icon: '&#xe783;', color: BgColorEnum.ERROR },
    more: { icon: '&#xe6df;', color: '' }
  } as const

  // 获取图标内容
  const iconContent = computed(() => {
    return props.icon || (props.type ? defaultButtons[props.type]?.icon : '') || ''
  })

  // 获取按钮样式类
  const buttonClass = computed(() => {
    return props.iconClass || (props.type ? defaultButtons[props.type]?.color : '') || ''
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
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: rgba(var(--art-gray-300-rgb), 0.5);
    }
  }
</style>
