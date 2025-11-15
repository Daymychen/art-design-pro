import { AppRouteRecord } from '@/types/router'

export const resultRoutes: AppRouteRecord = {
  path: '/result',
  name: 'Result',
  component: '/index/index',
  meta: {
    title: 'menus.result.title',
    icon: 'ri:checkbox-circle-line'
  },
  children: [
    {
      path: 'success',
      name: 'ResultSuccess',
      component: '/result/success',
      meta: {
        title: 'menus.result.success',
        icon: 'ri:checkbox-circle-line',
        keepAlive: true
      }
    },
    {
      path: 'fail',
      name: 'ResultFail',
      component: '/result/fail',
      meta: {
        title: 'menus.result.fail',
        icon: 'ri:close-circle-line',
        keepAlive: true
      }
    }
  ]
}
