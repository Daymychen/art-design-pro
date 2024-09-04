import type { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useWorktabStore } from '@/store/modules/worktab'
import Home from '@views/index/index.vue'
import { SystemInfo } from '@/config/setting'
import { useUserStore } from '@/store/modules/user'
import { addRouteList } from '@/api/menuApi'

// 路由项扩展
export type AppRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean
}

// 首页
export const HOME_PAGE = '/dashboard/console'

// 不需要权限的路由
const routes = [
  {
    path: '/',
    redirect: HOME_PAGE
  },
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: '监控中心',
      title_en: 'Dashboard'
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: () => import(`@views/dashboard/Console/index.vue`),
        meta: {
          title: '工作台',
          title_en: 'Workbench',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@views/login/index.vue'),
    meta: {
      title: '登录',
      notTab: true
    }
  },
  {
    path: '/exception',
    component: Home,
    meta: {
      title: '异常页面',
      title_en: 'Exception',
      keepAlive: true
    },
    children: [
      {
        path: '403',
        component: () => import('@/views/exception/403.vue'),
        meta: {
          title: '403',
          title_en: '403',
          keepAlive: true
        }
      },
      {
        path: '404',
        component: () => import('@views/exception/404.vue'),
        meta: {
          title: '404',
          title_en: '404',
          keepAlive: true
        }
      },
      {
        path: '500',
        component: () => import('@views/exception/500.vue'),
        meta: {
          title: '500',
          title_en: '500',
          keepAlive: true
        }
      }
    ]
  }
] as AppRouteRecordRaw[]

export const router = createRouter({
  history: createWebHashHistory(), // history 模式
  routes: routes, // 路由表
  scrollBehavior: () => ({ left: 0, top: 0 }) // 页面滚动行为
})

// 需要权限的路由
export const roleRoutes: AppRouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    component: Home,
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: '/user/user',
        name: 'Users',
        component: () => import('@views/user/User.vue'),
        meta: {
          title: '个人中心'
        }
      },
      {
        path: '/user/account',
        name: 'Account',
        component: () => import('@views/user/Account.vue'),
        meta: {
          title: '账号管理',
          keepAlive: true
        }
      },
      {
        path: '/user/department',
        name: 'Department',
        component: () => import('@views/user/Department.vue'),
        meta: {
          title: '部门管理',
          keepAlive: true
        }
      },
      {
        path: '/user/role',
        name: 'Role',
        component: () => import('@views/user/Role.vue'),
        meta: {
          title: '角色权限',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Home,
    meta: {
      title: '菜单管理'
    },
    children: [
      {
        path: '/menu/menu',
        name: 'Menus',
        component: () => import('@views/menu/Menu.vue'),
        meta: {
          title: '菜单管理'
        }
      }
    ]
  },
  {
    path: '/result',
    name: 'Result',
    component: Home,
    meta: {
      title: '结果页面'
    },
    children: [
      {
        path: '/result/success',
        name: 'Success',
        component: () => import('@views/result/Success.vue'),
        meta: {
          title: '成功页'
        }
      },
      {
        path: '/result/fail',
        name: 'Fail',
        component: () => import('@views/result/Fail.vue'),
        meta: {
          title: '失败页'
        }
      }
    ]
  },
  {
    path: '/article',
    component: Home,
    name: 'Article',
    meta: {
      title: '文章管理'
    },
    children: [
      {
        path: '/article/article-publish',
        component: () => import('@views/article/ArticlePublish.vue'),
        meta: {
          title: '文章发布',
          keepAlive: false
        }
      },
      {
        path: '/article/article-list',
        component: () => import('@views/article/ArticleList.vue'),
        meta: {
          title: '文章列表',
          keepAlive: true
        }
      },
      {
        path: '/article/detail',
        component: () => import('@views/article/ArticleDetail.vue'),
        meta: {
          title: '文章详情',
          keepAlive: false,
          notTab: true
        }
      },
      {
        path: '/article/classify',
        component: () => import('@views/article/Classify.vue'),
        meta: {
          title: '文章分类',
          keepAlive: true
        }
      },
      {
        path: '/article/comment',
        component: () => import('@views/article/Comment.vue'),
        meta: {
          title: '留言',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/widgets',
    component: Home,
    name: 'Widgets',
    meta: {
      title: '组件库'
    },
    children: [
      {
        path: '/widgets/icon-list',
        component: () => import('@views/widgets/IconList.vue'),
        meta: {
          title: '图标库',
          keepAlive: true
        }
      },
      {
        path: '/widgets/icon-selector',
        component: () => import('@views/widgets/IconSelector.vue'),
        meta: {
          title: '图标选择器',
          keepAlive: true
        }
      },
      {
        path: '/widgets/notification',
        component: () => import('@views/widgets/Notification.vue'),
        meta: {
          title: '通知',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/message',
    component: Home,
    name: 'Message',
    meta: {
      title: '消息中心'
    },
    children: [
      {
        path: '/message/message',
        component: () => import('@views/message/Index.vue'),
        meta: {
          title: '系统消息',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Home,
    name: 'System',
    meta: {
      title: '系统设置'
    },
    children: [
      {
        path: '/system/setting',
        component: () => import('@views/system/Setting.vue'),
        meta: {
          title: '系统设置',
          keepAlive: true
        }
      },
      {
        path: '/system/api',
        name: 'Api',
        component: () => import('@views/system/Api.vue'),
        meta: {
          title: 'API管理'
        }
      },
      {
        path: '/system/log',
        component: () => import('@views/system/Log.vue'),
        meta: {
          title: '系统日志',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/safeguard',
    component: Home,
    name: 'Safeguard',
    meta: {
      title: '运维管理'
    },
    children: [
      {
        path: '/safeguard/server',
        component: () => import('@views/safeguard/Server.vue'),
        meta: {
          title: '服务器管理',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/plan',
    component: Home,
    name: 'Plan',
    meta: {
      title: '版本计划'
    },
    children: [
      {
        path: '/plan/index',
        component: () => import('@views/plan/index.vue'),
        meta: {
          title: '更新计划',
          keepAlive: true
        }
      }
    ]
  }
]

export const allRoutes = roleRoutes

// 定义标识，记录路由是否添加
let registerRoute = true

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const worktabStore = useWorktabStore()
  const { meta, path, params, query } = to
  const { title, title_en, notTab } = meta
  const isLogin = userStore.isLogin

  if (!isLogin && path !== '/login') {
    userStore.logOut()
    return
  }

  if (registerRoute) {
    addRouteList()
    next({ ...to, replace: true })
    registerRoute = false
    return
  }

  // 页面不存在时跳转到404
  if (to.matched.length === 0) {
    next('/exception/404')
    return
  }

  // 设置标签页和网页标题
  if (!notTab) {
    worktabStore.router({
      title: title as string,
      title_en: title_en as string,
      path,
      params,
      query
    })
  }

  if (title) {
    document.title = `${title} - ${SystemInfo.name}`
  }

  next()
})

export function initRouter(app: App<Element>) {
  app.use(router)
}
