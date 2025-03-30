<!-- 左侧菜单 或 双列菜单 -->
<template>
  <div class="left-menu-or-dual-menu">
    <!-- 双列菜单（左侧） -->
    <div class="dual-menu-left" :style="{ background: theme.background }" v-if="isDualMenu">
      <svg class="svg-icon" aria-hidden="true" @click="toHome">
        <use xlink:href="#iconsys-zhaopian-copy"></use>
      </svg>
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
              :disabled="settingStore.dualMenuShowText"
            >
              <div
                :class="{
                  'is-active': menu.meta.isInMainContainer
                    ? menu.path === route.path
                    : menu.path === firstLevelMenuPath
                }"
                :style="{
                  margin: settingStore.dualMenuShowText ? '5px' : '15px',
                  height: settingStore.dualMenuShowText ? '60px' : '46px'
                }"
              >
                <i
                  class="iconfont-sys"
                  v-html="menu.meta.icon"
                  :style="{
                    fontSize: settingStore.dualMenuShowText ? '18px' : '22px',
                    marginBottom: settingStore.dualMenuShowText ? '5px' : '0'
                  }"
                ></i>
                <span v-if="settingStore.dualMenuShowText">
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
      class="menu-left"
      id="menu-left"
      :class="`menu-left-${theme.theme} menu-left-${collapse ? 'close' : 'open'}`"
      :style="{ background: theme.background }"
    >
      <div class="header" @click="toHome" :style="{ background: theme.background }">
        <svg class="svg-icon" aria-hidden="true" v-if="!isDualMenu">
          <use xlink:href="#iconsys-zhaopian-copy"></use>
        </svg>
        <p
          :class="{ 'is-dual-menu-name': isDualMenu }"
          :style="{ color: theme.systemNameColor, opacity: collapse ? 0 : 1 }"
        >
          {{ AppConfig.systemInfo.name }}
        </p>
      </div>
      <el-menu
        :class="'el-menu-' + theme.theme"
        :collapse="collapse"
        :default-active="routerPath"
        :text-color="theme.textColor"
        :unique-opened="uniqueOpened"
        :background-color="theme.background"
        :active-text-color="theme.textActiveColor"
        :default-openeds="defaultOpenedsArray"
        :popper-class="`menu-left-${theme.theme}-popper`"
      >
        <submenu :list="menuList" :isMobile="isMobileModel" :theme="theme" @close="closeMenu" />
      </el-menu>

      <div
        class="menu-model"
        @click="visibleMenu"
        :style="{
          opacity: collapse ? 0 : 1,
          transform: showMobileModel ? 'scale(1)' : 'scale(0)'
        }"
      >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Submenu from '../Submenu/submenu.vue'
  import { HOME_PAGE } from '@/router/index'
  import { useSettingStore } from '@/store/modules/setting'
  import AppConfig from '@/config'
  import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { isIframe } from '@/utils/utils'
  import { handleMenuJump } from '@/utils/jump'

  const route = useRoute()
  const router = useRouter()
  const settingStore = useSettingStore()
  const menuOpenWidth = computed(() => settingStore.getMenuOpenWidth)
  const menuCloseWidth = MenuWidth.CLOSE
  const isTopLeftMenu = computed(() => settingStore.menuType === MenuTypeEnum.TOP_LEFT)
  const isDualMenu = computed(() => settingStore.menuType === MenuTypeEnum.DUAL_MENU)

  const collapse = computed(() => !settingStore.menuOpen)
  const uniqueOpened = computed(() => settingStore.uniqueOpened)
  const defaultOpenedsArray = ref([])

  // 一级菜单列表
  const firstLevelMenus = computed(() => {
    return useMenuStore().getMenuList
  })

  const menuList = computed(() => {
    const list = useMenuStore().getMenuList

    // 如果不是顶部左侧菜单或双列菜单，直接返回完整菜单列表
    if (!isTopLeftMenu.value && !isDualMenu.value) {
      return list
    }

    // 处理 iframe 路径
    if (isIframe(route.path)) {
      return findIframeMenuList(route.path, list)
    }

    const currentTopPath = `/${route.path.split('/')[1]}`

    // 处理主容器内的一级菜单
    if (route.meta.isInMainContainer) {
      return list.filter((menu) => menu.meta.isInMainContainer)
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

  const routerPath = computed(() => {
    return route.path
  })

  onMounted(() => {
    listenerWindowResize()
  })

  const isMobileModel = ref(false)
  const showMobileModel = ref(false)
  const theme = computed(() => settingStore.getMenuTheme)

  watch(
    () => collapse.value,
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
    settingStore.setMenuOpen(!!collapse.value)

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
    settingStore.setDualMenuShowText(!settingStore.dualMenuShowText)
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>

<style lang="scss">
  @use './theme';

  .menu-left {
    // 展开的宽度
    .el-menu:not(.el-menu--collapse) {
      width: v-bind(menuOpenWidth);
    }

    // 折叠后宽度
    .el-menu--collapse {
      width: v-bind(menuCloseWidth);
    }
  }
</style>
