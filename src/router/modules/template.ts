import { AppRouteRecord } from '@/types/router'

export const templateRoutes: AppRouteRecord = {
  path: '/template',
  name: 'Template',
  component: '/index/index',
  meta: {
    title: 'menus.template.title',
    icon: 'ri:apps-2-line'
  },
  children: [
    {
      path: 'cards',
      name: 'Cards',
      component: '/template/cards',
      meta: {
        title: 'menus.template.cards',
        keepAlive: false
      }
    },
    {
      path: 'banners',
      name: 'Banners',
      component: '/template/banners',
      meta: {
        title: 'menus.template.banners',
        keepAlive: false
      }
    },
    {
      path: 'charts',
      name: 'Charts',
      component: '/template/charts',
      meta: {
        title: 'menus.template.charts',
        keepAlive: false
      }
    },
    {
      path: 'map',
      name: 'Map',
      component: '/template/map',
      meta: {
        title: 'menus.template.map',
        keepAlive: true
      }
    },
    {
      path: 'chat',
      name: 'Chat',
      component: '/template/chat',
      meta: {
        title: 'menus.template.chat',
        keepAlive: true
      }
    },
    {
      path: 'calendar',
      name: 'Calendar',
      component: '/template/calendar',
      meta: {
        title: 'menus.template.calendar',
        keepAlive: true
      }
    },
    {
      path: 'pricing',
      name: 'Pricing',
      component: '/template/pricing',
      meta: {
        title: 'menus.template.pricing',
        keepAlive: true,
        isFullPage: true
      }
    }
  ]
}
