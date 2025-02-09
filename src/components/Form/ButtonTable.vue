<!-- 表格按钮，支持文字和图标 -->
<template>
  <div
    :class="['btn-text custom-text', `btn-${props.type}`, useColor ? buttonColor : '']"
    @click="handleClick"
  >
    <i v-if="props.type" class="iconfont-sys" v-html="getIcon(props.type)"></i>
    <span v-if="props.text">{{ props.text }}</span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { withDefaults } from 'vue'

  const props = withDefaults(
    defineProps<{
      text?: string
      icon?: string
      type?: 'add' | 'edit' | 'delete' | 'more'
      buttonClass?: string
      useColor?: boolean
    }>(),
    {
      useColor: true
    }
  )

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  const defaultButtons = [
    { type: 'add', icon: '&#xe602;', color: 'bg-primary' },
    { type: 'edit', icon: '&#xe642;', color: 'bg-secondary' },
    { type: 'delete', icon: '&#xe783;', color: 'bg-error' },
    { type: 'more', icon: '&#xe6df;', color: '' }
  ] as const

  const getIcon = (type: 'add' | 'edit' | 'delete' | 'more') => {
    return defaultButtons.find((btn) => btn.type === type)?.icon
  }

  const getButtonColor = (type: 'add' | 'edit' | 'delete' | 'more') => {
    return defaultButtons.find((btn) => btn.type === type)?.color
  }

  const buttonColor = computed(() => {
    if (!props.useColor) return ''
    return props.buttonClass || (props.type ? getButtonColor(props.type) : '')
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
