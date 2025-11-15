/**
 * 用户状态管理模块
 *
 * 提供用户相关的状态管理
 *
 * ## 主要功能
 *
 * - 用户登录状态管理
 * - 用户信息存储
 * - 访问令牌和刷新令牌管理
 * - 语言设置
 * - 搜索历史记录
 * - 锁屏状态和密码管理
 * - 登出清理逻辑
 *
 * ## 使用场景
 *
 * - 用户登录和认证
 * - 权限验证
 * - 个人信息展示
 * - 多语言切换
 * - 锁屏功能
 * - 搜索历史管理
 *
 * ## 持久化
 *
 * - 使用 localStorage 存储
 * - 存储键：sys-v{version}-user
 * - 登出时自动清理
 *
 * @module store/modules/user
 * @author Art Design Pro Team
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LanguageEnum } from '@/enums/appEnum'
import { router } from '@/router'
import { useSettingStore } from './setting'
import { useWorktabStore } from './worktab'
import { AppRouteRecord } from '@/types/router'
import { setPageTitle } from '@/utils/router'
import { resetRouterState } from '@/router/guards/beforeEach'
import { useMenuStore } from './menu'
import { StorageConfig } from '@/utils/storage/storage-config'

/**
 * 用户状态管理
 * 管理用户登录状态、个人信息、语言设置、搜索历史、锁屏状态等
 */
export const useUserStore = defineStore(
  'userStore',
  () => {
    // 语言设置
    const language = ref(LanguageEnum.ZH)
    // 登录状态
    const isLogin = ref(false)
    // 锁屏状态
    const isLock = ref(false)
    // 锁屏密码
    const lockPassword = ref('')
    // 用户信息
    const info = ref<Partial<Api.Auth.UserInfo>>({})
    // 搜索历史记录
    const searchHistory = ref<AppRouteRecord[]>([])
    // 访问令牌
    const accessToken = ref('')
    // 刷新令牌
    const refreshToken = ref('')

    // 计算属性：获取用户信息
    const getUserInfo = computed(() => info.value)
    // 计算属性：获取设置状态
    const getSettingState = computed(() => useSettingStore().$state)
    // 计算属性：获取工作台状态
    const getWorktabState = computed(() => useWorktabStore().$state)

    /**
     * 设置用户信息
     * @param newInfo 新的用户信息
     */
    const setUserInfo = (newInfo: Api.Auth.UserInfo) => {
      info.value = newInfo
    }

    /**
     * 设置登录状态
     * @param status 登录状态
     */
    const setLoginStatus = (status: boolean) => {
      isLogin.value = status
    }

    /**
     * 设置语言
     * @param lang 语言枚举值
     */
    const setLanguage = (lang: LanguageEnum) => {
      setPageTitle(router.currentRoute.value)
      language.value = lang
    }

    /**
     * 设置搜索历史
     * @param list 搜索历史列表
     */
    const setSearchHistory = (list: AppRouteRecord[]) => {
      searchHistory.value = list
    }

    /**
     * 设置锁屏状态
     * @param status 锁屏状态
     */
    const setLockStatus = (status: boolean) => {
      isLock.value = status
    }

    /**
     * 设置锁屏密码
     * @param password 锁屏密码
     */
    const setLockPassword = (password: string) => {
      lockPassword.value = password
    }

    /**
     * 设置令牌
     * @param newAccessToken 访问令牌
     * @param newRefreshToken 刷新令牌（可选）
     */
    const setToken = (newAccessToken: string, newRefreshToken?: string) => {
      accessToken.value = newAccessToken
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken
      }
    }

    /**
     * 退出登录
     * 清空所有用户相关状态并跳转到登录页
     * 如果是同一账号重新登录，保留工作台标签页
     */
    const logOut = () => {
      // 保存当前用户 ID，用于下次登录时判断是否为同一用户
      const currentUserId = info.value.userId
      if (currentUserId) {
        localStorage.setItem(StorageConfig.LAST_USER_ID_KEY, String(currentUserId))
      }

      // 清空用户信息
      info.value = {}
      // 重置登录状态
      isLogin.value = false
      // 重置锁屏状态
      isLock.value = false
      // 清空锁屏密码
      lockPassword.value = ''
      // 清空访问令牌
      accessToken.value = ''
      // 清空刷新令牌
      refreshToken.value = ''
      // 注意：不清空工作台标签页，等下次登录时根据用户判断
      // 移除iframe路由缓存
      sessionStorage.removeItem('iframeRoutes')
      // 清空主页路径
      useMenuStore().setHomePath('')
      // 重置路由状态
      resetRouterState(500)
      // 跳转到登录页，携带当前路由作为 redirect 参数
      const currentRoute = router.currentRoute.value
      const redirect = currentRoute.path !== '/login' ? currentRoute.fullPath : undefined
      router.push({
        name: 'Login',
        query: redirect ? { redirect } : undefined
      })
    }

    /**
     * 检查并清理工作台标签页
     * 如果不是同一用户登录，清空工作台标签页
     * 应在登录成功后调用
     */
    const checkAndClearWorktabs = () => {
      const lastUserId = localStorage.getItem(StorageConfig.LAST_USER_ID_KEY)
      const currentUserId = info.value.userId

      // 无法获取当前用户 ID，跳过检查
      if (!currentUserId) return

      // 首次登录或缓存已清除，保留现有标签页
      if (!lastUserId) {
        return
      }

      // 不同用户登录，清空工作台标签页
      if (String(currentUserId) !== lastUserId) {
        const worktabStore = useWorktabStore()
        worktabStore.opened = []
        worktabStore.keepAliveExclude = []
      }

      // 清除临时存储
      localStorage.removeItem(StorageConfig.LAST_USER_ID_KEY)
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
      setUserInfo,
      setLoginStatus,
      setLanguage,
      setSearchHistory,
      setLockStatus,
      setLockPassword,
      setToken,
      logOut,
      checkAndClearWorktabs
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage
    }
  }
)
