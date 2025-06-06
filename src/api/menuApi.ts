import { asyncRoutes } from '@/router/routes/asyncRoutes'
import { menuDataToRouter } from '@/router/utils/menuToRouter'
import { AppRouteRecord } from '@/types/router'

interface MenuResponse {
  menuList: AppRouteRecord[]
}

// 菜单接口
export const menuService = {
  async getMenuList(delay = 300): Promise<MenuResponse> {
    try {
      // 模拟接口返回的菜单数据
      const menuData = asyncRoutes
      // 处理菜单数据
      const menuList = menuData.map((route) => menuDataToRouter(route))
      // 模拟接口延迟
      await new Promise((resolve) => setTimeout(resolve, delay))

      return { menuList }
    } catch (error) {
      throw error instanceof Error ? error : new Error('获取菜单失败')
    }
  }
}
