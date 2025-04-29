/**
 * 认证API适配器
 * 用于将后端API响应格式转换为前端需要的格式
 */
import { BaseResult } from '@/types/axios'
import { UserInfo } from '@/types/store'
import defaultAvatar from '@imgs/user/avatar.png'

/**
 * 将后端登录响应转换为前端格式
 * @param response 后端响应
 * @returns 转换后的响应
 */
export function adaptLoginResponse(response: any): BaseResult {
  // 检查响应格式是否符合预期
  if (response.code === 200 && response.data) {
    return {
      code: 200,
      message: response.message || '登录成功',
      data: {
        accessToken: response.data.accessToken || response.data.token,
        userInfo: response.data.userInfo
      }
    }
  }

  // 如果登录失败，返回错误信息
  return {
    code: response.code || 401,
    message: response.message || '用户名或密码错误',
    data: null
  }
}

/**
 * 将后端用户信息响应转换为前端格式
 * @param response 后端响应
 * @returns 转换后的用户信息
 */
export function adaptUserInfoResponse(response: any): BaseResult<UserInfo> {
  // 检查响应格式是否符合预期
  if (response.code === 200 && response.data) {
    const userData = response.data

    return {
      code: 200,
      message: response.message || '获取用户信息成功',
      data: {
        id: userData.id || 1,
        name: userData.name || userData.nickname || '未命名用户',
        username: userData.username || '',
        avatar: userData.avatar || defaultAvatar,
        email: userData.email || ''
      }
    }
  }

  // 如果获取用户信息失败，返回错误信息
  return {
    code: response.code || 500,
    message: response.message || '获取用户信息失败',
    data: null as any
  }
}
