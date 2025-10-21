<!-- TableSelect 组件 - 表格下拉选择器 -->
<template>
  <div
    ref="tableSelectRef"
    class="table-select-wrapper"
    :class="{ 'is-disabled': disabled, 'is-readonly': readonly }"
  >
    <!-- 输入框 -->
    <div class="table-select-input" :class="`table-select-input--${size}`">
      <ElInput
        ref="inputRef"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :size="size"
        :clearable="clearable"
        @input="handleInputChange"
        @focus="handleInputFocus"
        @clear="handleClear"
      >
        <template #suffix>
          <div class="table-select-suffix" @click.stop="handleSuffixClick">
            <ElIcon class="table-select-arrow" :class="{ 'is-reverse': visible }">
              <ArrowDown />
            </ElIcon>
          </div>
        </template>
      </ElInput>
    </div>

    <!-- 下拉表格 -->
    <Teleport to="body">
      <Transition name="el-zoom-in-top">
        <div
          v-show="visible"
          ref="popperRef"
          class="table-select-popper"
          :class="popperClass"
          :style="popperStyle"
        >
          <!-- 加载状态 -->
          <div v-if="loading" class="table-select-loading">
            <ElIcon class="is-loading">
              <Loading />
            </ElIcon>
            <span>加载中...</span>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="loadingState === 'error'" class="table-select-error">
            <ElIcon class="error-icon">
              <WarningFilled />
            </ElIcon>
            <div class="error-text">{{ errorText || '加载失败' }}</div>
            <ElButton type="primary" size="small" @click="handleRetry">重试</ElButton>
          </div>

          <!-- 空状态 -->
          <div v-else-if="tableData.length === 0" class="table-select-empty">
            <ElIcon class="empty-icon">
              <InfoFilled />
            </ElIcon>
            <div class="empty-text">{{ emptyText || '暂无数据' }}</div>
          </div>

          <!-- 表格 -->
          <div v-else class="table-select-table">
            <ElTable
              ref="tableRef"
              :data="tableData"
              :height="tableHeight"
              highlight-current-row
              v-bind="tableProps"
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange"
            >
              <!-- 单选列 -->
              <ElTableColumn v-if="!multiple" width="55" align="center">
                <template #default="{ row }">
                  <ElRadio
                    :model-value="currentRadioValue"
                    :label="row[valueKey]"
                    @change="handleRadioChange"
                  />
                </template>
              </ElTableColumn>

              <!-- 多选列 -->
              <ElTableColumn v-if="multiple" type="selection" width="55" />

              <!-- 数据列 -->
              <ElTableColumn
                v-for="column in visibleColumns"
                :key="column.prop"
                :label="column.label"
                :prop="column.prop"
                :width="column.width"
                :min-width="column.minWidth"
                :align="column.align || 'left'"
              />
            </ElTable>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, toRefs } from 'vue'
  import { ArrowDown, Loading, WarningFilled, InfoFilled } from '@element-plus/icons-vue'
  import type { TableSelectProps, TableSelectEmits } from './types'
  import { useTableSelect } from './useTableSelect'
  import type { ElTable } from 'element-plus'

  defineOptions({
    name: 'TableSelect',
    inheritAttrs: false
  })

  // Props
  const props = withDefaults(defineProps<TableSelectProps>(), {
    multiple: false,
    valueKey: 'id',
    labelKey: 'name',
    placeholder: '请输入搜索',
    debounce: 300,
    minSearchLength: 0,
    tableHeight: 300,
    pageSize: 50,
    clearable: true,
    size: 'default',
    autoExpandOnInput: true,
    disabled: false,
    readonly: false
  })

  // Emits
  const emit = defineEmits<TableSelectEmits>()

  // Model
  const model = defineModel<any>()

  // Refs
  const tableSelectRef = ref<HTMLElement>()
  const inputRef = ref<any>()
  const popperRef = ref<HTMLElement>()
  const tableRef = ref<InstanceType<typeof ElTable>>()

  // 使用核心逻辑
  const {
    loading,
    loadingState,
    visible,
    tableData,
    selectedRows,
    inputDisplayValue,
    currentValue,
    getTableSelection,
    handleInput,
    handleRowClick: onRowClick,
    handleSelectionChange: onSelectionChange,
    toggleVisible,
    clear,
    search,
    refresh,
    getRowLabel
  } = useTableSelect({
    ...props,
    modelValue: model,
    emit: emit as any
  })

  // ========== 输入框值管理 ==========
  const inputValue = ref('')

  // 当选中项变化时，更新输入框显示值
  watch(inputDisplayValue, (newValue) => {
    // 只在没有正在输入时更新
    if (!inputRef.value?.isFocused) {
      inputValue.value = newValue
    }
  })

  // 初始化输入框值
  watch(
    () => model.value,
    () => {
      inputValue.value = inputDisplayValue.value
    },
    { immediate: true }
  )

  /**
   * 处理输入变化
   */
  const handleInputChange = (value: string) => {
    inputValue.value = value
    handleInput(value)
  }

  /**
   * 处理输入框聚焦
   */
  const handleInputFocus = () => {
    // focus 时不自动展开，只有输入或点击箭头才展开
  }

  /**
   * 处理后缀图标点击
   */
  const handleSuffixClick = () => {
    if (props.disabled || props.readonly) return
    toggleVisible()
  }

  /**
   * 处理清空
   */
  const handleClear = () => {
    clear()
    inputValue.value = ''
  }

  /**
   * 处理行点击
   */
  const handleRowClickEvent = (row: any) => {
    onRowClick(row)
    // 单选模式下，选中后更新输入框值并关闭下拉
    if (!props.multiple) {
      inputValue.value = getRowLabel(row)
    }
  }

  /**
   * 处理表格选择变化
   */
  const handleSelectionChangeEvent = (selection: any[]) => {
    onSelectionChange(selection)
    // 多选模式下，更新输入框值
    if (props.multiple) {
      inputValue.value = selection.map((row) => getRowLabel(row)).join(', ')
    }
  }

  // 用于模板的引用
  const handleRowClick = handleRowClickEvent
  const handleSelectionChange = handleSelectionChangeEvent

  /**
   * 处理重试
   */
  const handleRetry = () => {
    refresh()
  }

  // ========== 下拉定位 ==========
  const popperStyle = ref<Record<string, string>>({})

  /**
   * 更新下拉位置
   */
  const updatePopperPosition = () => {
    if (!tableSelectRef.value || !popperRef.value) return

    const rect = tableSelectRef.value.getBoundingClientRect()
    const popperWidth = props.popperWidth || rect.width

    popperStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: typeof popperWidth === 'number' ? `${popperWidth}px` : popperWidth,
      zIndex: '2000'
    }
  }

  /**
   * 监听下拉显示状态，更新位置
   */
  watch(visible, async (newVisible) => {
    if (newVisible) {
      await nextTick()
      updatePopperPosition()
      // 设置表格的选中状态
      if (props.multiple && tableRef.value) {
        const selection = getTableSelection.value
        tableRef.value.clearSelection()
        selection.forEach((row) => {
          tableRef.value?.toggleRowSelection(row, true)
        })
      }
    }
  })

  /**
   * 点击外部关闭下拉
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (!visible.value) return

    const target = event.target as HTMLElement
    const isClickInside =
      tableSelectRef.value?.contains(target) || popperRef.value?.contains(target)

    if (!isClickInside) {
      visible.value = false
      // 关闭时，如果输入框值与选中值不一致，恢复选中值
      inputValue.value = inputDisplayValue.value
    }
  }

  /**
   * 窗口滚动/resize时更新位置
   */
  const handleWindowEvent = () => {
    if (visible.value) {
      updatePopperPosition()
    }
  }

  // ========== 生命周期 ==========
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', handleWindowEvent, true)
    window.addEventListener('resize', handleWindowEvent)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', handleWindowEvent, true)
    window.removeEventListener('resize', handleWindowEvent)
  })

  // ========== 计算属性 ==========
  const visibleColumns = computed(() => {
    return props.columns.filter((col) => col.show !== false)
  })

  /**
   * 当前单选框选中的值
   */
  const currentRadioValue = computed(() => {
    if (props.multiple || selectedRows.value.size === 0) {
      return undefined
    }
    return Array.from(selectedRows.value.keys())[0]
  })

  /**
   * 处理单选框变化
   */
  const handleRadioChange = (value: any) => {
    const row = tableData.value.find((item) => item[props.valueKey] === value)
    if (row) {
      handleRowClickEvent(row)
    }
  }

  /**
   * 解构 valueKey
   */
  const { valueKey } = toRefs(props)

  /**
   * 暴露方法供外部调用
   */
  defineExpose({
    /** 手动搜索 */
    search,
    /** 手动刷新数据 */
    refresh,
    /** 清空选择 */
    clear,
    /** 获取当前选中的行数据 */
    getSelectedRows: () => Array.from(selectedRows.value.values()).map((item) => item.row),
    /** 获取当前选中的值 */
    getValue: () => currentValue.value,
    /** 打开下拉 */
    open: () => {
      visible.value = true
    },
    /** 关闭下拉 */
    close: () => {
      visible.value = false
    },
    /** 切换下拉 */
    toggle: toggleVisible
  })
