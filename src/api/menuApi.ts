import { roleRoutes } from '@/router/index'
import { menuData } from '@/mock/menuData'
import { routerMatch } from '@/utils/menu'

export function addRouteList() {
  routerMatch(menuData, roleRoutes)
}
