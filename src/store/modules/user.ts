import { defineStore } from 'pinia'
import { LanguageEnum } from '@/enums/appEnum'
import { router, setPageTitle } from '@/router'
import { UserInfo } from '@/types/store'
import { useSettingStore } from './setting'
import { useWorktabStore } from './worktab'
import { getSysStorage } from '@/utils/storage'
import { MenuListType } from '@/types/menu'

interface UserState {
  language: LanguageEnum // 语言
  isLogin: boolean // 是否登录
  isLock: boolean // 是否锁屏
  lockPassword: string // 锁屏密码
  info: Partial<UserInfo> // 用户信息
  searchHistory: MenuListType[] // 搜索历史
  accessToken: string // 添加访问令牌
  refreshToken: string // 添加刷新令牌
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => ({
    language: LanguageEnum.ZH,
    isLogin: false,
    isLock: false,
    lockPassword: '',
    info: {},
    searchHistory: [],
    accessToken: '',
    refreshToken: ''
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
        const { info, isLogin, language, searchHistory, isLock, lockPassword, refreshToken } =
          sys.user

        this.info = info || {}
        this.isLogin = isLogin || false
        this.isLock = isLock || false
        this.language = language || LanguageEnum.ZH
        this.searchHistory = searchHistory || []
        this.lockPassword = lockPassword || ''
        this.refreshToken = refreshToken || ''
        this.accessToken = sessionStorage.getItem('accessToken') || ''
      }
    },
    // 用户数据持久化存储
    saveUserData() {
      saveStoreStorage({
        user: {
          info: this.info,
          isLogin: this.isLogin,
          language: this.language,
          isLock: this.isLock,
          lockPassword: this.lockPassword,
          searchHistory: this.searchHistory,
          refreshToken: this.refreshToken,
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
      setPageTitle(router.currentRoute.value)
      this.language = lang
    },
    setSearchHistory(list: Array<MenuListType>) {
      this.searchHistory = list
    },
    setLockStatus(isLock: boolean) {
      this.isLock = isLock
    },
    setLockPassword(password: string) {
      this.lockPassword = password
    },
    setToken(accessToken: string, refreshToken?: string) {
      this.accessToken = accessToken
      if (refreshToken) {
        this.refreshToken = refreshToken
      }
      sessionStorage.setItem('accessToken', accessToken)
      this.saveUserData()
    },
    logOut() {
      setTimeout(() => {
        this.info = {}
        this.isLogin = false
        this.isLock = false
        this.lockPassword = ''
        this.accessToken = ''
        this.refreshToken = ''
        sessionStorage.removeItem('accessToken')
        useWorktabStore().opened = []
        this.saveUserData()
        sessionStorage.removeItem('iframeRoutes')
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
