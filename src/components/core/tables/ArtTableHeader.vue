<template>
  <div class="table-header">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <div class="btn" @click="refresh">
        <i class="iconfont-sys">&#xe614;</i>
      </div>

      <el-dropdown @command="handleTableSizeChange">
        <div class="btn">
          <i class="iconfont-sys">&#xe63d;</i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <div v-for="item in tableSizeOptions" :key="item.value" class="table-size-btn-item">
              <el-dropdown-item
                :key="item.value"
                :command="item.value"
                :class="{ 'is-selected': tableSize === item.value }"
              >
                {{ item.label }}
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div class="btn" @click="toggleFullScreen">
        <i class="iconfont-sys">{{ isFullScreen ? '&#xe62d;' : '&#xe8ce;' }}</i>
      </div>

      <!-- 列设置 -->
      <ElPopover placement="bottom" trigger="click">
        <template #reference>
          <div class="btn">
            <i class="iconfont-sys" style="font-size: 18px">&#xe72b;</i>
          </div>
        </template>
        <div>
          <VueDraggable v-model="columns">
            <div v-for="item in columns" :key="item.prop || item.type" class="column-option">
              <div class="drag-icon">
                <i class="iconfont-sys">&#xe648;</i>
              </div>
              <ElCheckbox v-model="item.checked" :disabled="item.disabled">{{
                item.label || (item.type === 'selection' ? '选择' : '')
              }}</ElCheckbox>
            </div>
          </VueDraggable>
        </div>
      </ElPopover>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TableSizeEnum } from '@/enums/formEnum'
  import { useTableStore } from '@/store/modules/table'
  import { ElPopover, ElCheckbox } from 'element-plus'
  import { VueDraggable } from 'vue-draggable-plus'

  const columns = defineModel<ColumnOption[]>('columns', { required: true })
  const emit = defineEmits<{
    (e: 'refresh'): void
  }>()

  interface ColumnOption {
    label?: string
    prop?: string
    type?: string
    width?: string | number
    fixed?: boolean | 'left' | 'right'
    sortable?: boolean
    filters?: any[]
    filterMethod?: (value: any, row: any) => boolean
    filterPlacement?: string
    disabled?: boolean
    checked?: boolean
  }

  const tableSizeOptions = [
    { value: TableSizeEnum.SMALL, label: '紧凑' },
    { value: TableSizeEnum.DEFAULT, label: '默认' },
    { value: TableSizeEnum.LARGE, label: '宽松' }
  ]

  const tableStore = useTableStore()
  const { tableSize } = storeToRefs(tableStore)

  const refresh = () => {
    emit('refresh')
  }

  // 表格大小
  const handleTableSizeChange = (command: TableSizeEnum) => {
    useTableStore().setTableSize(command)
  }

  const isFullScreen = ref(false)

  // 全屏
  const toggleFullScreen = () => {
    const el = document.querySelector('#table-full-screen')
    if (!el) return

    el.classList.toggle('el-full-screen')
  }
</script>

<style lang="scss" scoped>
  :deep(.table-size-btn-item) {
    .el-dropdown-menu__item {
      margin-bottom: 3px !important;
    }

    &:last-child {
      .el-dropdown-menu__item {
        margin-bottom: 0 !important;
      }
    }
  }

  :deep(.is-selected) {
    background-color: rgba(var(--art-gray-200-rgb), 0.8) !important;
  }

  .table-header {
    display: flex;
    justify-content: space-between;

    .right {
      display: flex;
      align-items: center;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-left: 10px;
        color: var(--art-gray-700);
        cursor: pointer;
        background-color: rgba(var(--art-gray-200-rgb), 0.8);
        border-radius: 6px;
        transition: color 0.3s;
        transition: all 0.3s;

        i {
          font-size: 16px;
          color: var(--art-gray-700);
          user-select: none;
        }

        &:hover {
          background-color: rgba(var(--art-gray-300-rgb), 0.75);

          i {
            color: var(--art-gray-800);
          }
        }
      }
    }
  }

  :deep(.column-option) {
    display: flex;
    align-items: center;

    .drag-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 18px;
      margin-right: 8px;
      color: var(--art-gray-500);
      cursor: move;

      i {
        font-size: 18px;
      }
    }
  }
</style>
