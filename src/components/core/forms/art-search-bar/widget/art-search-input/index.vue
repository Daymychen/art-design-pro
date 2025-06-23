<template>
  <ElInput v-model="value" v-bind="config" @change="(val) => changeValue(val)" />
</template>

<script setup lang="ts">
  import { SearchFormItem } from '@/types'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  export type ValueVO = unknown

  const prop = defineProps<{
    value: ValueVO // 输入框的值
    item: SearchFormItem // 表单项配置
  }>()

  const emit = defineEmits<{
    (e: 'update:value', value: ValueVO): void // 更新输入框值的事件
  }>()

  // 计算属性:处理v-model双向绑定
  const value = computed({
    get: () => prop.value as string,
    set: (value: ValueVO) => emit('update:value', value)
  })

  // 合并默认配置和自定义配置
  const config = reactive({
    placeholder: `${t('table.searchBar.searchInputPlaceholder')}${prop.item.label}`,
    ...(prop.item.config || {}) // 合并自定义配置
  })

  // 输入框值变化处理函数
  const changeValue = (val: unknown): void => {
    // 如果存在onChange回调则执行
    if (prop.item.onChange) {
      prop.item.onChange({
        prop: prop.item.prop,
        val
      })
    }
  }
</script>
