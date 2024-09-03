import { SystemInfo } from '@/config/setting'
import Mock from 'mockjs'
const { mock, Random } = Mock

// 模拟登录接口
mock('/api/login', 'post', (options: any) => {
  const { username, password } = JSON.parse(options.body)
  if (username === SystemInfo.login.username && password === SystemInfo.login.password) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        id: 1,
        name: Random.cname(),
        username: 'John Snow',
        avatar: '',
        token: Random.guid()
      }
    }
  } else {
    return {
      code: 401,
      message: '用户名或密码错误'
    }
  }
})
