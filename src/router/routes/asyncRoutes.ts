import { RoutesAlias } from '../routesAlias'
import { AppRouteRecord } from '@/types/router'
import { WEB_LINKS } from '@/utils/constants'

/**
 * 菜单列表、异步路由
 *
 * 支持两种模式:
 * 1. 前端静态配置 - 直接使用本文件中定义的路由配置
 * 2. 后端动态配置 - 后端返回菜单数据，前端解析生成路由
 *
 * 菜单标题（title）:
 * 可以是 i18n 的 key，也可以是字符串，比如：'用户列表'
 */
export const asyncRoutes: AppRouteRecord[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.dashboard.title',
      icon: '&#xe721;'
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: RoutesAlias.Dashboard,
        meta: {
          title: 'menus.dashboard.console',
          keepAlive: false,
          fixedTab: true
        }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: RoutesAlias.Analysis,
        meta: {
          title: 'menus.dashboard.analysis',
          keepAlive: false
        }
      },
      {
        path: 'ecommerce',
        name: 'Ecommerce',
        component: RoutesAlias.Ecommerce,
        meta: {
          title: 'menus.dashboard.ecommerce',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/template',
    name: 'Template',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.template.title',
      icon: '&#xe860;'
    },
    children: [
      {
        path: 'cards',
        name: 'Cards',
        component: RoutesAlias.Cards,
        meta: {
          title: 'menus.template.cards',
          keepAlive: false
        }
      },
      {
        path: 'banners',
        name: 'Banners',
        component: RoutesAlias.Banners,
        meta: {
          title: 'menus.template.banners',
          keepAlive: false
        }
      },
      {
        path: 'charts',
        name: 'Charts',
        component: RoutesAlias.Charts,
        meta: {
          title: 'menus.template.charts',
          keepAlive: false
        }
      },
      {
        path: 'map',
        name: 'Map',
        component: RoutesAlias.Map,
        meta: {
          title: 'menus.template.map',
          keepAlive: true
        }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: RoutesAlias.Chat,
        meta: {
          title: 'menus.template.chat',
          keepAlive: true
        }
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: RoutesAlias.Calendar,
        meta: {
          title: 'menus.template.calendar',
          keepAlive: true
        }
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: RoutesAlias.Pricing,
        meta: {
          title: 'menus.template.pricing',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/widgets',
    name: 'Widgets',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.widgets.title',
      icon: '&#xe81a;'
    },
    children: [
      {
        path: 'icon-list',
        name: 'IconList',
        component: RoutesAlias.IconList,
        meta: {
          title: 'menus.widgets.iconList',
          keepAlive: true
        }
      },
      {
        path: 'icon-selector',
        name: 'IconSelector',
        component: RoutesAlias.IconSelector,
        meta: {
          title: 'menus.widgets.iconSelector',
          keepAlive: true
        }
      },
      {
        path: 'image-crop',
        name: 'ImageCrop',
        component: RoutesAlias.ImageCrop,
        meta: {
          title: 'menus.widgets.imageCrop',
          keepAlive: true
        }
      },
      {
        path: 'excel',
        name: 'Excel',
        component: RoutesAlias.Excel,
        meta: {
          title: 'menus.widgets.excel',
          keepAlive: true
        }
      },
      {
        path: 'video',
        name: 'Video',
        component: RoutesAlias.Video,
        meta: {
          title: 'menus.widgets.video',
          keepAlive: true
        }
      },
      {
        path: 'count-to',
        name: 'CountTo',
        component: RoutesAlias.CountTo,
        meta: {
          title: 'menus.widgets.countTo',
          keepAlive: false
        }
      },
      {
        path: 'wang-editor',
        name: 'WangEditor',
        component: RoutesAlias.WangEditor,
        meta: {
          title: 'menus.widgets.wangEditor',
          keepAlive: true
        }
      },
      {
        path: 'watermark',
        name: 'Watermark',
        component: RoutesAlias.Watermark,
        meta: {
          title: 'menus.widgets.watermark',
          keepAlive: true
        }
      },
      {
        path: 'context-menu',
        name: 'ContextMenu',
        component: RoutesAlias.ContextMenu,
        meta: {
          title: 'menus.widgets.contextMenu',
          keepAlive: true
        }
      },
      {
        path: 'qrcode',
        name: 'Qrcode',
        component: RoutesAlias.Qrcode,
        meta: {
          title: 'menus.widgets.qrcode',
          keepAlive: true
        }
      },
      {
        path: 'drag',
        name: 'Drag',
        component: RoutesAlias.Drag,
        meta: {
          title: 'menus.widgets.drag',
          keepAlive: true
        }
      },
      {
        path: 'text-scroll',
        name: 'TextScroll',
        component: RoutesAlias.TextScroll,
        meta: {
          title: 'menus.widgets.textScroll',
          keepAlive: true
        }
      },
      {
        path: 'fireworks',
        name: 'Fireworks',
        component: RoutesAlias.Fireworks,
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
          isIframe: true,
          showBadge: true
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.system.title',
      icon: '&#xe7b9;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: RoutesAlias.User,
        meta: {
          title: 'menus.system.user',
          keepAlive: true,
          roles: ['R_SUPER', 'R_ADMIN']
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: RoutesAlias.Role,
        meta: {
          title: 'menus.system.role',
          keepAlive: true,
          roles: ['R_SUPER']
        }
      },
      {
        path: 'user-center',
        name: 'UserCenter',
        component: RoutesAlias.UserCenter,
        meta: {
          title: 'menus.system.userCenter',
          isHide: true,
          keepAlive: true,
          isHideTab: true
        }
      },
      {
        path: 'menu',
        name: 'Menus',
        component: RoutesAlias.Menu,
        meta: {
          title: 'menus.system.menu',
          keepAlive: true,
          roles: ['R_SUPER'],
          authList: [
            {
              title: '新增',
              auth_mark: 'add'
            },
            {
              title: '编辑',
              auth_mark: 'edit'
            },
            {
              title: '删除',
              auth_mark: 'delete'
            }
          ]
        }
      },
      {
        path: 'nested',
        name: 'Nested',
        component: '',
        meta: {
          title: 'menus.system.nested',
          keepAlive: true
        },
        children: [
          {
            path: 'menu1',
            name: 'NestedMenu1',
            component: RoutesAlias.NestedMenu1,
            meta: {
              title: 'menus.system.menu1',
              icon: '&#xe676;',
              keepAlive: true
            }
          },
          {
            path: 'menu2',
            name: 'NestedMenu2',
            component: '',
            meta: {
              title: 'menus.system.menu2',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                path: 'menu2-1',
                name: 'NestedMenu2-1',
                component: RoutesAlias.NestedMenu21,
                meta: {
                  title: 'menus.system.menu21',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              }
            ]
          },
          {
            path: 'menu3',
            name: 'NestedMenu3',
            component: '',
            meta: {
              title: 'menus.system.menu3',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                path: 'menu3-1',
                name: 'NestedMenu3-1',
                component: RoutesAlias.NestedMenu31,
                meta: {
                  title: 'menus.system.menu31',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              },
              {
                path: 'menu3-2',
                name: 'NestedMenu3-2',
                component: '',
                meta: {
                  title: 'menus.system.menu32',
                  icon: '&#xe676;',
                  keepAlive: true
                },
                children: [
                  {
                    path: 'menu3-2-1',
                    name: 'NestedMenu3-2-1',
                    component: RoutesAlias.NestedMenu321,
                    meta: {
                      title: 'menus.system.menu321',
                      icon: '&#xe676;',
                      keepAlive: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/article',
    name: 'Article',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.article.title',
      icon: '&#xe7ae;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'article-list',
        name: 'ArticleList',
        component: RoutesAlias.ArticleList,
        meta: {
          title: 'menus.article.articleList',
          keepAlive: true,
          authList: [
            {
              title: '新增',
              auth_mark: 'add'
            },
            {
              title: '编辑',
              auth_mark: 'edit'
            }
          ]
        }
      },

      {
        path: 'detail',
        name: 'ArticleDetail',
        component: RoutesAlias.ArticleDetail,
        meta: {
          title: 'menus.article.articleDetail',
          isHide: true,
          keepAlive: true,
          activePath: '/article/article-list' // 激活菜单路径
        }
      },
      {
        path: 'comment',
        name: 'ArticleComment',
        component: RoutesAlias.Comment,
        meta: {
          title: 'menus.article.comment',
          keepAlive: true
        }
      },
      {
        path: 'publish',
        name: 'ArticlePublish',
        component: RoutesAlias.ArticlePublish,
        meta: {
          title: 'menus.article.articlePublish',
          keepAlive: true,
          authList: [
            {
              title: '发布',
              auth_mark: 'article/article-publish/add'
            }
          ]
        }
      }
    ]
  },
  {
    path: '/result',
    name: 'Result',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.result.title',
      icon: '&#xe715;'
    },
    children: [
      {
        path: 'success',
        name: 'ResultSuccess',
        component: RoutesAlias.Success,
        meta: {
          title: 'menus.result.success',
          keepAlive: true
        }
      },
      {
        path: 'fail',
        name: 'ResultFail',
        component: RoutesAlias.Fail,
        meta: {
          title: 'menus.result.fail',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/exception',
    name: 'Exception',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.exception.title',
      icon: '&#xe820;'
    },
    children: [
      {
        path: '403',
        name: '403',
        component: RoutesAlias.Exception403,
        meta: {
          title: 'menus.exception.forbidden',
          keepAlive: true
        }
      },
      {
        path: '404',
        name: '404',
        component: RoutesAlias.Exception404,
        meta: {
          title: 'menus.exception.notFound',
          keepAlive: true
        }
      },
      {
        path: '500',
        name: '500',
        component: RoutesAlias.Exception500,
        meta: {
          title: 'menus.exception.serverError',
          keepAlive: true
        }
      }
    ]
  },

  {
    path: '/safeguard',
    name: 'Safeguard',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.safeguard.title',
      icon: '&#xe816;',
      keepAlive: false
    },
    children: [
      {
        path: 'server',
        name: 'SafeguardServer',
        component: RoutesAlias.Server,
        meta: {
          title: 'menus.safeguard.server',
          keepAlive: true
        }
      }
    ]
  },
  {
    name: 'Help',
    path: '/help',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.help.title',
      icon: '&#xe719;',
      keepAlive: false,
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: '',
        name: 'Document',
        meta: {
          title: 'menus.help.document',
          link: WEB_LINKS.DOCS,
          isIframe: false,
          keepAlive: false
        }
      }
    ]
  },
  // 一级菜单
  {
    name: 'ChangeLog',
    path: '/change/log',
    component: RoutesAlias.ChangeLog,
    meta: {
      title: 'menus.plan.log',
      showTextBadge: `v${__APP_VERSION__}`,
      icon: '&#xe712;',
      keepAlive: false
    }
  }
]
