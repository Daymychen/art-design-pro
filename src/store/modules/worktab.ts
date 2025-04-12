import { defineStore } from 'pinia'
import { ref } from 'vue'
import { WorkTabType } from '@/types/store'
import { HOME_PAGE } from '@/router/index'
import { router } from '@/router'
import { getSysStorage } from '@/utils/storage'

// 选项卡
export const useWorktabStore = defineStore('worktabStore', () => {
  const current = ref<Partial<WorkTabType>>({})
  const opened = ref<WorkTabType[]>([])
  const keepAliveExclude = ref<string[]>([])

  const initState = () => {
    const sysStorage = getSysStorage()
    if (sysStorage) {
      const sys = JSON.parse(sysStorage)
      const { worktab } = sys.user
      current.value = worktab.current || {}
      opened.value = worktab.opened || []
      checkFirstHomePage()
    }
  }

  /**
   * 打开或激活一个选项卡
   * @param tab 目标选项卡信息
   */
  const openTab = (tab: WorkTabType): void => {
    removeKeepAliveExclude(tab.name as string)

    const index = opened.value.findIndex((item) => item.path === tab.path)

    if (index === -1) {
      opened.value.push({ ...tab })
    } else {
      const existingTab = opened.value[index]
      if (!areQueriesEqual(existingTab.query, tab.query)) {
        opened.value[index] = {
          ...existingTab,
          query: tab.query,
          // 可选：支持更多属性更新
          title: tab.title || existingTab.title
        }
      }
    }

    current.value = opened.value[index === -1 ? opened.value.length - 1 : index]
  }

  // 辅助函数
  const areQueriesEqual = (query1: any, query2: any): boolean => {
    return JSON.stringify(query1) === JSON.stringify(query2)
  }

  /**
   * 关闭指定的选项卡，并处理激活状态和路由跳转
   * @param path 要关闭的路由路径
   */
  const removeTab = (path: string) => {
    const noCurrentTab = opened.value.find((tab) => tab.path === path)
    const index = opened.value.findIndex((tab) => tab.path === path)
    if (index === -1) return

    opened.value.splice(index, 1)

    // 若关闭后无选项卡，且关闭的不是首页，则跳转首页
    if (!opened.value.length && path !== HOME_PAGE) {
      router.push(HOME_PAGE)
      return
    }

    // 若关闭的是当前激活标签，则标记其为缓存排除，并激活相邻标签
    if (current.value.path === path) {
      if (current.value.name) {
        addKeepAliveExclude(current.value as WorkTabType)
      }
      const newIndex = index >= opened.value.length ? opened.value.length - 1 : index
      current.value = opened.value[newIndex]
      router.push(current.value.path as string)
    } else {
      if (noCurrentTab?.name) {
        addKeepAliveExclude(noCurrentTab)
      }
    }
  }

  /**
   * 关闭当前标签左侧（不包括首页）的所有选项卡
   * @param path 当前选项卡的路由路径
   */
  const removeLeft = (path: string) => {
    const index = opened.value.findIndex((tab) => tab.path === path)
    if (index > 1) {
      // 保留首页和当前标签
      const tabsToRemove = opened.value.slice(1, index)
      markTabsToRemove(tabsToRemove)
      opened.value.splice(1, index - 1)
    }
  }

  /**
   * 关闭当前标签右侧的所有选项卡
   * @param path 当前选项卡的路由路径
   */
  const removeRight = (path: string) => {
    const index = opened.value.findIndex((tab) => tab.path === path)
    if (index !== -1 && index < opened.value.length - 1) {
      const tabsToRemove = opened.value.slice(index + 1)
      markTabsToRemove(tabsToRemove)
      opened.value.splice(index + 1)
    }
  }

  /**
   * 关闭除当前标签和首页外的所有选项卡
   * @param path 当前选项卡的路由路径
   */
  const removeOthers = (path: string) => {
    const tabsToRemove = opened.value.filter((tab) => tab.path !== path && tab.path !== HOME_PAGE)
    markTabsToRemove(tabsToRemove)
    opened.value = opened.value.filter((tab) => tab.path === path || tab.path === HOME_PAGE)
  }

  /**
   * 关闭所有选项卡（当传入的 path 不是首页时关闭全部；首页时只保留首页）
   * @param path 当前选项卡的路由路径
   */
  const removeAll = (path: string) => {
    if (path !== HOME_PAGE) {
      markTabsToRemove(opened.value)
      current.value = {}
      opened.value = []
      router.push(HOME_PAGE)
    } else {
      const tabsToRemove = opened.value.filter((tab) => tab.path !== HOME_PAGE)
      markTabsToRemove(tabsToRemove)
      opened.value = opened.value.filter((tab) => tab.path === HOME_PAGE)
      if (opened.value.length === 0) router.push(HOME_PAGE)
    }
  }

  /**
   * 检查第一个选项卡是否为首页，否则清空所有标签并跳转首页
   */
  const checkFirstHomePage = () => {
    if (opened.value.length && opened.value[0].path !== HOME_PAGE) {
      removeAll(HOME_PAGE)
    }
  }

  /**
   * 将指定选项卡添加到 keepAlive 排除列表中，只有当该选项卡的 keepAlive 为 true 时才进行添加
   * @param tab 选项卡对象
   */
  const addKeepAliveExclude = (tab: WorkTabType) => {
    if (tab.keepAlive && tab.name && !keepAliveExclude.value.includes(tab.name)) {
      keepAliveExclude.value.push(tab.name)
    }
  }

  /**
   * 从 keepAlive 排除列表中移除指定组件名称
   * @param name 路由组件名称
   */
  const removeKeepAliveExclude = (name: string) => {
    keepAliveExclude.value = keepAliveExclude.value.filter((item) => item !== name)
  }

  /**
   * 将传入的一组选项卡的组件名称标记为排除缓存
   * @param tabs 需要标记的选项卡数组
   */
  const markTabsToRemove = (tabs: WorkTabType[]) => {
    tabs.forEach((tab) => {
      if (tab.name) {
        addKeepAliveExclude(tab)
      }
    })
  }

  return {
    current,
    opened,
    keepAliveExclude,
    initState,
    openTab,
    removeTab,
    removeLeft,
    removeRight,
    removeOthers,
    removeAll,
    checkFirstHomePage,
    addKeepAliveExclude,
    removeKeepAliveExclude,
    markTabsToRemove
  }
})
