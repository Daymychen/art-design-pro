<!-- 全局搜索组件 -->
<template>
  <div class="layout-search">
    <ElDialog
      v-model="showSearchDialog"
      width="600"
      :show-close="false"
      :lock-scroll="false"
      modal-class="search-modal"
      @close="closeSearchDialog"
    >
      <ElInput
        v-model.trim="searchVal"
        :placeholder="$t('search.placeholder')"
        @input="search"
        @blur="searchBlur"
        ref="searchInput"
        :prefix-icon="Search"
        class="h-12"
      >
        <template #suffix>
          <div
            class="search-keydown flex h-[18px] items-center rounded border border-[var(--art-border-color)] bg-[var(--art-bg-color)] px-1.5 text-[var(--art-gray-500)]"
          >
            <i class="iconfont-sys text-[13px]">&#xe6e6;</i>
          </div>
        </template>
      </ElInput>
      <ElScrollbar class="mt-5" max-height="370px" ref="searchResultScrollbar" always>
        <div class="result w-full bg-[var(--rt-main-bg-color)]" v-show="searchResult.length">
          <div
            class="box !mt-0 cursor-pointer text-base font-medium leading-none"
            v-for="(item, index) in searchResult"
            :key="index"
          >
            <div
              class="mt-2 flex h-[50px] items-center justify-between rounded-[calc(var(--custom-radius)/2+2px)] bg-[var(--art-gray-100)] px-4 text-[15px] font-normal text-[var(--art-gray-700)]"
              :class="
                isHighlighted(index)
                  ? 'highlighted !bg-[var(--el-color-primary-light-3)] !text-white'
                  : ''
              "
              @click="searchGoPage(item)"
              @mouseenter="highlightOnHover(index)"
            >
              {{ formatMenuTitle(item.meta.title) }}
              <i class="selected-icon iconfont-sys text-[15px]" v-show="isHighlighted(index)"
                >&#xe6e6;</i
              >
            </div>
          </div>
        </div>

        <div v-show="!searchVal && searchResult.length === 0 && historyResult.length > 0">
          <p class="text-[13px] text-[var(--art-gray-600)]">{{ $t('search.historyTitle') }}</p>
          <div class="mt-1.5 w-full bg-[var(--rt-main-bg-color)]">
            <div
              class="box mt-2 flex h-[50px] cursor-pointer items-center justify-between rounded-[calc(var(--custom-radius)/2+2px)] bg-[var(--art-gray-100)] px-4 text-[15px] font-normal text-[var(--art-gray-800)]"
              v-for="(item, index) in historyResult"
              :key="index"
              :class="
                historyHIndex === index
                  ? 'highlighted !bg-[var(--el-color-primary-light-3)] !text-white [&_.selected-icon]:!text-white'
                  : ''
              "
              @click="searchGoPage(item)"
              @mouseenter="highlightOnHoverHistory(index)"
            >
              {{ formatMenuTitle(item.meta.title) }}
              <i
                class="selected-icon iconfont-sys h-5 w-5 select-none rounded-full text-center text-[15px] leading-5 text-[var(--art-gray-500)] transition-colors duration-300 hover:bg-[rgba(0,0,0,0.2)]"
                @click.stop="deleteHistory(index)"
                >&#xe83a;</i
              >
            </div>
          </div>
        </div>
      </ElScrollbar>

      <template #footer>
        <div
          class="dialog-footer box-border flex items-center border-t border-[rgba(var(--art-gray-300-rgb),0.6)] pb-[7px] pt-1.5"
        >
          <div class="flex h-10 items-center">
            <i
              class="iconfont-sys left-[117px] top-1.5 mr-2 box-border flex h-5 w-[22px] flex-row items-center justify-center rounded-[3px] border border-[var(--art-border-dashed-color)] bg-[var(--art-bg-color)] px-1.5 text-xs text-[var(--art-gray-500)] shadow-[0_2px_0_var(--art-border-dashed-color)] last-of-type:mr-1.5"
              >&#xe6e6;</i
            >
            <span class="mr-[15px] h-[22px] text-xs leading-[22px]">{{
              $t('search.selectKeydown')
            }}</span>
          </div>
          <div class="flex h-10 items-center">
            <i
              class="iconfont-sys left-[117px] top-1.5 mr-2 box-border flex h-5 w-[22px] flex-row items-center justify-center rounded-[3px] border border-[var(--art-border-dashed-color)] bg-[var(--art-bg-color)] px-1.5 text-xs text-[var(--art-gray-500)] shadow-[0_2px_0_var(--art-border-dashed-color)] last-of-type:mr-1.5"
              >&#xe864;</i
            >
            <i
              class="iconfont-sys left-[117px] top-1.5 mr-2 box-border flex h-5 w-[22px] flex-row items-center justify-center rounded-[3px] border border-[var(--art-border-dashed-color)] bg-[var(--art-bg-color)] px-1.5 text-xs text-[var(--art-gray-500)] shadow-[0_2px_0_var(--art-border-dashed-color)] last-of-type:mr-1.5"
              >&#xe867;</i
            >
            <span class="mr-[15px] h-[22px] text-xs leading-[22px]">{{
              $t('search.switchKeydown')
            }}</span>
          </div>
          <div class="flex h-10 items-center">
            <i
              class="iconfont-sys esc left-[117px] top-1.5 mr-2 box-border flex h-5 w-7 flex-row items-center justify-center rounded-[3px] border border-[var(--art-border-dashed-color)] bg-[var(--art-bg-color)] px-1.5 text-xs text-[var(--art-gray-500)] shadow-[0_2px_0_var(--art-border-dashed-color)] last-of-type:mr-1.5"
              ><p class="text-[10px] font-medium">ESC</p></i
            >
            <span class="mr-[15px] h-[22px] text-xs leading-[22px]">{{
              $t('search.exitKeydown')
            }}</span>
          </div>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user'
  import { AppRouteRecord } from '@/types/router'
  import { Search } from '@element-plus/icons-vue'
  import { mittBus } from '@/utils/sys'
  import { useMenuStore } from '@/store/modules/menu'
  import { formatMenuTitle } from '@/router/utils/utils'
  import { type ScrollbarInstance } from 'element-plus'

  defineOptions({ name: 'ArtGlobalSearch' })

  const router = useRouter()
  const userStore = useUserStore()
  const { menuList } = storeToRefs(useMenuStore())

  const showSearchDialog = ref(false)
  const searchVal = ref('')
  const searchResult = ref<AppRouteRecord[]>([])
  const historyMaxLength = 10

  const { searchHistory: historyResult } = storeToRefs(userStore)

  const searchInput = ref<HTMLInputElement | null>(null)
  const highlightedIndex = ref(0)
  const historyHIndex = ref(0)
  const searchResultScrollbar = ref<ScrollbarInstance>()
  const isKeyboardNavigating = ref(false) // 新增状态：是否正在使用键盘导航

  // 生命周期钩子
  onMounted(() => {
    mittBus.on('openSearchDialog', openSearchDialog)
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  // 键盘快捷键处理
  const handleKeydown = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const isCommandKey = isMac ? event.metaKey : event.ctrlKey

    if (isCommandKey && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      showSearchDialog.value = true
      focusInput()
    }

    // 当搜索对话框打开时，处理方向键和回车键
    if (showSearchDialog.value) {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        highlightPrevious()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        highlightNext()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        selectHighlighted()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        showSearchDialog.value = false
      }
    }
  }

  const focusInput = () => {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }

  // 搜索逻辑
  const search = (val: string) => {
    if (val) {
      searchResult.value = flattenAndFilterMenuItems(menuList.value, val)
    } else {
      searchResult.value = []
    }
  }

  const flattenAndFilterMenuItems = (items: AppRouteRecord[], val: string): AppRouteRecord[] => {
    const lowerVal = val.toLowerCase()
    const result: AppRouteRecord[] = []

    const flattenAndMatch = (item: AppRouteRecord) => {
      if (item.meta?.isHide) return

      const lowerItemTitle = formatMenuTitle(item.meta.title).toLowerCase()

      if (item.children && item.children.length > 0) {
        item.children.forEach(flattenAndMatch)
        return
      }

      if (lowerItemTitle.includes(lowerVal) && item.path) {
        result.push({ ...item, children: undefined })
      }
    }

    items.forEach(flattenAndMatch)
    return result
  }

  // 高亮控制并实现滚动条跟随
  const highlightPrevious = () => {
    isKeyboardNavigating.value = true
    if (searchVal.value) {
      highlightedIndex.value =
        (highlightedIndex.value - 1 + searchResult.value.length) % searchResult.value.length
      scrollToHighlightedItem()
    } else {
      historyHIndex.value =
        (historyHIndex.value - 1 + historyResult.value.length) % historyResult.value.length
      scrollToHighlightedHistoryItem()
    }
    // 延迟重置键盘导航状态，防止立即被 hover 覆盖
    setTimeout(() => {
      isKeyboardNavigating.value = false
    }, 100)
  }

  const highlightNext = () => {
    isKeyboardNavigating.value = true
    if (searchVal.value) {
      highlightedIndex.value = (highlightedIndex.value + 1) % searchResult.value.length
      scrollToHighlightedItem()
    } else {
      historyHIndex.value = (historyHIndex.value + 1) % historyResult.value.length
      scrollToHighlightedHistoryItem()
    }
    setTimeout(() => {
      isKeyboardNavigating.value = false
    }, 100)
  }

  const scrollToHighlightedItem = () => {
    nextTick(() => {
      if (!searchResultScrollbar.value || !searchResult.value.length) return

      const scrollWrapper = searchResultScrollbar.value.wrapRef
      if (!scrollWrapper) return

      const highlightedElements = scrollWrapper.querySelectorAll('.result .box')
      if (!highlightedElements[highlightedIndex.value]) return

      const highlightedElement = highlightedElements[highlightedIndex.value] as HTMLElement
      const itemHeight = highlightedElement.offsetHeight
      const scrollTop = scrollWrapper.scrollTop
      const containerHeight = scrollWrapper.clientHeight
      const itemTop = highlightedElement.offsetTop
      const itemBottom = itemTop + itemHeight

      if (itemTop < scrollTop) {
        searchResultScrollbar.value.setScrollTop(itemTop)
      } else if (itemBottom > scrollTop + containerHeight) {
        searchResultScrollbar.value.setScrollTop(itemBottom - containerHeight)
      }
    })
  }

  const scrollToHighlightedHistoryItem = () => {
    nextTick(() => {
      if (!searchResultScrollbar.value || !historyResult.value.length) return

      const scrollWrapper = searchResultScrollbar.value.wrapRef
      if (!scrollWrapper) return

      const historyItems = scrollWrapper.querySelectorAll('.history-result .box')
      if (!historyItems[historyHIndex.value]) return

      const highlightedElement = historyItems[historyHIndex.value] as HTMLElement
      const itemHeight = highlightedElement.offsetHeight
      const scrollTop = scrollWrapper.scrollTop
      const containerHeight = scrollWrapper.clientHeight
      const itemTop = highlightedElement.offsetTop
      const itemBottom = itemTop + itemHeight

      if (itemTop < scrollTop) {
        searchResultScrollbar.value.setScrollTop(itemTop)
      } else if (itemBottom > scrollTop + containerHeight) {
        searchResultScrollbar.value.setScrollTop(itemBottom - containerHeight)
      }
    })
  }

  const selectHighlighted = () => {
    if (searchVal.value && searchResult.value.length) {
      searchGoPage(searchResult.value[highlightedIndex.value])
    } else if (!searchVal.value && historyResult.value.length) {
      searchGoPage(historyResult.value[historyHIndex.value])
    }
  }

  const isHighlighted = (index: number) => {
    return highlightedIndex.value === index
  }

  const searchBlur = () => {
    highlightedIndex.value = 0
  }

  const searchGoPage = (item: AppRouteRecord) => {
    showSearchDialog.value = false
    addHistory(item)
    router.push(item.path)
    searchVal.value = ''
    searchResult.value = []
  }

  // 历史记录管理
  const updateHistory = () => {
    if (Array.isArray(historyResult.value)) {
      userStore.setSearchHistory(historyResult.value)
    }
  }

  const addHistory = (item: AppRouteRecord) => {
    const hasItemIndex = historyResult.value.findIndex(
      (historyItem: AppRouteRecord) => historyItem.path === item.path
    )

    if (hasItemIndex !== -1) {
      historyResult.value.splice(hasItemIndex, 1)
    } else if (historyResult.value.length >= historyMaxLength) {
      historyResult.value.pop()
    }

    const cleanedItem = { ...item }
    delete cleanedItem.children
    delete cleanedItem.meta.authList
    historyResult.value.unshift(cleanedItem)
    updateHistory()
  }

  const deleteHistory = (index: number) => {
    historyResult.value.splice(index, 1)
    updateHistory()
  }

  // 对话框控制
  const openSearchDialog = () => {
    showSearchDialog.value = true
    focusInput()
  }

  const closeSearchDialog = () => {
    searchVal.value = ''
    searchResult.value = []
    highlightedIndex.value = 0
    historyHIndex.value = 0
  }

  // 修改 hover 高亮逻辑，只有在非键盘导航时才生效
  const highlightOnHover = (index: number) => {
    if (!isKeyboardNavigating.value && searchVal.value) {
      highlightedIndex.value = index
    }
  }

  const highlightOnHoverHistory = (index: number) => {
    if (!isKeyboardNavigating.value && !searchVal.value) {
      historyHIndex.value = index
    }
  }
