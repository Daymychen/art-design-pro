<!-- 用户搜索栏 -->
<template>
  <ArtSearchBar
    v-model:filter="searchFormState"
    :items="formItems"
    @reset="handleReset"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
  import type { SearchChangeParams, SearchFormItem } from '@/types'

  interface Emits {
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }

  const props = defineProps<{
    filter: Record<string, any>
  }>()

  const emit = defineEmits<Emits>()

  const searchFormState = ref({ ...props.filter })

  watch(
    () => props.filter,
    (newFilter) => {
      searchFormState.value = { ...newFilter }
    },
    { deep: true, immediate: true }
  )

  // 重置表单
  const handleReset = () => {
    searchFormState.value = { ...props.filter }
    emit('reset')
  }

  // 搜索处理
  const handleSearch = () => {
    console.log('搜索参数:', searchFormState.value)
    emit('search', searchFormState.value)
  }

  const handleFormChange = (params: SearchChangeParams): void => {
    console.log('表单项变更:', params)
  }

  // --- 表单配置项 ---
  const formItems: SearchFormItem[] = [
    {
      label: '用户名',
      prop: 'name',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '电话',
      prop: 'phone',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '用户等级',
      prop: 'level',
      type: 'select',
      config: {
        clearable: true
      },
      // options 可以是一个函数返回数组，也可以是直接的数组
      options: [
        { label: '普通用户', value: 'normal' },
        { label: 'VIP用户', value: 'vip' },
        { label: '高级VIP', value: 'svip' },
        { label: '企业用户', value: 'enterprise', disabled: true }
      ],
      onChange: handleFormChange
    },
    {
      label: '地址',
      prop: 'address',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '邮箱',
      prop: 'email',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      prop: 'date',
      label: '日期',
      type: 'date',
      config: {
        type: 'date',
        placeholder: '请选择日期'
      }
    },
    {
      prop: 'daterange',
      label: '日期范围',
      type: 'daterange',
      config: {
        type: 'daterange',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      }
    },
    {
      label: '状态',
      prop: 'status',
      type: 'radio',
      options: [
        { label: '在线', value: '1' },
        { label: '离线', value: '2' }
      ],
      onChange: handleFormChange
    }
  ]
</script>
