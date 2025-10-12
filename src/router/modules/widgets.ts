import { AppRouteRecord } from '@/types/router'

export const widgetsRoutes: AppRouteRecord = {
  path: '/widgets',
  name: 'Widgets',
  component: '/index/index',
  meta: {
    title: 'menus.widgets.title',
    icon: '&#xe81a;'
  },
  children: [
    {
      path: 'icon-list',
      name: 'IconList',
      component: '/widgets/icon-list',
      meta: {
        title: 'menus.widgets.iconList',
        keepAlive: true
      }
    },
    {
      path: 'icon-selector',
      name: 'IconSelector',
      component: '/widgets/icon-selector',
      meta: {
        title: 'menus.widgets.iconSelector',
        keepAlive: true
      }
    },
    {
      path: 'image-crop',
      name: 'ImageCrop',
      component: '/widgets/image-crop',
      meta: {
        title: 'menus.widgets.imageCrop',
        keepAlive: true
      }
    },
    {
      path: 'excel',
      name: 'Excel',
      component: '/widgets/excel',
      meta: {
        title: 'menus.widgets.excel',
        keepAlive: true
      }
    },
    {
      path: 'video',
      name: 'Video',
      component: '/widgets/video',
      meta: {
        title: 'menus.widgets.video',
        keepAlive: true
      }
    },
    {
      path: 'count-to',
      name: 'CountTo',
      component: '/widgets/count-to',
      meta: {
        title: 'menus.widgets.countTo',
        keepAlive: false
      }
    },
    {
      path: 'wang-editor',
      name: 'WangEditor',
      component: '/widgets/wang-editor',
      meta: {
        title: 'menus.widgets.wangEditor',
        keepAlive: true
      }
    },
    {
      path: 'watermark',
      name: 'Watermark',
      component: '/widgets/watermark',
      meta: {
        title: 'menus.widgets.watermark',
        keepAlive: true
      }
    },
    {
      path: 'context-menu',
      name: 'ContextMenu',
      component: '/widgets/context-menu',
      meta: {
        title: 'menus.widgets.contextMenu',
        keepAlive: true
      }
    },
    {
      path: 'qrcode',
      name: 'Qrcode',
      component: '/widgets/qrcode',
      meta: {
        title: 'menus.widgets.qrcode',
        keepAlive: true
      }
    },
    {
      path: 'drag',
      name: 'Drag',
      component: '/widgets/drag',
      meta: {
        title: 'menus.widgets.drag',
        keepAlive: true
      }
    },
    {
      path: 'text-scroll',
      name: 'TextScroll',
      component: '/widgets/text-scroll',
      meta: {
        title: 'menus.widgets.textScroll',
        keepAlive: true
      }
    },
    {
      path: 'fireworks',
      name: 'Fireworks',
      component: '/widgets/fireworks',
      meta: {
        title: 'menus.widgets.fireworks',
        keepAlive: true,
        showTextBadge: 'Hot'
      }
    },
    {
      path: '/outside/iframe/elementui',
      name: 'ElementUI',
      component: '',
      meta: {
        title: 'menus.widgets.elementUI',
        keepAlive: false,
        link: 'https://element-plus.org/zh-CN/component/overview.html',
        isIframe: true
      }
    }
  ]
}
