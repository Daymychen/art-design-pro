<!-- 表格按钮，支持文字和图标 -->
<template>
  <div class="btn-text" @click="handleClick">
    <i v-if="props.type" class="iconfont-sys" v-html="getIcon(props.type)"></i>
    <span v-if="props.text">{{ props.text }}</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    text?: string
    icon?: string
    type?: 'add' | 'edit' | 'delete' | 'more'
  }>()

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  const defaultButtons = [
    { type: 'add', icon: '&#xe602;' },
    { type: 'edit', icon: '&#xe642;' },
    { type: 'delete', icon: '&#xe783;' },
    { type: 'more', icon: '&#xe6df;' }
  ] as const

  const getIcon = (type: 'add' | 'edit' | 'delete' | 'more') => {
    return defaultButtons.find((btn) => btn.type === type)?.icon
  }

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
    transition: background-color 0.1s;

    &:hover {
      background-color: var(--art-gray-300);
    }
  }
</style>
