import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import EmojiText from '../emojo'

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
  (response: AxiosResponse) => response,
  (error) => {
    if (axios.isCancel(error)) {
      console.log('repeated request: ' + error.message)
    } else {
      const errorMessage = error.response?.data.message
      ElMessage.error(
        errorMessage
          ? `${errorMessage} ${EmojiText[500]}`
          : `请求超时或服务器异常！${EmojiText[500]}`
      )
    }
    return Promise.reject(error)
  }
)

// 请求
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // 对 POST | PUT 请求特殊处理
  if (config.method?.toUpperCase() === 'POST' || config.method?.toUpperCase() === 'PUT') {
    // 如果已经有 data，则保留原有的 data
    if (config.params && !config.data) {
      config.data = config.params
      config.params = undefined // 使用 undefined 而不是空对象
    }
  }

  try {
    const res = await axiosInstance.request<T>({ ...config })
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      // 可以在这里处理 Axios 错误
    }
    return Promise.reject(e)
  }
}

// API 方法集合
const api = {
  get<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' }) // GET 请求
  },
  post<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' }) // POST 请求
  },
  put<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'PUT' }) // PUT 请求
  },
  del<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'DELETE' }) // DELETE 请求
  }
}

export default api
