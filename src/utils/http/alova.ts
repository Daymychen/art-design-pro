import { createAlova } from 'alova'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import VueHook from 'alova/vue'

import { axiosInstance } from './index'

/**
 * @example
 * import alovaRequest from '@/utils/http/alova'
 * import { useRequest } from 'alova/client'
 * import { usePagination } from 'alova/client'
 *
 * // 普通接口
 * const logout = alovaRequest.Get('/api/auth/logout')
 * const { data, loading, send } = useRequest(logout, {})
 *
 * // 分页接口
 * const getUsers = alovaRequest.Get('/api/users')
 * const {page, pageSize, loading, isLastPage, send, reload} = usePagination((page, pageSize) => getUsers, {
 *  // 设置默认数据，避免初始化页面时渲染错误，减少条件判断逻辑
 *  initialData: {
 *    list: [],
 *    total: 0
 *  },
 *  // 自定义接口中数据列表字段
 *  data: (res) => res.list,
 *  // 自定义接口中数据总数字段
 *  total: (res) => res.total
 * })
 *
 * 更多示例和用法查阅 https://alova.js.org/
 */
const alovaRequest = createAlova({
  requestAdapter: axiosRequestAdapter({
    axios: axiosInstance
  }),
  statesHook: VueHook,
  // 设置为null即可全局关闭全部请求缓存
  cacheFor: null
})

export default alovaRequest
