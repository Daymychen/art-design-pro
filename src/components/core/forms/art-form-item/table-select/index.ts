/**
 * TableSelect 组件导出
 */

import TableSelect from './index.vue'

export { TableSelect }
export default TableSelect

// 导出类型
export type {
  TableSelectProps,
  TableSelectEmits,
  TableColumn,
  TableDataItem,
  LoadingState,
  SelectedRow
} from './types'

// 导出 composable
export { useTableSelect } from './useTableSelect'
export type { UseTableSelectOptions } from './useTableSelect'
