import { AppRouteRecord } from '@/types/router'

export const safeguardRoutes: AppRouteRecord = {
  path: '/safeguard',
  name: 'Safeguard',
  component: '/index/index',
  meta: {
    title: 'menus.safeguard.title',
    icon: 'ri:account-circle-2-line',
    keepAlive: false
  },
  children: [
    {
      path: 'server',
      name: 'SafeguardServer',
      component: '/safeguard/server',
      meta: {
        title: 'menus.safeguard.server',
        keepAlive: true
      }
    }
  ]
}
