<template>
  <div class="table-header">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <div class="btn" @click="refresh">
        <i class="iconfont-sys">&#xe614;</i>
      </div>
      <!-- <div class="btn" @click="download">
        <i class="iconfont-sys">&#xe89f;</i>
      </div> -->
      <div class="btn" @click="toggleFullScreen">
        <i class="iconfont-sys">{{ isFullScreen ? '&#xe62d;' : '&#xe8ce;' }}</i>
      </div>

      <!-- 列设置 -->
      <ElPopover placement="bottom" trigger="click">
        <template #reference>
          <div class="btn">
            <i class="iconfont-sys">&#xe6dc;</i>
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

  const refresh = () => {
    emit('refresh')
  }

  // const download = () => {}

  const isFullScreen = ref(false)

  // 全屏
  const toggleFullScreen = () => {
    const el = document.querySelector('#table-full-screen')
    if (!el) return

    el.classList.toggle('el-full-screen')
  }
</script>

<style lang="scss" scoped>
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
