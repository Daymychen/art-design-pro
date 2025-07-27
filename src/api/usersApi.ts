import request from '@/utils/http'

export class UserService {
  // 登录
  static login(params: Api.Auth.LoginParams) {
    return request.post<Api.Auth.LoginResponse>({
      url: '/api/auth/login',
      params
      // showErrorMessage: false // 不显示错误消息
    })
  }

  // 获取用户信息
  static getUserInfo() {
    return request.get<Api.User.UserInfo>({
      url: '/api/user/info'
      // 自定义请求头
      // headers: {
      //   'X-Custom-Header': 'your-custom-value'
      // }
    })
  }

  // 获取用户列表
  static getUserList(params: Api.Common.PaginatingSearchParams) {
    return request.get<Api.User.UserListData>({
      url: '/api/user/list',
      params
    })
  }
}
