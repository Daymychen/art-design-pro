/**
 * 菜单icon使用了系统图标库里面的图标，你可以换成自定义图标，但是请注意修改菜单的 class 类名 为 iconfont
 * 系统图标库位置 class=iconfont-sys：/src/assets/icons/system
 * 自定义图标库位置 class=iconfont：/src/assets/icons/icons
 */

import { MenuListType } from '@/types/menu'

export const menuData: MenuListType[] = [
  {
    id: 1,
    title: 'Dashboard',
    title_en: 'Dashboard',
    name: 'Dashboard',
    icon: '\ue721', //
    path: '/dashboard',
    children: [
      {
        id: 101,
        title: '工作台',
        title_en: 'Workbench',
        path: '/dashboard/console'
      },
      {
        id: 101,
        title: '分析页',
        title_en: 'Analysis',
        path: '/dashboard/analysis',
        showTextBadge: 'Hot'
      }
    ]
  },
  {
    id: 4,
    title: '文章管理',
    title_en: 'Article manguage',
    icon: '\ue7ae',
    path: '/article',
    name: 'Article',
    children: [
      {
        id: 201,
        title: '文章发布',
        title_en: 'Article publish',
        path: '/article/article-publish',
        authList: [
          {
            id: 2010,
            title: '发布',
            auth_mark: 'article/article-publish/add'
          }
        ]
      },
      {
        id: 202,
        title: '文章列表',
        title_en: 'Article list',
        path: '/article/article-list',
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
      },
      {
        id: 203,
        title: '文章分类',
        title_en: 'Article category',
        path: '/article/classify',
        authList: [
          {
            id: 2031,
            title: '新增',
            auth_mark: 'add'
          },
          {
            id: 2032,
            title: '编辑',
            auth_mark: 'edit'
          },
          {
            id: 2033,
            title: '删除',
            auth_mark: 'delete'
          }
        ]
      },
      {
        id: 204,
        title: '文章详情',
        title_en: 'Article category',
        path: '/article/detail',
        noMenu: true
      },
      {
        id: 205,
        title: '留言管理',
        title_en: 'Comment',
        path: '/article/comment'
      }
    ]
  },
  {
    id: 2,
    title: '用户管理',
    name: 'User',
    title_en: 'User manguage',
    icon: '\ue86e',
    path: '/user',
    children: [
      {
        id: 301,
        title: '个人中心',
        title_en: 'User center',
        path: '/user/user',
        noMenu: true
      },
      {
        id: 302,
        title: '账号管理',
        title_en: 'Account manguage',
        path: '/user/account'
      },
      {
        id: 303,
        title: '部门管理',
        title_en: 'Department manguage',
        path: '/user/department'
      },
      {
        id: 304,
        title: '角色权限',
        title_en: 'Roles',
        path: '/user/role'
      }
    ]
  },
  {
    id: 3,
    title: '菜单管理',
    title_en: 'Menu manguage',
    icon: '\ue8a4',
    path: '/menu',
    name: 'Menu',
    children: [
      {
        id: 401,
        title: '菜单权限',
        title_en: 'Menu permissions',
        path: '/menu/menu',
        icon: '\ue8a4',
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
      },
      {
        id: 411,
        title: '权限控制',
        title_en: 'Permission control',
        path: '/menu/permission',
        icon: '\ue831',
        showTextBadge: 'new',
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
      },
      {
        id: 402,
        title: '嵌套菜单',
        title_en: 'Nested menu',
        path: '/menu/nested',
        icon: '\ue676',
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
        ],
        children: [
          {
            id: 40201,
            title: '菜单1',
            title_en: 'menu1',
            path: '/menu/nested/menu1',
            icon: '\ue676'
          },
          {
            id: 40202,
            title: '菜单2',
            title_en: 'menu2',
            path: '/menu/nested/menu2',
            icon: '\ue676',
            children: [
              {
                id: 4020201,
                title: '菜单2-1',
                title_en: 'menu2-1',
                path: '/menu/nested/menu2/menu2-1',
                icon: '\ue676'
              }
            ]
          },
          {
            id: 40203,
            title: '菜单3',
            title_en: 'menu3',
            path: '/menu/nested/menu3',
            icon: '\ue676',
            children: [
              {
                id: 4020301,
                title: '菜单3-1',
                title_en: 'menu3-1',
                path: '/menu/nested/menu3/menu3-1',
                icon: '\ue676'
              },
              {
                id: 4020302,
                title: '菜单3-2',
                title_en: 'menu3-2',
                path: '/menu/nested/menu3/menu3-2',
                icon: '\ue676',
                children: [
                  {
                    id: 402030201,
                    title: '菜单3-2-1',
                    title_en: 'menu3-2-1',
                    path: '/menu/nested/menu3/menu3-2/menu3-2-1',
                    icon: '\ue676'
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
    title: '结果页面',
    title_en: 'Result page',
    icon: '\ue715',
    path: '/result',
    name: 'Result',
    children: [
      {
        id: 401,
        title: '成功页',
        title_en: 'Success page',
        path: '/result/success'
      },
      {
        id: 402,
        title: '失败页',
        title_en: 'Fail page',
        path: '/result/fail'
      }
    ]
  },

  {
    id: 5,
    title: '组件中心',
    title_en: 'Components',
    icon: '\ue81a',
    path: '/widgets',
    name: 'Widgets',
    children: [
      {
        id: 501,
        title: '组件总览',
        title_en: 'Element UI',
        path: 'https://element-plus.org/zh-CN/component/overview.html'
      },
      {
        id: 503,
        title: 'Icon 图标',
        title_en: 'Icon',
        path: '/widgets/icon-list'
      },
      {
        id: 504,
        title: '图标选择器',
        title_en: 'Icon selector',
        path: '/widgets/icon-selector'
      },
      {
        id: 505,
        title: '通知',
        title_en: 'Notification',
        path: '/widgets/notification'
      }
    ]
  },
  {
    id: 7,
    title: '消息中心',
    title_en: 'Message center',
    icon: '\ue6e9',
    path: '/message',
    name: 'Message',
    children: [
      {
        id: 701,
        title: '系统消息',
        title_en: 'System message',
        path: '/message/message'
      }
    ]
  },
  {
    id: 8,
    title: '异常页面',
    title_en: 'Exception',
    icon: '\ue820',
    path: '/exception',
    name: 'Exception',
    children: [
      {
        id: 801,
        title: '403',
        title_en: '403',
        path: '/exception/403'
      },
      {
        id: 802,
        title: '404',
        title_en: '404',
        path: '/exception/404'
      },
      {
        id: 803,
        title: '500',
        title_en: '500',
        path: '/exception/500'
      }
    ]
  },
  {
    id: 9,
    title: '系统设置',
    title_en: 'System setting',
    icon: '\ue7b9',
    path: '/system',
    name: 'System',
    children: [
      {
        id: 901,
        title: '系统设置',
        title_en: 'System setting',
        path: '/system/setting'
      },
      {
        id: 902,
        title: 'API管理',
        title_en: 'API manguage',
        path: '/system/api'
      },
      {
        id: 903,
        title: '系统日志',
        title_en: 'System log',
        path: '/system/log'
      }
    ]
  },
  {
    id: 10,
    title: '运维管理',
    title_en: 'Safeguard',
    icon: '\ue816',
    path: '/safeguard',
    name: 'Safeguard',
    children: [
      {
        id: 1010,
        title: '服务器管理',
        title_en: 'Server manguage',
        path: '/safeguard/server'
      }
    ]
  },
  {
    id: 11,
    title: '版本计划',
    title_en: 'Version Plan',
    icon: '\ue712',
    path: '/plan',
    name: 'Plan',
    children: [
      {
        id: 1110,
        title: '更新计划',
        title_en: 'Update Plan',
        path: '/plan/index'
      }
    ]
  },
  {
    id: 11,
    title: '帮助中心',
    title_en: 'Help center',
    name: '0',
    icon: '\ue719',
    path: '',
    children: [
      {
        id: 1101,
        title: '官方文档',
        title_en: 'Document',
        path: 'https://www.lingchen.kim/art-design-pro/docs/'
      }
    ]
  }
]
