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

// 获取菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/system/menus'
  })
}

// 获取性别选项（模拟 API）
export async function fetchGetGenderOptions(delay = 500) {
  // 模拟接口延迟
  await new Promise((resolve) => setTimeout(resolve, delay))

  return {
    code: 200,
    message: 'success',
    data: [
      { label: '男', value: '男' },
      { label: '女', value: '女' },
      { label: '其他', value: '其他' }
    ]
  }
}
