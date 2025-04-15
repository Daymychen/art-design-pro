<!-- 表格组件，带分页（默认分页大于一页时显示） -->
<template>
  <div class="art-table" :class="{ 'header-background': showHeaderBackground }">
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-key="rowKey"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!-- 选择列 -->
      <el-table-column v-if="selection" type="selection" width="55" align="center" fixed="left" />

      <!-- 序号列 -->
      <el-table-column
        v-if="index"
        type="index"
        width="60"
        label="序号"
        align="center"
        fixed="left"
      />

      <!-- 动态列 -->
      <slot></slot>

      <!-- 空数据 -->
      <template #empty>
        <el-empty :description="emptyText" />
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="pagination" class="table-pagination" :class="paginationAlign">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :background="true"
        :size="paginationSize"
        :layout="paginationLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :hide-on-single-page="hideOnSinglePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TableProps {
    /** 表格数据源 */
    data?: any[]
    /** 是否显示加载状态 */
    loading?: boolean
    /** 行数据的 Key，用于标识每一行数据 */
    rowKey?: string
    /** 是否显示边框 */
    border?: boolean
    /** 是否使用斑马纹样式 */
    stripe?: boolean
    /** 是否显示多选列 */
    selection?: boolean
    /** 是否显示序号列 */
    index?: boolean
    /** 表格高度，可以是数字或 CSS 值 */
    height?: string | number
    /** 表格最大高度，可以是数字或 CSS 值 */
    maxHeight?: string | number
    /** 是否显示表头 */
    showHeader?: boolean
    /** 是否高亮当前行 */
    highlightCurrentRow?: boolean
    /** 空数据时显示的文本 */
    emptyText?: string
    /** 是否显示分页 */
    pagination?: boolean
    /** 总条目数 */
    total?: number
    /** 当前页码 */
    currentPage?: number
    /** 每页显示条目个数 */
    pageSize?: number
    /** 每页显示个数选择器的选项列表 */
    pageSizes?: number[]
    /** 只有一页时是否隐藏分页器 */
    hideOnSinglePage?: boolean
    /** 分页器的对齐方式 */
    paginationAlign?: 'left' | 'center' | 'right'
    /** 分页器的大小 */
    paginationSize?: 'small' | 'default' | 'large'
    /** 分页器的布局 */
    paginationLayout?: string
    /** 是否显示表头背景色 */
    showHeaderBackground?: boolean
  }

  const props = withDefaults(defineProps<TableProps>(), {
    data: () => [],
    loading: false,
    rowKey: 'id',
    border: false,
    stripe: false,
    selection: false,
    index: false,
    showHeader: true,
    highlightCurrentRow: false,
    emptyText: '暂无数据',
    pagination: true,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    hideOnSinglePage: true,
    pageSizes: () => [10, 20, 30, 50],
    paginationAlign: 'center',
    paginationSize: 'default',
    paginationLayout: 'total, sizes, prev, pager, next, jumper',
    showHeaderBackground: false
  })

  const emit = defineEmits([
    'update:currentPage',
    'update:pageSize',
    'selection-change',
    'row-click',
    'size-change',
    'current-change'
  ])

  // 表格数据
  const tableData = computed(() => props.data)

  // 当前页
  const currentPage = computed({
    get: () => props.currentPage,
    set: (val) => emit('update:currentPage', val)
  })

  // 每页条数
  const pageSize = computed({
    get: () => props.pageSize,
    set: (val) => emit('update:pageSize', val)
  })

  // 选择项改变
  const handleSelectionChange = (selection: any[]) => {
    emit('selection-change', selection)
  }

  // 行点击事件
  const handleRowClick = (row: any, column: any, event: any) => {
    emit('row-click', row, column, event)
  }

  // 每页条数改变
  const handleSizeChange = (val: number) => {
    emit('size-change', val)
  }

  // 当前页改变
  const handleCurrentChange = (val: number) => {
    emit('current-change', val)
  }
</script>

<style lang="scss" scoped>
  .art-table {
    margin-top: 20px;

    .table-pagination {
      display: flex;
      margin-top: 16px;

      // 分页对齐方式
      &.left {
        justify-content: flex-start;
      }

      &.center {
        justify-content: center;
      }

      &.right {
        justify-content: flex-end;
      }
    }

    :deep(.el-table) {
      th.el-table__cell {
        font-weight: 600;
      }

      td.el-table__cell,
      th.el-table__cell {
        padding: 16px 0; // 设置表格单元格高度
      }
    }

    &.header-background {
      :deep(.el-table) {
        th.el-table__cell {
          background-color: var(--el-fill-color-light);
        }
      }
    }

    // 解决el-image 和 el-table冲突层级冲突问题
    ::v-deep(.el-table__cell) {
      position: static !important;
    }
  }
</style>
