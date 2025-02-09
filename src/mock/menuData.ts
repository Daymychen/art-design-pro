import { MenuListType } from '@/types/menu'
import { upgradeLogList } from './upgradeLog'

export const menuData: MenuListType[] = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    meta: {
      title: '仪表盘',
      title_en: 'Dashboard',
      icon: '&#xe721;'
    },
    children: [
      {
        id: 101,
        path: '/dashboard/console',
        meta: {
          title: '工作台',
          title_en: 'Workbench',
          keepAlive: true
        }
      },
      {
        id: 102,
        path: '/dashboard/analysis',
        meta: {
          title: '分析页',
          title_en: 'Analysis',
          showTextBadge: 'Hot',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 5,
    path: '/widgets',
    name: 'Widgets',
    meta: {
      title: '组件中心',
      title_en: 'Components',
      icon: '&#xe81a;'
    },
    children: [
      {
        id: 503,
        path: '/widgets/icon-list',
        meta: {
          title: 'Icon 图标',
          title_en: 'Icon',
          keepAlive: true
        }
      },
      {
        id: 504,
        path: '/widgets/icon-selector',
        meta: {
          title: '图标选择器',
          title_en: 'Icon selector',
          keepAlive: true
        }
      },
      {
        id: 505,
        path: '/widgets/image-crop',
        meta: {
          title: '图像裁剪',
          title_en: 'Image crop',
          keepAlive: true
        }
      },
      {
        id: 506,
        path: '/widgets/excel',
        meta: {
          title: 'Excel 导入导出',
          title_en: 'Excel import and export',
          keepAlive: true
        }
      },
      {
        id: 507,
        path: '/widgets/video',
        meta: {
          title: '视频播放器',
          title_en: 'Video',
          keepAlive: true
        }
      },
      {
        id: 508,
        path: '/widgets/count-to',
        meta: {
          title: '数字滚动',
          title_en: 'Count to',
          keepAlive: false
        }
      },
      {
        id: 509,
        path: '/widgets/wang-editor',
        meta: {
          title: '富文本编辑器',
          title_en: 'Rich text editor',
          keepAlive: true
        }
      },
      {
        id: 510,
        path: '/widgets/watermark',
        meta: {
          title: '水印',
          title_en: 'Watermark',
          keepAlive: true
        }
      },
      {
        id: 511,
        path: '/widgets/context-menu',
        meta: {
          title: '右键菜单',
          title_en: 'Context menu',
          keepAlive: true
        }
      },
      {
        id: 512,
        path: '/widgets/qrcode',
        meta: {
          title: '二维码',
          title_en: 'QR code',
          keepAlive: true
        }
      },
      {
        id: 513,
        path: '/widgets/drag',
        meta: {
          title: '拖拽',
          title_en: 'Drag',
          keepAlive: true
        }
      },
      {
        id: 514,
        path: '/widgets/text-scroll',
        meta: {
          title: '文字滚动',
          title_en: 'Text scroll',
          keepAlive: true
        }
      },
      {
        id: 515,
        path: '/widgets/fireworks',
        meta: {
          title: '礼花',
          title_en: 'Fireworks',
          keepAlive: true,
          showTextBadge: 'New'
        }
      },
      {
        id: 516,
        path: '',
        meta: {
          title: '组件总览',
          title_en: 'Element UI',
          keepAlive: false,
          link: 'https://element-plus.org/zh-CN/component/overview.html',
          isIframe: true
        }
      }
    ]
  },
  {
    id: 126,
    path: '/template',
    name: 'Template',
    meta: {
      title: '模板中心',
      title_en: 'Template',
      icon: '&#xe860;'
    },
    children: [
      {
        id: 12601,
        path: '/template/chat',
        meta: {
          title: '聊天',
          title_en: 'Chat',
          keepAlive: true,
          showTextBadge: 'New'
        }
      },
      {
        id: 12602,
        path: '/template/cards',
        meta: {
          title: '卡片',
          title_en: 'Cards',
          keepAlive: false,
          showTextBadge: 'New'
        }
      },
      {
        id: 12603,
        path: '/template/banners',
        meta: {
          title: '横幅',
          title_en: 'Banners',
          keepAlive: false,
          showTextBadge: 'New'
        }
      },
      {
        id: 12604,
        path: '/template/charts',
        meta: {
          title: '图表',
          title_en: 'Charts',
          keepAlive: false,
          showTextBadge: 'New'
        }
      },
      {
        id: 12605,
        path: '/template/calendar',
        meta: {
          title: '日历',
          title_en: 'Calendar',
          keepAlive: true,
          showTextBadge: 'New'
        }
      },

      {
        id: 12622,
        path: '/template/pricing',
        meta: {
          title: '定价',
          title_en: 'Pricing',
          keepAlive: true,
          showTextBadge: 'New'
        }
      }
    ]
  },
  {
    id: 4,
    path: '/article',
    name: 'Article',
    meta: {
      title: '文章管理',
      title_en: 'Article manguage',
      icon: '&#xe7ae;'
    },
    children: [
      {
        id: 202,
        path: '/article/article-list',
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
        path: '/article/detail',
        meta: {
          title: '文章详情',
          title_en: 'Article category',
          isHide: true,
          keepAlive: true
        }
      },
      {
        id: 205,
        path: '/article/comment',
        meta: {
          title: '留言管理',
          title_en: 'Comment',
          keepAlive: true
        }
      },
      {
        id: 201,
        path: '/article/article-publish',
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
    meta: {
      title: '用户管理',
      title_en: 'User manguage',
      icon: '&#xe86e;'
    },
    children: [
      {
        id: 301,
        path: '/user/account',
        meta: {
          title: '账号管理',
          title_en: 'Account manguage',
          keepAlive: true
        }
      },
      {
        id: 302,
        path: '/user/department',
        meta: {
          title: '部门管理',
          title_en: 'Department manguage',
          keepAlive: true
        }
      },
      {
        id: 303,
        path: '/user/role',
        meta: {
          title: '角色权限',
          title_en: 'Roles',
          keepAlive: true
        }
      },
      {
        id: 304,
        path: '/user/user',
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
    meta: {
      title: '菜单管理',
      title_en: 'Menu manguage',
      icon: '&#xe8a4;'
    },
    children: [
      {
        id: 401,
        path: '/menu/menu',
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
        path: '/menu/permission',
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
        path: '/menu/nested',
        meta: {
          title: '嵌套菜单',
          title_en: 'Nested menu',
          icon: '&#xe676;',
          keepAlive: true,
          authList: [
            {
              id: 4021,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 4022,
              title: '编辑',
              auth_mark: 'edit'
            },
            {
              id: 4023,
              title: '删除',
              auth_mark: 'delete'
            }
          ]
        },
        children: [
          {
            id: 40201,
            path: '/menu/nested/menu1',
            meta: {
              title: '菜单1',
              title_en: 'menu1',
              icon: '&#xe676;',
              keepAlive: true
            }
          },
          {
            id: 40202,
            path: '/menu/nested/menu2',
            meta: {
              title: '菜单2',
              title_en: 'menu2',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                id: 4020201,
                path: '/menu/nested/menu2/menu2-1',
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
            path: '/menu/nested/menu3',
            meta: {
              title: '菜单3',
              title_en: 'menu3',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                id: 4020301,
                path: '/menu/nested/menu3/menu3-1',
                meta: {
                  title: '菜单3-1',
                  title_en: 'menu3-1',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              },
              {
                id: 4020302,
                path: '/menu/nested/menu3/menu3-2',
                meta: {
                  title: '菜单3-2',
                  title_en: 'menu3-2',
                  icon: '&#xe676;',
                  keepAlive: true
                },
                children: [
                  {
                    id: 402030201,
                    path: '/menu/nested/menu3/menu3-2/menu3-2-1',
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
    meta: {
      title: '结果页面',
      title_en: 'Result page',
      icon: '&#xe715;'
    },
    children: [
      {
        id: 401,
        path: '/result/success',
        meta: {
          title: '成功页',
          title_en: 'Success page',
          keepAlive: true
        }
      },
      {
        id: 402,
        path: '/result/fail',
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
    meta: {
      title: '异常页面',
      title_en: 'Exception',
      icon: '&#xe820;'
    },
    children: [
      {
        id: 801,
        path: '/exception/403',
        meta: {
          title: '403',
          title_en: '403',
          keepAlive: true
        }
      },
      {
        id: 802,
        path: '/exception/404',
        meta: {
          title: '404',
          title_en: '404',
          keepAlive: true
        }
      },
      {
        id: 803,
        path: '/exception/500',
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
    meta: {
      title: '系统设置',
      title_en: 'System setting',
      icon: '&#xe7b9;'
    },
    children: [
      {
        id: 901,
        path: '/system/setting',
        meta: {
          title: '系统设置',
          title_en: 'System setting',
          keepAlive: true
        }
      },
      {
        id: 902,
        path: '/system/api',
        meta: {
          title: 'API管理',
          title_en: 'API manguage',
          keepAlive: true
        }
      },
      {
        id: 903,
        path: '/system/log',
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
    meta: {
      title: '运维管理',
      title_en: 'Safeguard',
      icon: '&#xe816;'
    },
    children: [
      {
        id: 1010,
        path: '/safeguard/server',
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
    meta: {
      title: '版本计划',
      title_en: 'Version Plan',
      icon: '&#xe712;'
    },
    children: [
      {
        id: 1110,
        path: '/plan/log',
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
    name: '0',
    path: '',
    meta: {
      title: '帮助中心',
      title_en: 'Help center',
      icon: '&#xe719;'
    },
    children: [
      {
        id: 1101,
        path: '',
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
