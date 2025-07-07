<!-- 表格组件 -->
<template>
  <div class="art-table" :class="tableClasses" :style="tableStyles">
    <div class="table-container">
      <ElTable
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        :row-key="mergedTableConfig.rowKey"
        :height="computedTableHeight"
        :max-height="mergedTableConfig.maxHeight"
        :show-header="mergedTableConfig.showHeader"
        :highlight-current-row="mergedTableConfig.highlightCurrentRow"
        :size="computedTableSize"
        :stripe="computedStripe"
        :border="computedBorder"
        :header-cell-style="computedHeaderCellStyle"
        :empty-text="mergedTableConfig.emptyText"
        :tree-props="mergedTableConfig.treeProps"
        :default-expand-all="mergedTableConfig.defaultExpandAll"
        :expand-row-keys="mergedTableConfig.expandRowKeys"
        :default-sort="mergedTableConfig.defaultSort"
        :tooltip-effect="mergedTableConfig.tooltipEffect"
        :show-summary="mergedTableConfig.showSummary"
        :sum-text="mergedTableConfig.sumText"
        :summary-method="mergedTableConfig.summaryMethod"
        :span-method="mergedTableConfig.spanMethod"
        :select-on-indeterminate="mergedTableConfig.selectOnIndeterminate"
        :indent="mergedTableConfig.indent"
        :lazy="mergedTableConfig.lazy"
        :load="mergedTableConfig.load"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
        @current-change="handleCurrentRowChange"
        @header-click="handleHeaderClick"
        @header-contextmenu="handleHeaderContextmenu"
        @row-contextmenu="handleRowContextmenu"
        @row-dblclick="handleRowDblclick"
        @cell-click="handleCellClick"
        @cell-dblclick="handleCellDblclick"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
        @expand-change="handleExpandChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <!-- 序号列 -->
        <ElTableColumn
          v-if="shouldShowIndex"
          type="index"
          :width="INDEX_COLUMN_WIDTH"
          :label="INDEX_COLUMN_LABEL"
          align="center"
          fixed="left"
        />

        <!-- 动态列渲染 -->
        <template v-if="hasData">
          <!-- 配置式列 -->
          <template v-for="col in visibleColumns" :key="getColumnKey(col)">
            <!-- 全局序号列的特殊处理 -->
            <ElTableColumn
              v-if="col.type === COLUMN_TYPES.GLOBAL_INDEX"
              v-bind="getColumnProps(col)"
            >
              <template #default="{ $index }">
                <span>{{ getGlobalIndex($index) }}</span>
              </template>
            </ElTableColumn>

            <!-- 普通列 -->
            <ElTableColumn v-else v-bind="getColumnProps(col)">
              <!-- 表头插槽 -->
              <template v-if="col.useHeaderSlot" #header="headerSlotScope">
                <slot
                  :name="col.headerSlotName || `${col.prop}-header`"
                  v-bind="headerSlotScope"
                  :prop="col.prop"
                  :label="col.label"
                >
                  {{ col.label }}
                </slot>
              </template>

              <!-- 内容插槽 -->
              <template v-if="col.useSlot" #default="slotScope">
                <slot
                  :name="col.slotName || col.prop"
                  v-bind="slotScope"
                  :prop="col.prop"
                  :value="col.prop ? slotScope.row[col.prop] : undefined"
                />
              </template>
            </ElTableColumn>
          </template>

          <!-- 模板式列 - 支持直接写 ElTableColumn -->
          <slot />
        </template>

        <!-- 空数据 -->
        <template #empty>
          <ElEmpty :description="mergedTableConfig.emptyText" :image-size="120" v-show="!loading" />
        </template>
      </ElTable>
    </div>

    <!-- 分页 -->
    <div v-if="shouldShowPagination" class="table-pagination" :class="mergedPaginationConfig.align">
      <ElPagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="mergedPaginationConfig.sizes"
        :pager-count="isMobile ? MOBILE_PAGER_COUNT : DESKTOP_PAGER_COUNT"
        :total="total"
        :background="true"
        :size="mergedPaginationConfig.componentSize"
        :layout="computedPaginationLayout"
        :hide-on-single-page="mergedPaginationConfig.hideOnSinglePage"
        :disabled="loading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any> = Record<string, any>">
  import { useTableStore } from '@/store/modules/table'
  import { useCommon } from '@/composables/useCommon'
  import type { ColumnOption } from '@/types/component'
  import type { SortOrder } from '@/types/common'
  import type { TableInstance, TableColumnCtx } from 'element-plus'

  /** 移动端分页器显示的页码数量 */
  const MOBILE_PAGER_COUNT = 5
  /** 桌面端分页器显示的页码数量 */
  const DESKTOP_PAGER_COUNT = 7
  /** 序号列的宽度 */
  const INDEX_COLUMN_WIDTH = 60
  /** 序号列的标题 */
  const INDEX_COLUMN_LABEL = '序号'
  /** 默认每页显示数量 */
  const DEFAULT_PAGE_SIZE = 20
  /** 默认分页大小选项 */
  const DEFAULT_PAGINATION_SIZES = [10, 20, 30, 50, 100]
  /** 默认顶部边距 */
  const DEFAULT_MARGIN_TOP = 20
  /** 分页器区域高度 */
  const PAGINATION_HEIGHT = 90
  /** 表格内边距 */
  const TABLE_PADDING = 25
  /** 移动端设备断点 */
  const MOBILE_BREAKPOINT = 768

  // 列类型常量
  const COLUMN_TYPES = {
    /** 全局序号列 */
    GLOBAL_INDEX: 'globalIndex',
    /** 多选列 */
    SELECTION: 'selection',
    /** 序号列 */
    INDEX: 'index',
    /** 展开行列 */
    EXPAND: 'expand'
  } as const

  // 分页配置接口
  interface PaginationConfig {
    /** 当前页码 */
    current: number
    /** 每页显示条目个数 */
    size: number
    /** 总条目数 */
    total: number
    /** 每页显示个数选择器的选项列表 */
    sizes?: number[]
    /** 分页器的对齐方式 */
    align?: 'left' | 'center' | 'right'
    /** 分页器的布局 */
    layout?: string
    /** 只有一页时是否隐藏分页器 */
    hideOnSinglePage?: boolean
    /** 分页器的大小 */
    componentSize?: 'small' | 'default' | 'large'
  }

  // 表格配置接口
  interface TableConfig {
    /** 行数据的 Key，用于标识每一行数据 */
    rowKey?: string | ((row: T) => string)
    /** 表格高度，可以是数字或 CSS 值 */
    height?: string | number
    /** 表格最大高度，可以是数字或 CSS 值 */
    maxHeight?: string | number
    /** 表格空数据高度 */
    emptyHeight?: string | number
    /** 表格大小 */
    size?: 'small' | 'default' | 'large'
    /** 是否显示边框 */
    border?: boolean | null
    /** 是否使用斑马纹样式 */
    stripe?: boolean | null
    /** 是否显示表头 */
    showHeader?: boolean
    /** 是否高亮当前行 */
    highlightCurrentRow?: boolean
    /** 是否显示表头背景色 */
    showHeaderBackground?: boolean | null
    /** 空数据时显示的文本 */
    emptyText?: string
    /** 树形数据的配置 */
    treeProps?: { hasChildren?: string; children?: string }
    /** 是否默认展开所有行 */
    defaultExpandAll?: boolean
    /** 可以通过该属性设置目前的展开行 */
    expandRowKeys?: string[]
    /** 默认的排序列的 prop 和顺序 */
    defaultSort?: { prop: string; order: SortOrder }
    /** tooltip effect */
    tooltipEffect?: 'dark' | 'light'
    /** 是否显示合计行 */
    showSummary?: boolean
    /** 合计行第一列的文本 */
    sumText?: string
    /** 自定义的合计计算方法 */
    summaryMethod?: (param: { columns: TableColumnCtx<T>[]; data: T[] }) => string[]
    /** 合并行或列的计算方法 */
    spanMethod?: (param: {
      row: T
      column: TableColumnCtx<T>
      rowIndex: number
      columnIndex: number
    }) => number[] | { rowspan: number; colspan: number }
    /** 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为 */
    selectOnIndeterminate?: boolean
    /** 展示树形数据时，树节点的缩进 */
    indent?: number
    /** 是否懒加载子节点数据 */
    lazy?: boolean
    /** 加载子节点数据的函数 */
    load?: (row: T, treeNode: any, resolve: (data: T[]) => void) => void
  }

  // 布局配置接口
  interface LayoutConfig {
    /** 表格距离顶部距离 */
    marginTop?: number
    /** 是否显示序号列 */
    showIndex?: boolean
  }

  // 排序信息接口
  interface SortInfo {
    column: TableColumnCtx<T>
    prop: string
    order: SortOrder
  }

  // 组件属性接口
  interface TableSlotProps {
    /** 表格数据源 */
    data?: T[]
    /** 列配置 */
    columns?: ColumnOption<T>[]
    /** 是否显示加载状态 */
    loading?: boolean
    /** 分页配置 */
    pagination?: PaginationConfig
    /** 表格配置 */
    tableConfig?: TableConfig
    /** 布局配置 */
    layout?: LayoutConfig
  }

  defineOptions({ name: 'ArtTable' })

  const props = withDefaults(defineProps<TableSlotProps>(), {
    data: () => [],
    columns: () => [],
    loading: false,
    pagination: undefined,
    tableConfig: undefined,
    layout: undefined
  })

  const emit = defineEmits<{
    // 分页事件
    'pagination:change': [pagination: PaginationConfig]
    'pagination:size-change': [size: number]
    'pagination:current-change': [current: number]

    // 行操作事件
    'row:click': [row: T, column: TableColumnCtx<T>, event: Event]
    'row:dblclick': [row: T, column: TableColumnCtx<T>, event: Event]
    'row:contextmenu': [row: T, column: TableColumnCtx<T>, event: Event]
    'row:selection-change': [selection: T[]]
    'row:current-change': [currentRow: T | null, oldCurrentRow: T | null]

    // 单元格事件
    'cell:click': [row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event]
    'cell:dblclick': [row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event]
    'cell:mouse-enter': [row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event]
    'cell:mouse-leave': [row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event]

    // 表头事件
    'header:click': [column: TableColumnCtx<T>, event: Event]
    'header:contextmenu': [column: TableColumnCtx<T>, event: Event]

    // 排序筛选事件
    'sort:change': [sortInfo: SortInfo]
    'filter:change': [filterInfo: Record<string, any>]

    // 展开事件
    'expand:change': [row: T, expandedRows: T[]]

    // 选择事件
    select: [selection: T[], row: T]
    'select:all': [selection: T[]]
  }>()

  // ========== 响应式数据 ==========
  const { width } = useWindowSize()
  const tableStore = useTableStore()
  const { tableSize } = storeToRefs(tableStore)
  const tableRef = ref<TableInstance>()

  // ========== 计算属性 ==========
  /** 是否为移动端设备 */
  const isMobile = computed(() => width.value < MOBILE_BREAKPOINT)

  /** 表格是否有数据 */
  const hasData = computed(() => props.data.length > 0)

  /** 是否显示序号列 */
  const shouldShowIndex = computed(() => mergedLayoutConfig.value.showIndex && hasData.value)

  /** 是否显示分页器 */
  const shouldShowPagination = computed(
    () => props.pagination && hasData.value && mergedPaginationConfig.value.total > 0
  )

  // ========== 默认配置 ==========
  const defaultPaginationConfig: PaginationConfig = {
    current: 1,
    size: DEFAULT_PAGE_SIZE,
    total: 0,
    sizes: DEFAULT_PAGINATION_SIZES,
    align: 'center',
    layout: '',
    hideOnSinglePage: true,
    componentSize: 'default'
  }

  const defaultTableConfig: TableConfig = {
    rowKey: 'id',
    height: '100%',
    showHeader: true,
    highlightCurrentRow: false,
    emptyText: '暂无数据',
    border: null,
    stripe: null,
    showHeaderBackground: null,
    size: undefined,
    tooltipEffect: 'dark',
    showSummary: false,
    sumText: '合计',
    selectOnIndeterminate: true,
    indent: 16,
    lazy: false
  }

  const defaultLayoutConfig: LayoutConfig = {
    marginTop: DEFAULT_MARGIN_TOP,
    showIndex: false
  }

  // ========== 合并配置 ==========
  /** 合并后的分页配置 */
  const mergedPaginationConfig = computed(() => ({
    ...defaultPaginationConfig,
    ...props.pagination
  }))

  /** 合并后的表格配置 */
  const mergedTableConfig = computed(() => ({
    ...defaultTableConfig,
    ...props.tableConfig
  }))

  /** 合并后的布局配置 */
  const mergedLayoutConfig = computed(() => ({
    ...defaultLayoutConfig,
    ...props.layout
  }))

  // ========== 样式计算 ==========
  /** 表格样式类名 */
  const tableClasses = computed(() => ({
    'header-background': computedShowHeaderBackground.value,
    mobile: isMobile.value
  }))

  /** 表格内联样式 */
  const tableStyles = computed(() => ({
    marginTop: `${mergedLayoutConfig.value.marginTop}px`,
    height: shouldShowPagination.value
      ? `calc(100% - ${PAGINATION_HEIGHT}px)`
      : `calc(100% - ${TABLE_PADDING}px)`
  }))

  // ========== 表格配置计算 ==========
  /** 计算后的表格大小 */
  const computedTableSize = computed(() => mergedTableConfig.value.size || tableSize.value)

  /** 计算后的斑马纹配置 */
  const computedStripe = computed(() => mergedTableConfig.value.stripe ?? tableStore.isZebra)

  /** 计算后的边框配置 */
  const computedBorder = computed(() => mergedTableConfig.value.border ?? tableStore.isBorder)

  /** 计算后的表头背景配置 */
  const computedShowHeaderBackground = computed(
    () => mergedTableConfig.value.showHeaderBackground ?? tableStore.isHeaderBackground
  )

  /** 计算后的表头单元格样式 */
  const computedHeaderCellStyle = computed(() => ({
    backgroundColor: computedShowHeaderBackground.value
      ? 'var(--el-fill-color-lighter)'
      : 'var(--art-main-bg-color)',
    fontWeight: '500'
  }))

  /** 计算后的表格高度 */
  const computedTableHeight = computed(() => {
    if (tableStore.isFullScreen) {
      return '100%'
    }
    const { emptyHeight, height } = mergedTableConfig.value
    return !hasData.value && emptyHeight ? emptyHeight : height
  })

  // ========== 分页布局计算 ==========
  /** 计算后的分页器布局 */
  const computedPaginationLayout = computed(() => {
    const { layout } = mergedPaginationConfig.value
    if (layout) return layout

    // 根据设备类型返回不同的布局
    return isMobile.value ? 'prev, pager, next, jumper' : 'total, sizes, prev, pager, next, jumper'
  })

  // ========== 列处理 ==========
  /** 过滤可见列 */
  const visibleColumns = computed(() =>
    props.columns.filter((col) => {
      // 特殊类型列直接显示
      if (col.type) return true
      // 使用插槽的列
      if (col.useSlot) return true
      // 有formatter的列
      if (col.formatter) return true
      // 普通列（有prop的）
      return Boolean(col.prop)
    })
  )

  /**
   * 获取列的唯一键
   * @param col 列配置
   * @returns 唯一键
   */
  const getColumnKey = (col: ColumnOption<T>) => col.prop || col.type || col.label || 'unknown'

  /**
   * 获取列的属性配置
   * @param col 列配置
   * @returns 处理后的列属性
   */
  const getColumnProps = (col: ColumnOption<T>) => {
    const { useSlot, formatter, ...columnProps } = col

    // 使用插槽的列，直接返回列属性
    if (useSlot) {
      return columnProps
    }

    // 有formatter的列，包装formatter函数
    if (formatter) {
      return {
        ...columnProps,
        formatter: (row: T) => formatter(row)
      }
    }

    return columnProps
  }

  // ========== 数据处理 ==========
  /** 处理后的表格数据 */
  const tableData = computed(() => {
    const { data, pagination } = props
    const { current, size, total } = mergedPaginationConfig.value

    // 如果不显示分页或使用后端分页，直接返回原始数据
    if (!pagination || total > data.length) {
      return data
    }

    // 前端分页处理
    const start = (current - 1) * size
    const end = start + size
    return data.slice(start, end)
  })

  // ========== 分页数据 ==========
  /** 当前页码 */
  const currentPage = computed({
    get: () => mergedPaginationConfig.value.current,
    set: (val) => {
      emit('pagination:current-change', val)
      if (props.pagination) {
        emit('pagination:change', { ...mergedPaginationConfig.value, current: val })
      }
    }
  })

  /** 每页显示数量 */
  const pageSize = computed({
    get: () => mergedPaginationConfig.value.size,
    set: (val) => {
      emit('pagination:size-change', val)
      if (props.pagination) {
        emit('pagination:change', { ...mergedPaginationConfig.value, size: val })
      }
    }
  })

  /** 总条目数 */
  const total = computed(() => mergedPaginationConfig.value.total)

  // ========== 工具方法 ==========
  /**
   * 获取全局序号
   * @param index 当前行索引
   * @returns 全局序号
   */
  const getGlobalIndex = (index: number) => {
    if (!props.pagination) return index + 1
    const { current, size } = mergedPaginationConfig.value
    return (current - 1) * size + index + 1
  }

  /**
   * 滚动到顶部
   */
  const scrollToTop = () => {
    nextTick(() => {
      console.log('scrollToTop')
      tableRef.value?.setScrollTop(0)
    })
  }

  /**
   * 滚动到指定位置
   * @param position 目标位置
   */
  const scrollToPosition = (position: number) => {
    nextTick(() => {
      console.log('scrollToPosition', position)
      tableRef.value?.setScrollTop(position)
    })
  }

  // ========== 树形数据处理 ==========
  /**
   * 处理树形数据展开/折叠
   * @param rows 行数据
   * @param expand 是否展开
   */
  const processTreeRows = (rows: T[], expand: boolean) => {
    if (!tableRef.value) return

    rows.forEach((row) => {
      const rowWithChildren = row as T & { children?: T[] }
      if (rowWithChildren.children?.length && tableRef.value) {
        tableRef.value.toggleRowExpansion(row, expand)
        if (expand) {
          // 递归处理子节点
          processTreeRows(rowWithChildren.children, expand)
        }
      }
    })
  }

  // ========== 事件处理 ==========
  const handleRowClick = (row: T, column: TableColumnCtx<T>, event: Event) => {
    emit('row:click', row, column, event)
  }

  // 行双击事件
  const handleRowDblclick = (row: T, column: TableColumnCtx<T>, event: Event) => {
    emit('row:dblclick', row, column, event)
  }

  // 行右键事件
  const handleRowContextmenu = (row: T, column: TableColumnCtx<T>, event: Event) => {
    emit('row:contextmenu', row, column, event)
  }

  // 行选中事件
  const handleSelectionChange = (selection: T[]) => {
    emit('row:selection-change', selection)
  }

  // 行当前行事件
  const handleCurrentRowChange = (currentRow: T | null, oldCurrentRow: T | null) => {
    emit('row:current-change', currentRow, oldCurrentRow)
  }

  const handleCellClick = (row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event) => {
    emit('cell:click', row, column, cell, event)
  }

  // 行单元格双击事件
  const handleCellDblclick = (
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLElement,
    event: Event
  ) => {
    emit('cell:dblclick', row, column, cell, event)
  }

  // 行单元格鼠标进入事件
  const handleCellMouseEnter = (
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLElement,
    event: Event
  ) => {
    emit('cell:mouse-enter', row, column, cell, event)
  }

  // 行单元格鼠标离开事件
  const handleCellMouseLeave = (
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLElement,
    event: Event
  ) => {
    emit('cell:mouse-leave', row, column, cell, event)
  }

  // 表头点击事件
  const handleHeaderClick = (column: TableColumnCtx<T>, event: Event) => {
    emit('header:click', column, event)
  }

  // 表头右键事件
  const handleHeaderContextmenu = (column: TableColumnCtx<T>, event: Event) => {
    emit('header:contextmenu', column, event)
  }

  // 排序事件
  const handleSortChange = (sortInfo: SortInfo) => {
    emit('sort:change', sortInfo)
  }

  // 过滤事件
  const handleFilterChange = (filterInfo: Record<string, any>) => {
    emit('filter:change', filterInfo)
  }

  // 展开事件
  const handleExpandChange = (row: T, expandedRows: T[]) => {
    emit('expand:change', row, expandedRows)
  }

  // 选择事件
  const handleSelect = (selection: T[], row: T) => {
    emit('select', selection, row)
  }

  // 全选事件
  const handleSelectAll = (selection: T[]) => {
    emit('select:all', selection)
  }

  /**
   * 处理分页大小变化
   * @param val 新的分页大小
   */
  const handleSizeChange = (val: number) => {
    pageSize.value = val
  }

  /**
   * 处理当前页码变化
   * @param val 新的页码
   */
  const handleCurrentChange = (val: number) => {
    currentPage.value = val
    nextTick(() => {
      scrollToTop()
      useCommon().scrollToTop()
    })
  }

  // ========== 公共方法 ==========
  /** 获取表格实例 */
  const getTableInstance = () => tableRef.value
  /** 清空多选 */
  const clearSelection = () => tableRef.value?.clearSelection()
  /** 切换行的选中状态 */
  const toggleRowSelection = (row: T, selected?: boolean) =>
    tableRef.value?.toggleRowSelection(row, selected)
  /** 切换全选状态 */
  const toggleAllSelection = () => tableRef.value?.toggleAllSelection()
  /** 切换行的展开状态 */
  const toggleRowExpansion = (row: T, expanded?: boolean) =>
    tableRef.value?.toggleRowExpansion(row, expanded)
  /** 设置当前行 */
  const setCurrentRow = (row: T) => tableRef.value?.setCurrentRow(row)
  /** 清空排序 */
  const clearSort = () => tableRef.value?.clearSort()
  /** 清空过滤 */
  const clearFilter = (columnKeys?: string[]) => tableRef.value?.clearFilter(columnKeys)
  /** 重新布局 */
  const doLayout = () => tableRef.value?.doLayout()
  /** 手动排序 */
  const sort = (prop: string, order: string) => tableRef.value?.sort(prop, order)

  // ========== 暴露方法 ==========
  defineExpose({
    // 表格实例
    getTableInstance,

    // 展开/折叠
    expandAll: () => processTreeRows(props.data, true),
    collapseAll: () => processTreeRows(props.data, false),
    toggleRowExpansion,

    // 选择
    clearSelection,
    toggleRowSelection,
    toggleAllSelection,
    setCurrentRow,

    // 排序和过滤
    clearSort,
    clearFilter,
    sort,

    // 布局
    doLayout,

    // 滚动
    scrollToTop,
    scrollToPosition,

    // 数据
    tableData,
    visibleColumns
  })
</script>

<style>
  .el-table__row {
    background-color: var(--art-main-bg-color) !important;
  }
</style>

<style lang="scss" scoped>
  @use './style';
</style>
