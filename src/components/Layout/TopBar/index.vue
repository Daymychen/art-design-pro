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
          <el-input
            v-model="searchVal"
            :placeholder="$t('topBar.search.title')"
            @input="search"
            ref="searchInput"
            :prefix-icon="Search"
          >
            <template #suffix>
              <div class="search-keydown">
                <i class="iconfont-sys">&#xe9ab;</i>
                <span>k</span>
              </div>
            </template>
          </el-input>
          <div class="result" v-show="seachResult.length">
            <div v-for="(item, index) in seachResult" :key="index">
              <i class="iconfont-sys">{{ item.icon }}</i
              >{{ getLocaleMenuTitle(item) }}
              <div
                v-for="(cItem, index) in item.children"
                :key="index"
                @click="searchGoPage(cItem.path)"
              >
                {{ getLocaleMenuTitle(cItem) }}
              </div>
            </div>
          </div>
        </div>

        <div class="user">
          <img
            class="cover"
            src="@imgs/user/avatar.png"
            style="float: left"
            @click="goPage('/user/user')"
          />
          <el-dropdown @command="goPage">
            <div class="user-wrap">
              <span class="name">{{ userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="/user/user">
                  <i class="menu-icon iconfont-sys">&#xe725;</i>
                  <span class="menu-txt">{{ $t('topBar.user[0]') }}</span>
                </el-dropdown-item>
                <el-dropdown-item command="loginOut">
                  <i class="menu-icon iconfont-sys">&#xe678;</i>
                  <span class="menu-txt">{{ $t('topBar.user[1]') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- <div class="history" v-if="!showWorktab">
          <el-dropdown @command="openHistoryPage">
            <div class="btn" style="margin-right: 10px;">
              <i class="iconfont-sys">&#xe64c;</i>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in historyList.slice(0, 10)" :key="index"
                  :command="item.path"
                >
                  <span>{{item.title}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div> -->
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

        <!-- <div class="setting-btn" @click="openSetting">
          <i class="iconfont-sys btn">&#xe6d0;</i>
        </div> -->

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
  import { useMenuStore } from '@/store/modules/menu'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { fullScreen, exitScreen } from '@/utils/utils'
  import { ElMessageBox } from 'element-plus'
  import { menuData } from '@/mock/menuData'
  import { Search } from '@element-plus/icons-vue'
  import { HOME_PAGE } from '@/router'
  import { MenuListType } from '@/types/menu'
  import { useI18n } from 'vue-i18n'
  import mittBus from '@/utils/mittBus'

  const { locale } = useI18n()

  const store = useMenuStore()
  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const router = useRouter()

  const showMenuButton = computed(() => settingStore.showMenuButton)
  const showRefreshButton = computed(() => settingStore.showRefreshButton)
  const showLanguage = computed(() => settingStore.showLanguage)
  const menuOpen = computed(() => store.menuOpen)
  const showCrumbs = computed(() => settingStore.showCrumbs)
  const userInfo = computed(() => userStore.getUserInfo)
  const language = computed(() => userStore.language)
  const isFullScreen = ref(false)
  const showNotice = ref(false)
  const notice = ref(null)
  const searchVal = ref()
  const seachResult: any = ref([])
  const systemThemeColor = computed(() => settingStore.systemThemeColor)
  const showSettingGuide = computed(() => settingStore.showSettingGuide)
  const searchInput = ref<HTMLInputElement | null>(null)

  onMounted(() => {
    initLanguage()
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('click', bodyCloseNotice)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.addEventListener('click', bodyCloseNotice)
  })

  const handleKeydown = (event: KeyboardEvent) => {
    // Check for macOS Command key or Windows/Linux Ctrl key
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const isCommandKey = isMac ? event.metaKey : event.ctrlKey

    if (isCommandKey && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      searchInput.value?.focus()
    }
  }

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
    store.setMenuOpen(!menuOpen.value)
    reload(300)
  }

  const goPage = (path: string) => {
    if (path === 'loginOut') {
      loginOut()
      return
    }

    router.push(path)
  }

  const toHome = () => {
    router.push(HOME_PAGE)
  }

  const searchGoPage = (path: string) => {
    router.push(path)
    searchVal.value = ''
    seachResult.value = []
  }

  const loginOut = () => {
    ElMessageBox.confirm('您确定退出登录当前账户吗？打开的标签页和个人设置将会保存。').then(() => {
      userStore.logOut()
    })
  }

  const search = (val: string) => {
    if (val) {
      let list = fuzzyQueryList(menuData, val)
      seachResult.value = list
    } else {
      seachResult.value = []
    }
  }

  // 模糊查询
  const fuzzyQueryList = (arr: MenuListType[], val: string): MenuListType[] => {
    const titleField = language.value === LanguageEnum.ZH ? 'title' : 'title_en'
    const lowerVal = val.toLowerCase() // 将查询值转换为小写

    const searchItem = (item: MenuListType): MenuListType | null => {
      // 将 item[titleField] 转换为小写进行比较
      const lowerItemTitle = item[titleField]!.toLowerCase()

      // 查找子项并过滤符合条件的子项
      const children = item.children ? fuzzyQueryList(item.children, val) : []

      if (children.length || lowerItemTitle.includes(lowerVal)) {
        return { ...item, children }
      }
      return null
    }

    // 使用 map 和 filter 来优化处理逻辑
    return arr.map((item) => searchItem(item)).filter((item): item is MenuListType => item !== null)
  }

  const getLocaleMenuTitle = (item: MenuListType) => {
    return language.value === LanguageEnum.ZH ? item.title : item.title_en
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
