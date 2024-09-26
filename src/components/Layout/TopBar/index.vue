<template>
  <div class="top-bar" :style="{ width: topBarWidth() }">
    <div class="menu">
      <div class="left" style="display: flex">
        <svg class="svg-icon" aria-hidden="true" @click="toHome()">
          <use xlink:href="#icon-zhaopian-copy"></use>
        </svg>
        <i class="menu-btn btn iconfont-sys" @click="visibleMenu" v-if="showMenuButton">&#xe6ba;</i>
        <i class="refresh btn iconfont-sys" @click="reload()" v-if="showRefreshButton">&#xe6b3;</i>
        <breadcrumb v-if="showCrumbs" />
      </div>

      <div class="right">
        <div class="search-wrap">
          <div class="search-input" @click="openSearchDialog">
            <div class="left">
              <i class="iconfont-sys">&#xe710;</i>
              <span>{{ $t('topBar.search.title') }}</span>
            </div>
            <div class="search-keydown">
              <i class="iconfont-sys" v-if="isWindows">&#xeeac;</i>
              <i class="iconfont-sys" v-else>&#xe9ab;</i>
              <span>k</span>
            </div>
          </div>
        </div>

        <div class="screen" @click="fullScreenFun" v-if="!isFullScreen">
          <i class="iconfont-sys btn">&#xe8ce;</i>
        </div>
        <div class="screen" @click="exitScreenFun" v-else>
          <i class="iconfont-sys btn">&#xe62d;</i>
        </div>
        <div class="notice notice-btn" @click="visibleNotice">
          <i class="iconfont-sys notice-btn btn">&#xe6c2;</i>
          <span class="count notice-btn"></span>
        </div>
        <div class="lang" v-if="showLanguage">
          <el-dropdown @command="changeLanguage">
            <i class="iconfont-sys btn">&#xe611;</i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">
                  <span class="menu-txt">中文</span>
                </el-dropdown-item>
                <el-dropdown-item command="en">
                  <span class="menu-txt">English</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="setting-btn" @click="openSetting">
          <el-popover :visible="showSettingGuide" placement="bottom-start" :width="190" :offset="0">
            <template #reference>
              <i class="iconfont-sys btn">&#xe6d0;</i>
            </template>
            <template #default>
              <p
                >点击这里查看<span :style="{ color: systemThemeColor }"> 主题风格 </span>、
                <span :style="{ color: systemThemeColor }"> 开启顶栏菜单 </span>等更多配置
              </p>
            </template>
          </el-popover>
        </div>

        <div class="user">
          <el-popover
            placement="bottom-end"
            :width="210"
            :hide-after="0"
            :offset="20"
            trigger="hover"
            :show-arrow="false"
            popper-class="user-menu-popover"
            popper-style="border: 1px solid var(--art-border-dashed-color); border-radius: 10px; padding: 5px 16px; 5px 16px;"
          >
            <template #reference>
              <img class="cover" src="@imgs/user/avatar.png" />
            </template>
            <template #default>
              <div class="user-menu-box">
                <div class="user-head">
                  <img class="cover" src="@imgs/user/avatar.png" style="float: left" />
                  <div class="user-wrap">
                    <span class="name">{{ userInfo.username }}</span>
                  </div>
                </div>
                <ul class="user-menu">
                  <li @click="goPage('/user/user')">
                    <i class="menu-icon iconfont-sys">&#xe734;</i>
                    <span class="menu-txt">{{ $t('topBar.user[0]') }}</span>
                  </li>
                  <li @click="toDocs()">
                    <i class="menu-icon iconfont-sys" style="font-size: 15px">&#xe828;</i>
                    <span class="menu-txt">{{ $t('topBar.user[1]') }}</span>
                  </li>
                  <li @click="toGithub()">
                    <i class="menu-icon iconfont-sys">&#xe8d6;</i>
                    <span class="menu-txt">{{ $t('topBar.user[2]') }}</span>
                  </li>
                  <li @click="loginOut">
                    <i class="menu-icon iconfont-sys">&#xe780;</i>
                    <span class="menu-txt">{{ $t('topBar.user[3]') }}</span>
                  </li>
                </ul>
              </div>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
    <slot></slot>

    <Notice v-model:value="showNotice" ref="notice" />
  </div>
