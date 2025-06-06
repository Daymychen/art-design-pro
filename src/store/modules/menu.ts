import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppRouteRecord } from '@/types/router'

// 菜单
export const useMenuStore = defineStore('menuStore', () => {
  const menuList = ref<AppRouteRecord[]>([])
  const menuWidth = ref('')

  const setMenuList = (list: AppRouteRecord[]) => (menuList.value = list)

  const setMenuWidth = (width: string) => (menuWidth.value = width)

  return {
    menuList,
    menuWidth,
    setMenuList,
    setMenuWidth
  }
})
