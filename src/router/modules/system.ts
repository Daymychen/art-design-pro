import { AppRouteRecord } from '@/types/router'

export const systemRoutes: AppRouteRecord = {
  path: '/system',
  name: 'System',
  component: '/index/index',
  meta: {
    title: 'menus.system.title',
    icon: 'ri:user-3-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: '/system/user',
      meta: {
        title: 'menus.system.user',
        icon: 'ri:user-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'role',
      name: 'Role',
      component: '/system/role',
      meta: {
        title: 'menus.system.role',
        icon: 'ri:user-settings-line',
        keepAlive: true,
        roles: ['R_SUPER']
      }
    },
    {
      path: 'user-center',
      name: 'UserCenter',
      component: '/system/user-center',
      meta: {
        title: 'menus.system.userCenter',
        icon: 'ri:user-line',
        isHide: true,
        keepAlive: true,
        isHideTab: true
      }
    },
    {
      path: 'menu',
      name: 'Menus',
      component: '/system/menu',
      meta: {
        title: 'menus.system.menu',
        icon: 'ri:menu-line',
        keepAlive: true,
        roles: ['R_SUPER'],
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' },
          { title: '删除', authMark: 'delete' }
        ]
      }
    },
    {
      path: 'nested',
      name: 'Nested',
      component: '',
      meta: {
        title: 'menus.system.nested',
        icon: 'ri:menu-unfold-3-line',
        keepAlive: true
      },
      children: [
        {
          path: 'menu1',
          name: 'NestedMenu1',
          component: '/system/nested/menu1',
          meta: {
            title: 'menus.system.menu1',
            icon: 'ri:align-justify',
            keepAlive: true
          }
        },
        {
          path: 'menu2',
          name: 'NestedMenu2',
          component: '',
          meta: {
            title: 'menus.system.menu2',
            icon: 'ri:align-justify',
            keepAlive: true
          },
          children: [
            {
              path: 'menu2-1',
              name: 'NestedMenu2-1',
              component: '/system/nested/menu2',
              meta: {
                title: 'menus.system.menu21',
                icon: 'ri:align-justify',
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
            icon: 'ri:align-justify',
            keepAlive: true
          },
          children: [
            {
              path: 'menu3-1',
              name: 'NestedMenu3-1',
              component: '/system/nested/menu3',
              meta: {
                title: 'menus.system.menu31',
                keepAlive: true
              }
            },
            {
              path: 'menu3-2',
              name: 'NestedMenu3-2',
              component: '',
              meta: {
                title: 'menus.system.menu32',
                keepAlive: true
              },
              children: [
                {
                  path: 'menu3-2-1',
                  name: 'NestedMenu3-2-1',
                  component: '/system/nested/menu3/menu3-2',
                  meta: {
                    title: 'menus.system.menu321',
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
}