</template>

<script setup lang="ts">
  import Breadcrumb from '../Breadcrumb/index.vue'
  import Notice from '../Notice/index.vue'
  import { LanguageEnum, MenuWidth } from '@/enums/appEnum'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { fullScreen, exitScreen } from '@/utils/utils'
  import { ElMessageBox } from 'element-plus'
  import { HOME_PAGE } from '@/router'
  import { useI18n } from 'vue-i18n'
  import mittBus from '@/utils/mittBus'

  const isWindows = navigator.userAgent.includes('Windows')
  const { locale } = useI18n()

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const router = useRouter()

  const showMenuButton = computed(() => settingStore.showMenuButton)
  const showRefreshButton = computed(() => settingStore.showRefreshButton)
  const showLanguage = computed(() => settingStore.showLanguage)
  const menuOpen = computed(() => settingStore.menuOpen)
  const showCrumbs = computed(() => settingStore.showCrumbs)
  const userInfo = computed(() => userStore.getUserInfo)
  const language = computed(() => userStore.language)
  const isFullScreen = ref(false)
  const showNotice = ref(false)
  const notice = ref(null)
  const systemThemeColor = computed(() => settingStore.systemThemeColor)
  const showSettingGuide = computed(() => settingStore.showSettingGuide)
  const { t } = useI18n()

  onMounted(() => {
    initLanguage()
    document.addEventListener('click', bodyCloseNotice)
  })

  onUnmounted(() => {
    document.addEventListener('click', bodyCloseNotice)
  })

  const fullScreenFun = () => {
    fullScreen()
    isFullScreen.value = true
  }

  const exitScreenFun = () => {
    exitScreen()
    isFullScreen.value = false
  }

  const topBarWidth = (): string => {
    return menuOpen.value ? `calc(100% - ${MenuWidth.OPEN})` : `calc(100% - ${MenuWidth.CLOSE})`
  }

  const visibleMenu = () => {
    settingStore.setMenuOpen(!menuOpen.value)
  }

  const goPage = (path: string) => {
    if (path === 'loginOut') {
      loginOut()
      return
    }

    router.push(path)
  }

  const toDocs = () => {
    window.open('https://www.lingchen.kim/art-design-pro/docs')
  }

  const toGithub = () => {
    window.open('https://github.com/Daymychen/art-design-pro')
  }

  const toHome = () => {
    router.push(HOME_PAGE)
  }

  const loginOut = () => {
    ElMessageBox.confirm(t('common.logOutTips'), t('common.tips'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel')
    }).then(() => {
      userStore.logOut()
    })
  }

  const reload = (time: number = 0) => {
    setTimeout(() => {
      settingStore.reload()
    }, time)
  }

  const initLanguage = () => {
    locale.value = language.value
  }

  const changeLanguage = (lang: LanguageEnum) => {
    locale.value = lang
    userStore.setLanguage(lang)
    reload(50)
  }

  const openSetting = () => {
    mittBus.emit('openSetting')

    // 隐藏设置引导
    if (showSettingGuide.value) {
      settingStore.hideSettingGuide()
    }
    // 打开设置引导
    // settingStore.openSettingGuide()
  }

  const openSearchDialog = () => {
    mittBus.emit('openSearchDialog')
  }

  const bodyCloseNotice = (e: any) => {
    let { className } = e.target

    if (showNotice.value) {
      if (typeof className === 'object') {
        showNotice.value = false
        return
      }
      if (className.indexOf('notice-btn') === -1) {
        showNotice.value = false
      }
    }
  }

  const visibleNotice = () => {
    showNotice.value = !showNotice.value
  }
</script>

<style lang="scss" scoped>
  @import './style';
  @import './mobile';
</style>
