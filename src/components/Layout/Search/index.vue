<template>
  <div class="search-widget">
    <el-dialog
      v-model="showSearchDialog"
      width="600"
      :show-close="false"
      :lock-scroll="false"
      modal-class="search-modal"
      @close="closeSearchDialog"
    >
      <el-input
        v-model.trim="searchVal"
        :placeholder="$t('search.placeholder')"
        @input="search"
        @blur="searchBlur"
        ref="searchInput"
        :prefix-icon="Search"
        @keydown.up.prevent="highlightPrevious"
        @keydown.down.prevent="highlightNext"
        @keydown.enter.prevent="selectHighlighted"
      >
        <template #suffix>
          <div class="search-keydown">
            <span>ESC</span>
          </div>
        </template>
      </el-input>
      <el-scrollbar class="search-scrollbar" max-height="370px" ref="searchResultScrollbar" always>
        <div class="result" v-show="searchResult.length">
          <div class="box" v-for="(item, index) in searchResult" :key="index">
            <div
              :class="{ highlighted: isHighlighted(index) }"
              @click="searchGoPage(item)"
              @mouseenter="highlightOnHover(index)"
            >
              {{ formatMenuTitle(item.meta.title) }}
              <i class="selected-icon iconfont-sys" v-show="isHighlighted(index)"></i>
            </div>
          </div>
        </div>

        <div
          class="history-box"
          v-show="!searchVal && searchResult.length === 0 && historyResult.length > 0"
        >
          <p class="title">{{ $t('search.historyTitle') }}</p>
          <div class="history-result">
            <div
              class="box"
              v-for="(item, index) in historyResult"
              :key="index"
              :class="{ highlighted: historyHIndex === index }"
              @click="searchGoPage(item)"
              @mouseenter="highlightOnHoverHistory(index)"
            >
              {{ formatMenuTitle(item.meta.title) }}
              <i class="selected-icon iconfont-sys" @click.stop="deleteHistory(index)"></i>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <div>
            <i class="iconfont-sys"></i>
            <i class="iconfont-sys"></i>
            <span>{{ $t('search.switchKeydown') }}</span>
          </div>
          <div>
            <i class="iconfont-sys"></i>
            <span>{{ $t('search.selectKeydown') }}</span>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import { MenuListType } from '@/types/menu'
  import { Search } from '@element-plus/icons-vue'
  import mittBus from '@/utils/mittBus'
  import { useMenuStore } from '@/store/modules/menu'
  import { formatMenuTitle } from '@/utils/menu'
  import type { ScrollbarInstance } from 'element-plus'

  const router = useRouter()
  const userStore = useUserStore()
  const menuList = computed(() => useMenuStore().getMenuList)

  const showSearchDialog = ref(false)
  const searchVal = ref('')
  const searchResult = ref<MenuListType[]>([])
  const historyMaxLength = 10

  const historyResult = computed(() => userStore.searchHistory)
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
      console.log(searchResult.value)
    } else {
      searchResult.value = []
    }
  }

  const flattenAndFilterMenuItems = (items: MenuListType[], val: string): MenuListType[] => {
    const lowerVal = val.toLowerCase()
    const result: MenuListType[] = []

    const flattenAndMatch = (item: MenuListType) => {
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

      const highlightedElement = scrollWrapper.querySelector('.highlighted')
      if (!highlightedElement) return

      const itemHeight = (highlightedElement as HTMLElement).offsetHeight
      const scrollTop = scrollWrapper.scrollTop
      const containerHeight = scrollWrapper.clientHeight
      const itemTop = (highlightedElement as HTMLElement).offsetTop
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

  const searchGoPage = (item: MenuListType) => {
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

  const addHistory = (item: MenuListType) => {
    const hasItemIndex = historyResult.value.findIndex(
      (historyItem: MenuListType) => historyItem.path === item.path
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

<style lang="scss" scoped>
  @use './style';
</style>
