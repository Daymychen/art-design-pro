import { upgradeLogList } from '@/mock/upgradeLog'
import { RoutesAlias } from './routesAlias'
import { MenuListType } from '@/types/menu'

/**
 * 菜单列表、异步路由
 *
 * 支持两种模式:
 * 1. 前端静态配置 - 直接使用本文件中定义的路由配置
 * 2. 后端动态配置 - 后端返回菜单数据，前端解析生成路由
 *
 */
export const asyncRoutes: MenuListType[] = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Home,
    meta: {
      title: '仪表盘',
      title_en: 'Dashboard',
      icon: '&#xe721;',
      keepAlive: false
    },
    children: [
      {
        id: 101,
        path: 'console',
        name: 'Console',
        component: RoutesAlias.Dashboard,
        meta: {
          title: '工作台',
          title_en: 'Workbench',
          keepAlive: true
        }
      },
      {
        id: 102,
        path: 'analysis',
        name: 'Analysis',
        component: RoutesAlias.Analysis,
        meta: {
          title: '分析页',
          title_en: 'Analysis',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 5,
    path: '/widgets',
    name: 'Widgets',
    component: RoutesAlias.Home,
    meta: {
      title: '组件中心',
      title_en: 'Components',
      icon: '&#xe81a;',
      keepAlive: false
    },
    children: [
      {
        id: 503,
        path: 'icon-list',
        name: 'IconList',
        component: RoutesAlias.IconList,
        meta: {
          title: 'Icon 图标',
          title_en: 'Icon',
          keepAlive: true
        }
      },
      {
        id: 504,
        path: 'icon-selector',
        name: 'IconSelector',
        component: RoutesAlias.IconSelector,
        meta: {
          title: '图标选择器',
          title_en: 'Icon selector',
          keepAlive: true
        }
      },
      {
        id: 505,
        path: 'image-crop',
        name: 'ImageCrop',
        component: RoutesAlias.ImageCrop,
        meta: {
          title: '图像裁剪',
          title_en: 'Image crop',
          keepAlive: true
        }
      },
      {
        id: 506,
        path: 'excel',
        name: 'Excel',
        component: RoutesAlias.Excel,
        meta: {
          title: 'Excel 导入导出',
          title_en: 'Excel import and export',
          keepAlive: true
        }
      },
      {
        id: 507,
        path: 'video',
        name: 'Video',
        component: RoutesAlias.Video,
        meta: {
          title: '视频播放器',
          title_en: 'Video',
          keepAlive: true
        }
      },
      {
        id: 508,
        path: 'count-to',
        name: 'CountTo',
        component: RoutesAlias.CountTo,
        meta: {
          title: '数字滚动',
          title_en: 'Count to',
          keepAlive: false
        }
      },
      {
        id: 509,
        path: 'wang-editor',
        name: 'WangEditor',
        component: RoutesAlias.WangEditor,
        meta: {
          title: '富文本编辑器',
          title_en: 'Rich text editor',
          keepAlive: true
        }
      },
      {
        id: 510,
        path: 'watermark',
        name: 'Watermark',
        component: RoutesAlias.Watermark,
        meta: {
          title: '水印',
          title_en: 'Watermark',
          keepAlive: true
        }
      },
      {
        id: 511,
        path: 'context-menu',
        name: 'ContextMenu',
        component: RoutesAlias.ContextMenu,
        meta: {
          title: '右键菜单',
          title_en: 'Context menu',
          keepAlive: true
        }
      },
      {
        id: 512,
        path: 'qrcode',
        name: 'Qrcode',
        component: RoutesAlias.Qrcode,
        meta: {
          title: '二维码',
          title_en: 'QR code',
          keepAlive: true
        }
      },
      {
        id: 513,
        path: 'drag',
        name: 'Drag',
        component: RoutesAlias.Drag,
        meta: {
          title: '拖拽',
          title_en: 'Drag',
          keepAlive: true
        }
      },
      {
        id: 514,
        path: 'text-scroll',
        name: 'TextScroll',
        component: RoutesAlias.TextScroll,
        meta: {
          title: '文字滚动',
          title_en: 'Text scroll',
          keepAlive: true
        }
      },
      {
        id: 515,
        path: 'fireworks',
        name: 'Fireworks',
        component: RoutesAlias.Fireworks,
        meta: {
          title: '礼花',
          title_en: 'Fireworks',
          keepAlive: true,
          showTextBadge: 'Hot'
        }
      },
      {
        id: 516,
        path: '',
        name: 'ElementUI',
        component: '',
        meta: {
          title: '组件总览',
          title_en: 'Element UI',
          keepAlive: false,
          link: 'https://element-plus.org/zh-CN/component/overview.html',
          isIframe: true,
          showBadge: true
        }
      }
    ]
  },
  {
    id: 126,
    path: '/template',
    name: 'Template',
    component: RoutesAlias.Home,
    meta: {
      title: '模板中心',
      title_en: 'Template',
      icon: '&#xe860;',
      keepAlive: false
    },
    children: [
      {
        id: 12601,
        path: 'chat',
        name: 'Chat',
        component: RoutesAlias.Chat,
        meta: {
          title: '聊天',
          title_en: 'Chat',
          keepAlive: true
        }
      },
      {
        id: 12602,
        path: 'cards',
        name: 'Cards',
        component: RoutesAlias.Cards,
        meta: {
          title: '卡片',
          title_en: 'Cards',
          keepAlive: false
        }
      },
      {
        id: 12603,
        path: 'banners',
        name: 'Banners',
        component: RoutesAlias.Banners,
        meta: {
          title: '横幅',
          title_en: 'Banners',
          keepAlive: false
        }
      },
      {
        id: 12604,
        path: 'charts',
        name: 'Charts',
        component: RoutesAlias.Charts,
        meta: {
          title: '图表',
          title_en: 'Charts',
          keepAlive: false
        }
      },
      {
        id: 12605,
        path: 'calendar',
        name: 'Calendar',
        component: RoutesAlias.Calendar,
        meta: {
          title: '日历',
          title_en: 'Calendar',
          keepAlive: true
        }
      },

      {
        id: 12622,
        path: 'pricing',
        name: 'Pricing',
        component: RoutesAlias.Pricing,
        meta: {
          title: '定价',
          title_en: 'Pricing',
          keepAlive: true,
          isHideTab: true
        }
      }
    ]
  },
  {
    id: 4,
    path: '/article',
    name: 'Article',
    component: RoutesAlias.Home,
    meta: {
      title: '文章管理',
      title_en: 'Article manguage',
      icon: '&#xe7ae;',
      keepAlive: true
    },
    children: [
      {
        id: 202,
        path: 'article-list',
        name: 'ArticleList',
        component: RoutesAlias.ArticleList,
        meta: {
          title: '文章列表',
          title_en: 'Article list',
          keepAlive: true,
          authList: [
            {
              id: 2021,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 2022,
              title: '编辑',
              auth_mark: 'edit'
            }
          ]
        }
      },

      {
        id: 204,
        path: 'detail',
        name: 'ArticleDetail',
        component: RoutesAlias.ArticleDetail,
        meta: {
          title: '文章详情',
          title_en: 'Article category',
          isHide: true,
          keepAlive: true
        }
      },
      {
        id: 205,
        path: 'comment',
        name: 'Comment',
        component: RoutesAlias.Comment,
        meta: {
          title: '留言管理',
          title_en: 'Comment',
          keepAlive: true
        }
      },
      {
        id: 201,
        path: 'article-publish',
        name: 'ArticlePublish',
        component: RoutesAlias.ArticlePublish,
        meta: {
          title: '文章发布',
          title_en: 'Article publish',
          keepAlive: true,
          authList: [
            {
              id: 2010,
              title: '发布',
              auth_mark: 'article/article-publish/add'
            }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    name: 'User',
    path: '/user',
    component: RoutesAlias.Home,
    meta: {
      title: '用户管理',
      title_en: 'User manguage',
      icon: '&#xe86e;',
      keepAlive: false
    },
    children: [
      {
        id: 301,
        path: 'account',
        name: 'Account',
        component: RoutesAlias.Account,
        meta: {
          title: '账号管理',
          title_en: 'Account manguage',
          keepAlive: true
        }
      },
      {
        id: 302,
        path: 'department',
        name: 'Department',
        component: RoutesAlias.Department,
        meta: {
          title: '部门管理',
          title_en: 'Department manguage',
          keepAlive: false
        }
      },
      {
        id: 303,
        path: 'role',
        name: 'Role',
        component: RoutesAlias.Role,
        meta: {
          title: '角色权限',
          title_en: 'Roles',
          keepAlive: true
        }
      },
      {
        id: 304,
        path: 'user',
        name: 'UserCenter',
        component: RoutesAlias.UserCenter,
        meta: {
          title: '个人中心',
          title_en: 'User center',
          isHide: true,
          keepAlive: true,
          isHideTab: true
        }
      }
    ]
  },
  {
    id: 3,
    path: '/menu',
    name: 'Menu',
    component: RoutesAlias.Home,
    meta: {
      title: '菜单管理',
      title_en: 'Menu manguage',
      icon: '&#xe8a4;',
      keepAlive: false
    },
    children: [
      {
        id: 401,
        path: 'menu',
        name: 'Menus',
        component: RoutesAlias.Menu,
        meta: {
          title: '菜单权限',
          title_en: 'Menu permissions',
          icon: '&#xe8a4;',
          keepAlive: true,
          authList: [
            {
              id: 4011,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 4012,
              title: '编辑',
              auth_mark: 'edit'
            },
            {
              id: 4013,
              title: '删除',
              auth_mark: 'delete'
            }
          ]
        }
      },
      {
        id: 411,
        path: 'permission',
        name: 'Permission',
        component: RoutesAlias.Permission,
        meta: {
          title: '权限控制',
          title_en: 'Permission control',
          icon: '&#xe831;',
          showTextBadge: 'new',
          keepAlive: true,
          authList: [
            {
              id: 4111,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 4112,
              title: '编辑',
              auth_mark: 'edit'
            },
            {
              id: 4113,
              title: '删除',
              auth_mark: 'delete'
            }
          ]
        }
      },
      {
        id: 402,
        path: 'nested',
        name: 'Nested',
        component: '',
        meta: {
          title: '嵌套菜单',
          title_en: 'Nested menu',
          icon: '&#xe676;',
          keepAlive: true
        },
        children: [
          {
            id: 40201,
            path: 'menu1',
            name: 'NestedMenu1',
            component: RoutesAlias.NestedMenu1,
            meta: {
              title: '菜单1',
              title_en: 'menu1',
              icon: '&#xe676;',
              keepAlive: true
            }
          },
          {
            id: 40202,
            path: 'menu2',
            name: 'NestedMenu2',
            component: '',
            meta: {
              title: '菜单2',
              title_en: 'menu2',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                id: 4020201,
                path: 'menu2-1',
                name: 'NestedMenu2-1',
                component: RoutesAlias.NestedMenu21,
                meta: {
                  title: '菜单2-1',
                  title_en: 'menu2-1',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              }
            ]
          },
          {
            id: 40203,
            path: 'menu3',
            name: 'NestedMenu3',
            component: '',
            meta: {
              title: '菜单3',
              title_en: 'menu3',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                id: 4020301,
                path: 'menu3-1',
                name: 'NestedMenu3-1',
                component: RoutesAlias.NestedMenu31,
                meta: {
                  title: '菜单3-1',
                  title_en: 'menu3-1',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              },
              {
                id: 4020302,
                path: 'menu3-2',
                name: 'NestedMenu3-2',
                component: '',
                meta: {
                  title: '菜单3-2',
                  title_en: 'menu3-2',
                  icon: '&#xe676;',
                  keepAlive: true
                },
                children: [
                  {
                    id: 402030201,
                    path: 'menu3-2-1',
                    name: 'NestedMenu3-2-1',
                    component: RoutesAlias.NestedMenu321,
                    meta: {
                      title: '菜单3-2-1',
                      title_en: 'menu3-2-1',
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
    id: 18,
    path: '/result',
    name: 'Result',
    component: RoutesAlias.Home,
    meta: {
      title: '结果页面',
      title_en: 'Result page',
      icon: '&#xe715;',
      keepAlive: false
    },
    children: [
      {
        id: 401,
        path: 'success',
        name: 'Success',
        component: RoutesAlias.Success,
        meta: {
          title: '成功页',
          title_en: 'Success page',
          keepAlive: true
        }
      },
      {
        id: 402,
        path: 'fail',
        name: 'Fail',
        component: RoutesAlias.Fail,
        meta: {
          title: '失败页',
          title_en: 'Fail page',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 8,
    path: '/exception',
    name: 'Exception',
    component: RoutesAlias.Home,
    meta: {
      title: '异常页面',
      title_en: 'Exception',
      icon: '&#xe820;',
      keepAlive: false
    },
    children: [
      {
        id: 801,
        path: '403',
        name: '403',
        component: RoutesAlias.Exception403,
        meta: {
          title: '403',
          title_en: '403',
          keepAlive: true
        }
      },
      {
        id: 802,
        path: '404',
        name: '404',
        component: RoutesAlias.Exception404,
        meta: {
          title: '404',
          title_en: '404',
          keepAlive: true
        }
      },
      {
        id: 803,
        path: '500',
        name: '500',
        component: RoutesAlias.Exception500,
        meta: {
          title: '500',
          title_en: '500',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 9,
    path: '/system',
    name: 'System',
    component: RoutesAlias.Home,
    meta: {
      title: '系统设置',
      title_en: 'System setting',
      icon: '&#xe7b9;',
      keepAlive: false
    },
    children: [
      {
        id: 901,
        path: 'setting',
        name: 'Setting',
        component: RoutesAlias.Setting,
        meta: {
          title: '系统设置',
          title_en: 'System setting',
          keepAlive: true
        }
      },
      {
        id: 902,
        path: 'api',
        name: 'Api',
        component: RoutesAlias.Api,
        meta: {
          title: 'API管理',
          title_en: 'API manguage',
          keepAlive: true
        }
      },
      {
        id: 903,
        path: 'log',
        name: 'Log',
        component: RoutesAlias.Log,
        meta: {
          title: '系统日志',
          title_en: 'System log',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 10,
    path: '/safeguard',
    name: 'Safeguard',
    component: RoutesAlias.Home,
    meta: {
      title: '运维管理',
      title_en: 'Safeguard',
      icon: '&#xe816;',
      keepAlive: false
    },
    children: [
      {
        id: 1010,
        path: 'server',
        name: 'Server',
        component: RoutesAlias.Server,
        meta: {
          title: '服务器管理',
          title_en: 'Server manguage',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 11,
    path: '/plan',
    name: 'Plan',
    component: RoutesAlias.Home,
    meta: {
      title: '版本计划',
      title_en: 'Version Plan',
      icon: '&#xe712;',
      keepAlive: false
    },
    children: [
      {
        id: 1110,
        path: 'log',
        name: 'PlanLog',
        component: RoutesAlias.PlanLog,
        meta: {
          title: '更新日志',
          title_en: 'Update Plan',
          showTextBadge: `${upgradeLogList.value[0].version}`,
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 12,
    name: '',
    path: '',
    component: RoutesAlias.Home,
    meta: {
      title: '帮助中心',
      title_en: 'Help center',
      icon: '&#xe719;',
      keepAlive: false
    },
    children: [
      {
        id: 1101,
        path: '',
        name: 'Document',
        meta: {
          title: '官方文档',
          title_en: 'Document',
          link: 'https://www.lingchen.kim/art-design-pro/docs/',
          isIframe: false,
          keepAlive: false
        }
      }
    ]
  }
]
