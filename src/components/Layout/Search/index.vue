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

      <div class="result" v-show="searchResult.length">
        <div class="box" v-for="(item, pIndex) in searchResult" :key="pIndex">
          <div
            v-for="(cItem, cIndex) in item.children"
            :key="cIndex"
            @click="searchGoPage(cItem)"
            @mouseenter="highlightOnHover(pIndex, cIndex)"
            :class="{
              highlighted: isHighlighted(pIndex, cIndex)
            }"
          >
            {{ getMenuTitle(cItem) }}
            <i class="selected-icon iconfont-sys" v-show="isHighlighted(pIndex, cIndex)"
              >&#xe6e6;</i
            >
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
            :class="{
              highlighted: historyHIndex === index
            }"
            @click="searchGoPage(item)"
            @mouseenter="historyHIndex = index"
          >
            {{ getMenuTitle(item) }}
            <i class="selected-icon iconfont-sys" @click.stop="deleteHistory(index)">&#xe83a;</i>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div>
            <i class="iconfont-sys">&#xe864;</i>
            <i class="iconfont-sys">&#xe867;</i>
            <span>{{ $t('search.switchKeydown') }}</span>
          </div>
          <div>
            <i class="iconfont-sys">&#xe6e6;</i>
            <span>{{ $t('search.selectKeydown') }}</span>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { LanguageEnum } from '@/enums/appEnum'
  import { useUserStore } from '@/store/modules/user'
  import { MenuListType } from '@/types/menu'
  import { Search } from '@element-plus/icons-vue'
  import mittBus from '@/utils/mittBus'
  import { getMenuTitle } from '@/utils/menu'
  import { useMenuStore } from '@/store/modules/menu'

  const router = useRouter()
  const userStore = useUserStore()
  const language = computed(() => userStore.language)
  const menuList = computed(() => useMenuStore().getMenuList)

  const showSearchDialog = ref(false)
  const searchVal = ref()
  const searchResult: any = ref([])
  const historyMaxLength = 5 // 历史记录最大长度

  const historyResult = computed(() => userStore.searchHistory)

  const searchInput = ref<HTMLInputElement | null>(null)

  onMounted(() => {
    mittBus.on('openSearchDialog', openSearchDialog)
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

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

  const search = (val: string) => {
    if (val) {
      let list = fuzzyQueryList(menuList.value, val)
      searchResult.value = list.filter((item) => {
        return item.children!.length
      })
    } else {
      searchResult.value = []
    }
  }

  // 模糊查询
  const fuzzyQueryList = (arr: MenuListType[], val: string): MenuListType[] => {
    const titleField = language.value === LanguageEnum.ZH ? 'title' : 'title_en'
    const lowerVal = val.toLowerCase() // 将查询值转换为小写
    const searchItem = (item: MenuListType): MenuListType | null => {
      // 如果当前项有 noMenu: true，直接过滤掉
      if (item.noMenu) return null

      // 将 item[titleField] 转换为小写进行比较
      const lowerItemTitle = item[titleField]!.toLowerCase()

      // 查找子项并过滤符合条件的子项
      const children = item.children ? fuzzyQueryList(item.children, val) : []

      // 如果子项符合条件或当前项标题包含查询值，返回该项
      if (children.length || lowerItemTitle.includes(lowerVal)) {
        return { ...item, children }
      }

      // 否则过滤掉
      return null
    }

    // 使用 map 和 filter 来优化处理逻辑，排除 null 结果
    return arr.map(searchItem).filter((item): item is MenuListType => item !== null)
  }

  // 搜索逻辑
  const highlightedIndex = ref([0, 0]) // [parentIndex, childIndex]
  const historyHIndex = ref(0)

  // 搜索框键盘向上切换
  const highlightPrevious = () => {
    if (searchVal.value) {
      const [parentIndex, childIndex] = highlightedIndex.value

      if (childIndex > 0) {
        highlightedIndex.value = [parentIndex, childIndex - 1]
      } else if (parentIndex > 0) {
        const previousParent = searchResult.value[parentIndex - 1]
        const newChildIndex =
          previousParent.children.length > 0 ? previousParent.children.length - 1 : -1
        highlightedIndex.value = [parentIndex - 1, newChildIndex]
      } else {
        const lastParentIndex = searchResult.value.length - 1
        const lastParent = searchResult.value[lastParentIndex]
        const newChildIndex = lastParent.children.length > 0 ? lastParent.children.length - 1 : -1
        highlightedIndex.value = [lastParentIndex, newChildIndex]
      }
    } else {
      historyHIndex.value =
        (historyHIndex.value - 1 + historyResult.value.length) % historyResult.value.length
    }
  }

  // 搜索框键盘向下切换
  const highlightNext = () => {
    if (searchVal.value) {
      const [parentIndex, childIndex] = highlightedIndex.value
      const currentParent = searchResult.value[parentIndex]

      const hasMoreChildren = childIndex < currentParent.children.length - 1

      if (hasMoreChildren) {
        highlightedIndex.value = [parentIndex, childIndex + 1]
      } else if (parentIndex < searchResult.value.length - 1) {
        highlightedIndex.value = [parentIndex + 1, 0]
      } else {
        highlightedIndex.value = [0, 0]
      }
    } else {
      historyHIndex.value = (historyHIndex.value + 1) % historyResult.value.length
    }
  }

  // 搜索框键盘回车跳转页面
  const selectHighlighted = () => {
    if (searchVal.value) {
      const [parentIndex, childIndex] = highlightedIndex.value
      if (parentIndex !== -1) {
        const selectedItem =
          childIndex === -1
            ? searchResult.value[parentIndex]
            : searchResult.value[parentIndex].children[childIndex]
        if (selectedItem) {
          searchInput.value?.blur()
          searchGoPage(selectedItem)
        }
      }
    } else {
      if (!searchVal.value && historyResult.value.length === 0) {
        return
      }
      searchGoPage(historyResult.value[historyHIndex.value])
    }
  }

  const isHighlighted = (parentIndex: number, childIndex?: number) => {
    const [highlightedParentIndex, highlightedChildIndex] = highlightedIndex.value
    return childIndex === undefined
      ? highlightedParentIndex === parentIndex && highlightedChildIndex === -1
      : highlightedParentIndex === parentIndex && highlightedChildIndex === childIndex
  }

  const searchBlur = () => {
    highlightedIndex.value = [0, 0]
  }

  const searchGoPage = (item: MenuListType) => {
    showSearchDialog.value = false

    addHistory(item)

    // 如果 path 是以 http 开头则跳转到新的页面
    if (item.path.startsWith('http')) {
      window.open(item.path)
      return
    }
    router.push(item.path)
    searchVal.value = ''
    searchResult.value = []
  }

  // 添加历史记录
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
      historyResult.value.splice(hasItemIndex, 1) // 如果存在则删除
    } else if (historyResult.value.length >= historyMaxLength) {
      historyResult.value.pop() // 超过最大记录数则删除最后一个
    }

    cleanItem(item)
    historyResult.value.unshift(item) // 添加新的 item 到头部
    updateHistory()
  }

  const cleanItem = (item: MenuListType) => {
    delete item.children
    delete item.authList
  }

  const deleteHistory = (index: number) => {
    historyResult.value.splice(index, 1)
    updateHistory()
  }

  const openSearchDialog = () => {
    showSearchDialog.value = true
    focusInput()
  }

  const closeSearchDialog = () => {
    searchVal.value = ''
    searchResult.value = []
    highlightedIndex.value = [0, 0]
    historyHIndex.value = 0
  }

  // 鼠标 hover 高亮
  const highlightOnHover = (pIndex: number, cIndex: number) => {
    highlightedIndex.value = [pIndex, cIndex]
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>
