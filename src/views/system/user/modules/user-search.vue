<template>
  <ArtSearchBar
    v-model:filter="formFilters"
    :items="formItems"
    @reset="handleReset"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
  import { SearchChangeParams, SearchFormItem } from '@/types'

  interface Props {
    modelValue: any
  }

  interface Emits {
    (e: 'update:modelValue', value: any): void
    (e: 'search'): void
    (e: 'reset'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 定义表单搜索初始值
  const initialSearchState = {
    name: '',
    phone: '',
    address: '',
    level: '',
    email: '',
    date: '',
    daterange: '',
    status: '1'
  }

  // 响应式表单数据
  const formFilters = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  // 重置表单
  const handleReset = () => {
    emit('update:modelValue', { ...initialSearchState })
    emit('reset')
  }

  // 搜索处理
  const handleSearch = () => {
    console.log('搜索参数:', formFilters.value)
    emit('search')
  }

  // 表单项变更处理
  const handleFormChange = (params: SearchChangeParams): void => {
    console.log('表单项变更:', params)
  }

  // 表单配置项
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
      options: () => [
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
    // 支持 9 种日期类型定义
    // 具体可参考 src/components/core/forms/art-search-bar/widget/art-search-date/README.md
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
