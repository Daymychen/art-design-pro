<!-- 按钮权限示例页面 -->
<template>
  <div class="w-full py-2">
    <!-- 页面头部 -->
    <div class="mb-6">
      <h2 class="m-0 mb-2 text-xl font-medium">{{ $t('menus.examples.permission.buttonAuth') }}</h2>
      <p class="m-0 text-sm leading-[1.6] text-g-700">
        此页面演示按钮级别的权限控制，不同用户身份下可见的按钮会有所不同。权限控制基于用户角色和权限码实现。
      </p>
    </div>

    <div class="mb-6">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">当前用户权限信息</span>
          </div>
        </template>
        <div>
          <div class="flex items-start mb-4 last:mb-0">
            <span class="min-w-20 font-semibold">用户角色：</span>
            <ElTag :type="getRoleTagType(currentUserRole)">
              {{ getRoleDisplayName(currentUserRole) }}
            </ElTag>
          </div>
          <div class="flex items-start mb-4 last:mb-0">
            <span class="min-w-20 font-semibold">权限码：</span>
            <div class="flex flex-wrap gap-2">
              <ElTag
                v-for="permission in currentUserPermissions"
                :key="permission"
                size="small"
                type="info"
                class="m-0"
              >
                {{ permission }}
              </ElTag>
              <span v-if="!currentUserPermissions.length" class="italic text-red-500"
                >无权限码</span
              >
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 基于角色的权限控制演示 -->
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">基于角色的权限控制（v-roles 指令）</span>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            使用
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >v-roles</code
            >
            指令控制按钮显示，只有拥有指定角色的用户才能看到对应按钮。
          </p>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            <div class="flex flex-col gap-2">
              <ElButton type="primary" plain v-roles="'R_SUPER'"> 超级管理员可见 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-roles="'R_SUPER'"</code
                >
                <span class="text-g-700">只有超级管理员可见</span>
              </div>
            </div>

            <!-- 管理员级别按钮 -->
            <div class="flex flex-col gap-2">
              <ElButton type="warning" plain v-roles="['R_SUPER', 'R_ADMIN']">
                管理员可见
              </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-roles="['R_SUPER', 'R_ADMIN']"</code
                >
                <span class="text-g-700">超级管理员和管理员可见</span>
              </div>
            </div>

            <!-- 所有已登录用户可见 -->
            <div class="flex flex-col gap-2">
              <ElButton type="success" plain v-roles="['R_SUPER', 'R_ADMIN', 'R_USER']">
                所有用户可见
              </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-roles="['R_SUPER', 'R_ADMIN', 'R_USER']"</code
                >
                <span class="text-g-700">所有已登录用户可见</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 后端模式：基于路由权限配置的控制演示 -->
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">后端模式权限控制（v-auth 指令）</span>
            <ElTag v-if="!isFrontendMode" type="success" size="small">当前模式</ElTag>
            <ElTag v-else type="info" size="small">非当前模式</ElTag>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >v-auth</code
            >
            指令在后端模式下根据当前路由的
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >meta.authList</code
            >
            配置检查权限。 权限列表来源于路由元数据，适用于权限配置由后端统一管理的场景。
          </p>

          <div class="mb-5">
            <h4 class="m-0 mb-2 text-sm font-semibold"> 当前路由权限配置： </h4>
            <div
              class="max-h-30 p-3 overflow-y-auto font-mono text-xs break-all whitespace-pre-wrap bg-g-200 border-full-d rounded"
            >
              <code>{{ JSON.stringify(backendAuthList, null, 2) }}</code>
            </div>
          </div>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            <!-- 新增权限 -->
            <div class="flex flex-col gap-2">
              <ElButton type="primary" plain v-auth="'add'"> 新增 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'add'"</code
                >
                <span class="text-g-700">检查路由 meta.authList 中是否存在 authMark: 'add'</span>
              </div>
            </div>

            <!-- 编辑权限 -->
            <div class="flex flex-col gap-2">
              <ElButton type="warning" plain v-auth="'edit'"> 编辑 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'edit'"</code
                >
                <span class="text-g-700">检查路由 meta.authList 中是否存在 authMark: 'edit'</span>
              </div>
            </div>

            <!-- 删除权限 -->
            <div class="flex flex-col gap-2">
              <ElButton type="danger" plain v-auth="'delete'"> 删除 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'delete'"</code
                >
                <span class="text-g-700">检查路由 meta.authList 中是否存在 authMark: 'delete'</span>
              </div>
            </div>

            <!-- 导出权限 -->
            <div class="flex flex-col gap-2">
              <ElButton type="info" plain v-auth="'export'"> 导出 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'export'"</code
                >
                <span class="text-g-700">检查路由 meta.authList 中是否存在 authMark: 'export'</span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <ElAlert
              :type="isFrontendMode ? 'warning' : 'success'"
              :title="
                isFrontendMode
                  ? '注意：当前为前端模式，v-auth 指令在后端模式下才生效'
                  : '当前为后端模式，v-auth 指令正常工作'
              "
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 前端模式：编程式权限控制演示 -->
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">前端模式权限控制（hasAuth 方法）</span>
            <ElTag v-if="isFrontendMode" type="success" size="small">当前模式</ElTag>
            <ElTag v-else type="info" size="small">非当前模式</ElTag>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >hasAuth</code
            >
            方法在前端模式下根据用户信息中的
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >buttons</code
            >
            字段检查权限。 权限列表存储在用户状态中，适用于权限完全由前端管理的场景。
          </p>

          <div class="mb-5">
            <h4 class="m-0 mb-2 text-sm font-semibold">当前用户权限列表（buttons 字段）：</h4>
            <div
              class="max-h-30 p-3 overflow-y-auto font-mono text-xs break-all whitespace-pre-wrap bg-g-200 border-full-d rounded"
            >
              <code>{{ JSON.stringify(frontendAuthList, null, 2) }}</code>
            </div>
          </div>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            <!-- 条件渲染按钮 -->
            <div class="flex flex-col gap-2">
              <ElButton v-if="hasAuth('view')" type="primary"> 查看详情 </ElButton>
              <ElButton v-else type="info" disabled> 无查看权限 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-if="hasAuth('view')"</code
                >
                <span class="text-g-700">检查用户 buttons 数组是否包含 'view'</span>
              </div>
            </div>

            <!-- 动态按钮状态 -->
            <div class="flex flex-col gap-2">
              <ElButton
                :disabled="!hasAuth('publish')"
                :type="hasAuth('publish') ? 'success' : 'info'"
                @click="handlePublish"
              >
                {{ hasAuth('publish') ? '发布' : '无发布权限' }}
              </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >:disabled="!hasAuth('publish')"</code
                >
                <span class="text-g-700">检查用户 buttons 数组是否包含 'publish'</span>
              </div>
            </div>

            <!-- 批量操作按钮 -->
            <div class="flex flex-col gap-2">
              <ElDropdown @command="handleBatchAction" :disabled="!hasBatchPermissions">
                <ElButton :type="hasBatchPermissions ? 'warning' : 'info'">
                  批量操作
                  <ElIcon class="el-icon--right">
                    <ArrowDown />
                  </ElIcon>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="batchEdit" :disabled="!hasAuth('edit')">
                      批量编辑
                    </ElDropdownItem>
                    <ElDropdownItem command="batchDelete" :disabled="!hasAuth('delete')">
                      批量删除
                    </ElDropdownItem>
                    <ElDropdownItem command="batchExport" :disabled="!hasAuth('export')">
                      批量导出
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >computed(() => hasAuth('edit') || hasAuth('delete'))</code
                >
                <span class="text-g-700">复合权限检查，检查多个权限的并集</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 后端模式：编程式权限控制演示 -->
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">后端模式权限控制（hasAuth 方法）</span>
            <ElTag v-if="!isFrontendMode" type="success" size="small">当前模式</ElTag>
            <ElTag v-else type="info" size="small">非当前模式</ElTag>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >hasAuth</code
            >
            方法在后端模式下根据当前路由的
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >meta.authList</code
            >
            配置检查权限。与 v-auth 指令使用相同的权限来源，但提供编程式的权限检查能力。
          </p>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            <!-- 动态功能切换 -->
            <div class="flex flex-col gap-2">
              <ElSwitch
                v-model="dynamicFeatureEnabled"
                :disabled="!hasAuth('config')"
                active-text="功能开启"
                inactive-text="功能关闭"
              />
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >:disabled="!hasAuth('config')"</code
                >
                <span class="text-g-700">检查路由权限控制功能开关</span>
              </div>
            </div>

            <!-- 条件显示操作区域 -->
            <div class="flex flex-col gap-2">
              <div v-if="hasAuth('manage')" class="flex gap-2 p-3 bg-g-200 border-full-d rounded">
                <ElButton type="primary" size="small">管理操作</ElButton>
                <ElButton type="warning" size="small">高级设置</ElButton>
              </div>
              <div
                v-else
                class="flex-c gap-2 p-3 text-g-500 bg-g-200 border border-dashed border-g-400 rounded"
              >
                <ElIcon><Lock /></ElIcon>
                <span class="text-sm">需要管理权限才能查看此区域</span>
              </div>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-if="hasAuth('manage')"</code
                >
                <span class="text-g-700">基于后端路由权限的条件渲染</span>
              </div>
            </div>

            <!-- 权限状态指示器 -->
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap gap-3">
                <ElBadge
                  :value="hasAuth('add') ? '✓' : '✗'"
                  :type="hasAuth('add') ? 'success' : 'danger'"
                >
                  <ElButton size="small">新增权限</ElButton>
                </ElBadge>
                <ElBadge
                  :value="hasAuth('edit') ? '✓' : '✗'"
                  :type="hasAuth('edit') ? 'success' : 'danger'"
                >
                  <ElButton size="small">编辑权限</ElButton>
                </ElBadge>
                <ElBadge
                  :value="hasAuth('delete') ? '✓' : '✗'"
                  :type="hasAuth('delete') ? 'success' : 'danger'"
                >
                  <ElButton size="small">删除权限</ElButton>
                </ElBadge>
              </div>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >hasAuth('permission')</code
                >
                <span class="text-g-700">实时权限状态指示器</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 权限模式对比说明 -->
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">权限控制模式对比</span>
          </div>
        </template>
        <div>
          <div class="mt-4">
            <ElTable :data="comparisonData" border>
              <ElTableColumn prop="feature" label="功能特性" width="150" />
              <ElTableColumn prop="frontend" label="前端模式" />
              <ElTableColumn prop="backend" label="后端模式" />
            </ElTable>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ArrowDown, Lock } from '@element-plus/icons-vue'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useUserStore } from '@/store/modules/user'
  import { useAppMode } from '@/hooks/core/useAppMode'
  import { useRoute } from 'vue-router'
  import type { AppRouteRecord } from '@/types/router'

  defineOptions({ name: 'PermissionButtonAuth' })

  const { hasAuth } = useAuth()
  const { isFrontendMode } = useAppMode()
  const userStore = useUserStore()
  const route = useRoute()

  // 动态功能状态
  const dynamicFeatureEnabled = ref(false)

  // 当前用户角色
  const currentUserRole = computed(() => {
    return userStore.info?.roles?.[0] || ''
  })

  // 当前用户权限码
  const currentUserPermissions = computed(() => {
    return userStore.info?.buttons || []
  })

  // 前端模式权限列表（用户的 buttons 字段）
  const frontendAuthList = computed(() => {
    return userStore.info?.buttons || []
  })

  // 后端模式权限列表（路由 meta.authList 配置）
  const backendAuthList = computed(() => {
    type AuthItem = NonNullable<AppRouteRecord['meta']['authList']>[number]
    return Array.isArray(route.meta.authList) ? (route.meta.authList as AuthItem[]) : []
  })

  // 是否拥有批量操作权限
  const hasBatchPermissions = computed(() => {
    return hasAuth('edit') || hasAuth('delete') || hasAuth('export')
  })

  // 权限对比数据
  const comparisonData = computed(() => [
    {
      feature: '权限来源',
      frontend: '用户状态中的 buttons 字段',
      backend: '路由配置中的 meta.authList'
    },
    {
      feature: 'v-auth 指令',
      frontend: '不可用（前端模式下指令无效）',
      backend: '可用（根据路由权限配置检查）'
    },
    {
      feature: 'hasAuth 方法',
      frontend: '可用（检查 buttons 数组）',
      backend: '可用（检查 meta.authList）'
    },
    {
      feature: '权限管理',
      frontend: '完全由前端控制，灵活度高',
      backend: '后端统一管理，安全性更高'
    },
    {
      feature: '适用场景',
      frontend: '快速原型、简单应用',
      backend: '企业级应用、复杂权限体系'
    }
  ])

  // 获取角色标签类型
  const getRoleTagType = (role: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
    const roleMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
      R_SUPER: 'warning',
      R_ADMIN: 'primary',
      R_USER: 'success'
    }
    return roleMap[role] || 'info'
  }

  // 获取角色显示名称
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      R_SUPER: '超级管理员',
      R_ADMIN: '管理员',
      R_USER: '普通用户'
    }
    return roleMap[role] || '未知角色'
  }

  // 处理发布操作
  const handlePublish = () => {
    if (hasAuth('publish')) {
      ElMessage.success('发布成功！')
    } else {
      ElMessage.warning('您没有发布权限')
    }
  }

  // 处理批量操作
  const handleBatchAction = (command: string) => {
    const actions: Record<string, string> = {
      batchEdit: '批量编辑',
      batchDelete: '批量删除',
      batchExport: '批量导出'
    }

    const permission = command.replace('batch', '').toLowerCase()

    if (hasAuth(permission)) {
      ElMessage.success(`${actions[command]}操作执行成功！`)
    } else {
      ElMessage.warning(`您没有${actions[command]}权限`)
    }
  }
</script>
