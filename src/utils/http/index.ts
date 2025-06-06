import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import EmojiText from '../ui/emojo'
import { ApiStatus } from './status'
import type { RequestOptions, ErrorMessageMode } from '@/types/api'

const axiosInstance = axios.create({
  timeout: 15000, // 请求超时时间(毫秒)
  baseURL: import.meta.env.VITE_API_URL, // API地址
  withCredentials: true, // 异步请求携带cookie
  transformRequest: [(data) => JSON.stringify(data)], // 请求数据转换为 JSON 字符串
  validateStatus: (status) => status >= 200 && status < 300, // 只接受 2xx 的状态码
  headers: {
    get: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    post: { 'Content-Type': 'application/json;charset=utf-8' }
  },
  transformResponse: [
    (data, headers) => {
      const contentType = headers['content-type']
      if (contentType && contentType.includes('application/json')) {
        try {
          return JSON.parse(data)
        } catch {
          return data
        }
      }
      return data
    }
  ]
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const { accessToken } = useUserStore()

    // 如果 token 存在，则设置请求头
    if (accessToken) {
      request.headers.set({
        'Content-Type': 'application/json',
        Authorization: accessToken
      })
    }

    return request // 返回修改后的配置
  },
  (error) => {
    ElMessage.error(`服务器异常！ ${EmojiText[500]}`) // 显示错误消息
    return Promise.reject(error) // 返回拒绝的 Promise
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 401
    if (response.data.code === ApiStatus.unauthorized) {
      logOut()
      return Promise.reject(response)
    }
    return response
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('repeated request: ' + error.message)
    }
    // 注意：错误处理现在在request函数中根据requestOptions处理
    return Promise.reject(error)
  }
)

// 扩展的请求配置接口
interface ExtendedRequestConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions
}

// 处理请求配置
function processRequestConfig(config: ExtendedRequestConfig): AxiosRequestConfig {
  const { requestOptions, ...axiosConfig } = config

  // 应用自定义请求选项
  if (requestOptions) {
    // 处理是否携带token
    if (requestOptions.withToken === false) {
      axiosConfig.headers = { ...axiosConfig.headers }
      delete axiosConfig.headers?.Authorization
    }

    // 处理是否添加时间戳
    if (requestOptions.joinTime) {
      const timestamp = Date.now()
      if (axiosConfig.method?.toUpperCase() === 'GET') {
        axiosConfig.params = { ...axiosConfig.params, _t: timestamp }
      }
    }

    // 处理API URL
    if (requestOptions.apiUrl) {
      axiosConfig.baseURL = requestOptions.apiUrl
    }
  }

  return axiosConfig
}

// 处理错误消息
function handleErrorMessage(error: any, mode: ErrorMessageMode = 'message') {
  if (mode === 'none') return

  const errorMessage = error.response?.data.msg
  const message = errorMessage
    ? `${errorMessage} ${EmojiText[500]}`
    : `请求超时或服务器异常！${EmojiText[500]}`

  if (mode === 'modal') {
    // TODO: 可以使用 ElMessageBox 显示模态框
    ElMessage.error(message)
  } else {
    ElMessage.error(message)
  }
}

// 请求
async function request<T = any>(config: ExtendedRequestConfig): Promise<T> {
  const processedConfig = processRequestConfig(config)

  // 对 POST | PUT 请求特殊处理
  if (
    processedConfig.method?.toUpperCase() === 'POST' ||
    processedConfig.method?.toUpperCase() === 'PUT'
  ) {
    // 如果已经有 data，则保留原有的 data
    if (processedConfig.params && !processedConfig.data) {
      processedConfig.data = processedConfig.params
      processedConfig.params = undefined // 使用 undefined 而不是空对象
    }
  }

  try {
    const res = await axiosInstance.request<T>(processedConfig)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      // 处理错误消息
      const errorMode = config.requestOptions?.errorMessageMode || 'message'
      handleErrorMessage(e, errorMode)
    }
    return Promise.reject(e)
  }
}

// API 方法集合
const api = {
  get<T>(config: ExtendedRequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' }) // GET 请求
  },
  post<T>(config: ExtendedRequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' }) // POST 请求
  },
  put<T>(config: ExtendedRequestConfig): Promise<T> {
    return request({ ...config, method: 'PUT' }) // PUT 请求
  },
  del<T>(config: ExtendedRequestConfig): Promise<T> {
    return request({ ...config, method: 'DELETE' }) // DELETE 请求
  },
  request<T>(config: ExtendedRequestConfig): Promise<T> {
    return request({ ...config }) // 通用请求
  }
}

// 退出登录
const logOut = () => {
  ElMessage.error(`登录已过期，请重新登录 ${EmojiText[500]}`)
  setTimeout(() => {
    useUserStore().logOut()
  }, 1000)
}

export default api
