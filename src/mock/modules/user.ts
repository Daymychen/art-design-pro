import avatar from '@imgs/user/avatar.png'

// 用户信息（示例数据）
export const userInfo = {
  id: 1,
  name: '张三',
  username: 'John Snow',
  avatar: avatar,
  email: 'art.design@gmail.com',
  mobile: '13800138000',
  gender: 1, // 1-男，2-女，0-未知
  status: 1, // 1-正常，0-禁用
  roles: ['admin', 'user'],
  permissions: ['system:view', 'user:add', 'user:edit', 'user:delete']
}
