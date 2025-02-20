// import request from '@/utils/http'
// import { BaseResult } from '@/types/axios'
// import { LoginParams } from './model/loginModel'
import { SystemInfo } from '@/config/setting'

export class UserService {
  // 登录
  // static login(params: LoginParams) {
  //   return request.post<BaseResult>({
  //     url: '/api/users/login',
  //     params
  //   })
  // }

  // 模拟登录接口
  static mockLogin(options: { body: string }) {
    const { username, password } = JSON.parse(options.body)

    if (username === SystemInfo.login.username && password === SystemInfo.login.password) {
      return {
        code: 200,
        message: '登录成功',
        data: {
          id: 1,
          name: '张三',
          username: 'John Snow',
          avatar: '',
          token: 'eaf1234567890',
          email: 'art.design@gmail.com'
        }
      }
    } else {
      return {
        code: 401,
        message: '用户名或密码错误'
      }
    }
  }
}
