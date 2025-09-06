import { ref, computed, watch } from 'vue'
import { $t } from '@/locales'
import type { ColumnOption } from '@/types/component'

/**
 * 特殊列类型
 */
const SPECIAL_COLUMNS: Record<string, { prop: string; label: string }> = {
  selection: { prop: '__selection__', label: $t('table.column.selection') },
  expand: { prop: '__expand__', label: $t('table.column.expand') },
  index: { prop: '__index__', label: $t('table.column.index') }
}

/**
 * 获取列的唯一标识
 */
export const getColumnKey = <T>(col: ColumnOption<T>) =>
  SPECIAL_COLUMNS[col.type as keyof typeof SPECIAL_COLUMNS]?.prop ?? (col.prop as string)

/**
 * 获取列的检查状态
 */
export const getColumnChecks = <T>(columns: ColumnOption<T>[]) =>
  columns.map((col) => {
    const special = col.type && SPECIAL_COLUMNS[col.type]
    if (special) {
      return { ...col, prop: special.prop, label: special.label, checked: true }
    }
    return { ...col, checked: col.checked ?? true }
  })

/**
 * 动态列配置接口
 */
export interface DynamicColumnConfig<T = any> {
  /**
   * 新增列
   * @param column 列配置
   * @param index 可选的插入位置，默认末尾
   */
  addColumn: (column: ColumnOption<T>, index?: number) => void
  /**
   * 删除列
   * @param prop 列的唯一标识或标识数组
   */
  removeColumn: (prop: string | string[]) => void
  /**
   * 切换列显示状态
   * @param prop 列的唯一标识
   * @param visible 可选的显示状态，默认取反
   */
  toggleColumn: (prop: string, visible?: boolean) => void

  /**
   * 更新列
   * @param prop 列的唯一标识
   * @param updates 列配置更新
   */
  updateColumn: (prop: string, updates: Partial<ColumnOption<T>>) => void
  /**
   * 批量更新列
   * @param updates 列更新配置
   */
  batchUpdateColumns: (updates: Array<{ prop: string; updates: Partial<ColumnOption<T>> }>) => void
  /**
   * 重新排序列
   * @param fromIndex 源索引
   * @param toIndex 目标索引
   */
  reorderColumns: (fromIndex: number, toIndex: number) => void
  /**
   * 获取列配置
   * @param prop 列的唯一标识
   * @returns 列配置
   */
  getColumnConfig: (prop: string) => ColumnOption<T> | undefined
  /**
   * 获取所有列配置
   * @returns 所有列配置
   */
  getAllColumns: () => ColumnOption<T>[]
  /**
   * 重置所有列
   */
  resetColumns: () => void
}

export function useTableColumns<T = any>(
  columnsFactory: () => ColumnOption<T>[]
): {
  columns: any
  columnChecks: any
} & DynamicColumnConfig<T> {
  const dynamicColumns = ref<ColumnOption<T>[]>(columnsFactory())
  const columnChecks = ref<ColumnOption<T>[]>(getColumnChecks(dynamicColumns.value))

  // 当 dynamicColumns 变动时，重新生成 columnChecks 且保留已存在的 checked 状态
  watch(
    dynamicColumns,
    (newCols) => {
      const checkedMap = new Map(
        columnChecks.value.map((c) => [getColumnKey(c), c.checked ?? true])
      )
      const newChecks = getColumnChecks(newCols).map((c) => ({
        ...c,
        checked: checkedMap.has(getColumnKey(c)) ? checkedMap.get(getColumnKey(c)) : c.checked
      }))
      columnChecks.value = newChecks
    },
    { deep: true }
  )

  // 当前显示列（基于 columnChecks 的 checked）
  const columns = computed(() => {
    const colMap = new Map(dynamicColumns.value.map((c) => [getColumnKey(c), c]))
    return columnChecks.value
      .filter((c) => c.checked)
      .map((c) => colMap.get(getColumnKey(c)))
      .filter(Boolean) as ColumnOption<T>[]
  })

  // 支持 updater 返回新数组或直接在传入数组上 mutate
  const setDynamicColumns = (updater: (cols: ColumnOption<T>[]) => void | ColumnOption<T>[]) => {
    const copy = [...dynamicColumns.value]
    const result = updater(copy)
    dynamicColumns.value = Array.isArray(result) ? result : copy
  }

  return {
    columns,
    columnChecks,

    addColumn: (column: ColumnOption<T>, index?: number) =>
      setDynamicColumns((cols) => {
        const next = [...cols]
        if (typeof index === 'number' && index >= 0 && index <= next.length) {
          next.splice(index, 0, column)
        } else {
          next.push(column)
        }
        return next
      }),

    removeColumn: (prop: string | string[]) =>
      setDynamicColumns((cols) => {
        const propsToRemove = Array.isArray(prop) ? prop : [prop]
        return cols.filter((c) => !propsToRemove.includes(getColumnKey(c)))
      }),

    updateColumn: (prop: string, updates: Partial<ColumnOption<T>>) =>
      setDynamicColumns((cols) =>
        cols.map((c) => (getColumnKey(c) === prop ? { ...c, ...updates } : c))
      ),

    toggleColumn: (prop: string, visible?: boolean) => {
      const i = columnChecks.value.findIndex((c) => getColumnKey(c) === prop)
      if (i > -1) {
        const next = [...columnChecks.value]
        next[i] = { ...next[i], checked: visible ?? !next[i].checked }
        columnChecks.value = next
      }
    },

    resetColumns: () => {
      dynamicColumns.value = columnsFactory()
    },

    batchUpdateColumns: (updates) =>
      setDynamicColumns((cols) => {
        const map = new Map(updates.map((u) => [u.prop, u.updates]))
        return cols.map((c) => {
          const key = getColumnKey(c)
          const upd = map.get(key)
          return upd ? { ...c, ...upd } : c
        })
      }),

    reorderColumns: (fromIndex: number, toIndex: number) =>
      setDynamicColumns((cols) => {
        if (
          fromIndex < 0 ||
          fromIndex >= cols.length ||
          toIndex < 0 ||
          toIndex >= cols.length ||
          fromIndex === toIndex
        ) {
          return cols
        }
        const next = [...cols]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        return next
      }),

    getColumnConfig: (prop: string) => dynamicColumns.value.find((c) => getColumnKey(c) === prop),

    getAllColumns: () => [...dynamicColumns.value]
  }
}