</script>

<style>
  .layout-search :deep(.search-modal) {
    background-color: rgb(0 0 0 / 20%);
  }

  .layout-search :deep(.el-dialog__header) {
    padding: 5px 0;
  }

  .layout-search :deep(.el-dialog) {
    padding: 0 15px;
    border-radius: calc(var(--custom-radius) / 2 + 8px) !important;
  }

  .layout-search .el-input :deep(.el-input__wrapper) {
    background-color: rgba(var(--art-gray-200-rgb), 0.8);
    border: 1px solid var(--art-border-dashed-color);
    border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
    box-shadow: none;
  }

  .layout-search .el-input :deep(.el-input__inner) {
    color: var(--art-gray-600) !important;
  }

  .dark .layout-search .el-input :deep(.el-input__wrapper) {
    background-color: #252526;
    border: 1px solid #4c4d50;
  }

  .dark .layout-search :deep(.search-modal) {
    background-color: rgb(23 23 26 / 60%);
    backdrop-filter: none;
  }

  .dark .layout-search :deep(.el-dialog) {
    background-color: #252526;
  }

  .dark .layout-search .result .box div {
    color: rgb(255 255 255 / 60%) !important;
  }

  .dark .layout-search .result .box div.highlighted {
    color: #fff !important;
  }

  .dark .layout-search .dialog-footer > div {
    color: var(--art-gray-600) !important;
  }

  .dark .layout-search .dialog-footer > div i {
    background-color: var(--art-gray-100);
  }

  .dark .layout-search .search-keydown {
    background-color: #252526;
    border: 1px solid #4c4d50;
  }
</style>
