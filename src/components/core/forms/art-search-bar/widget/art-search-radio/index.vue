<template>
  <ElRadioGroup v-model="value" v-bind="config" @change="(val) => changeValue(val)">
    <ElRadio v-for="v in options" :key="v.value" :value="v.value">{{ v.label }}</ElRadio>
  </ElRadioGroup>
</template>

<script setup lang="ts">
  import { SearchFormItem } from '@/types'

  export type ValueVO = unknown

  const prop = defineProps<{
    value: ValueVO // 单选框的值
    item: SearchFormItem // 表单项配置
  }>()

  // 定义emit事件
  const emit = defineEmits<{
    (e: 'update:value', value: ValueVO): void // 更新单选框值的事件
  }>()

  // 计算属性:处理v-model双向绑定
  const value = computed({
    get: () => prop.value as string,
    set: (value: ValueVO) => emit('update:value', value)
  })

  // 合并默认配置和自定义配置
  const config = reactive({
    ...(prop.item.config || {}) // 合并自定义配置
  })

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

  // 单选框值变化处理函数
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
