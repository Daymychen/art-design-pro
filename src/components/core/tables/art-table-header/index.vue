<!-- 表格头部，包含表格大小、刷新、全屏、列设置、其他设置 -->
<template>
  <div class="table-header" id="art-table-header">
    <div class="left">
      <slot name="left"></slot>
    </div>

    <div class="right">
      <div
        v-if="showSearchBar != null"
        class="btn"
        @click="search"
        :class="{ active: showSearchBar }"
      >
        <i class="iconfont-sys">&#xe6cb;</i>
      </div>
      <div
        v-if="shouldShow('refresh')"
        class="btn"
        @click="refresh"
        :class="{ loading: loading && isManualRefresh }"
      >
        <i class="iconfont-sys">&#xe615;</i>
      </div>

      <ElDropdown v-if="shouldShow('size')" @command="handleTableSizeChange">
        <div class="btn">
          <i class="iconfont-sys">&#xe63d;</i>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <div v-for="item in tableSizeOptions" :key="item.value" class="table-size-btn-item">
              <ElDropdownItem
                :key="item.value"
                :command="item.value"
                :class="{ 'is-selected': tableSize === item.value }"
              >
                {{ item.label }}
              </ElDropdownItem>
            </div>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <div v-if="shouldShow('fullscreen')" class="btn" @click="toggleFullScreen">
        <i class="iconfont-sys">{{ isFullScreen ? '&#xe62d;' : '&#xe8ce;' }}</i>
      </div>

      <!-- 列设置 -->
      <ElPopover v-if="shouldShow('columns')" placement="bottom" trigger="click">
        <template #reference>
          <div class="btn"><i class="iconfont-sys">&#xe6bd;</i> </div>
        </template>
        <div>
          <VueDraggable
            v-model="columns"
            :disabled="false"
            filter=".fixed-column"
            :prevent-on-filter="false"
          >
            <div
              v-for="item in columns"
              :key="item.prop || item.type"
              class="column-option"
              :class="{ 'fixed-column': item.fixed }"
            >
              <div class="drag-icon" :class="{ disabled: item.fixed }">
                <i class="iconfont-sys">{{ item.fixed ? '&#xe648;' : '&#xe648;' }}</i>
              </div>
              <ElCheckbox v-model="item.checked" :disabled="item.disabled">{{
                item.label || (item.type === 'selection' ? t('table.selection') : '')
              }}</ElCheckbox>
            </div>
          </VueDraggable>
        </div>
      </ElPopover>
      <!-- 其他设置 -->
      <ElPopover v-if="shouldShow('settings')" placement="bottom" trigger="click">
        <template #reference>
          <div class="btn">
            <i class="iconfont-sys" style="font-size: 17px">&#xe72b;</i>
          </div>
        </template>
        <div>
          <ElCheckbox v-if="showZebra" v-model="isZebra" :value="true">{{
            t('table.zebra')
          }}</ElCheckbox>
          <ElCheckbox v-if="showBorder" v-model="isBorder" :value="true">{{
            t('table.border')
          }}</ElCheckbox>
          <ElCheckbox v-if="showHeaderBackground" v-model="isHeaderBackground" :value="true">{{
            t('table.headerBackground')
          }}</ElCheckbox>
        </div>
      </ElPopover>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { TableSizeEnum } from '@/enums/formEnum'
  import { useTableStore } from '@/store/modules/table'
  import { VueDraggable } from 'vue-draggable-plus'
  import { useI18n } from 'vue-i18n'
  import type { ColumnOption } from '@/types/component'

  defineOptions({ name: 'ArtTableHeader' })

  const { t } = useI18n()

  interface Props {
    /** 斑马纹 */
    showZebra?: boolean
    /** 边框 */
    showBorder?: boolean
    /** 表头背景 */
    showHeaderBackground?: boolean
    /** 全屏 class */
    fullClass?: string
    /** 组件布局，子组件名用逗号分隔 */
    layout?: string
    /** 加载中 */
    loading?: boolean
    /** 搜索栏显示状态 */
    showSearchBar?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    showZebra: true,
    showBorder: true,
    showHeaderBackground: true,
    fullClass: 'art-page-view',
    layout: 'search,refresh,size,fullscreen,columns,settings',
    showSearchBar: undefined
  })

  const columns = defineModel<ColumnOption[]>('columns', {
    required: false,
    default: () => []
  })

  const emit = defineEmits<{
    (e: 'refresh'): void
    (e: 'search'): void
    (e: 'update:showSearchBar', value: boolean): void
  }>()

  /** 表格大小选项配置 */
  const tableSizeOptions = [
    { value: TableSizeEnum.SMALL, label: t('table.sizeOptions.small') },
    { value: TableSizeEnum.DEFAULT, label: t('table.sizeOptions.default') },
    { value: TableSizeEnum.LARGE, label: t('table.sizeOptions.large') }
  ]

  const tableStore = useTableStore()
  const { tableSize, isZebra, isBorder, isHeaderBackground } = storeToRefs(tableStore)

  /** 解析 layout 属性，转换为数组 */
  const layoutItems = computed(() => {
    return props.layout.split(',').map((item) => item.trim())
  })

  /**
   * 检查组件是否应该显示
   * @param componentName 组件名称
   * @returns 是否显示
   */
  const shouldShow = (componentName: string) => {
    return layoutItems.value.includes(componentName)
  }

  /** 搜索事件处理 */
  const search = () => {
    // 切换搜索栏显示状态
    emit('update:showSearchBar', !props.showSearchBar)
    emit('search')
  }

  /** 刷新事件处理 */
  const refresh = () => {
    isManualRefresh.value = true
    emit('refresh')
  }

  /**
   * 表格大小变化处理
   * @param command 表格大小枚举值
   */
  const handleTableSizeChange = (command: TableSizeEnum) => {
    useTableStore().setTableSize(command)
  }

  /** 是否手动点击刷新 */
  const isManualRefresh = ref(false)

  /** 加载中 */
  const isFullScreen = ref(false)

  /** 保存原始的 overflow 样式，用于退出全屏时恢复 */
  const originalOverflow = ref('')

  /**
   * 切换全屏状态
   * 进入全屏时会隐藏页面滚动条，退出时恢复原状态
   */
  const toggleFullScreen = () => {
    const el = document.querySelector(`.${props.fullClass}`)
    if (!el) return

    isFullScreen.value = !isFullScreen.value

    if (isFullScreen.value) {
      // 进入全屏：保存原始样式并隐藏滚动条
      originalOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      el.classList.add('el-full-screen')
      tableStore.setIsFullScreen(true)
    } else {
      // 退出全屏：恢复原始样式
      document.body.style.overflow = originalOverflow.value
      el.classList.remove('el-full-screen')
      tableStore.setIsFullScreen(false)
    }
  }

  /**
   * ESC键退出全屏的事件处理器
   * 需要保存引用以便在组件卸载时正确移除监听器
   */
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullScreen.value) {
      toggleFullScreen()
    }
  }

  /** 组件挂载时注册全局事件监听器 */
  onMounted(() => {
    document.addEventListener('keydown', handleEscapeKey)
  })

  /** 组件卸载时清理资源 */
  onUnmounted(() => {
    // 移除事件监听器
    document.removeEventListener('keydown', handleEscapeKey)

    // 如果组件在全屏状态下被卸载，恢复页面滚动状态
    if (isFullScreen.value) {
      document.body.style.overflow = originalOverflow.value
      const el = document.querySelector(`.${props.fullClass}`)
      if (el) {
        el.classList.remove('el-full-screen')
      }
    }
  })
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

    .left {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 0;
    }

    .right {
      display: flex;
      align-items: center;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-left: 8px;
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

        &.loading {
          i {
            color: var(--art-gray-600);
            animation: loading-spin 1s linear infinite;
          }
        }

        &.active {
          background-color: var(--el-color-primary);

          i {
            color: #fff;
          }

          &:hover {
            background-color: var(--el-color-primary-light-3);

            i {
              color: #fff;
            }
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

      &.disabled {
        color: var(--art-gray-300);
        cursor: default;
      }
    }

    .el-checkbox {
      flex: 1;
      min-width: 0;

      .el-checkbox__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  @media (max-width: $device-phone) {
    .table-header {
      flex-direction: column;

      .right {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;

        .btn {
          margin-right: 10px;
          margin-left: 0;
        }
      }
    }
  }

  @keyframes loading-spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
