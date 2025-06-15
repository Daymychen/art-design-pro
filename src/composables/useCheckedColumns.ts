// 动态列配置

import { ref, computed } from 'vue'
import { $t } from '@/locales'

// 定义列配置接口
export interface ColumnOption {
  type?: 'selection' | 'expand' | 'index'
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  disabled?: boolean
  formatter?: (row: any) => any
  [key: string]: any
}

// 定义列选择状态接口
export interface ColumnCheck {
  prop: string
  label: string
  checked: boolean
}

// 特殊列类型常量
const SELECTION_KEY = '__selection__'
const EXPAND_KEY = '__expand__'
const INDEX_KEY = '__index__'

// 工具函数：根据列配置生成列选择状态
const getColumnChecks = (columns: ColumnOption[]): ColumnCheck[] => {
  const checks: ColumnCheck[] = []

  columns.forEach((column) => {
    if (column.type === 'selection') {
      checks.push({
        prop: SELECTION_KEY,
        label: $t('table.column.selection'),
        checked: true
      })
    } else if (column.type === 'expand') {
      checks.push({
        prop: EXPAND_KEY,
        label: $t('table.column.expand'),
        checked: true
      })
    } else if (column.type === 'index') {
      checks.push({
        prop: INDEX_KEY,
        label: $t('table.column.index'),
        checked: true
      })
    } else {
      checks.push({
        prop: column.prop as string,
        label: column.label as string,
        checked: true
      })
    }
  })

  return checks
}

export function useCheckedColumns(columnsFactory: () => ColumnOption[]) {
  // 获取所有列定义
  const allColumns = columnsFactory()

  // 列选中状态，初始包含所有普通列和特殊类型列
  const columnChecks = ref<ColumnCheck[]>(getColumnChecks(allColumns))

  // 当前显示的列
  const columns = computed(() => {
    const cols = allColumns
    const columnMap = new Map<string, ColumnOption>()

    cols.forEach((column) => {
      if (column.type === 'selection') {
        columnMap.set(SELECTION_KEY, column)
      } else if (column.type === 'expand') {
        columnMap.set(EXPAND_KEY, column)
      } else if (column.type === 'index') {
        columnMap.set(INDEX_KEY, column)
      } else {
        columnMap.set(column.prop as string, column)
      }
    })

    return columnChecks.value
      .filter((item) => item.checked)
      .map((check) => columnMap.get(check.prop) as ColumnOption)
  })

  return {
    columns,
    columnChecks
  }
}
