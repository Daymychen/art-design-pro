import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/auth/login',
    params
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

/**
 * 刷新令牌
 * @param params 刷新令牌参数
 * @returns 刷新令牌响应
 */
export function fetchRefreshToken(params: Api.Auth.RefreshParams) {
  return request.post<Api.Auth.RefreshResponse>({
    url: '/api/auth/refresh',
    params
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  return request.get<Api.Auth.UserInfo>({
    url: '/api/user/info'
  })
}

/**
 * 获取允许的邮箱域名配置
 */
export function fetchEmailConfig() {
  return request.get<Api.Auth.EmailConfigResponse>({
    url: '/api/auth/email-config'
  })
}

/**
 * 发送验证码
 * @param params 邮箱和用途
 */
export function fetchSendVerifyCode(params: Api.Auth.SendVerifyCodeParams) {
  return request.post({
    url: '/api/auth/send-verify-code',
    params
  })
}

/**
 * 邮箱注册
 * @param params 邮箱、验证码、密码
 */
export function fetchRegister(params: Api.Auth.RegisterParams) {
  return request.post({
    url: '/api/auth/register',
    params
  })
}

/**
 * 忘记密码 — 重置密码
 * @param params 邮箱、验证码、新密码
 */
export function fetchForgotPassword(params: Api.Auth.ForgotPasswordParams) {
  return request.post({
    url: '/api/auth/forgot-password',
    params
  })
}
