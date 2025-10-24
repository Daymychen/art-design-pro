<!-- 顶部栏 -->
<template>
  <div
    class="w-full bg-[var(--art-bg-color)]"
    :class="[tabStyle === 'tab-card' || tabStyle === 'tab-google' ? 'mb-5 !art-card-bg' : '']"
  >
    <div
      class="relative box-border flex justify-between h-[60px] leading-[60px] select-none"
      :class="[
        tabStyle === 'tab-card' || tabStyle === 'tab-google'
          ? 'border-b border-[var(--art-border-color)]'
          : ''
      ]"
    >
      <div class="flex flex-1 items-center min-w-0 leading-[60px]" style="display: flex">
        <!-- 系统信息  -->
        <div class="flex items-center cursor-pointer" @click="toHome" v-if="isTopMenu">
          <ArtLogo class="pl-[18px]" />
          <p v-if="width >= 1400" class="my-0 mx-[10px] ml-[9px] text-lg">{{
            AppConfig.systemInfo.name
          }}</p>
        </div>

        <ArtLogo
          class="hidden pl-[15px] overflow-hidden align-[-0.15em] fill-current logo2"
          @click="toHome"
        />

        <!-- 菜单按钮 -->
        <div
          v-if="isLeftMenu && shouldShowMenuButton"
          class="header-icon-btn ml-[10px]"
          @click="visibleMenu"
        >
          <ArtSvgIcon icon="ri:menu-2-fill" class="header-icon" />
        </div>

        <!-- 刷新按钮 -->
        <div
          v-if="shouldShowRefreshButton"
          class="refresh-btn header-icon-btn max-sm:hidden"
          :style="{ marginLeft: !isLeftMenu ? '10px' : '0' }"
          @click="reload()"
        >
          <ArtSvgIcon icon="ri:refresh-line" class="header-icon" />
        </div>

        <!-- 快速入口 -->
        <ArtFastEnter v-if="shouldShowFastEnter && width >= headerBarFastEnterMinWidth">
          <div class="header-icon-btn">
            <ArtSvgIcon icon="ri:function-line" class="header-icon" />
          </div>
        </ArtFastEnter>

        <!-- 面包屑 -->
        <ArtBreadcrumb
          v-if="(shouldShowBreadcrumb && isLeftMenu) || (shouldShowBreadcrumb && isDualMenu)"
        />

        <!-- 顶部菜单 -->
        <ArtHorizontalMenu v-if="isTopMenu" :list="menuList" />

        <!-- 混合菜单-顶部 -->
        <ArtMixedMenu v-if="isTopLeftMenu" :list="menuList" />
      </div>

      <div class="flex items-center gap-2.5">
        <!-- 搜索 -->
        <div
          v-if="shouldShowGlobalSearch"
          class="flex-between w-[160px] h-9 px-2.5 cursor-pointer border border-g-300/70 rounded-custom-sm"
          @click="openSearchDialog"
        >
          <div class="flex items-center">
            <ArtSvgIcon icon="ri:search-line" class="text-[13px] text-g-500" />
            <span class="ml-[10px] text-[13px] font-normal text-g-400">{{
              $t('topBar.search.title')
            }}</span>
          </div>
          <div
            class="flex items-center h-5 px-[6px] text-g-400 bg-[var(--art-bg-color)] border border-g-200 rounded"
          >
            <ArtSvgIcon v-if="isWindows" icon="vaadin:ctrl-a" class="text-[14px]" />
            <ArtSvgIcon v-else icon="ri:command-fill" class="text-xs" />
            <span class="ml-[2px] text-xs">k</span>
          </div>
        </div>

        <!-- 全屏按钮 -->
        <div
          v-if="shouldShowFullscreen"
          @click="toggleFullScreen"
          class="header-icon-btn"
          :class="[!isFullscreen ? 'full-screen-btn' : 'exit-full-screen-btn']"
        >
          <ArtSvgIcon
            :icon="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-fill'"
            class="header-icon"
          />
        </div>

        <!-- 通知按钮 -->
        <div
          v-if="shouldShowNotification"
          class="notice-button notice-btn header-icon-btn relative"
          @click="visibleNotice"
        >
          <ArtSvgIcon icon="ri:notification-2-line" class="header-icon" />
          <span
            class="absolute top-[9px] right-[12px] block size-[6px] bg-[var(--el-color-danger)] rounded-full notice-btn pointer-events-none"
          ></span>
        </div>

        <!-- 聊天按钮 -->
        <div v-if="shouldShowChat" class="chat-button relative header-icon-btn" @click="openChat">
          <ArtSvgIcon icon="ri:message-3-line" class="header-icon" />
          <span
            class="breathing-dot absolute top-2 right-2 block w-[6px] h-[6px] bg-[var(--el-color-success)] rounded-full"
          ></span>
        </div>

        <!-- 国际化按钮 -->
        <ElDropdown
          @command="changeLanguage"
          popper-class="langDropDownStyle"
          v-if="shouldShowLanguage"
        >
          <div class="language-btn header-icon-btn">
            <ArtSvgIcon icon="ri:global-line" class="header-icon" />
          </div>
          <template #dropdown>
            <ElDropdownMenu>
              <div v-for="item in languageOptions" :key="item.value" class="lang-btn-item">
                <ElDropdownItem
                  :command="item.value"
                  :class="{ 'is-selected': locale === item.value }"
                >
                  <span class="menu-txt">{{ item.label }}</span>
                  <ArtSvgIcon icon="ri:check-fill" v-if="locale === item.value" />
                </ElDropdownItem>
              </div>
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <!-- 设置按钮 -->
        <div v-if="shouldShowSettings">
          <ElPopover :visible="showSettingGuide" placement="bottom-start" :width="190" :offset="0">
            <template #reference>
              <div class="setting-btn header-icon-btn" @click="openSetting">
                <ArtSvgIcon icon="ri:settings-line" class="header-icon" />
              </div>
            </template>
            <template #default>
              <p
                >{{ $t('topBar.guide.title')
                }}<span :style="{ color: systemThemeColor }"> {{ $t('topBar.guide.theme') }} </span
                >、 <span :style="{ color: systemThemeColor }"> {{ $t('topBar.guide.menu') }} </span
                >{{ $t('topBar.guide.description') }}
              </p>
            </template>
          </ElPopover>
        </div>

        <!-- 主题切换按钮 -->
        <div v-if="shouldShowThemeToggle" @click="themeAnimation" class="header-icon-btn">
          <ArtSvgIcon :icon="isDark ? 'ri:sun-fill' : 'ri:moon-line'" class="header-icon" />
        </div>

        <!-- 用户头像、菜单 -->
        <ElPopover
          ref="userMenuPopover"
          placement="bottom-end"
          :width="240"
          :hide-after="0"
          :offset="10"
          trigger="hover"
          :show-arrow="false"
          popper-class="user-menu-popover"
          popper-style="padding: 5px 16px; 5px 16px;"
        >
          <template #reference>
            <img
              class="size-8.5 mr-5 cursor-pointer rounded-full max-sm:w-[26px] max-sm:h-[26px]"
              src="@imgs/user/avatar.webp"
              alt="avatar"
            />
          </template>
          <template #default>
            <div class="pt-[10px]">
              <div class="flex items-center pb-1 px-0">
                <img
                  class="w-10 h-10 mr-[10px] ml-0 overflow-hidden rounded-full float-left"
                  src="@imgs/user/avatar.webp"
                />
                <div class="w-[calc(100%-60px)] h-full">
                  <span class="block text-sm font-medium text-g-800 truncate">{{
                    userInfo.userName
                  }}</span>
                  <span class="block mt-[3px] text-xs text-g-500 truncate">{{
                    userInfo.email
                  }}</span>
                </div>
              </div>
              <ul class="py-4 mt-[10px] border-t border-[var(--art-border-color)]">
                <li
                  class="flex items-center p-2 mb-[10px] cursor-pointer select-none rounded-md hover:bg-g-100/60 last:mb-0"
                  @click="goPage('/system/user-center')"
                >
                  <ArtSvgIcon icon="ri:user-3-line" class="mr-1 text-base" />
                  <span class="text-sm text-[var(--art-text-gray-800)] menu-txt">{{
                    $t('topBar.user.userCenter')
                  }}</span>
                </li>
                <li
                  class="flex items-center p-2 mb-[10px] cursor-pointer select-none rounded-md hover:bg-g-100/60 last:mb-0"
                  @click="toDocs()"
                >
                  <ArtSvgIcon icon="ri:book-2-line" class="mr-1 text-base" />
                  <span class="text-sm text-[var(--art-text-gray-800)] menu-txt">{{
                    $t('topBar.user.docs')
                  }}</span>
                </li>
                <li
                  class="flex items-center p-2 mb-[10px] cursor-pointer select-none rounded-md hover:bg-g-100/60 last:mb-0"
                  @click="toGithub()"
                >
                  <ArtSvgIcon icon="ri:github-line" class="mr-1 text-base" />
                  <span class="text-sm text-[var(--art-text-gray-800)] menu-txt">{{
                    $t('topBar.user.github')
                  }}</span>
                </li>
                <li
                  class="flex items-center p-2 mb-[10px] cursor-pointer select-none rounded-md hover:bg-g-100/60 last:mb-0"
                  @click="lockScreen()"
                >
                  <ArtSvgIcon icon="ri:lock-line" class="mr-1 text-base" />
                  <span class="text-sm text-[var(--art-text-gray-800)] menu-txt">{{
                    $t('topBar.user.lockScreen')
                  }}</span>
                </li>
                <div class="w-full h-px my-[10px] bg-[var(--art-border-color)]"></div>
                <div class="log-out" @click="loginOut">
                  {{ $t('topBar.user.logout') }}
                </div>
              </ul>
            </div>
          </template>
        </ElPopover>
      </div>
    </div>

    <!-- 标签页 -->
    <ArtWorkTab />

    <!-- 通知 -->
    <ArtNotification v-model:value="showNotice" ref="notice" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { ElMessageBox } from 'element-plus'
  import { useFullscreen, useWindowSize } from '@vueuse/core'
  import { LanguageEnum, MenuTypeEnum } from '@/enums/appEnum'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { useMenuStore } from '@/store/modules/menu'
  import AppConfig from '@/config'
  import { languageOptions } from '@/locales'
  import { WEB_LINKS } from '@/utils/constants'
  import { mittBus } from '@/utils/sys'
  import { themeAnimation } from '@/utils/theme/animation'
  import { useCommon } from '@/composables/useCommon'
  import { useHeaderBar } from '@/composables/useHeaderBar'

  defineOptions({ name: 'ArtHeaderBar' })

  // 检测操作系统类型
  const isWindows = navigator.userAgent.includes('Windows')

  const router = useRouter()
  const { locale, t } = useI18n()
  const { width } = useWindowSize()

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const menuStore = useMenuStore()

  // 顶部栏功能配置
  const {
    shouldShowMenuButton,
    shouldShowRefreshButton,
    shouldShowFastEnter,
    shouldShowBreadcrumb,
    shouldShowGlobalSearch,
    shouldShowFullscreen,
    shouldShowNotification,
    shouldShowChat,
    shouldShowLanguage,
    shouldShowSettings,
    shouldShowThemeToggle,
    fastEnterMinWidth: headerBarFastEnterMinWidth
  } = useHeaderBar()

  const { menuOpen, systemThemeColor, showSettingGuide, menuType, isDark, tabStyle } =
    storeToRefs(settingStore)

  const { language, getUserInfo: userInfo } = storeToRefs(userStore)
  const { menuList } = storeToRefs(menuStore)

  const showNotice = ref(false)
  const notice = ref(null)
  const userMenuPopover = ref()

  // 菜单类型判断
  const isLeftMenu = computed(() => menuType.value === MenuTypeEnum.LEFT)
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)
  const isTopMenu = computed(() => menuType.value === MenuTypeEnum.TOP)
  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)

  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  onMounted(() => {
    initLanguage()
    document.addEventListener('click', bodyCloseNotice)
  })

  onUnmounted(() => {
    document.removeEventListener('click', bodyCloseNotice)
  })

  /**
   * 切换全屏状态
   */
  const toggleFullScreen = (): void => {
    toggleFullscreen()
  }

  /**
   * 切换菜单显示/隐藏状态
   */
  const visibleMenu = (): void => {
    settingStore.setMenuOpen(!menuOpen.value)
  }

  /**
   * 页面跳转
   * @param {string} path - 目标路径
   */
  const goPage = (path: string): void => {
    router.push(path)
  }

  /**
   * 打开文档页面
   */
  const toDocs = (): void => {
    window.open(WEB_LINKS.DOCS)
  }

  /**
   * 打开 GitHub 页面
   */
  const toGithub = (): void => {
    window.open(WEB_LINKS.GITHUB)
  }

  /**
   * 跳转到首页
   */
  const toHome = (): void => {
    router.push(useCommon().homePath.value)
  }

  /**
   * 用户登出确认
   */
  const loginOut = (): void => {
    closeUserMenu()
    setTimeout(() => {
      ElMessageBox.confirm(t('common.logOutTips'), t('common.tips'), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        customClass: 'login-out-dialog'
      }).then(() => {
        userStore.logOut()
      })
    }, 200)
  }

  /**
   * 刷新页面
   * @param {number} time - 延迟时间，默认为0毫秒
   */
  const reload = (time: number = 0): void => {
    setTimeout(() => {
      useCommon().refresh()
    }, time)
  }

  /**
   * 初始化语言设置
   */
  const initLanguage = (): void => {
    locale.value = language.value
  }

  /**
   * 切换系统语言
   * @param {LanguageEnum} lang - 目标语言类型
   */
  const changeLanguage = (lang: LanguageEnum): void => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
    reload(50)
  }

  /**
   * 打开设置面板
   */
  const openSetting = (): void => {
    mittBus.emit('openSetting')

    // 隐藏设置引导提示
    if (showSettingGuide.value) {
      settingStore.hideSettingGuide()
    }
  }

  /**
   * 打开全局搜索对话框
   */
  const openSearchDialog = (): void => {
    mittBus.emit('openSearchDialog')
  }

  /**
   * 点击页面其他区域关闭通知面板
   * @param {Event} e - 点击事件对象
   */
  const bodyCloseNotice = (e: any): void => {
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

  /**
   * 切换通知面板显示状态
   */
  const visibleNotice = (): void => {
    showNotice.value = !showNotice.value
  }

  /**
   * 打开聊天窗口
   */
  const openChat = (): void => {
    mittBus.emit('openChat')
  }

  /**
   * 打开锁屏功能
   */
  const lockScreen = (): void => {
    mittBus.emit('openLockScreen')
  }

  /**
   * 关闭用户菜单弹出层
   */
  const closeUserMenu = (): void => {
    setTimeout(() => {
      userMenuPopover.value.hide()
    }, 100)
  }
</script>

<style scoped>
  @import 'tailwindcss';

  /* Reusable button styles */
  .header-icon-btn {
    @apply size-[38px]
    flex 
    items-center 
    justify-center 
    flex-shrink-0 
    cursor-pointer 
    rounded-md 
    transition-all 
    duration-200 
    hover:text-[var(--main-color)] 
    hover:bg-[rgba(var(--art-gray-200-rgb),0.7)];
  }

  .log-out {
    @apply py-1.5 
    mt-5 
    text-[13px] 
    text-center 
    cursor-pointer 
    border 
    border-[var(--art-border-dashed-color)] 
    rounded-md 
    transition-all 
    duration-200 
    hover:shadow-[0_0_10px_rgb(var(--art-gray-300-rgb),0.7)];
  }

  .header-icon {
    @apply text-[20px] text-[var(--art-gray-600)];
  }

  /* Custom animations */
  @keyframes rotate180 {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0);
    }

    25% {
      transform: rotate(-5deg);
    }

    50% {
      transform: rotate(5deg);
    }

    75% {
      transform: rotate(-5deg);
    }

    100% {
      transform: rotate(0);
    }
  }

  @keyframes expand {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes shrink {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0.9);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes moveUp {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-3px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes breathing {
    0% {
      opacity: 0.4;
      transform: scale(0.9);
    }

    50% {
      opacity: 1;
      transform: scale(1.1);
    }

    100% {
      opacity: 0.4;
      transform: scale(0.9);
    }
  }

  /* Hover animation classes */
  .refresh-btn:hover :deep(svg) {
    animation: rotate180 0.5s;
  }

  .language-btn:hover :deep(svg) {
    animation: moveUp 0.4s;
  }

  .setting-btn:hover :deep(svg) {
    animation: rotate180 0.5s;
  }

  .full-screen-btn:hover :deep(svg) {
    animation: expand 0.6s forwards;
  }

  .exit-full-screen-btn:hover :deep(svg) {
    animation: shrink 0.6s forwards;
  }

  .notice-button:hover :deep(svg) {
    animation: shake 0.5s ease-in-out;
  }

  .chat-button:hover :deep(svg) {
    animation: shake 0.5s ease-in-out;
  }

  /* Breathing animation for chat dot */
  .breathing-dot {
    animation: breathing 1.5s ease-in-out infinite;
  }

  /* iPad breakpoint adjustments */
  @media screen and (width <= 768px) {
    .logo2 {
      display: block !important;
    }
  }

  @media screen and (width <= 640px) {
    .btn-box {
      width: 40px;
    }
  }
</style>
