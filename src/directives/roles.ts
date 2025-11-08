/**
 * v-roles 角色权限指令
 *
 * 基于用户角色控制 DOM 元素的显示和隐藏。
 * 只要用户拥有指定角色中的任意一个，元素就会显示，否则从 DOM 中移除。
 *
 * ## 主要功能
 *
 * - 角色验证 - 检查用户是否拥有指定角色
 * - 多角色支持 - 支持单个角色或多个角色（满足其一即可）
 * - DOM 控制 - 无权限时自动移除元素，而非隐藏
 * - 响应式更新 - 角色变化时自动更新元素状态
 *
 * ## 使用示例
 *
 * ```vue
 * <template>
 *   <!-- 单个角色 - 只有超级管理员可见 -->
 *   <el-button v-roles="'R_SUPER'">超级管理员功能</el-button>
 *
 *   <!-- 多个角色 - 超级管理员或普通管理员可见 -->
 *   <el-button v-roles="['R_SUPER', 'R_ADMIN']">管理员功能</el-button>
 *
 *   <!-- 应用到任意元素 -->
 *   <div v-roles="['R_SUPER', 'R_ADMIN', 'R_USER']">
 *     所有登录用户可见的内容
 *   </div>
 * </template>
 * ```
 *
 * ## 权限逻辑
 *
 * - 用户角色从 userStore.getUserInfo.roles 获取
 * - 只要用户拥有指定角色中的任意一个，元素就会显示
 * - 如果用户没有任何角色或不满足条件，元素将被移除
 *
 * ## 注意事项
 *
 * - 该指令会直接移除 DOM 元素，而不是使用 v-if 隐藏
 * - 适用于基于角色的粗粒度权限控制
 * - 如需基于具体操作的细粒度权限控制，请使用 v-auth 指令
 *
 * @module directives/roles
 * @author Art Design Pro Team
 */

import { useUserStore } from '@/store/modules/user'
import { App, Directive, DirectiveBinding } from 'vue'

interface RolesBinding extends DirectiveBinding {
  value: string | string[]
}

function checkRolePermission(el: HTMLElement, binding: RolesBinding): void {
  const userStore = useUserStore()
  const userRoles = userStore.getUserInfo.roles

  // 如果用户角色为空或未定义，移除元素
  if (!userRoles?.length) {
    removeElement(el)
    return
  }

  // 确保指令值为数组格式
  const requiredRoles = Array.isArray(binding.value) ? binding.value : [binding.value]

  // 检查用户是否具有所需角色之一
  const hasPermission = requiredRoles.some((role: string) => userRoles.includes(role))

  // 如果没有权限，安全地移除元素
  if (!hasPermission) {
    removeElement(el)
  }
}

function removeElement(el: HTMLElement): void {
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

const rolesDirective: Directive = {
  mounted: checkRolePermission,
  updated: checkRolePermission
}

export function setupRolesDirective(app: App): void {
  app.directive('roles', rolesDirective)
}
