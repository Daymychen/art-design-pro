import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MenuListType } from '@/types/menu'

// 菜单
export const useMenuStore = defineStore('menuStore', () => {
  const menuList = ref<MenuListType[]>([])
  const menuWidth = ref('')

  const setMenuList = (list: MenuListType[]) => (menuList.value = list)

  const setMenuWidth = (width: string) => (menuWidth.value = width)

  return {
    menuList,
    menuWidth,
    setMenuList,
    setMenuWidth
  }
})
