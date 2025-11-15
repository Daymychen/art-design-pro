<!-- 标签页 -->
<template>
  <div
    v-if="showWorkTab"
    class="box-border flex-b w-full px-5 mb-3 select-none max-sm:px-[15px]"
    :class="[
      tabStyle === 'tab-card' ? 'py-1 border-b border-[var(--art-card-border)]' : '',
      tabStyle === 'tab-google' ? 'pt-1 pb-0 border-b border-[var(--art-card-border)]' : ''
    ]"
  >
    <div class="w-full overflow-hidden" ref="scrollRef">
      <ul
        class="float-left whitespace-nowrap !bg-transparent flex"
        :class="[tabStyle === 'tab-google' ? 'pl-1' : '']"
        ref="tabsRef"
        :style="{
          transform: `translateX(${scrollState.translateX}px)`,
          transition: `${scrollState.transition}`
        }"
      >
        <li
          class="art-card-xs inline-flex flex-cc h-8 mr-1.5 text-xs c-p hover:text-theme group"
          :class="[
            item.path === activeTab ? 'activ-tab !text-theme' : 'text-g-600 dark:text-g-800',
            tabStyle === 'tab-google' ? 'google-tab relative !h-8 !leading-8 !border-none' : ''
          ]"
          :style="{
            padding: item.fixedTab ? '0 10px' : '0 8px 0 12px',
            borderRadius:
              tabStyle === 'tab-google'
                ? 'calc(var(--custom-radius) / 2.5 + 4px) !important'
                : 'calc(var(--custom-radius) / 2.5 + 2px) !important'
          }"
          v-for="(item, index) in list"
          :key="item.path"
          :ref="item.path"
          :id="`scroll-li-${index}`"
          @click="clickTab(item)"
          @contextmenu.prevent="(e: MouseEvent) => showMenu(e, item.path)"
        >
          <ArtSvgIcon
            v-show="item.icon"
            :icon="item.icon"
            class="text-base mr-1 group-hover:text-theme"
            :class="item.path === activeTab ? 'text-theme' : 'text-g-600'"
          />
          {{ item.customTitle || formatMenuTitle(item.title) }}
          <span
            v-if="list.length > 1 && !item.fixedTab"
            class="inline-flex flex-cc relative ml-0.5 p-1 rounded-full tad-200 hover:bg-g-200"
            @click.stop="closeWorktab('current', item.path)"
          >
            <ArtSvgIcon icon="ri:close-large-fill" class="text-[10px] text-g-600" />
          </span>
          <div
            v-if="tabStyle === 'tab-google'"
            class="line absolute top-0 bottom-0 left-0 w-px h-4 my-auto bg-g-400 transition-opacity duration-150"
          />
        </li>
      </ul>
    </div>

    <div class="flex">
      <div
        class="flex-cc art-card-xs relative top-0 size-8 leading-8 text-center c-p tad-200 hover:!bg-hover-color"
        :style="{
          borderRadius: 'calc(var(--custom-radius) / 2.5 + 0px)',
          marginTop: tabStyle === 'tab-google' ? '-2px' : ''
        }"
        @click="(e: MouseEvent) => showMenu(e, activeTab)"
      >
        <ArtSvgIcon icon="iconamoon:arrow-down-2-thin" class="text-2xl text-g-700" />
      </div>
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
  import { storeToRefs } from 'pinia'

  import { useWorktabStore } from '@/store/modules/worktab'
  import { useUserStore } from '@/store/modules/user'
  import { formatMenuTitle } from '@/utils/router'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuItemType } from '../../others/art-menu-right/index.vue'
  import { useCommon } from '@/hooks/core/useCommon'
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
          icon: 'ri:refresh-line',
          disabled: !isCurrentTab
        },
        {
          key: 'fixed',
          label: currentTab?.fixedTab ? t('worktab.btn.unfixed') : t('worktab.btn.fixed'),
          icon: 'ri:pushpin-2-line',
          disabled: false,
          showLine: true
        },
        {
          key: 'left',
          label: t('worktab.btn.closeLeft'),
          icon: 'ri:arrow-left-s-line',
          disabled: clickedIndex === 0 || fixedStatus.areAllLeftTabsFixed
        },
        {
          key: 'right',
          label: t('worktab.btn.closeRight'),
          icon: 'ri:arrow-right-s-line',
          disabled: isLastTab || fixedStatus.areAllRightTabsFixed
        },
        {
          key: 'other',
          label: t('worktab.btn.closeOther'),
          icon: 'ri:close-fill',
          disabled: isOneTab || fixedStatus.areAllOtherTabsFixed
        },
        {
          key: 'all',
          label: t('worktab.btn.closeAll'),
          icon: 'ri:close-circle-line',
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

<style scoped>
  .google-tab.activ-tab {
    color: var(--theme-color) !important;
    background-color: var(--el-color-primary-light-9) !important;
    border-bottom: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .google-tab.activ-tab::before,
  .google-tab.activ-tab::after {
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 20px;
    content: '';
    border-radius: 50%;
    box-shadow: 0 0 0 30px var(--el-color-primary-light-9);
  }

  .google-tab.activ-tab::before {
    left: -20px;
    clip-path: inset(50% -10px 0 50%);
  }

  .google-tab.activ-tab::after {
    right: -20px;
    clip-path: inset(50% 50% 0 -10px);
  }

  .dark .google-tab.activ-tab {
    color: var(--art-gray-800) !important;
    background-color: var(--art-hover-color) !important;
  }

  .dark .google-tab.activ-tab::before,
  .dark .google-tab.activ-tab::after {
    box-shadow: 0 0 0 30px var(--art-hover-color);
  }

  .google-tab:not(.activ-tab):hover {
    box-sizing: border-box;
    color: var(--art-gray-600) !important;
    background-color: var(--art-gray-200) !important;
    border-bottom: 1px solid var(--default-box-color) !important;
    border-radius: calc(var(--custom-radius) / 2.5 + 4px) !important;
  }

  .dark .google-tab:not(.activ-tab):hover {
    background-color: var(--art-hover-color) !important;
  }

  .google-tab:hover .line,
  .google-tab.activ-tab .line,
  .google-tab:first-child .line {
    opacity: 0;
  }

  .google-tab:hover + .google-tab .line,
  .google-tab.activ-tab + .google-tab .line {
    opacity: 0;
  }

  .google-tab::before,
  .google-tab::after {
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 20px;
    content: '';
    border-radius: 50%;
    box-shadow: 0 0 0 30px transparent;
  }

  .google-tab::before {
    left: -20px;
    clip-path: inset(50% -10px 0 50%);
  }

  .google-tab::after {
    right: -20px;
    clip-path: inset(50% 50% 0 -10px);
  }

  .google-tab i:hover {
    color: var(--art-gray-700);
    background: var(--art-gray-300);
  }

  @media only screen and (width <= 768px) {
    .box-border.flex.justify-between {
      padding-right: 0.625rem;
      padding-left: 0.625rem;
    }
  }

  @media only screen and (width <= 640px) {
    .box-border.flex.justify-between {
      padding-right: 0.9375rem;
      padding-left: 0.9375rem;
    }
  }
</style>
