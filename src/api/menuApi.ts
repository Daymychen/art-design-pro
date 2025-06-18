// import { Api } from '@/typings/api'
import { menuDataToRouter } from '@/router/utils/menuToRouter'
import { AppRouteRecord } from '@/types/router'

// 后端控制模式（模拟接口返回的菜单数据）
import { asyncRoutes } from '@/router/routes/asyncRoutes'

// 后端控制模式（获取真实接口返回的菜单数据）
// import request from '@/utils/http'

interface MenuResponse {
  menuList: AppRouteRecord[]
}

// 菜单接口
// 下方代码仅在权限控制模式为“后端控制模式”时生效
export const menuService = {
  // 后端控制模式（模拟接口返回的菜单数据）
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

  // 后端控制模式（获取真实接口返回的菜单数据）
  // async getMenuList(): Promise<MenuResponse> {
  //   try {
  //     // 获取菜单列表
  //     const { menuList: menuData = [] } = await request.get<Api.User.MenuList>({
  //       url: '/api/user/menu'
  //     })
  //     // 处理菜单数据
  //     const menuList = menuData.map((route) => menuDataToRouter(route))
  //     return { menuList }
  //   } catch (error) {
  //     console.error('获取菜单列表失败:', error)
  //     throw error instanceof Error ? error : new Error('获取菜单列表失败')
  //   }
  // }
}
