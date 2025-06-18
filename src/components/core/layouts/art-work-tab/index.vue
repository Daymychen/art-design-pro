<template>
  <div class="worktab" :class="[tabStyle]" v-if="showWorkTab">
    <div class="scroll-view" ref="scrollRef">
      <ul
        class="tabs"
        ref="tabsRef"
        :style="{ transform: `translateX(${translateX}px)`, transition: `${transition}` }"
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
          {{ formatMenuTitle(item.title) }}
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
  // 导入必要的组件和工具
  import { computed, onMounted, ref, watch, nextTick } from 'vue'
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
  const { t } = useI18n()
  const store = useWorktabStore()
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()
  const { currentRoute } = router
  const settingStore = useSettingStore()

  const { tabStyle, showWorkTab } = storeToRefs(settingStore)

  // 初始化状态和引用
  const scrollRef = ref<HTMLElement | null>(null) // 滚动容器引用
  const tabsRef = ref<HTMLElement | null>(null) // 标签列表容器引用
  const menuRef = ref() // 右键菜单引用

  // 滚动相关状态
  const translateX = ref(0) // 标签列表水平偏移量
  const transition = ref('') // 过渡动画样式
  const clickedPath = ref('') // 当前点击的标签路径
  let startX = 0 // 触摸开始位置
  let currentX = 0 // 当前触摸位置

  // 打开的标签页列表
  const list = computed(() => store.opened)
  // 当前激活的标签页
  const activeTab = computed(() => currentRoute.value.path)
  // 获取当前激活 tab 的 index
  const activeTabIndex = computed(() => list.value.findIndex((tab) => tab.path === activeTab.value))

  // 右键菜单选项
  const menuItems = computed(() => {
    const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)
    const isLastTab = clickedIndex === list.value.length - 1
    const isOneTab = list.value.length === 1
    const isCurrentTab = clickedPath.value === activeTab.value
    const currentTab = list.value[clickedIndex]

    // 检查左侧标签页是否全部为固定标签页
    const leftTabs = list.value.slice(0, clickedIndex)
    const areAllLeftTabsFixed = leftTabs.length > 0 && leftTabs.every((tab) => tab.fixedTab)

    // 检查右侧标签页是否全部为固定标签页
    const rightTabs = list.value.slice(clickedIndex + 1)
    const areAllRightTabsFixed = rightTabs.length > 0 && rightTabs.every((tab) => tab.fixedTab)

    // 检查其他标签页是否全部为固定标签页
    const otherTabs = list.value.filter((_, index) => index !== clickedIndex)
    const areAllOtherTabsFixed = otherTabs.length > 0 && otherTabs.every((tab) => tab.fixedTab)

    // 检查所有标签页是否全部为固定标签页
    const areAllTabsFixed = list.value.every((tab) => tab.fixedTab)

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
        disabled: clickedIndex === 0 || areAllLeftTabsFixed
      },
      {
        key: 'right',
        label: t('worktab.btn.closeRight'),
        icon: '&#xe865;',
        disabled: isLastTab || areAllRightTabsFixed
      },
      {
        key: 'other',
        label: t('worktab.btn.closeOther'),
        icon: '&#xe83a;',
        disabled: isOneTab || areAllOtherTabsFixed
      },
      {
        key: 'all',
        label: t('worktab.btn.closeAll'),
        icon: '&#xe71a;',
        disabled: isOneTab || areAllTabsFixed
      }
    ]
  })

  // 获取当前标签页索引和元素
  const getCurTabEl = () =>
    document.getElementById(`scroll-li-${activeTabIndex.value}`) as HTMLElement

  // 设置过渡动画
  const setTransition = () => {
    transition.value = 'transform 0.5s cubic-bezier(0.15, 0, 0.15, 1)'
    setTimeout(() => {
      transition.value = ''
    }, 250)
  }

  // 自动定位当前标签页到可视区域
  const worktabAutoPosition = () => {
    if (!scrollRef.value || !tabsRef.value) return

    const scrollWidth = scrollRef.value.offsetWidth
    const ulWidth = tabsRef.value.offsetWidth
    const curTabEl = getCurTabEl()

    if (!curTabEl) return

    const { offsetLeft, clientWidth } = curTabEl
    const curTabRight = offsetLeft + clientWidth
    const targetLeft = scrollWidth - curTabRight

    if (
      (offsetLeft > Math.abs(translateX.value) && curTabRight <= scrollWidth) ||
      (translateX.value < targetLeft && targetLeft < 0)
    )
      return

    requestAnimationFrame(() => {
      if (curTabRight > scrollWidth) {
        translateX.value = Math.max(targetLeft - 6, scrollWidth - ulWidth)
      } else if (offsetLeft < Math.abs(translateX.value)) {
        translateX.value = -offsetLeft
      }
    })
  }

  // 生命周期钩子
  onMounted(() => {
    listenerScroll() // 监听滚动事件
    addTouchListeners() // 添加触摸事件监听
    worktabAutoPosition() // 初始定位
  })

  // 监听路由变化，自动定位标签页
  watch(
    () => currentRoute.value,
    () => {
      setTransition()
      worktabAutoPosition()
    }
  )

  // 监听语言变化，重置标签页位置
  watch(
    () => userStore.language,
    () => {
      translateX.value = 0
      nextTick(() => {
        worktabAutoPosition()
      })
    }
  )

  // 标签页操作方法
  const clickTab = (item: WorkTab) => {
    router.push({
      path: item.path,
      query: item.query as LocationQueryRaw
    })
  }

  // 关闭标签页的不同方式
  const closeWorktab = (type: string, tabPath: string) => {
    let path = typeof tabPath === 'string' ? tabPath : route.path

    switch (type) {
      case 'current':
        store.removeTab(path)
        break
      case 'left':
        store.removeLeft(path)
        break
      case 'right':
        store.removeRight(path)
        break
      case 'other':
        store.removeOthers(path)
        break
      case 'all':
        store.removeAll()
        break
    }

    setTimeout(() => {
      worktabClosePosition()
    }, 100)
  }

  // 关闭标签页后的位置调整
  const worktabClosePosition = () => {
    if (!scrollRef.value || !tabsRef.value) return

    const curTabEl = getCurTabEl()
    if (!curTabEl) return

    const { offsetLeft, clientWidth } = curTabEl
    const scrollWidth = scrollRef.value.offsetWidth
    const ulWidth = tabsRef.value.offsetWidth
    const curTabLeft = offsetLeft + clientWidth

    requestAnimationFrame(() => {
      translateX.value = curTabLeft > scrollWidth ? scrollWidth - ulWidth : 0
    })
  }

  // 右键菜单相关方法
  const showMenu = (e: MouseEvent, path?: string) => {
    clickedPath.value = path || ''
    menuRef.value?.show(e)
    e.preventDefault()
    e.stopPropagation()
  }

  const handleSelect = (item: MenuItemType) => {
    const { key } = item

    // 刷新页面操作
    if (key === 'refresh') {
      useCommon().refresh()
      return
    }

    // 固定
    if (key === 'fixed') {
      useWorktabStore().toggleFixedTab(clickedPath.value)
      return
    }

    const activeIndex = list.value.findIndex((tab) => tab.path === activeTab.value)
    const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)

    // 定义需要导航的操作类型
    const navigationRules = {
      left: activeIndex < clickedIndex,
      right: activeIndex > clickedIndex,
      other: true
    } as const

    // 处理标签跳转逻辑
    const shouldNavigate = navigationRules[key as keyof typeof navigationRules]

    if (shouldNavigate) {
      router.push(clickedPath.value)
    }

    // 关闭标签页
    closeWorktab(key, clickedPath.value)
  }

  // 滚动事件处理
  const listenerScroll = () => {
    const xMax = 0

    if (tabsRef.value) {
      tabsRef.value.addEventListener(
        'wheel',
        (event: WheelEvent) => {
          if (scrollRef.value && tabsRef.value) {
            event.preventDefault()

            if (tabsRef.value.offsetWidth <= scrollRef.value.offsetWidth) return

            const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth
            // 使用 deltaX 来处理水平滚动，使用 deltaY 来处理垂直滚动
            const delta =
              Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
            translateX.value = Math.min(Math.max(translateX.value - delta, xMin), xMax)
          }
        },
        { passive: false }
      )
    }
  }

  // 触摸事件处理
  const addTouchListeners = () => {
    if (tabsRef.value) {
      tabsRef.value.addEventListener('touchstart', handleTouchStart)
      tabsRef.value.addEventListener('touchmove', handleTouchMove)
      tabsRef.value.addEventListener('touchend', handleTouchEnd)
    }
  }

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!scrollRef.value || !tabsRef.value) return

    currentX = event.touches[0].clientX
    const deltaX = currentX - startX
    const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth

    translateX.value = Math.min(Math.max(translateX.value + deltaX, xMin), 0)
    startX = currentX
  }

  const handleTouchEnd = () => {
    setTransition()
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>
