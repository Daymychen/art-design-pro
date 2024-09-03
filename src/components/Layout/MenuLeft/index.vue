<template>
  <div
    class="menu-left"
    id="menu-left"
    :class="`menu-left-${theme.theme} menu-left-${collapse ? 'close' : 'open'}`"
    :style="{ background: theme.background }"
  >
    <div class="header" @click="toHome" :style="{ background: theme.background }">
      <svg class="svg-icon" aria-hidden="true">
        <use xlink:href="#icon-zhaopian-copy"></use>
      </svg>
      <p :style="{ color: theme.systemNameColor, opacity: collapse ? 0 : 1 }">
        {{ SystemInfo.name }}
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
    >
      <submenu :list="menuData" :isMobile="isMobileModel" :theme="theme" @close="closeMenu" />
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
  import { computed, ref, onMounted, watch } from 'vue'
  import { menuData } from '@/mock/menuData'
  import { HOME_PAGE } from '@/router/index'
  import { useMenuStore } from '@/store/modules/menu'
  import { useSettingStore } from '@/store/modules/setting'
  import { SystemInfo } from '@/config/setting'
  import { MenuWidth } from '@/enums/appEnum'

  const store = useMenuStore()
  const route = useRoute()
  const router = useRouter()
  const settingStore = useSettingStore()
  const menuOpenWidth = MenuWidth.OPEN
  const menuCloseWidth = MenuWidth.CLOSE

  const collapse = computed(() => !store.menuOpen)
  const uniqueOpened = computed(() => settingStore.uniqueOpened)
  const defaultOpenedsArray = ref([])
  const routerPath = computed(() => {
    if (route.path === '/user/user') {
      // defaultOpenedsArray.value = []
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
    (collapse) => {
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
    // ipad 竖屏
    if (screenWidth < 900) {
      store.setMenuOpen(false)
    } else {
      store.setMenuOpen(true)
    }
  }

  const visibleMenu = () => {
    store.setMenuOpen(!!collapse.value)

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
      store.setMenuOpen(false)
      showMobileModel.value = false
    }
  }
</script>

<style lang="scss" scoped>
  @import './style';
</style>

<style lang="scss">
  @import './theme';

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