</script>

<style lang="scss" scoped>
  .table-select-wrapper {
    position: relative;
    width: 100%;

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &.is-readonly {
      cursor: default;
    }
  }

  .table-select-input {
    width: 100%;

    :deep(.el-input__inner) {
      cursor: pointer;
    }

    &.is-disabled :deep(.el-input__inner) {
      cursor: not-allowed;
    }
  }

  .table-select-suffix {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .table-select-arrow {
    font-size: 14px;
    transition: transform 0.3s;

    &.is-reverse {
      transform: rotate(180deg);
    }
  }

  .table-select-popper {
    position: fixed;
    overflow: hidden;
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-light);
  }

  .table-select-loading,
  .table-select-error,
  .table-select-empty {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
    min-height: 150px;
    padding: 32px 16px;
  }

  .table-select-loading {
    .is-loading {
      font-size: 32px;
      color: var(--el-color-primary);
    }

    span {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .table-select-error {
    .error-icon {
      font-size: 32px;
      color: var(--el-color-danger);
    }

    .error-text {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .table-select-empty {
    .empty-icon {
      font-size: 32px;
      color: var(--el-color-info);
    }

    .empty-text {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .table-select-table {
    :deep(.el-table) {
      border: none;

      tr {
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--el-fill-color-light);
        }
      }

      .el-table__header {
        th {
          background-color: var(--el-fill-color-lighter);
        }
      }
    }
  }
</style>
