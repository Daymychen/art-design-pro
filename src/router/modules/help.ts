import { AppRouteRecord } from '@/types/router'
import { WEB_LINKS } from '@/utils/constants'

export const helpRoutes: AppRouteRecord[] = [
  {
    name: 'Document',
    path: '',
    component: '',
    meta: {
      title: 'menus.help.document',
      icon: 'ri:bill-line',
      link: WEB_LINKS.DOCS,
      isIframe: false,
      keepAlive: false
    }
  },
  {
    name: 'LiteVersion',
    path: '',
    component: '',
    meta: {
      title: 'menus.help.liteVersion',
      icon: 'ri:bus-2-line',
      link: WEB_LINKS.LiteVersion,
      isIframe: false,
      keepAlive: false
    }
  },
  {
    name: 'ChangeLog',
    path: '/change/log',
    component: '/change/log',
    meta: {
      title: 'menus.plan.log',
      showTextBadge: `v${__APP_VERSION__}`,
      icon: 'ri:gamepad-line',
      keepAlive: false
    }
  }
]
