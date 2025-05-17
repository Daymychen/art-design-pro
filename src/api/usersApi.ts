import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

interface LoginParams {
  userName: string
  password: string
}

export class UserService {
  // 登录
  static login(params: LoginParams) {
    return request.post<BaseResult>({
      url: '/auth/login',
      params
    })
  }

  // 获取用户信息
  static getUserInfo() {
    return request.get<BaseResult>({
      url: '/auth/getUserInfo'
    })
  }
}
