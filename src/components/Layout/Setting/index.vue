<template>
  <div class="setting">
    <el-drawer
      size="300px"
      v-model="showDrawer"
      :lock-scroll="false"
      :with-header="false"
      :before-close="closeDrawer"
      @open="toggleDrawer(true)"
      @close="toggleDrawer(false)"
      modal-class="setting-modal"
    >
      <div class="drawer-con">
        <div class="close-wrap">
          <i class="iconfont-sys" @click="closeDrawer">&#xe7dc;</i>
        </div>

        <!-- 主题风格 -->
        <p class="title">{{ $t('setting.theme.title') }}</p>
        <div class="theme-styles">
          <div
            class="style-item"
            v-for="(item, index) in settingThemeList"
            :key="item.theme"
            @click="switchThemeStyles(item.theme)"
          >
            <div class="box" :class="{ 'is-active': item.theme === systemThemeMode }">
              <img :src="item.img" />
            </div>
            <p class="name">{{ $t(`setting.theme.list[${index}]`) }}</p>
            <div class="active" v-show="item.theme === systemThemeMode"></div>
          </div>
        </div>

        <!-- 菜单布局 -->
        <div v-if="width > 1000">
          <p class="title" style="margin-top: 30px">{{ $t('setting.menuType.title') }}</p>
          <div class="menu-layouts">
            <div class="menu-layouts-wrap">
              <div
                class="style-item"
                v-for="(item, index) in AppConfig.menuLayoutList"
                :key="item.value"
                @click="switchMenuLayouts(item.value)"
              >
                <div
                  class="box"
                  :class="{ 'is-active': item.value === menuType, 'mt-16': index > 2 }"
                >
                  <img :src="item.img" />
                </div>
                <p class="name">{{ $t(`setting.menuType.list[${index}]`) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 菜单风格 -->
        <p class="title" style="margin-top: 0">{{ $t('setting.menu.title') }}</p>
        <div class="menu-styles">
          <div class="menu-styles-wrap">
            <div
              class="style-item"
              v-for="item in menuThemeList"
              :key="item.theme"
              @click="switchMenuStyles(item.theme)"
            >
              <div
                class="box"
                :class="{ 'is-active': item.theme === currentMenuTheme }"
                :style="{
                  cursor: isDualMenu || isTopMenu || isDark ? 'no-drop' : 'pointer'
                }"
              >
                <img :src="item.img" />
              </div>
              <div class="active" v-if="item.theme === currentMenuTheme"></div>
            </div>
          </div>
        </div>

        <!-- 系统主题色 -->
        <p class="title" style="margin-top: 60px">{{ $t('setting.color.title') }}</p>
        <div class="main-color-wrap">
          <div class="offset">
            <div
              v-for="color in mainColor"
              :key="color"
              :style="{ background: `${color} !important` }"
              @click="setElementTheme(color)"
            >
              <i class="iconfont-sys" v-show="color == systemThemeColor">&#xe616;</i>
            </div>
          </div>
        </div>

        <!-- 盒子样式 -->
        <p class="title" style="margin-top: 40px">{{ $t('setting.box.title') }}</p>
        <div class="box-style">
          <div v-if="false">{{ boxBorderMode }}</div>
          <div
            class="button"
            :class="{ 'is-active': boxBorderMode }"
            @click="switchBoxMode(false, 'border-mode')"
          >
            {{ $t('setting.box.list[0]') }}
          </div>
          <div
            class="button"
            :class="{ 'is-active': !boxBorderMode }"
            @click="switchBoxMode(false, 'shadow-mode')"
          >
            {{ $t('setting.box.list[1]') }}
          </div>
        </div>

        <!-- 容器宽度 -->
        <p class="title" style="margin-top: 50px">{{ $t('setting.container.title') }}</p>
        <div class="container-width">
          <div
            class="item"
            :class="{ 'is-active': containerWidth === item.value }"
            v-for="item in containerWidthList"
            :key="item.value"
            @click="setContainerWidth(item.value)"
          >
            <i class="iconfont-sys" v-html="item.icon"></i>
            <span>{{ $t(item.label) }}</span>
          </div>
        </div>

        <!-- 基础配置 -->
        <p class="title" style="margin-top: 40px">{{ $t('setting.basics.title') }}</p>
        <div class="basic-box">
          <div class="item">
            <span>{{ $t('setting.basics.list[4]') }}</span>
            <el-switch v-model="showWorkTab" @change="showWorkTabFunc" />
          </div>
          <div class="item" style="display: flex">
            <span>{{ $t('setting.basics.list[0]') }}</span>
            <el-switch v-model="uniqueOpened" @change="setUniqueOpened" />
          </div>
          <div class="item">
            <span>{{ $t('setting.basics.list[1]') }}</span>
            <el-switch v-model="showMenuButton" @change="setButton" />
          </div>
          <div class="item">
            <span>{{ $t('setting.basics.list[2]') }}</span>
            <el-switch v-model="showRefreshButton" @change="setShowRefreshButton" />
          </div>
          <div class="item mobile-hide">
            <span>{{ $t('setting.basics.list[3]') }}</span>
            <el-switch v-model="showCrumbs" @change="setCrumbs" />
          </div>

          <div class="item">
            <span>{{ $t('setting.basics.list[5]') }}</span>
            <el-switch v-model="showLanguage" @change="setLanguage" />
          </div>
          <div class="item">
            <span>{{ $t('setting.basics.list[6]') }}</span>
            <el-switch v-model="showNprogress" @change="setNprogress" />
          </div>
          <div class="item">
            <span>{{ $t('setting.basics.list[7]') }}</span>
            <el-switch v-model="colorWeak" @change="setColorWeak()" />
          </div>
          <div class="item">
            <span>{{ $t('setting.basics.list[8]') }}</span>
            <el-switch v-model="autoClose" @change="setAutoClose" />
          </div>
          <div class="item">
            <span>{{ $t('setting.basics.list[9]') }}</span>
            <el-switch v-model="watermarkVisible" @change="setWatermarkVisible" />
          </div>
          <div class="item" style="display: flex">
            <span>{{ $t('setting.basics.list[10]') }}</span>
            <el-input-number
              :min="180"
              :max="320"
              size="default"
              :step="10"
              style="width: 120px"
              v-model="menuOpenWidth"
              controls-position="right"
              @change="setMenuOpenSize"
            />
          </div>
          <div class="item" style="display: flex">
            <span>{{ $t('setting.basics.list[13]') }}</span>
            <el-select
              v-model="tabStyle"
              placeholder="Select"
              size="default"
              style="width: 120px"
              @change="setTabStyle"
            >
              <el-option
                v-for="item in tabStyleOps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="item" style="display: flex">
            <span>{{ $t('setting.basics.list[11]') }}</span>
            <el-select
              v-model="pageTransition"
              placeholder="Select"
              size="default"
              style="width: 120px"
              @change="setPageTransition"
            >
              <el-option
                v-for="item in pageTransitionOps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="item" style="display: flex">
            <span>{{ $t('setting.basics.list[12]') }}</span>
            <el-select
              v-model="customRadius"
              placeholder="Select"
              size="default"
              style="width: 120px"
              @change="setCustomRadius"
            >
              <el-option
                v-for="item in customRadiusOps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import AppConfig from '@/config'
  import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum } from '@/enums/appEnum'
  import mittBus from '@/utils/mittBus'
  import { useTheme } from '@/composables/useTheme'
  import { useCeremony } from '@/composables/useCeremony'
  import { ContainerWidthEnum } from '@/enums/appEnum'
  const { openFestival, cleanup } = useCeremony()
  const { setSystemTheme, setSystemAutoTheme, switchThemeStyles } = useTheme()

  const store = useSettingStore()

  const props = defineProps(['open'])

  const showDrawer = ref(false)

  const { width } = useWindowSize()

  // 记录窗口宽度变化前的菜单类型
  const beforeMenuType = ref<MenuTypeEnum>()
  const hasChangedMenu = ref(false) // 添加标记来跟踪是否已经改变过菜单

  watch(width, (newWidth: number) => {
    if (newWidth < 1000) {
      if (!hasChangedMenu.value) {
        beforeMenuType.value = menuType.value
        switchMenuLayouts(MenuTypeEnum.LEFT)
        store.setMenuOpen(false)
        hasChangedMenu.value = true
      }
    } else {
      if (hasChangedMenu.value && beforeMenuType.value) {
        switchMenuLayouts(beforeMenuType.value)
        store.setMenuOpen(true)
        hasChangedMenu.value = false
      }
    }
  })

  watch(
    () => props.open,
    (val: boolean) => (showDrawer.value = val)
  )

  const settingThemeList = AppConfig.settingThemeList
  const menuThemeList = AppConfig.themeList
  const mainColor = AppConfig.systemMainColor
  const isDark = computed(() => store.isDark)
  const currentGlopTheme = computed(() => store.systemThemeType)
  const systemThemeMode = computed(() => store.systemThemeMode)
  const currentMenuTheme = computed(() => store.menuThemeType)
  const systemThemeColor = computed(() => store.systemThemeColor as (typeof mainColor)[number])
  const boxBorderMode = computed(() => store.boxBorderMode)
  const pageTransition = computed(() => store.pageTransition)
  const tabStyle = computed(() => store.tabStyle)
  const customRadius = computed(() => store.customRadius)
  const menuType = computed(() => store.menuType)
  const isTopMenu = computed(() => store.menuType === MenuTypeEnum.TOP)
  const isDualMenu = computed(() => store.menuType === MenuTypeEnum.DUAL_MENU)
  const watermarkVisible = computed(() => store.watermarkVisible)
  const menuOpenWidth = ref(store.menuOpenWidth)
  const uniqueOpened = ref(true)
  const showMenuButton = ref(true)
  const autoClose = ref(true)
  const showRefreshButton = ref(true)
  const showCrumbs = ref(true)
  let showWorkTab = ref(true)
  const showLanguage = ref(true)
  const showNprogress = ref(true)
  const colorWeak = ref(false)
  const containerWidth = computed(() => store.containerWidth)
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabStyleOps = computed(() => [
    {
      value: 'tab-default',
      label: t('setting.tabStyle.default')
    },
    {
      value: 'tab-card',
      label: t('setting.tabStyle.card')
    },
    {
      value: 'tab-google',
      label: t('setting.tabStyle.google')
    }
  ])

  const pageTransitionOps = [
    {
      value: '',
      label: '无动画'
    },
    {
      value: 'fade',
      label: 'fade'
    },
    {
      value: 'slide-right',
      label: 'slide-right'
    },
    {
      value: 'slide-top',
      label: 'slide-top'
    },
    {
      value: 'slide-bottom',
      label: 'slide-bottom'
    }
  ]

  const customRadiusOps = [
    {
      value: '0',
      label: '0'
    },
    {
      value: '0.25',
      label: '0.25'
    },
    {
      value: '0.5',
      label: '0.5'
    },
    {
      value: '0.75',
      label: '0.75'
    },
    {
      value: '1',
      label: '1'
    }
  ]

  const containerWidthList = [
    {
      value: ContainerWidthEnum.FULL,
      label: 'setting.container.list[0]',
      icon: '&#xe694;'
    },
    {
      value: ContainerWidthEnum.BOXED,
      label: 'setting.container.list[1]',
      icon: '&#xe6de;'
    }
  ]

  watch(
    () => store.showWorkTab,
    (e: boolean) => {
      showWorkTab.value = e
    }
  )

  onMounted(() => {
    mittBus.on('openSetting', openSetting)

    initSystemColor()
    listenerSystemTheme()
    initUserSetting()
    initSystemTheme()
    openFestival()
  })

  onUnmounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.removeEventListener('change', initSystemTheme)
    cleanup()
  })

  //  如果主题色不在列表中，则设置为列表中的第一个元素
  const initSystemColor = () => {
    if (!AppConfig.systemMainColor.includes(systemThemeColor.value)) {
      setElementTheme(AppConfig.systemMainColor[0])
    }
  }

  const initUserSetting = () => {
    uniqueOpened.value = store.uniqueOpened
    showMenuButton.value = store.showMenuButton
    autoClose.value = store.autoClose
    showRefreshButton.value = store.showRefreshButton
    showCrumbs.value = store.showCrumbs
    showWorkTab.value = store.showWorkTab
    showLanguage.value = store.showLanguage
    showNprogress.value = store.showNprogress
    colorWeak.value = store.colorWeak
    initColorWeak()
    setBoxMode(true, store.boxBorderMode ? 'border-mode' : 'shadow-mode')
  }

  const switchMenuStyles = (theme: MenuThemeEnum) => {
    if (isDualMenu.value || isTopMenu.value || isDark.value) {
      return
    }
    store.switchMenuStyles(theme)
    isAutoClose()
  }

  // 监听系统主题变化
  const listenerSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', initSystemTheme)
  }

  // 初始化系统主题
  const initSystemTheme = () => {
    if (systemThemeMode.value === SystemThemeEnum.AUTO) {
      setSystemAutoTheme()
    } else {
      setSystemTheme(currentGlopTheme.value)
    }
  }

  const switchMenuLayouts = (type: MenuTypeEnum) => {
    if (type === MenuTypeEnum.LEFT || type === MenuTypeEnum.TOP_LEFT) store.setMenuOpen(true)
    store.switchMenuLayouts(type)
    if (type === MenuTypeEnum.DUAL_MENU) {
      store.switchMenuStyles(MenuThemeEnum.DESIGN)
      store.setMenuOpen(true)
    }
    isAutoClose()
  }

  // 自动关闭
  const isAutoClose = () => {
    if (autoClose.value) {
      closeDrawer()
    }
  }

  // 打开或关闭抽屉
  const toggleDrawer = (open: boolean) => {
    let el = document.getElementsByTagName('body')[0]
    if (open) {
      setTimeout(() => {
        el.setAttribute('class', 'theme-change')
      }, 500)
    } else {
      el.removeAttribute('class')
    }
  }

  const openSetting = () => (showDrawer.value = true)

  const closeDrawer = () => (showDrawer.value = false)

  const switchBoxMode = (isInit: boolean = false, type: string) => {
    if (
      (type === 'shadow-mode' && boxBorderMode.value === false) ||
      (type === 'border-mode' && boxBorderMode.value === true)
    ) {
      return
    }
    setBoxMode(isInit, type)
  }

  // 设置盒子边框 ｜ 阴影 样式
  const setBoxMode = (isInit: boolean = false, type: string) => {
    setTimeout(() => {
      const el = document.documentElement
      el.setAttribute('data-box-mode', type)

      if (!isInit) {
        store.setBorderMode()
      }
    }, 50)
  }

  // 高阶函数：封装 store 方法调用后自动关闭抽屉
  const autoCloseHandler = (
    storeMethod: (...args: any[]) => void,
    needReload: boolean = false,
    ...args: any[]
  ) => {
    storeMethod(...args)
    if (needReload) {
      store.reload()
    }
    isAutoClose()
  }

  const showWorkTabFunc = () => autoCloseHandler(store.setWorkTab, false, !store.showWorkTab)

  const setPageTransition = (transition: string) =>
    autoCloseHandler(store.setPageTransition, false, transition)

  const setTabStyle = (style: string) => autoCloseHandler(store.setTabStyle, false, style)

  const setContainerWidth = (type: ContainerWidthEnum) =>
    autoCloseHandler(store.setContainerWidth, true, type)

  const setElementTheme = (theme: string) => autoCloseHandler(store.setElementTheme, true, theme)

  const setCustomRadius = (radius: string) => autoCloseHandler(store.setCustomRadius, false, radius)

  const setUniqueOpened = () => autoCloseHandler(store.setUniqueOpened)

  const setButton = () => autoCloseHandler(store.setButton)

  const setShowRefreshButton = () => autoCloseHandler(store.setShowRefreshButton)

  const setCrumbs = () => autoCloseHandler(store.setCrumbs)

  const setLanguage = () => autoCloseHandler(store.setLanguage)

  const setNprogress = () => autoCloseHandler(store.setNprogress)

  const setAutoClose = () => autoCloseHandler(store.setAutoClose)

  const setColorWeak = () => {
    let el = document.getElementsByTagName('html')[0]

    if (colorWeak.value) {
      el.setAttribute('class', 'color-weak')
    } else {
      el.removeAttribute('class')
      setSystemTheme(SystemThemeEnum.LIGHT)
    }
    store.setColorWeak()
    isAutoClose()
  }

  const setWatermarkVisible = () =>
    autoCloseHandler(store.setWatermarkVisible, false, !store.watermarkVisible)

  const setMenuOpenSize = () =>
    menuOpenWidth.value && autoCloseHandler(store.setMenuOpenWidth, false, menuOpenWidth.value)

  const initColorWeak = () => {
    if (colorWeak.value) {
      let el = document.getElementsByTagName('html')[0]
      setTimeout(() => {
        el.setAttribute('class', 'color-weak')
      }, 100)
    }
  }

  watch(
    () => store.menuOpenWidth,
    (newVal) => {
      menuOpenWidth.value = newVal
    }
  )
</script>

<style lang="scss">
  .setting-modal {
    background: transparent !important;

    .el-drawer {
      // 背景滤镜
      background: rgba($color: #fff, $alpha: 50%) !important;
      box-shadow: 0 0 30px rgb(0 0 0 / 10%) !important;

      @include backdropBlur();
    }
  }

  .dark {
    .setting-modal {
      .el-drawer {
        background: rgba($color: #000, $alpha: 50%) !important;
      }
    }
  }

  // 去除滚动条
  .el-drawer__body::-webkit-scrollbar {
    width: 0 !important;
  }
</style>

<style lang="scss" scoped>
  @use './style';
</style>
