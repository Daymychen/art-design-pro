import { defineStore } from 'pinia'
import { LanguageEnum } from '@/enums/appEnum'
import { router } from '@/router'
import { UserInfo } from '@/types/store'
import { useSettingStore } from './setting'
import { useWorktabStore } from './worktab'
import { getSysStorage } from '@/utils/storage'
import { MenuListType } from '@/types/menu'

interface UserState {
  language: LanguageEnum // 语言
  isLogin: boolean // 是否登录
  info: Partial<UserInfo> // 用户信息
  searchHistory: MenuListType[] // 搜索历史
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => ({
    language: LanguageEnum.ZH,
    isLogin: false,
    info: {},
    searchHistory: []
  }),
  getters: {
    getUserInfo(): Partial<UserInfo> {
      return this.info
    },
    getSettingState() {
      return useSettingStore().$state
    },
    getWorktabState() {
      return useWorktabStore().$state
    }
  },
  actions: {
    initState() {
      let sys = getSysStorage()

      if (sys) {
        sys = JSON.parse(sys)
        const { info, isLogin, language, searchHistory } = sys.user

        this.info = info || {}
        this.isLogin = isLogin || false
        this.language = language || LanguageEnum.ZH
        this.searchHistory = searchHistory || []
      }
    },
    // 用户数据持久化存储
    saveUserData() {
      saveStoreStorage({
        user: {
          info: this.info,
          isLogin: this.isLogin,
          language: this.language,
          searchHistory: this.searchHistory,
          worktab: this.getWorktabState,
          setting: this.getSettingState
        }
      })
    },
    setUserInfo(info: UserInfo) {
      this.info = info
    },
    setLoginStatus(isLogin: boolean) {
      this.isLogin = isLogin
    },
    setLanguage(lang: LanguageEnum) {
      this.language = lang
    },
    setSearchHistory(list: Array<MenuListType>) {
      this.searchHistory = list
    },
    logOut() {
      setTimeout(() => {
        document.getElementsByTagName('html')[0].removeAttribute('class') // 移除暗黑主题
        this.info = {}
        this.isLogin = false
        useWorktabStore().opened = []
        this.saveUserData()
        router.push('/login')
      }, 300)
    }
  }
})

function initVersion(version: string) {
  const vs = localStorage.getItem('version')
  if (!vs) {
    localStorage.setItem('version', version)
  }
}

// 数据持久化存储
function saveStoreStorage<T>(newData: T) {
  const version = import.meta.env.VITE_VERSION
  initVersion(version)
  const vs = localStorage.getItem('version') || version
  const storedData = JSON.parse(localStorage.getItem(`sys-v${vs}`) || '{}')

  // 合并新数据与现有数据
  const mergedData = { ...storedData, ...newData }
  localStorage.setItem(`sys-v${vs}`, JSON.stringify(mergedData))
}
