<!-- 表格头部，包含表格大小、刷新、全屏、列设置、其他设置 -->
<template>
  <div class="flex-cb" id="art-table-header">
    <div class="flex-wrap">
      <slot name="left"></slot>
    </div>

    <div class="flex-c md:justify-end">
      <div
        v-if="showSearchBar != null"
        class="button"
        @click="search"
        :class="showSearchBar ? 'active !bg-theme hover:!bg-theme/80' : ''"
      >
        <ArtSvgIcon icon="ri:search-line" :class="showSearchBar ? 'text-white' : 'text-g-700'" />
      </div>
      <div
        v-if="shouldShow('refresh')"
        class="button"
        @click="refresh"
        :class="{ loading: loading && isManualRefresh }"
      >
        <ArtSvgIcon
          icon="ri:refresh-line"
          :class="loading && isManualRefresh ? 'animate-spin text-g-600' : ''"
        />
      </div>

      <ElDropdown v-if="shouldShow('size')" @command="handleTableSizeChange">
        <div class="button">
          <ArtSvgIcon icon="ri:arrow-up-down-fill" />
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <div
              v-for="item in tableSizeOptions"
              :key="item.value"
              class="table-size-btn-item [&_.el-dropdown-menu__item]:!mb-[3px] last:[&_.el-dropdown-menu__item]:!mb-0"
            >
              <ElDropdownItem
                :key="item.value"
                :command="item.value"
                :class="tableSize === item.value ? '!bg-g-300/55' : ''"
              >
                {{ item.label }}
              </ElDropdownItem>
            </div>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <div v-if="shouldShow('fullscreen')" class="button" @click="toggleFullScreen">
        <ArtSvgIcon :icon="isFullScreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'" />
      </div>

      <!-- 列设置 -->
      <ElPopover v-if="shouldShow('columns')" placement="bottom" trigger="click">
        <template #reference>
          <div class="button">
            <ArtSvgIcon icon="ri:align-right" />
          </div>
        </template>
        <div>
          <VueDraggable
            v-model="columns"
            :disabled="false"
            filter=".fixed-column"
            :prevent-on-filter="false"
            @move="checkColumnMove"
          >
            <div
              v-for="item in columns"
              :key="item.prop || item.type"
              class="column-option flex-c"
              :class="{ 'fixed-column': item.fixed }"
            >
              <div
                class="drag-icon mr-2 h-4.5 flex-cc text-g-500"
                :class="item.fixed ? 'cursor-default text-g-300' : 'cursor-move'"
              >
                <ArtSvgIcon
                  :icon="item.fixed ? 'ri:unpin-line' : 'ri:drag-move-2-fill'"
                  class="text-base"
                />
              </div>
              <ElCheckbox
                v-model="item.checked"
                :disabled="item.disabled"
                class="flex-1 min-w-0 [&_.el-checkbox__label]:overflow-hidden [&_.el-checkbox__label]:text-ellipsis [&_.el-checkbox__label]:whitespace-nowrap"
                >{{
                  item.label || (item.type === 'selection' ? t('table.selection') : '')
                }}</ElCheckbox
              >
            </div>
          </VueDraggable>
        </div>
      </ElPopover>
      <!-- 其他设置 -->
      <ElPopover v-if="shouldShow('settings')" placement="bottom" trigger="click">
        <template #reference>
          <div class="button">
            <ArtSvgIcon icon="ri:settings-line" />
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

  /**
   * 拖拽移动事件处理 - 防止固定列位置改变
   * @param evt move事件对象
   * @returns 是否允许移动
   */
  const checkColumnMove = (event: any) => {
    // 拖拽进入的目标 DOM 元素
    const toElement = event.related as HTMLElement
    // 如果目标位置是 fixed 列，则不允许移动
    if (toElement && toElement.classList.contains('fixed-column')) {
      return false
    }
    return true
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

<style scoped>
  @reference '@styles/tailwind.css';

  .button {
    @apply ml-2 
    size-8 
    flex 
    items-center 
    justify-center 
    cursor-pointer 
    rounded-md 
    bg-g-300/55 
    text-g-700  
    hover:bg-g-300 
    md:ml-0 
    md:mr-2.5;
  }
</style>
