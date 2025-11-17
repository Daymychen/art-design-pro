/**
 * 选项处理 Composable
 */

import { ref, computed } from 'vue'
import { uniqBy } from 'lodash-es'
import type { OptionItem } from './types'

export interface UseOptionsConfig {
  /** label 字段名 */
  labelField?: string
  /** value 字段名 */
  valueField?: string
  /** 前置选项 */
  prependOptions?: OptionItem[]
  /** 后置选项 */
  appendOptions?: OptionItem[]
  /** 数据转换函数 */
  transform?: (data: any) => OptionItem[]
}

export function useOptions(config: UseOptionsConfig = {}) {
  const {
    labelField = 'label',
    valueField = 'value',
    prependOptions,
    appendOptions,
    transform
  } = config

  // 原始 API 数据
  const rawOptions = ref<OptionItem[]>([])

  // 最终处理后的选项
  const processedOptions = computed(() => {
    let options = [...rawOptions.value]

    // 1. 数据转换
    if (transform) {
      options = transform(options)
    }

    // 2. 添加前置选项
    if (prependOptions && prependOptions.length > 0) {
      options = [...prependOptions, ...options]
    }

    // 3. 添加后置选项
    if (appendOptions && appendOptions.length > 0) {
      options = [...options, ...appendOptions]
    }

    // 4. 去重（根据 value 字段，使用 lodash uniqBy）
    options = uniqBy(options, valueField)

    return options
  })

  /**
   * 设置原始选项
   */
  const setRawOptions = (options: OptionItem[]) => {
    rawOptions.value = options
  }

  /**
   * 清空选项
   */
  const clearOptions = () => {
    rawOptions.value = []
  }

  /**
   * 根据 value 查找选项
   */
  const findOptionByValue = (value: any): OptionItem | undefined => {
    return processedOptions.value.find((option) => option[valueField] === value)
  }

  /**
   * 根据多个 value 查找选项
   */
  const findOptionsByValues = (values: any[]): OptionItem[] => {
    return processedOptions.value.filter((option) => values.includes(option[valueField]))
  }

  /**
   * 获取选项的 label
   */
  const getOptionLabel = (option: OptionItem): any => {
    return option[labelField]
  }

  /**
   * 获取选项的 value
   */
  const getOptionValue = (option: OptionItem): any => {
    return option[valueField]
  }

  return {
    // 状态
    rawOptions,
    processedOptions,

    // 方法
    setRawOptions,
    clearOptions,
    findOptionByValue,
    findOptionsByValues,
    getOptionLabel,
    getOptionValue
  }
}
