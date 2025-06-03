import { RoutesAlias } from '../routesAlias'
import { MenuListType } from '@/types/menu'
import { WEB_LINKS } from '@/utils/links'

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
export const asyncRoutes: MenuListType[] = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.dashboard.title',
      icon: '&#xe721;',
      keepAlive: false
    },
    children: [
      {
        id: 11,
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
        id: 12,
        path: 'analysis',
        name: 'Analysis',
        component: RoutesAlias.Analysis,
        meta: {
          title: 'menus.dashboard.analysis',
          keepAlive: false
        }
      },
      {
        id: 13,
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
    id: 2,
    path: '/widgets',
    name: 'Widgets',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.widgets.title',
      icon: '&#xe81a;',
      keepAlive: false
    },
    children: [
      {
        id: 21,
        path: 'icon-list',
        name: 'IconList',
        component: RoutesAlias.IconList,
        meta: {
          title: 'menus.widgets.iconList',
          keepAlive: true
        }
      },
      {
        id: 22,
        path: 'icon-selector',
        name: 'IconSelector',
        component: RoutesAlias.IconSelector,
        meta: {
          title: 'menus.widgets.iconSelector',
          keepAlive: true
        }
      },
      {
        id: 23,
        path: 'image-crop',
        name: 'ImageCrop',
        component: RoutesAlias.ImageCrop,
        meta: {
          title: 'menus.widgets.imageCrop',
          keepAlive: true
        }
      },
      {
        id: 24,
        path: 'excel',
        name: 'Excel',
        component: RoutesAlias.Excel,
        meta: {
          title: 'menus.widgets.excel',
          keepAlive: true
        }
      },
      {
        id: 25,
        path: 'video',
        name: 'Video',
        component: RoutesAlias.Video,
        meta: {
          title: 'menus.widgets.video',
          keepAlive: true
        }
      },
      {
        id: 26,
        path: 'count-to',
        name: 'CountTo',
        component: RoutesAlias.CountTo,
        meta: {
          title: 'menus.widgets.countTo',
          keepAlive: false
        }
      },
      {
        id: 27,
        path: 'wang-editor',
        name: 'WangEditor',
        component: RoutesAlias.WangEditor,
        meta: {
          title: 'menus.widgets.wangEditor',
          keepAlive: true
        }
      },
      {
        id: 28,
        path: 'watermark',
        name: 'Watermark',
        component: RoutesAlias.Watermark,
        meta: {
          title: 'menus.widgets.watermark',
          keepAlive: true
        }
      },
      {
        id: 29,
        path: 'context-menu',
        name: 'ContextMenu',
        component: RoutesAlias.ContextMenu,
        meta: {
          title: 'menus.widgets.contextMenu',
          keepAlive: true
        }
      },
      {
        id: 30,
        path: 'qrcode',
        name: 'Qrcode',
        component: RoutesAlias.Qrcode,
        meta: {
          title: 'menus.widgets.qrcode',
          keepAlive: true
        }
      },
      {
        id: 31,
        path: 'drag',
        name: 'Drag',
        component: RoutesAlias.Drag,
        meta: {
          title: 'menus.widgets.drag',
          keepAlive: true
        }
      },
      {
        id: 32,
        path: 'text-scroll',
        name: 'TextScroll',
        component: RoutesAlias.TextScroll,
        meta: {
          title: 'menus.widgets.textScroll',
          keepAlive: true
        }
      },
      {
        id: 33,
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
        id: 34,
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
    id: 3,
    path: '/template',
    name: 'Template',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.template.title',
      icon: '&#xe860;',
      keepAlive: false
    },
    children: [
      {
        id: 31,
        path: 'cards',
        name: 'Cards',
        component: RoutesAlias.Cards,
        meta: {
          title: 'menus.template.cards',
          keepAlive: false
        }
      },
      {
        id: 32,
        path: 'banners',
        name: 'Banners',
        component: RoutesAlias.Banners,
        meta: {
          title: 'menus.template.banners',
          keepAlive: false
        }
      },
      {
        id: 33,
        path: 'charts',
        name: 'Charts',
        component: RoutesAlias.Charts,
        meta: {
          title: 'menus.template.charts',
          keepAlive: false
        }
      },
      {
        id: 34,
        path: 'map',
        name: 'Map',
        component: RoutesAlias.Map,
        meta: {
          title: 'menus.template.map',
          keepAlive: true
        }
      },
      {
        id: 35,
        path: 'chat',
        name: 'Chat',
        component: RoutesAlias.Chat,
        meta: {
          title: 'menus.template.chat',
          keepAlive: true
        }
      },
      {
        id: 36,
        path: 'calendar',
        name: 'Calendar',
        component: RoutesAlias.Calendar,
        meta: {
          title: 'menus.template.calendar',
          keepAlive: true
        }
      },
      {
        id: 37,
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
    id: 4,
    path: '/system',
    name: 'System',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.system.title',
      icon: '&#xe7b9;',
      keepAlive: false,
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        id: 41,
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
        id: 42,
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
        id: 43,
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
        id: 44,
        path: 'menu',
        name: 'Menus',
        component: RoutesAlias.Menu,
        meta: {
          title: 'menus.system.menu',
          keepAlive: true,
          roles: ['R_SUPER'],
          authList: [
            {
              id: 441,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 442,
              title: '编辑',
              auth_mark: 'edit'
            },
            {
              id: 443,
              title: '删除',
              auth_mark: 'delete'
            }
          ]
        }
      },
      // {
      //   id: 45,
      //   path: 'permission',
      //   name: 'Permission',
      //   component: RoutesAlias.Permission,
      //   meta: {
      //     title: 'menus.system.permission',
      //     keepAlive: true,
      //     authList: [
      //       {
      //         id: 451,
      //         title: '新增',
      //         auth_mark: 'add'
      //       },
      //       {
      //         id: 452,
      //         title: '编辑',
      //         auth_mark: 'edit'
      //       },
      //       {
      //         id: 453,
      //         title: '删除',
      //         auth_mark: 'delete'
      //       }
      //     ]
      //   }
      // },
      {
        id: 46,
        path: 'nested',
        name: 'Nested',
        component: '',
        meta: {
          title: 'menus.system.nested',
          keepAlive: true
        },
        children: [
          {
            id: 461,
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
            id: 462,
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
                id: 4621,
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
            id: 463,
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
                id: 4631,
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
                id: 4632,
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
                    id: 46321,
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
    id: 5,
    path: '/article',
    name: 'Article',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.article.title',
      icon: '&#xe7ae;',
      keepAlive: true,
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        id: 51,
        path: 'article-list',
        name: 'ArticleList',
        component: RoutesAlias.ArticleList,
        meta: {
          title: 'menus.article.articleList',
          keepAlive: true,
          authList: [
            {
              id: 511,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 512,
              title: '编辑',
              auth_mark: 'edit'
            }
          ]
        }
      },

      {
        id: 52,
        path: 'detail',
        name: 'ArticleDetail',
        component: RoutesAlias.ArticleDetail,
        meta: {
          title: 'menus.article.articleDetail',
          isHide: true,
          keepAlive: true
        }
      },
      {
        id: 53,
        path: 'comment',
        name: 'Comment',
        component: RoutesAlias.Comment,
        meta: {
          title: 'menus.article.comment',
          keepAlive: true
        }
      },
      {
        id: 54,
        path: 'publish',
        name: 'ArticlePublish',
        component: RoutesAlias.ArticlePublish,
        meta: {
          title: 'menus.article.articlePublish',
          keepAlive: true,
          authList: [
            {
              id: 541,
              title: '发布',
              auth_mark: 'article/article-publish/add'
            }
          ]
        }
      }
    ]
  },
  {
    id: 6,
    path: '/result',
    name: 'Result',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.result.title',
      icon: '&#xe715;',
      keepAlive: false
    },
    children: [
      {
        id: 61,
        path: 'success',
        name: 'Success',
        component: RoutesAlias.Success,
        meta: {
          title: 'menus.result.success',
          keepAlive: true
        }
      },
      {
        id: 62,
        path: 'fail',
        name: 'Fail',
        component: RoutesAlias.Fail,
        meta: {
          title: 'menus.result.fail',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 7,
    path: '/exception',
    name: 'Exception',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.exception.title',
      icon: '&#xe820;',
      keepAlive: false
    },
    children: [
      {
        id: 71,
        path: '403',
        name: '403',
        component: RoutesAlias.Exception403,
        meta: {
          title: 'menus.exception.forbidden',
          keepAlive: true
        }
      },
      {
        id: 72,
        path: '404',
        name: '404',
        component: RoutesAlias.Exception404,
        meta: {
          title: 'menus.exception.notFound',
          keepAlive: true
        }
      },
      {
        id: 73,
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
    id: 8,
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
        id: 81,
        path: 'server',
        name: 'Server',
        component: RoutesAlias.Server,
        meta: {
          title: 'menus.safeguard.server',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 9,
    name: '',
    path: '',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.help.title',
      icon: '&#xe719;',
      keepAlive: false,
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        id: 91,
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
    id: 10,
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
