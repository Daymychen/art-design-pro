<template>
  <ElDatePicker
    v-model="modelValue"
    v-bind="config"
    @change="handleChange"
    :style="{ width: '100%' }"
  />
</template>

<script setup lang="ts">
  import { SearchFormItem } from '@/types'
  import { useI18n } from 'vue-i18n'

  // 组件名称
  defineOptions({
    name: 'ArtSearchDate'
  })

  const { t } = useI18n()

  // 日期选择器类型
  type DatePickerType =
    | 'date' // 单日期
    | 'datetime' // 日期时间
    | 'daterange' // 日期范围
    | 'datetimerange' // 日期时间范围
    | 'month' // 月份
    | 'monthrange' // 月份范围
    | 'year' // 年份
    | 'yearrange' // 年份范围
    | 'week' // 周

  // 定义组件值类型 - 根据不同类型返回不同的值
  export type ValueVO = string | Date | null | undefined | [Date, Date] | [string, string] | number

  // 定义组件props
  interface Props {
    value: ValueVO
    item: SearchFormItem & {
      config?: {
        type?: DatePickerType
        format?: string
        valueFormat?: string
        placeholder?: string
        startPlaceholder?: string
        endPlaceholder?: string
        rangeSeparator?: string
        clearable?: boolean
        disabled?: boolean
        readonly?: boolean
        size?: 'large' | 'default' | 'small'
        shortcuts?: Array<{
          text: string
          value: Date | (() => Date | [Date, Date])
        }>
        disabledDate?: (time: Date) => boolean
        [key: string]: any
      }
    }
  }

  const props = defineProps<Props>()

  // 定义emit事件
  const emit = defineEmits<{
    'update:value': [value: ValueVO]
  }>()

  // 计算属性: 处理v-model双向绑定
  const modelValue = computed({
    get: () => props.value as any,
    set: (newValue: ValueVO) => emit('update:value', newValue)
  })

  // 获取默认配置
  const getDefaultConfig = (type: DatePickerType) => {
    const baseConfig = {
      clearable: true,
      size: 'default' as const
    }

    switch (type) {
      case 'date':
        return {
          ...baseConfig,
          type: 'date' as const,
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          placeholder: `${t('table.searchBar.searchSelectPlaceholder')}${props.item.label}`
        }

      case 'datetime':
        return {
          ...baseConfig,
          type: 'datetime' as const,
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          placeholder: `${t('table.searchBar.searchSelectPlaceholder')}${props.item.label}`
        }

      case 'daterange':
        return {
          ...baseConfig,
          type: 'daterange' as const,
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          rangeSeparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期'
        }

      case 'datetimerange':
        return {
          ...baseConfig,
          type: 'datetimerange' as const,
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          rangeSeparator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        }

      case 'month':
        return {
          ...baseConfig,
          type: 'month' as const,
          format: 'YYYY-MM',
          valueFormat: 'YYYY-MM',
          placeholder: `${t('table.searchBar.searchSelectPlaceholder')}${props.item.label}`
        }

      case 'monthrange':
        return {
          ...baseConfig,
          type: 'monthrange' as const,
          format: 'YYYY-MM',
          valueFormat: 'YYYY-MM',
          rangeSeparator: '至',
          startPlaceholder: '开始月份',
          endPlaceholder: '结束月份'
        }

      case 'year':
        return {
          ...baseConfig,
          type: 'year' as const,
          format: 'YYYY',
          valueFormat: 'YYYY',
          placeholder: `${t('table.searchBar.searchSelectPlaceholder')}${props.item.label}`
        }

      case 'yearrange':
        return {
          ...baseConfig,
          type: 'yearrange' as const,
          format: 'YYYY',
          valueFormat: 'YYYY',
          rangeSeparator: '至',
          startPlaceholder: '开始年份',
          endPlaceholder: '结束年份'
        }

      case 'week':
        return {
          ...baseConfig,
          type: 'week' as const,
          format: 'YYYY 第 ww 周',
          valueFormat: 'YYYY-MM-DD',
          placeholder: `${t('table.searchBar.searchSelectPlaceholder')}${props.item.label}`
        }

      default:
        return {
          ...baseConfig,
          type: 'date' as const,
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          placeholder: `${t('table.searchBar.searchSelectPlaceholder')}${props.item.label}`
        }
    }
  }

  // 常用快捷选项
  const getCommonShortcuts = (type: DatePickerType) => {
    if (!['daterange', 'datetimerange'].includes(type)) {
      return []
    }

    return [
      {
        text: '今天',
        value: () => {
          const today = new Date()
          return [today, today] as [Date, Date]
        }
      },
      {
        text: '昨天',
        value: () => {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          return [yesterday, yesterday] as [Date, Date]
        }
      },
      {
        text: '最近7天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setDate(start.getDate() - 6)
          return [start, end] as [Date, Date]
        }
      },
      {
        text: '最近30天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setDate(start.getDate() - 29)
          return [start, end] as [Date, Date]
        }
      },
      {
        text: '本月',
        value: () => {
          const now = new Date()
          const start = new Date(now.getFullYear(), now.getMonth(), 1)
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          return [start, end] as [Date, Date]
        }
      },
      {
        text: '上月',
        value: () => {
          const now = new Date()
          const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          const end = new Date(now.getFullYear(), now.getMonth(), 0)
          return [start, end] as [Date, Date]
        }
      }
    ]
  }

  // 合并默认配置和自定义配置
  const config = computed(() => {
    const dateType = (props.item.config?.type || 'date') as DatePickerType
    const defaultConfig = getDefaultConfig(dateType)
    const userConfig = props.item.config || {}

    // 如果用户没有提供快捷选项且类型是范围选择，则添加默认快捷选项
    const shouldAddShortcuts =
      !userConfig.shortcuts && ['daterange', 'datetimerange'].includes(dateType)
    const shortcuts = shouldAddShortcuts ? getCommonShortcuts(dateType) : userConfig.shortcuts

    return {
      ...defaultConfig,
      ...userConfig,
      ...(shortcuts && { shortcuts })
    }
  })

  // 日期值变化处理函数
  const handleChange = (val: ValueVO): void => {
    if (props.item.onChange) {
      props.item.onChange({
        prop: props.item.prop,
        val
      })
    }
  }
</script>
