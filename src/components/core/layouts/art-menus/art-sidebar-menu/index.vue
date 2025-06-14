<!-- 左侧菜单 或 双列菜单 -->
<template>
  <div
    class="layout-sidebar"
    v-if="showLeftMenu || isDualMenu"
    :class="{ 'no-border': menuList.length === 0 }"
  >
    <!-- 双列菜单（左侧） -->
    <div class="dual-menu-left" :style="{ background: getMenuTheme.background }" v-if="isDualMenu">
      <ArtLogo class="logo" @click="toHome" />
      <el-scrollbar style="height: calc(100% - 135px)">
        <ul>
          <li v-for="menu in firstLevelMenus" :key="menu.path" @click="handleMenuJump(menu, true)">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="$t(menu.meta.title)"
              placement="right"
              :offset="25"
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
                  margin: dualMenuShowText ? '5px' : '15px',
                  height: dualMenuShowText ? '60px' : '46px'
                }"
              >
                <i
                  class="iconfont-sys"
                  v-html="menu.meta.icon"
                  :style="{
                    fontSize: dualMenuShowText ? '18px' : '22px',
                    marginBottom: dualMenuShowText ? '5px' : '0'
                  }"
                ></i>
                <span v-if="dualMenuShowText">
                  {{ $t(menu.meta.title) }}
                </span>
              </div>
            </el-tooltip>
          </li>
        </ul>
      </el-scrollbar>
      <div class="switch-btn" @click="setDualMenuMode">
        <i class="iconfont-sys">&#xe798;</i>
      </div>
    </div>

    <!-- 左侧菜单 || 双列菜单（右侧） -->
    <div
      v-show="menuList.length > 0"
      class="menu-left"
      id="menu-left"
      :class="`menu-left-${getMenuTheme.theme} menu-left-${!menuOpen ? 'close' : 'open'}`"
      :style="{ background: getMenuTheme.background }"
    >
      <div class="header" @click="toHome" :style="{ background: getMenuTheme.background }">
        <ArtLogo class="logo" v-if="!isDualMenu" />
        <p
          :class="{ 'is-dual-menu-name': isDualMenu }"
          :style="{ color: getMenuTheme.systemNameColor, opacity: !menuOpen ? 0 : 1 }"
        >
          {{ AppConfig.systemInfo.name }}
        </p>
      </div>
      <el-menu
        :class="'el-menu-' + getMenuTheme.theme"
        :collapse="!menuOpen"
        :default-active="routerPath"
        :text-color="getMenuTheme.textColor"
        :unique-opened="uniqueOpened"
        :background-color="getMenuTheme.background"
        :active-text-color="getMenuTheme.textActiveColor"
        :default-openeds="defaultOpenedsArray"
        :popper-class="`menu-left-${getMenuTheme.theme}-popper`"
        :show-timeout="50"
        :hide-timeout="50"
      >
        <SidebarSubmenu
          :list="menuList"
          :isMobile="isMobileModel"
          :theme="getMenuTheme"
          @close="closeMenu"
        />
      </el-menu>

      <div
        class="menu-model"
        @click="visibleMenu"
        :style="{
          opacity: !menuOpen ? 0 : 1,
          transform: showMobileModel ? 'scale(1)' : 'scale(0)'
        }"
      >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { HOME_PAGE } from '@/router/routesAlias'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { isIframe } from '@/utils/navigation'
  import { handleMenuJump } from '@/utils/navigation'
  import SidebarSubmenu from './widget/SidebarSubmenu.vue'

  const route = useRoute()
  const router = useRouter()
  const settingStore = useSettingStore()

  const { getMenuOpenWidth, menuType, uniqueOpened, dualMenuShowText, menuOpen, getMenuTheme } =
    storeToRefs(settingStore)

  const menuCloseWidth = MenuWidth.CLOSE

  const openwidth = computed(() => getMenuOpenWidth.value)
  const closewidth = computed(() => menuCloseWidth)

  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)
  const showLeftMenu = computed(
    () => menuType.value === MenuTypeEnum.LEFT || menuType.value === MenuTypeEnum.TOP_LEFT
  )
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)

  const defaultOpenedsArray = ref([])

  // 一级菜单列表
  const firstLevelMenus = computed(() => {
    return useMenuStore().menuList.filter((menu) => !menu.meta.isHide)
  })

  const menuList = computed(() => {
    const list = useMenuStore().menuList

    // 如果不是顶部左侧菜单或双列菜单，直接返回完整菜单列表
    if (!isTopLeftMenu.value && !isDualMenu.value) {
      return list
    }

    // 处理 iframe 路径
    if (isIframe(route.path)) {
      return findIframeMenuList(route.path, list)
    }

    const currentTopPath = `/${route.path.split('/')[1]}`

    // 处理一级菜单
    if (route.meta.isFirstLevel) {
      return []
    }

    // 返回当前顶级路径对应的子菜单
    const currentMenu = list.find((menu) => menu.path === currentTopPath)
    return currentMenu?.children ?? []
  })

  // 查找 iframe 对应的二级菜单列表
  const findIframeMenuList = (currentPath: string, menuList: any[]) => {
    // 递归查找包含当前路径的菜单项
    const hasPath = (items: any[]) => {
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

  const firstLevelMenuPath = computed(() => {
    return route.matched[0].path
  })

  const routerPath = computed(() => String(route.meta.activePath || route.path))

  onMounted(() => {
    listenerWindowResize()
  })

  const isMobileModel = ref(false)
  const showMobileModel = ref(false)

  watch(
    () => !menuOpen.value,
    (collapse: boolean) => {
      if (!collapse) {
        showMobileModel.value = true
      }
    }
  )

  const toHome = () => {
    router.push(HOME_PAGE)
  }

  let screenWidth = 0

  const listenerWindowResize = () => {
    screenWidth = document.body.clientWidth

    setMenuModel()

    window.onresize = () => {
      return (() => {
        screenWidth = document.body.clientWidth
        setMenuModel()
      })()
    }
  }

  const setMenuModel = () => {
    // 小屏幕折叠菜单
    if (screenWidth < 800) {
      settingStore.setMenuOpen(false)
    }
  }

  const visibleMenu = () => {
    settingStore.setMenuOpen(!menuOpen.value)

    // 移动端模态框
    if (!showMobileModel.value) {
      showMobileModel.value = true
    } else {
      setTimeout(() => {
        showMobileModel.value = false
      }, 200)
    }
  }

  const closeMenu = () => {
    if (document.body.clientWidth < 800) {
      settingStore.setMenuOpen(false)
      showMobileModel.value = false
    }
  }

  const setDualMenuMode = () => {
    settingStore.setDualMenuShowText(!dualMenuShowText.value)
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>

<style lang="scss">
  @use './theme';

  .layout-sidebar {
    // 展开的宽度
    .el-menu:not(.el-menu--collapse) {
      width: v-bind(openwidth);
    }

    // 折叠后宽度
    .el-menu--collapse {
      width: v-bind(closewidth);
    }
  }
</style>
