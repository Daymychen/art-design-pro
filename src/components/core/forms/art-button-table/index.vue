<!-- 表格按钮 -->
<template>
  <div
    :class="[
      'inline-block min-w-[34px] h-[34px] px-2.5 mr-2.5 text-[13px] leading-[34px] cursor-pointer bg-[rgba(var(--art-gray-200-rgb),0.7)] rounded-md tad-200 ease-in-out hover:bg-[rgba(var(--art-gray-300-rgb),0.5)]',
      buttonClass
    ]"
    :style="{ backgroundColor: buttonBgColor, color: iconColor }"
    @click="handleClick"
  >
    <ArtSvgIcon :icon="iconContent" />
  </div>
</template>

<script setup lang="ts">
  import { BgColorEnum } from '@/enums/appEnum'

  defineOptions({ name: 'ArtButtonTable' })

  interface Props {
    /** 按钮类型 */
    type?: 'add' | 'edit' | 'delete' | 'more' | 'view'
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
    add: { icon: 'ri:add-fill', color: BgColorEnum.PRIMARY },
    edit: { icon: 'ri:pencil-line', color: BgColorEnum.SECONDARY },
    delete: { icon: 'ri:delete-bin-5-line', color: BgColorEnum.ERROR },
    view: { icon: 'ri:eye-line', color: BgColorEnum.INFO },
    more: { icon: 'ri:more-2-fill', color: '' }
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
