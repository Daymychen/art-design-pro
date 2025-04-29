// import request from '@/utils/http'
// import { BaseResult } from '@/types/axios'
import AppConfig from '@/config'
import { BaseResult } from '@/types/axios'
import { UserInfo } from '@/types/store'
import avatar from '@imgs/user/avatar.png'
import api from '@/utils/http'
import { adaptLoginResponse, adaptUserInfoResponse } from './adapter/authAdapter'
import { AuthApi } from './config/apiConfig'

// 定义API响应类型
interface ApiResponse {
  code?: number
  message?: string
  data?: any
}

export class UserService {
  // 用户登录接口
  static async login(options: { body: string }): Promise<BaseResult> {
    const bodyData = JSON.parse(options.body)

    // 开发环境使用模拟数据
    if (import.meta.env.MODE === 'development' && AppConfig.useMock) {
      return new Promise((resolve) => {
        const { username, password } = bodyData

        if (
          username === AppConfig.systemInfo.login.username &&
          password === AppConfig.systemInfo.login.password
        ) {
          resolve({
            code: 200,
            message: '登录成功',
            data: {
              accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gU25vdyIsImlhdCI6MTcwNjg2NTYwMCwiZXhwIjoxNzA2OTUyMDAwfQ.8f9D4kJ2m3XlH5Q0y6Z1r2Y3n4X5pL6q8K9v2W3n4X5'
            }
          })
        } else {
          resolve({
            code: 401,
            message: '用户名或密码错误',
            data: null
          })
        }
      })
    }

    // 生产环境调用真实接口
    try {
      const response = await api.post<ApiResponse>({
        url: AuthApi.LOGIN,
        data: {
          username: bodyData.username,
          password: bodyData.password
        }
      })

      // 使用适配器处理响应
      return adaptLoginResponse(response)
    } catch (error) {
      console.error('登录请求失败', error)
      return {
        code: 500,
        message: '登录请求失败，请检查网络连接',
        data: null
      }
    }
  }

  // 获取用户信息
  static async getUserInfo(): Promise<BaseResult<UserInfo>> {
    // 开发环境使用模拟数据
    if (import.meta.env.MODE === 'development' && AppConfig.useMock) {
      return new Promise((resolve) => {
        resolve({
          code: 200,
          message: '获取用户信息成功',
          data: {
            id: 1,
            name: '张三',
            username: 'John Snow',
            avatar: avatar,
            email: 'art.design@gmail.com'
          }
        })
      })
    }

    // 生产环境调用真实接口
    try {
      const response = await api.get<ApiResponse>({
        url: AuthApi.USER_INFO
      })

      // 使用适配器处理响应
      return adaptUserInfoResponse(response)
    } catch (error) {
      console.error('获取用户信息失败', error)
      return {
        code: 500,
        message: '获取用户信息失败，请检查网络连接',
        data: null as any
      }
    }
  }

  // 退出登录
  static async logout(): Promise<BaseResult<void>> {
    // 开发环境使用模拟数据
    if (import.meta.env.MODE === 'development' && AppConfig.useMock) {
      return new Promise((resolve) => {
        resolve({
          code: 200,
          message: '退出登录成功',
          data: undefined
        })
      })
    }

    // 生产环境调用真实接口
    try {
      const response = await api.post<ApiResponse>({
        url: AuthApi.LOGOUT
      })

      return {
        code: response.code || 200,
        message: response.message || '退出登录成功',
        data: undefined
      }
    } catch (error) {
      console.error('退出登录失败', error)
      return {
        code: 500,
        message: '退出登录失败，请检查网络连接',
        data: undefined
      }
    }
  }

  // 检查用户名是否存在
  static async checkUsernameExists(username: string): Promise<BaseResult<boolean>> {
    // 开发环境使用模拟数据
    if (import.meta.env.MODE === 'development' && AppConfig.useMock) {
      return new Promise((resolve) => {
        resolve({
          code: 200,
          message: '检查用户名成功',
          data: false
        })
      })
    }

    // 生产环境调用真实接口
    try {
      const response = await api.get<ApiResponse>({
        url: AuthApi.CHECK_USERNAME,
        params: { username }
      })

      return {
        code: response.code || 200,
        message: response.message || '检查用户名成功',
        data: !!response.data
      }
    } catch (error) {
      console.error('检查用户名失败', error)
      return {
        code: 500,
        message: '检查用户名失败，请检查网络连接',
        data: false
      }
    }
  }

  // 检查手机号是否存在
  static async checkMobileExists(mobile: string): Promise<BaseResult<boolean>> {
    // 开发环境使用模拟数据
    if (import.meta.env.MODE === 'development' && AppConfig.useMock) {
      return new Promise((resolve) => {
        resolve({
          code: 200,
          message: '检查手机号成功',
          data: false
        })
      })
    }

    // 生产环境调用真实接口
    try {
      const response = await api.get<ApiResponse>({
        url: AuthApi.CHECK_MOBILE,
        params: { mobile }
      })

      return {
        code: response.code || 200,
        message: response.message || '检查手机号成功',
        data: !!response.data
      }
    } catch (error) {
      console.error('检查手机号失败', error)
      return {
        code: 500,
        message: '检查手机号失败，请检查网络连接',
        data: false
      }
    }
  }
}
