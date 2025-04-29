/**
 * API接口路径配置
 * 统一管理所有接口URL，方便维护和修改
 */
import { getServiceActualPath } from '@/config/env/api-config'

// 服务名称常量
export const ServiceNames = {
  AUTH: 'easy-cloud-auth',
  USER: 'easy-cloud-user',
  SYSTEM: 'easy-cloud-system',
  CONTENT: 'easy-cloud-content'
} as const

/**
 * API接口基础路径
 * @param serviceName 微服务名称
 * @returns 服务的完整前缀路径
 */
export function getServicePath(serviceName: string): string {
  // 使用API配置获取实际服务路径
  return getServiceActualPath(serviceName)
}

/**
 * 拼接完整的API路径
 * @param serviceName 微服务名称
 * @param path API路径
 * @returns 完整的API路径
 */
export function getApiPath(serviceName: string, path: string): string {
  const servicePath = getServicePath(serviceName)
  // 如果服务路径为空（不启用服务前缀），则直接返回路径
  if (!servicePath) {
    return path
  }
  return `${servicePath}${path}`
}

/**
 * 认证相关API
 */
export const AuthApi = {
  // 登录认证
  LOGIN: getApiPath(ServiceNames.AUTH, '/auth/login'),
  LOGOUT: getApiPath(ServiceNames.AUTH, '/auth/logout'),
  // 用户信息
  USER_INFO: getApiPath(ServiceNames.AUTH, '/auth/user/info'),
  // 检查用户名和手机号
  CHECK_USERNAME: getApiPath(ServiceNames.AUTH, '/auth/check/username'),
  CHECK_MOBILE: getApiPath(ServiceNames.AUTH, '/auth/check/mobile'),
  // 注册
  REGISTER: getApiPath(ServiceNames.AUTH, '/auth/register')
}

/**
 * 用户相关API
 */
export const UserApi = {
  // 用户列表
  LIST: getApiPath(ServiceNames.USER, '/user/list'),
  // 用户详情
  DETAIL: getApiPath(ServiceNames.USER, '/user/detail'),
  // 更新用户
  UPDATE: getApiPath(ServiceNames.USER, '/user/update'),
  // 删除用户
  DELETE: getApiPath(ServiceNames.USER, '/user/delete')
}

/**
 * 系统管理相关API
 */
export const SystemApi = {
  // 菜单
  MENU_LIST: getApiPath(ServiceNames.SYSTEM, '/menu/list'),
  MENU_TREE: getApiPath(ServiceNames.SYSTEM, '/menu/tree'),
  // 角色
  ROLE_LIST: getApiPath(ServiceNames.SYSTEM, '/role/list'),
  // 权限
  PERMISSION_LIST: getApiPath(ServiceNames.SYSTEM, '/permission/list')
}

/**
 * 其他业务相关API可以按照上面的模式扩展
 */
