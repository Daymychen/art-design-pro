import request from '@/utils/http'
import { BaseResponse } from '@/types/api'

interface LoginParams {
  userName: string
  password: string
}

interface UserListParams {
  current?: number
  size?: number
}

export class UserService {
  // 登录
  static login(params: LoginParams) {
    return request.post<BaseResponse>({
      url: '/api/auth/login',
      params
    })
  }

  // 获取用户信息
  static getUserInfo() {
    return request.get<BaseResponse>({
      url: '/api/user/info'
    })
  }

  // 获取用户列表
  static getUserList(params?: UserListParams) {
    return request.get<BaseResponse>({
      url: '/api/user/list',
      params
    })
  }
}
