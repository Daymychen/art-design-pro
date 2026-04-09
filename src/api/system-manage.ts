import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

// 获取用户列表
export function fetchGetUserList(params: Api.SystemManage.UserSearchParams) {
  return request.get<Api.SystemManage.UserList>({
    url: '/api/user/list',
    params
  })
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
  return request.get<Api.SystemManage.RoleList>({
    url: '/api/role/list',
    params
  })
}

// 创建用户
export function fetchCreateUser(data: {
  userName: string
  password?: string
  userGender?: string
  userPhone?: string
  userEmail?: string
  roles?: string[]
  status?: string
}) {
  return request.post({ url: '/api/user', params: data, showSuccessMessage: true })
}

// 更新用户
export function fetchUpdateUser(id: number, data: Record<string, any>) {
  return request.put({ url: `/api/user/${id}`, params: data, showSuccessMessage: true })
}

// 删除用户
export function fetchDeleteUser(id: number) {
  return request.del({ url: `/api/user/${id}`, showSuccessMessage: true })
}

// 创建角色
export function fetchCreateRole(data: {
  roleName: string
  roleCode: string
  description?: string
  enabled?: boolean
}) {
  return request.post({ url: '/api/role', params: data, showSuccessMessage: true })
}

// 更新角色
export function fetchUpdateRole(id: number, data: Record<string, any>) {
  return request.put({ url: `/api/role/${id}`, params: data, showSuccessMessage: true })
}

// 删除角色
export function fetchDeleteRole(id: number) {
  return request.del({ url: `/api/role/${id}`, showSuccessMessage: true })
}

// 获取菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus'
  })
}
