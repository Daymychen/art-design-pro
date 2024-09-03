import { defineStore } from 'pinia'
import { MenuListType } from '@/types/menu'

interface MenuState {
  menuList: MenuListType[]
  menuWidth: string
  menuOpen: boolean
}

export const useMenuStore = defineStore({
  id: 'menuStore',
  state: (): MenuState => ({
    menuList: [],
    menuWidth: '',
    menuOpen: true
  }),
  getters: {
    getMenuList(): MenuListType[] {
      return this.menuList
    }
  },
  actions: {
    setMenuList(list: []) {
      this.menuList = list
    },
    setMenuWidth(width: string) {
      this.menuWidth = width
    },
    setMenuOpen(open: boolean) {
      this.menuOpen = open
    }
  }
})
