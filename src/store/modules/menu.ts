import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppRouteRecord } from '@/types/router'
import { getFirstMenuPath } from '@/utils'

// 菜单
export const useMenuStore = defineStore('menuStore', () => {
  const homePath = ref('')
  const menuList = ref<AppRouteRecord[]>([])
  const menuWidth = ref('')
  const removeRouteFns = ref<(() => void)[]>([]) // 存储路由移除函数

  // 设置菜单列表
  const setMenuList = (list: AppRouteRecord[]) => {
    menuList.value = list
    const firstMenuPath = getFirstMenuPath(list) // 获取菜单的第一个 path
    homePath.value = firstMenuPath
  }

  // 获取首页路径
  const getHomePath = () => homePath.value

  // 设置菜单宽度
  const setMenuWidth = (width: string) => (menuWidth.value = width)

  // 添加路由移除函数
  const addRemoveRouteFns = (fns: (() => void)[]) => {
    removeRouteFns.value.push(...fns)
  }

  // 移除所有动态路由
  const removeAllDynamicRoutes = () => {
    removeRouteFns.value.forEach((fn) => fn())
    removeRouteFns.value = []
  }

  // 清空移除函数
  const clearRemoveRouteFns = () => {
    removeRouteFns.value = []
  }

  return {
    menuList,
    menuWidth,
    removeRouteFns,
    setMenuList,
    setMenuWidth,
    getHomePath,
    addRemoveRouteFns,
    removeAllDynamicRoutes,
    clearRemoveRouteFns
  }
})
