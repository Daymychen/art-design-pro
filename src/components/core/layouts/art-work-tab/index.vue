<!-- 标签页 -->
<template>
  <div class="worktab" :class="[tabStyle]" v-if="showWorkTab">
    <div class="scroll-view" ref="scrollRef">
      <ul
        class="tabs"
        ref="tabsRef"
        :style="{
          transform: `translateX(${scrollState.translateX}px)`,
          transition: `${scrollState.transition}`
        }"
      >
        <li
          class="art-custom-card"
          v-for="(item, index) in list"
          :key="item.path"
          :ref="item.path"
          :class="{ 'activ-tab': item.path === activeTab }"
          :id="`scroll-li-${index}`"
          :style="{ padding: item.fixedTab ? '0 10px' : '0 8px 0 12px' }"
          @click="clickTab(item)"
          @contextmenu.prevent="(e: MouseEvent) => showMenu(e, item.path)"
        >
          {{ item.customTitle || formatMenuTitle(item.title) }}
          <el-icon
            v-if="list.length > 1 && !item.fixedTab"
            @click.stop="closeWorktab('current', item.path)"
          >
            <Close />
          </el-icon>
          <div class="line"></div>
        </li>
      </ul>
    </div>

    <div class="right">
      <el-icon
        class="btn console-box art-custom-card"
        @click="(e: MouseEvent) => showMenu(e, activeTab)"
      >
        <ArrowDown />
      </el-icon>
    </div>

    <ArtMenuRight
      ref="menuRef"
      :menu-items="menuItems"
      :menu-width="140"
      :border-radius="10"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
  import { LocationQueryRaw, useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { ArrowDown, Close } from '@element-plus/icons-vue'
  import { storeToRefs } from 'pinia'

  import { useWorktabStore } from '@/store/modules/worktab'
  import { useUserStore } from '@/store/modules/user'
  import { formatMenuTitle } from '@/router/utils/utils'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuItemType } from '../../others/art-menu-right/index.vue'
  import { useCommon } from '@/composables/useCommon'
  import { WorkTab } from '@/types'

  defineOptions({ name: 'ArtWorkTab' })

  // 类型定义
  interface ScrollState {
    translateX: number
    transition: string
  }

  interface TouchState {
    startX: number
    currentX: number
  }

  type TabCloseType = 'current' | 'left' | 'right' | 'other' | 'all'

  // 基础设置
  const { t } = useI18n()
  const store = useWorktabStore()
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()
  const { currentRoute } = router
  const settingStore = useSettingStore()
  const { tabStyle, showWorkTab } = storeToRefs(settingStore)

  // DOM 引用
  const scrollRef = ref<HTMLElement | null>(null)
  const tabsRef = ref<HTMLElement | null>(null)
  const menuRef = ref()

  // 状态管理
  const scrollState = ref<ScrollState>({
    translateX: 0,
    transition: ''
  })

  const touchState = ref<TouchState>({
    startX: 0,
    currentX: 0
  })

  const clickedPath = ref('')

  // 计算属性
  const list = computed(() => store.opened)
  const activeTab = computed(() => currentRoute.value.path)
  const activeTabIndex = computed(() => list.value.findIndex((tab) => tab.path === activeTab.value))

  // 右键菜单逻辑
  const useContextMenu = () => {
    const getClickedTabInfo = () => {
      const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)
      const currentTab = list.value[clickedIndex]

      return {
        clickedIndex,
        currentTab,
        isLastTab: clickedIndex === list.value.length - 1,
        isOneTab: list.value.length === 1,
        isCurrentTab: clickedPath.value === activeTab.value
      }
    }

    // 检查标签页是否固定
    const checkTabsFixedStatus = (clickedIndex: number) => {
      const leftTabs = list.value.slice(0, clickedIndex)
      const rightTabs = list.value.slice(clickedIndex + 1)
      const otherTabs = list.value.filter((_, index) => index !== clickedIndex)

      return {
        areAllLeftTabsFixed: leftTabs.length > 0 && leftTabs.every((tab) => tab.fixedTab),
        areAllRightTabsFixed: rightTabs.length > 0 && rightTabs.every((tab) => tab.fixedTab),
        areAllOtherTabsFixed: otherTabs.length > 0 && otherTabs.every((tab) => tab.fixedTab),
        areAllTabsFixed: list.value.every((tab) => tab.fixedTab)
      }
    }

    // 右键菜单选项
    const menuItems = computed(() => {
      const { clickedIndex, currentTab, isLastTab, isOneTab, isCurrentTab } = getClickedTabInfo()
      const fixedStatus = checkTabsFixedStatus(clickedIndex)

      return [
        {
          key: 'refresh',
          label: t('worktab.btn.refresh'),
          icon: '&#xe6b3;',
          disabled: !isCurrentTab
        },
        {
          key: 'fixed',
          label: currentTab?.fixedTab ? t('worktab.btn.unfixed') : t('worktab.btn.fixed'),
          icon: '&#xe644;',
          disabled: false,
          showLine: true
        },
        {
          key: 'left',
          label: t('worktab.btn.closeLeft'),
          icon: '&#xe866;',
          disabled: clickedIndex === 0 || fixedStatus.areAllLeftTabsFixed
        },
        {
          key: 'right',
          label: t('worktab.btn.closeRight'),
          icon: '&#xe865;',
          disabled: isLastTab || fixedStatus.areAllRightTabsFixed
        },
        {
          key: 'other',
          label: t('worktab.btn.closeOther'),
          icon: '&#xe83a;',
          disabled: isOneTab || fixedStatus.areAllOtherTabsFixed
        },
        {
          key: 'all',
          label: t('worktab.btn.closeAll'),
          icon: '&#xe71a;',
          disabled: isOneTab || fixedStatus.areAllTabsFixed
        }
      ]
    })

    return { menuItems }
  }

  // 滚动逻辑
  const useScrolling = () => {
    const setTransition = () => {
      scrollState.value.transition = 'transform 0.5s cubic-bezier(0.15, 0, 0.15, 1)'
      setTimeout(() => {
        scrollState.value.transition = ''
      }, 250)
    }

    const getCurrentTabElement = (): HTMLElement | null => {
      return document.getElementById(`scroll-li-${activeTabIndex.value}`)
    }

    const calculateScrollPosition = () => {
      if (!scrollRef.value || !tabsRef.value) return

      const scrollWidth = scrollRef.value.offsetWidth
      const ulWidth = tabsRef.value.offsetWidth
      const curTabEl = getCurrentTabElement()

      if (!curTabEl) return

      const { offsetLeft, clientWidth } = curTabEl
      const curTabRight = offsetLeft + clientWidth
      const targetLeft = scrollWidth - curTabRight

      return {
        scrollWidth,
        ulWidth,
        offsetLeft,
        clientWidth,
        curTabRight,
        targetLeft
      }
    }

    const autoPositionTab = () => {
      const positions = calculateScrollPosition()
      if (!positions) return

      const { scrollWidth, ulWidth, offsetLeft, curTabRight, targetLeft } = positions

      if (
        (offsetLeft > Math.abs(scrollState.value.translateX) && curTabRight <= scrollWidth) ||
        (scrollState.value.translateX < targetLeft && targetLeft < 0)
      ) {
        return
      }

      requestAnimationFrame(() => {
        if (curTabRight > scrollWidth) {
          scrollState.value.translateX = Math.max(targetLeft - 6, scrollWidth - ulWidth)
        } else if (offsetLeft < Math.abs(scrollState.value.translateX)) {
          scrollState.value.translateX = -offsetLeft
        }
      })
    }

    const adjustPositionAfterClose = () => {
      const positions = calculateScrollPosition()
      if (!positions) return

      const { scrollWidth, ulWidth, offsetLeft, clientWidth } = positions
      const curTabLeft = offsetLeft + clientWidth

      requestAnimationFrame(() => {
        scrollState.value.translateX = curTabLeft > scrollWidth ? scrollWidth - ulWidth : 0
      })
    }

    return {
      setTransition,
      autoPositionTab,
      adjustPositionAfterClose
    }
  }

  // 事件处理逻辑
  const useEventHandlers = () => {
    const { setTransition, adjustPositionAfterClose } = useScrolling()

    const handleWheelScroll = (event: WheelEvent) => {
      if (!scrollRef.value || !tabsRef.value) return

      event.preventDefault()

      if (tabsRef.value.offsetWidth <= scrollRef.value.offsetWidth) return

      const xMax = 0
      const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      scrollState.value.translateX = Math.min(
        Math.max(scrollState.value.translateX - delta, xMin),
        xMax
      )
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchState.value.startX = event.touches[0].clientX
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!scrollRef.value || !tabsRef.value) return

      touchState.value.currentX = event.touches[0].clientX
      const deltaX = touchState.value.currentX - touchState.value.startX
      const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth

      scrollState.value.translateX = Math.min(
        Math.max(scrollState.value.translateX + deltaX, xMin),
        0
      )
      touchState.value.startX = touchState.value.currentX
    }

    const handleTouchEnd = () => {
      setTransition()
    }

    const setupEventListeners = () => {
      if (tabsRef.value) {
        tabsRef.value.addEventListener('wheel', handleWheelScroll, { passive: false })
        tabsRef.value.addEventListener('touchstart', handleTouchStart, { passive: true })
        tabsRef.value.addEventListener('touchmove', handleTouchMove, { passive: true })
        tabsRef.value.addEventListener('touchend', handleTouchEnd, { passive: true })
      }
    }

    const cleanupEventListeners = () => {
      if (tabsRef.value) {
        tabsRef.value.removeEventListener('wheel', handleWheelScroll)
        tabsRef.value.removeEventListener('touchstart', handleTouchStart)
        tabsRef.value.removeEventListener('touchmove', handleTouchMove)
        tabsRef.value.removeEventListener('touchend', handleTouchEnd)
      }
    }

    return {
      setupEventListeners,
      cleanupEventListeners,
      adjustPositionAfterClose
    }
  }

  // 标签页操作逻辑
  const useTabOperations = (adjustPositionAfterClose: () => void) => {
    const clickTab = (item: WorkTab) => {
      router.push({
        path: item.path,
        query: item.query as LocationQueryRaw
      })
    }

    const closeWorktab = (type: TabCloseType, tabPath: string) => {
      const path = typeof tabPath === 'string' ? tabPath : route.path

      const closeActions = {
        current: () => store.removeTab(path),
        left: () => store.removeLeft(path),
        right: () => store.removeRight(path),
        other: () => store.removeOthers(path),
        all: () => store.removeAll()
      }

      closeActions[type]?.()

      setTimeout(() => {
        adjustPositionAfterClose()
      }, 100)
    }

    const showMenu = (e: MouseEvent, path?: string) => {
      clickedPath.value = path || ''
      menuRef.value?.show(e)
      e.preventDefault()
      e.stopPropagation()
    }

    const handleSelect = (item: MenuItemType) => {
      const { key } = item

      if (key === 'refresh') {
        useCommon().refresh()
        return
      }

      if (key === 'fixed') {
        useWorktabStore().toggleFixedTab(clickedPath.value)
        return
      }

      const activeIndex = list.value.findIndex((tab) => tab.path === activeTab.value)
      const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)

      const navigationRules = {
        left: activeIndex < clickedIndex,
        right: activeIndex > clickedIndex,
        other: true
      } as const

      const shouldNavigate = navigationRules[key as keyof typeof navigationRules]

      if (shouldNavigate) {
        router.push(clickedPath.value)
      }

      closeWorktab(key as TabCloseType, clickedPath.value)
    }

    return {
      clickTab,
      closeWorktab,
      showMenu,
      handleSelect
    }
  }

  // 组合所有逻辑
  const { menuItems } = useContextMenu()
  const { setTransition, autoPositionTab } = useScrolling()
  const { setupEventListeners, cleanupEventListeners, adjustPositionAfterClose } =
    useEventHandlers()
  const { clickTab, closeWorktab, showMenu, handleSelect } =
    useTabOperations(adjustPositionAfterClose)

  // 生命周期
  onMounted(() => {
    setupEventListeners()
    autoPositionTab()
  })

  onUnmounted(() => {
    cleanupEventListeners()
  })

  // 监听器
  watch(
    () => currentRoute.value,
    () => {
      setTransition()
      autoPositionTab()
    }
  )

  watch(
    () => userStore.language,
    () => {
      scrollState.value.translateX = 0
      nextTick(() => {
        autoPositionTab()
      })
    }
  )
</script>

<style lang="scss" scoped>
  @use './style';
</style>
