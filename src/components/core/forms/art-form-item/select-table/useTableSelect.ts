/**
 * TableSelect 核心逻辑 Composable
 */

import { ref, computed, watch, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { TableSelectProps, TableDataItem, LoadingState, SelectedRow } from './types'

export interface UseTableSelectOptions extends TableSelectProps {
  /** 绑定值 */
  modelValue?: Ref<any>
  /** emit 函数 */
  emit?: {
    (e: 'change', value: any, selectedRows: TableDataItem | TableDataItem[]): void
    (e: 'search', query: string): void
    (e: 'load-success', data: TableDataItem[]): void
    (e: 'load-error', error: any): void
    (e: 'clear'): void
    (e: 'visible-change', visible: boolean): void
  }
}

export function useTableSelect(options: UseTableSelectOptions) {
  const {
    request,
    multiple = false,
    valueKey = 'id',
    labelKey = 'name',
    debounce = 300,
    minSearchLength = 0,
    autoExpandOnInput = true,
    modelValue,
    emit
  } = options

  // ========== 状态管理 ==========
  const loading = ref(false)
  const loadingState = ref<LoadingState>('idle')
  const error = ref<Error | null>(null)
  const visible = ref(false)
  const searchQuery = ref('')
  const tableData = ref<TableDataItem[]>([])
  const selectedRows = ref<Map<any, SelectedRow>>(new Map())

  /**
   * 获取行的唯一值
   */
  const getRowValue = (row: TableDataItem): any => {
    return row[valueKey]
  }

  /**
   * 获取行的显示标签
   */
  const getRowLabel = (row: TableDataItem): string => {
    return row[labelKey] ?? ''
  }

  /**
   * 计算输入框显示的值
   */
  const inputDisplayValue = computed(() => {
    if (selectedRows.value.size === 0) {
      return ''
    }

    if (multiple) {
      return Array.from(selectedRows.value.values())
        .map((item) => item.label)
        .join(', ')
    } else {
      const first = Array.from(selectedRows.value.values())[0]
      return first?.label ?? ''
    }
  })

  /**
   * 获取当前选中的值（用于 v-model）
   */
  const currentValue = computed(() => {
    if (selectedRows.value.size === 0) {
      return multiple ? [] : undefined
    }

    if (multiple) {
      return Array.from(selectedRows.value.keys())
    } else {
      return Array.from(selectedRows.value.keys())[0]
    }
  })

  /**
   * 加载表格数据
   */
  const loadTableData = async (query: string = '') => {
    // 检查最小搜索长度
    if (minSearchLength > 0 && query.length < minSearchLength) {
      return
    }

    try {
      loading.value = true
      loadingState.value = 'loading'
      error.value = null

      const data = await request(query)

      tableData.value = Array.isArray(data) ? data : []
      loadingState.value = 'success'
      emit?.('load-success', tableData.value)

      // 如果设置了自动展开，则展开下拉
      if (autoExpandOnInput && query) {
        visible.value = true
      }
    } catch (err: any) {
      error.value = err
      loadingState.value = 'error'
      emit?.('load-error', err)
      console.error('[TableSelect] 加载数据失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 防抖搜索
   */
  const debouncedSearch = useDebounceFn(async (query: string) => {
    searchQuery.value = query
    emit?.('search', query)
    await loadTableData(query)
  }, debounce)

  /**
   * 处理输入事件
   */
  const handleInput = (value: string) => {
    debouncedSearch(value)
  }

  /**
   * 处理行点击（单选）
   */
  const handleRowClick = (row: TableDataItem) => {
    if (multiple) return

    const value = getRowValue(row)
    const label = getRowLabel(row)

    selectedRows.value.clear()
    selectedRows.value.set(value, { row, label, value })

    // 不关闭下拉，让用户可以继续修改输入框
    // visible.value = false

    // 触发变更事件
    emitChange()
  }

  /**
   * 处理表格选择变化（多选）
   */
  const handleSelectionChange = (selection: TableDataItem[]) => {
    if (!multiple) return

    selectedRows.value.clear()
    selection.forEach((row) => {
      const value = getRowValue(row)
      const label = getRowLabel(row)
      selectedRows.value.set(value, { row, label, value })
    })

    // 触发变更事件
    emitChange()
  }

  /**
   * 触发变更事件
   */
  const emitChange = () => {
    const value = currentValue.value
    const rows = multiple
      ? Array.from(selectedRows.value.values()).map((item) => item.row)
      : Array.from(selectedRows.value.values())[0]?.row

    emit?.('change', value, rows)

    // 更新 v-model
    if (modelValue) {
      modelValue.value = value
    }
  }

  /**
   * 切换下拉显示状态
   */
  const toggleVisible = () => {
    visible.value = !visible.value
    emit?.('visible-change', visible.value)
  }

  /**
   * 清空选择
   */
  const clear = () => {
    selectedRows.value.clear()
    searchQuery.value = ''
    tableData.value = []
    emit?.('clear')
    emitChange()
  }

  /**
   * 手动搜索
   */
  const search = async (query: string) => {
    await loadTableData(query)
  }

  /**
   * 刷新数据
   */
  const refresh = async () => {
    await loadTableData(searchQuery.value)
  }

  /**
   * 根据值初始化选中行
   */
  const initSelectedRows = (value: any) => {
    if (value === undefined || value === null) {
      selectedRows.value.clear()
      return
    }

    // 如果表格数据为空，无法初始化
    if (tableData.value.length === 0) {
      return
    }

    selectedRows.value.clear()

    if (multiple && Array.isArray(value)) {
      value.forEach((val) => {
        const row = tableData.value.find((item) => getRowValue(item) === val)
        if (row) {
          const label = getRowLabel(row)
          selectedRows.value.set(val, { row, label, value: val })
        }
      })
    } else if (!multiple) {
      const row = tableData.value.find((item) => getRowValue(item) === value)
      if (row) {
        const label = getRowLabel(row)
        selectedRows.value.set(value, { row, label, value })
      }
    }
  }

  /**
   * 获取表格当前选中的行（用于回显）
   */
  const getTableSelection = computed(() => {
    return Array.from(selectedRows.value.values()).map((item) => item.row)
  })

  /**
   * 监听 modelValue 变化，初始化选中行
   */
  watch(
    () => modelValue?.value,
    (newValue) => {
      if (newValue !== currentValue.value) {
        initSelectedRows(newValue)
      }
    },
    { immediate: true }
  )

  /**
   * 监听下拉显示状态
   */
  watch(visible, (newVisible) => {
    if (newVisible) {
      // 展开时，如果没有数据且没有搜索查询，加载一次数据
      if (tableData.value.length === 0 && !searchQuery.value) {
        loadTableData('')
      }
    }
  })

  return {
    // 状态
    loading,
    loadingState,
    error,
    visible,
    searchQuery,
    tableData,
    selectedRows,
    inputDisplayValue,
    currentValue,
    getTableSelection,

    // 方法
    loadTableData,
    handleInput,
    handleRowClick,
    handleSelectionChange,
    toggleVisible,
    clear,
    search,
    refresh,
    getRowValue,
    getRowLabel
  }
}
