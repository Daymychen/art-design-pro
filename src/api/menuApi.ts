import { fourDotsSpinnerSvg } from '@/assets/svg/loading'
import { asyncRoutes } from '@/router/routes/asyncRoutes'
import { menuDataToRouter } from '@/router/utils/menuToRouter'
import { MenuListType } from '@/types/menu'
import { ElLoading } from 'element-plus'

const DEFAULT_LOADING_CONFIG = {
  lock: true,
  background: 'rgba(0, 0, 0, 0)',
  svg: fourDotsSpinnerSvg,
  svgViewBox: '0 0 40 40'
} as const

interface MenuResponse {
  menuList: MenuListType[]
  closeLoading: () => void
}

// 菜单接口
export const menuService = {
  async getMenuList(delay = 300): Promise<MenuResponse> {
    let loading: { close: () => void } | null = null

    try {
      loading = ElLoading.service(DEFAULT_LOADING_CONFIG)

      // 模拟接口返回的菜单数据
      const menuData = asyncRoutes

      // 处理菜单数据
      const menuList = menuData.map((route) => menuDataToRouter(route))

      // 模拟接口延迟
      await new Promise((resolve) => setTimeout(resolve, delay))

      return {
        menuList: menuList,
        closeLoading: () => loading?.close()
      }
    } catch (error) {
      loading?.close()
      throw error instanceof Error ? error : new Error('获取菜单失败')
    }
  }
}
