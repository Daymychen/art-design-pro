import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LanguageEnum } from '@/enums/appEnum'
import { router, setPageTitle } from '@/router'
import { UserInfo } from '@/types/store'
import { useSettingStore } from './setting'
import { useWorktabStore } from './worktab'
import { getSysStorage } from '@/utils/storage'
import { MenuListType } from '@/types/menu'

// 用户
export const useUserStore = defineStore('userStore', () => {
  const language = ref(LanguageEnum.ZH)
  const isLogin = ref(false)
  const isLock = ref(false)
  const lockPassword = ref('')
  const info = ref<Partial<UserInfo>>({})
  const searchHistory = ref<MenuListType[]>([])
  const accessToken = ref('')
  const refreshToken = ref('')

  const getUserInfo = computed(() => info.value)
  const getSettingState = computed(() => useSettingStore().$state)
  const getWorktabState = computed(() => useWorktabStore().$state)

  const initState = () => {
    let sys = getSysStorage()

    if (sys) {
      sys = JSON.parse(sys)
      const {
        info: storedInfo,
        isLogin: storedIsLogin,
        language: storedLanguage,
        searchHistory: storedSearchHistory,
        isLock: storedIsLock,
        lockPassword: storedLockPassword,
        refreshToken: storedRefreshToken
      } = sys.user

      info.value = storedInfo || {}
      isLogin.value = storedIsLogin || false
      isLock.value = storedIsLock || false
      language.value = storedLanguage || LanguageEnum.ZH
      searchHistory.value = storedSearchHistory || []
      lockPassword.value = storedLockPassword || ''
      refreshToken.value = storedRefreshToken || ''
      accessToken.value = sessionStorage.getItem('accessToken') || ''
    }
  }

  const saveUserData = () => {
    saveStoreStorage({
      user: {
        info: info.value,
        isLogin: isLogin.value,
        language: language.value,
        isLock: isLock.value,
        lockPassword: lockPassword.value,
        searchHistory: searchHistory.value,
        refreshToken: refreshToken.value,
        worktab: getWorktabState.value,
        setting: getSettingState.value
      }
    })
  }

  const setUserInfo = (newInfo: UserInfo) => {
    info.value = newInfo
  }

  const setLoginStatus = (status: boolean) => {
    isLogin.value = status
  }

  const setLanguage = (lang: LanguageEnum) => {
    setPageTitle(router.currentRoute.value)
    language.value = lang
  }

  const setSearchHistory = (list: MenuListType[]) => {
    searchHistory.value = list
  }

  const setLockStatus = (status: boolean) => {
    isLock.value = status
  }

  const setLockPassword = (password: string) => {
    lockPassword.value = password
  }

  const setToken = (newAccessToken: string, newRefreshToken?: string) => {
    accessToken.value = newAccessToken
    if (newRefreshToken) {
      refreshToken.value = newRefreshToken
    }
    sessionStorage.setItem('accessToken', newAccessToken)
    saveUserData()
  }

  const logOut = () => {
    setTimeout(() => {
      info.value = {}
      isLogin.value = false
      isLock.value = false
      lockPassword.value = ''
      accessToken.value = ''
      refreshToken.value = ''
      sessionStorage.removeItem('accessToken')
      useWorktabStore().opened = []
      saveUserData()
      sessionStorage.removeItem('iframeRoutes')
      router.push('/login')
    }, 300)
  }

  return {
    language,
    isLogin,
    isLock,
    lockPassword,
    info,
    searchHistory,
    accessToken,
    refreshToken,
    getUserInfo,
    getSettingState,
    getWorktabState,
    initState,
    saveUserData,
    setUserInfo,
    setLoginStatus,
    setLanguage,
    setSearchHistory,
    setLockStatus,
    setLockPassword,
    setToken,
    logOut
  }
})

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

// 初始化版本
function initVersion(version: string) {
  const vs = localStorage.getItem('version')
  if (!vs) {
    localStorage.setItem('version', version)
  }
}
