<template>
  <ElSelect v-model="value" v-bind="config" @change="(val) => changeValue(val)">
    <ElOption
      v-for="v in options"
      :key="v.value"
      :label="v.label"
      :value="v.value"
      :disabled="v.disabled || false"
    >
    </ElOption>
  </ElSelect>
</template>

<script setup lang="ts">
  import { SearchFormItem } from '@/types'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // 定义组件值类型
  export type ValueVO = unknown

  // 定义组件props
  const prop = defineProps<{
    value: ValueVO // 选择框的值
    item: SearchFormItem // 表单项配置
  }>()

  // 定义emit事件
  const emit = defineEmits<{
    (e: 'update:value', value: ValueVO): void // 更新选择框值的事件
  }>()

  // 计算属性:处理v-model双向绑定
  const value = computed({
    get: () => prop.value as string,
    set: (value: ValueVO) => emit('update:value', value)
  })

  // 合并默认配置和自定义配置
  const config = reactive({
    placeholder: `${t('table.searchBar.searchSelectPlaceholder')}${prop.item.label}`, // 修改默认placeholder文案
    ...(prop.item.config || {})
  })

  // 选择框值变化处理函数
  const changeValue = (val: unknown): void => {
    if (prop.item.onChange) {
      prop.item.onChange({
        prop: prop.item.prop,
        val
      })
    }
  }

  // 计算属性:处理选项数据
  const options = computed(() => {
    if (prop.item.options) {
      // 判断options是数组还是函数
      if (Array.isArray(prop.item.options)) {
        return prop.item.options
      } else {
        return prop.item.options()
      }
    } else {
      return []
    }
  })
</script>
