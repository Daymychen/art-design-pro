<template>
  <div
    class="menu-left"
    id="menu-left"
    :class="`menu-left-${theme.theme} menu-left-${collapse ? 'close' : 'open'}`"
    :style="{ background: theme.background }"
  >
    <div class="header" @click="toHome" :style="{ background: theme.background }">
      <svg class="svg-icon" aria-hidden="true">
        <use xlink:href="#iconsys-zhaopian-copy"></use>
      </svg>
      <p :style="{ color: theme.systemNameColor, opacity: collapse ? 0 : 1 }">
        {{ SystemInfo.name }}
      </p>
    </div>
    <!--  -->
    <el-menu
      :class="'el-menu-' + theme.theme"
      :collapse="collapse"
      :default-active="routerPath"
      :text-color="theme.textColor"
      :unique-opened="uniqueOpened"
      :background-color="theme.background"
      :active-text-color="theme.textActiveColor"
      :default-openeds="defaultOpenedsArray"
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
</template>

<script setup lang="ts">
  import Submenu from '../Submenu/submenu.vue'
  import { HOME_PAGE } from '@/router/index'
  import { useSettingStore } from '@/store/modules/setting'
  import { SystemInfo } from '@/config/setting'
  import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { getIframeTitle, isIframe } from '@/utils/utils'

  const route = useRoute()
  const router = useRouter()
  const settingStore = useSettingStore()
  const menuOpenWidth = MenuWidth.OPEN
  const menuCloseWidth = MenuWidth.CLOSE

  const collapse = computed(() => !settingStore.menuOpen)
  const uniqueOpened = computed(() => settingStore.uniqueOpened)
  const defaultOpenedsArray = ref([])

  const menuList = computed(() => {
    const list = useMenuStore().getMenuList
    const isTopLeftMenu = settingStore.menuType === MenuTypeEnum.TOP_LEFT

    if (isTopLeftMenu) {
      const title = getIframeTitle()

      // 处理 iframe 路径
      if (isIframe(route.path)) {
        return findMenuChildrenByTitle(list, title)
      }

      // 处理一级菜单
      const currentTopPath = `/${route.path.split('/')[1]}`
      return list.find((menu) => menu.path === currentTopPath)?.children || []
    }

    return list
  })

  const findMenuChildrenByTitle = (menuList: any[], title: string): any[] => {
    for (const menu of menuList) {
      if (menu.meta.title === title && menu.meta.isIframe) {
        return menuList
      }
      if (menu.children) {
        const found = findMenuChildrenByTitle(menu.children, title)
        if (found.length > 0) {
          return found
        }
      }
    }
    return []
  }

  const routerPath = computed(() => {
    if (route.path === '/user/user') {
      // defaultOpenedsArray.value = []
    }

    // 处理 iframe 路径
    if (isIframe(route.path)) {
      return getIframeTitle()
    }
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
    if (screenWidth < 900) {
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
    if (document.body.clientWidth < 500) {
      settingStore.setMenuOpen(false)
      showMobileModel.value = false
    }
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
