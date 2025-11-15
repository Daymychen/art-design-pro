<!-- 左侧菜单 或 双列菜单 -->
<template>
  <div
    class="layout-sidebar"
    v-if="showLeftMenu || isDualMenu"
    :class="{ 'no-border': menuList.length === 0 }"
  >
    <!-- 双列菜单（左侧） -->
    <div
      v-if="isDualMenu"
      class="dual-menu-left"
      :style="{ width: dualMenuShowText ? '80px' : '64px', background: getMenuTheme.background }"
    >
      <ArtLogo class="logo" @click="navigateToHome" />

      <ElScrollbar style="height: calc(100% - 135px)">
        <ul>
          <li v-for="menu in firstLevelMenus" :key="menu.path" @click="handleMenuJump(menu, true)">
            <ElTooltip
              class="box-item"
              effect="dark"
              :content="$t(menu.meta.title)"
              placement="right"
              :offset="15"
              :hide-after="0"
              :disabled="dualMenuShowText"
            >
              <div
                :class="{
                  'is-active': menu.meta.isFirstLevel
                    ? menu.path === route.path
                    : menu.path === firstLevelMenuPath
                }"
                :style="{
                  height: dualMenuShowText ? '60px' : '46px'
                }"
              >
                <ArtSvgIcon
                  class="menu-icon text-g-700 dark:text-g-800"
                  :icon="menu.meta.icon"
                  :style="{
                    marginBottom: dualMenuShowText ? '5px' : '0'
                  }"
                />
                <span v-if="dualMenuShowText" class="text-md text-g-700">
                  {{ $t(menu.meta.title) }}
                </span>
                <div v-if="menu.meta.showBadge" class="art-badge art-badge-dual" />
              </div>
            </ElTooltip>
          </li>
        </ul>
      </ElScrollbar>

      <ArtIconButton
        class="switch-btn size-10"
        icon="ri:arrow-left-right-fill"
        @click="toggleDualMenuMode"
      />
    </div>

    <!-- 左侧菜单 || 双列菜单（右侧） -->
    <div
      v-show="menuList.length > 0"
      class="menu-left"
      :class="`menu-left-${getMenuTheme.theme} menu-left-${!menuOpen ? 'close' : 'open'}`"
      :style="{ background: getMenuTheme.background }"
    >
      <ElScrollbar :style="scrollbarStyle">
        <!-- Logo、系统名称 -->
        <div
          class="header"
          @click="navigateToHome"
          :style="{
            background: getMenuTheme.background
          }"
        >
          <ArtLogo v-if="!isDualMenu" class="logo" />

          <p
            :class="{ 'is-dual-menu-name': isDualMenu }"
            :style="{
              color: getMenuTheme.systemNameColor,
              opacity: !menuOpen ? 0 : 1
            }"
          >
            {{ AppConfig.systemInfo.name }}
          </p>
        </div>

        <ElMenu
          :class="'el-menu-' + getMenuTheme.theme"
          :collapse="!menuOpen"
          :default-active="routerPath"
          :text-color="getMenuTheme.textColor"
          :unique-opened="uniqueOpened"
          :background-color="getMenuTheme.background"
          :default-openeds="defaultOpenedMenus"
          :popper-class="`menu-left-popper menu-left-${getMenuTheme.theme}-popper`"
          :show-timeout="50"
          :hide-timeout="50"
        >
          <SidebarSubmenu
            :list="menuList"
            :isMobile="isMobileMode"
            :theme="getMenuTheme"
            @close="handleMenuClose"
          />
        </ElMenu>
      </ElScrollbar>

      <!-- 双列菜单右侧折叠按钮 -->
      <div class="dual-menu-collapse-btn" v-if="isDualMenu" @click="toggleMenuVisibility">
        <ArtSvgIcon
          class="text-g-500/70"
          :icon="menuOpen ? 'ri:arrow-left-wide-fill' : 'ri:arrow-right-wide-fill'"
        />
      </div>

      <div
        class="menu-model"
        @click="toggleMenuVisibility"
        :style="{
          opacity: !menuOpen ? 0 : 1,
          transform: showMobileModal ? 'scale(1)' : 'scale(0)'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { isIframe } from '@/utils/navigation'
  import { handleMenuJump } from '@/utils/navigation'
  import SidebarSubmenu from './widget/SidebarSubmenu.vue'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useWindowSize, useTimeoutFn } from '@vueuse/core'

  defineOptions({ name: 'ArtSidebarMenu' })

  const MOBILE_BREAKPOINT = 800
  const ANIMATION_DELAY = 350
  const MENU_CLOSE_WIDTH = MenuWidth.CLOSE

  const route = useRoute()
  const router = useRouter()
  const settingStore = useSettingStore()

  const { getMenuOpenWidth, menuType, uniqueOpened, dualMenuShowText, menuOpen, getMenuTheme } =
    storeToRefs(settingStore)

  // 组件内部状态
  const defaultOpenedMenus = ref<string[]>([])
  const isMobileMode = ref(false)
  const showMobileModal = ref(false)

  // 使用 VueUse 的窗口尺寸监听
  const { width } = useWindowSize()

  // 菜单宽度相关
  const menuopenwidth = computed(() => getMenuOpenWidth.value)
  const menuclosewidth = computed(() => MENU_CLOSE_WIDTH)

  // 菜单类型判断
  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)
  const showLeftMenu = computed(
    () => menuType.value === MenuTypeEnum.LEFT || menuType.value === MenuTypeEnum.TOP_LEFT
  )
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)

  // 移动端屏幕判断（使用 computed 避免重复计算）
  const isMobileScreen = computed(() => width.value < MOBILE_BREAKPOINT)

  // 路由相关
  const firstLevelMenuPath = computed(() => route.matched[0]?.path)
  const routerPath = computed(() => String(route.meta.activePath || route.path))

  // 菜单数据
  const firstLevelMenus = computed(() => {
    return useMenuStore().menuList.filter((menu) => !menu.meta.isHide)
  })

  const menuList = computed(() => {
    const menuStore = useMenuStore()
    const allMenus = menuStore.menuList

    // 如果不是顶部左侧菜单或双列菜单，直接返回完整菜单列表
    if (!isTopLeftMenu.value && !isDualMenu.value) {
      return allMenus
    }

    // 处理 iframe 路径
    if (isIframe(route.path)) {
      return findIframeMenuList(route.path, allMenus)
    }

    // 处理一级菜单
    if (route.meta.isFirstLevel) {
      return []
    }

    // 返回当前顶级路径对应的子菜单
    const currentTopPath = `/${route.path.split('/')[1]}`
    const currentMenu = allMenus.find((menu) => menu.path === currentTopPath)
    return currentMenu?.children ?? []
  })

  // 双列菜单收起时的滚动条样式
  const scrollbarStyle = computed(() => {
    const isCollapsed = isDualMenu.value && !menuOpen.value
    return {
      transform: isCollapsed ? 'translateY(-50px)' : 'translateY(0)',
      height: isCollapsed ? 'calc(100% + 50px)' : '100%',
      transition: 'transform 0.3s ease'
    }
  })

  /**
   * 延迟隐藏移动端模态框（使用 VueUse 的 useTimeoutFn）
   */
  const { start: delayHideMobileModal } = useTimeoutFn(
    () => {
      showMobileModal.value = false
    },
    ANIMATION_DELAY,
    { immediate: false }
  )

  /**
   * 查找 iframe 对应的二级菜单列表
   */
  const findIframeMenuList = (currentPath: string, menuList: any[]) => {
    // 递归查找包含当前路径的菜单项
    const hasPath = (items: any[]): boolean => {
      for (const item of items) {
        if (item.path === currentPath) {
          return true
        }
        if (item.children && hasPath(item.children)) {
          return true
        }
      }
      return false
    }

    // 遍历一级菜单查找匹配的子菜单
    for (const menu of menuList) {
      if (menu.children && hasPath(menu.children)) {
        return menu.children
      }
    }
    return []
  }

  const { homePath } = useCommon()

  /**
   * 导航到首页
   */
  const navigateToHome = (): void => {
    router.push(homePath.value)
  }

  /**
   * 切换菜单显示/隐藏
   */
  const toggleMenuVisibility = (): void => {
    settingStore.setMenuOpen(!menuOpen.value)

    // 移动端模态框控制逻辑
    if (isMobileScreen.value) {
      if (!menuOpen.value) {
        // 菜单即将打开，立即显示模态框
        showMobileModal.value = true
      } else {
        // 菜单即将关闭，延迟隐藏模态框确保动画完成
        delayHideMobileModal()
      }
    }
  }

  /**
   * 处理菜单关闭（来自子组件）
   */
  const handleMenuClose = (): void => {
    if (isMobileScreen.value) {
      settingStore.setMenuOpen(false)
      delayHideMobileModal()
    }
  }

  /**
   * 切换双列菜单模式
   */
  const toggleDualMenuMode = (): void => {
    settingStore.setDualMenuShowText(!dualMenuShowText.value)
  }

  /**
   * 监听窗口尺寸变化，自动处理移动端菜单
   */
  watch(width, (newWidth) => {
    if (newWidth < MOBILE_BREAKPOINT) {
      settingStore.setMenuOpen(false)
      if (!menuOpen.value) {
        showMobileModal.value = false
      }
    } else {
      showMobileModal.value = false
    }
  })

  /**
   * 监听菜单开关状态变化
   */
  watch(menuOpen, (isMenuOpen: boolean) => {
    if (!isMobileScreen.value) {
      // 大屏幕设备上，模态框始终隐藏
      showMobileModal.value = false
    } else {
      // 小屏幕设备上，根据菜单状态控制模态框
      if (isMenuOpen) {
        // 菜单打开时立即显示模态框
        showMobileModal.value = true
      } else {
        // 菜单关闭时延迟隐藏模态框，确保动画完成
        delayHideMobileModal()
      }
    }
  })
</script>

<style lang="scss" scoped>
  @use './style';
</style>

<style lang="scss">
  @use './theme';

  .layout-sidebar {
    // 展开的宽度
    .el-menu:not(.el-menu--collapse) {
      width: v-bind(menuopenwidth);
    }

    // 折叠后宽度
    .el-menu--collapse {
      width: v-bind(menuclosewidth);
    }
  }
</style>
