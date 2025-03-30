// import request from '@/utils/http'
// import { BaseResult } from '@/types/axios'
import AppConfig from '@/config'
import { BaseResult } from '@/types/axios'
import { UserInfo } from '@/types/store'
import avatar from '@imgs/user/avatar.png'

export class UserService {
  // 模拟登录接口
  static login(options: { body: string }): Promise<BaseResult> {
    return new Promise((resolve) => {
      const { username, password } = JSON.parse(options.body)

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

  // 获取用户信息
  static getUserInfo(): Promise<BaseResult<UserInfo>> {
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
}
