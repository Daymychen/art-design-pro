<template>
  <div class="button-auth-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>{{ $t('menus.examples.permission.buttonAuth') }}</h2>
      <p class="description">
        此页面演示按钮级别的权限控制，不同用户身份下可见的按钮会有所不同。权限控制基于用户角色和权限码实现。
      </p>
    </div>

    <div class="current-auth-card">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>当前用户权限信息</span>
          </div>
        </template>
        <div class="auth-info">
          <div class="auth-item">
            <span class="label">用户角色：</span>
            <ElTag :type="getRoleTagType(currentUserRole)">
              {{ getRoleDisplayName(currentUserRole) }}
            </ElTag>
          </div>
          <div class="auth-item">
            <span class="label">权限码：</span>
            <div class="permissions-list">
              <ElTag
                v-for="permission in currentUserPermissions"
                :key="permission"
                size="small"
                type="info"
                class="permission-tag"
              >
                {{ permission }}
              </ElTag>
              <span v-if="!currentUserPermissions.length" class="no-data">无权限码</span>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 基于角色的权限控制演示 -->
    <div class="role-based-section">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>基于角色的权限控制（v-roles 指令）</span>
          </div>
        </template>
        <div class="demo-content">
          <p class="section-desc">
            使用 <code>v-roles</code> 指令控制按钮显示，只有拥有指定角色的用户才能看到对应按钮。
          </p>

          <div class="button-group">
            <div class="button-item">
              <ElButton type="primary" plain v-roles="'R_SUPER'"> 超级管理员可见 </ElButton>
              <div class="button-desc">
                <code>v-roles="'R_SUPER'"</code>
                <span>只有超级管理员可见</span>
              </div>
            </div>

            <!-- 管理员级别按钮 -->
            <div class="button-item">
              <ElButton type="warning" plain v-roles="['R_SUPER', 'R_ADMIN']">
                管理员可见
              </ElButton>
              <div class="button-desc">
                <code>v-roles="['R_SUPER', 'R_ADMIN']"</code>
                <span>超级管理员和管理员可见</span>
              </div>
            </div>

            <!-- 所有已登录用户可见 -->
            <div class="button-item">
              <ElButton type="success" plain v-roles="['R_SUPER', 'R_ADMIN', 'R_USER']">
                所有用户可见
              </ElButton>
              <div class="button-desc">
                <code>v-roles="['R_SUPER', 'R_ADMIN', 'R_USER']"</code>
                <span>所有已登录用户可见</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 后端模式：基于路由权限配置的控制演示 -->
    <div class="backend-mode-section">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>后端模式权限控制（v-auth 指令）</span>
            <ElTag v-if="!isFrontendMode" type="success" size="small">当前模式</ElTag>
            <ElTag v-else type="info" size="small">非当前模式</ElTag>
          </div>
        </template>
        <div class="demo-content">
          <p class="section-desc">
            <code>v-auth</code>
            指令在后端模式下根据当前路由的 <code>meta.authList</code> 配置检查权限。
            权限列表来源于路由元数据，适用于权限配置由后端统一管理的场景。
          </p>

          <div class="auth-config-info">
            <h4>当前路由权限配置：</h4>
            <div class="config-display">
              <code>{{ JSON.stringify(backendAuthList, null, 2) }}</code>
            </div>
          </div>

          <div class="button-group">
            <!-- 新增权限 -->
            <div class="button-item">
              <ElButton type="primary" plain v-auth="'add'"> 新增 </ElButton>
              <div class="button-desc">
                <code>v-auth="'add'"</code>
                <span>检查路由 meta.authList 中是否存在 authMark: 'add'</span>
              </div>
            </div>

            <!-- 编辑权限 -->
            <div class="button-item">
              <ElButton type="warning" plain v-auth="'edit'"> 编辑 </ElButton>
              <div class="button-desc">
                <code>v-auth="'edit'"</code>
                <span>检查路由 meta.authList 中是否存在 authMark: 'edit'</span>
              </div>
            </div>

            <!-- 删除权限 -->
            <div class="button-item">
              <ElButton type="danger" plain v-auth="'delete'"> 删除 </ElButton>
              <div class="button-desc">
                <code>v-auth="'delete'"</code>
                <span>检查路由 meta.authList 中是否存在 authMark: 'delete'</span>
              </div>
            </div>

            <!-- 导出权限 -->
            <div class="button-item">
              <ElButton type="info" plain v-auth="'export'"> 导出 </ElButton>
              <div class="button-desc">
                <code>v-auth="'export'"</code>
                <span>检查路由 meta.authList 中是否存在 authMark: 'export'</span>
              </div>
            </div>
          </div>

          <div class="mode-note">
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
    <div class="frontend-mode-section">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>前端模式权限控制（hasAuth 方法）</span>
            <ElTag v-if="isFrontendMode" type="success" size="small">当前模式</ElTag>
            <ElTag v-else type="info" size="small">非当前模式</ElTag>
          </div>
        </template>
        <div class="demo-content">
          <p class="section-desc">
            <code>hasAuth</code>
            方法在前端模式下根据用户信息中的 <code>buttons</code> 字段检查权限。
            权限列表存储在用户状态中，适用于权限完全由前端管理的场景。
          </p>

          <div class="auth-config-info">
            <h4>当前用户权限列表（buttons 字段）：</h4>
            <div class="config-display">
              <code>{{ JSON.stringify(frontendAuthList, null, 2) }}</code>
            </div>
          </div>

          <div class="button-group">
            <!-- 条件渲染按钮 -->
            <div class="button-item">
              <ElButton v-if="hasAuth('view')" type="primary"> 查看详情 </ElButton>
              <ElButton v-else type="info" disabled> 无查看权限 </ElButton>
              <div class="button-desc">
                <code>v-if="hasAuth('view')"</code>
                <span>检查用户 buttons 数组是否包含 'view'</span>
              </div>
            </div>

            <!-- 动态按钮状态 -->
            <div class="button-item">
              <ElButton
                :disabled="!hasAuth('publish')"
                :type="hasAuth('publish') ? 'success' : 'info'"
                @click="handlePublish"
              >
                {{ hasAuth('publish') ? '发布' : '无发布权限' }}
              </ElButton>
              <div class="button-desc">
                <code>:disabled="!hasAuth('publish')"</code>
                <span>检查用户 buttons 数组是否包含 'publish'</span>
              </div>
            </div>

            <!-- 批量操作按钮 -->
            <div class="button-item">
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
              <div class="button-desc">
                <code>computed(() => hasAuth('edit') || hasAuth('delete'))</code>
                <span>复合权限检查，检查多个权限的并集</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 后端模式：编程式权限控制演示 -->
    <div class="backend-programmatic-section">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>后端模式权限控制（hasAuth 方法）</span>
            <ElTag v-if="!isFrontendMode" type="success" size="small">当前模式</ElTag>
            <ElTag v-else type="info" size="small">非当前模式</ElTag>
          </div>
        </template>
        <div class="demo-content">
          <p class="section-desc">
            <code>hasAuth</code>
            方法在后端模式下根据当前路由的
            <code>meta.authList</code> 配置检查权限。与 v-auth
            指令使用相同的权限来源，但提供编程式的权限检查能力。
          </p>

          <div class="button-group">
            <!-- 动态功能切换 -->
            <div class="button-item">
              <ElSwitch
                v-model="dynamicFeatureEnabled"
                :disabled="!hasAuth('config')"
                active-text="功能开启"
                inactive-text="功能关闭"
              />
              <div class="button-desc">
                <code>:disabled="!hasAuth('config')"</code>
                <span>检查路由权限控制功能开关</span>
              </div>
            </div>

            <!-- 条件显示操作区域 -->
            <div class="button-item">
              <div v-if="hasAuth('manage')" class="operation-area">
                <ElButton type="primary" size="small">管理操作</ElButton>
                <ElButton type="warning" size="small">高级设置</ElButton>
              </div>
              <div v-else class="no-permission-tip">
                <ElIcon><Lock /></ElIcon>
                <span>需要管理权限才能查看此区域</span>
              </div>
              <div class="button-desc">
                <code>v-if="hasAuth('manage')"</code>
                <span>基于后端路由权限的条件渲染</span>
              </div>
            </div>

            <!-- 权限状态指示器 -->
            <div class="button-item">
              <div class="permission-indicators">
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
              <div class="button-desc">
                <code>hasAuth('permission')</code>
                <span>实时权限状态指示器</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 权限模式对比说明 -->
    <div class="comparison-section">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>权限控制模式对比</span>
          </div>
        </template>
        <div class="demo-content">
          <div class="comparison-table">
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
  import { ElMessage } from 'element-plus'
  import { ArrowDown, Lock } from '@element-plus/icons-vue'
  import { useAuth } from '@/composables/useAuth'
  import { useUserStore } from '@/store/modules/user'
  import { useCommon } from '@/composables/useCommon'
  import { useRoute } from 'vue-router'
  import type { AppRouteRecord } from '@/types/router'

  defineOptions({ name: 'PermissionButtonAuth' })

  const { hasAuth } = useAuth()
  const { isFrontendMode } = useCommon()
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

<style lang="scss" scoped>
  .button-auth-page {
    width: 100%;
    padding: 10px 0;

    .page-header {
      margin-bottom: 24px;

      h2 {
        margin: 0 0 8px;
        font-size: 22px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .description {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: var(--el-text-color-regular);
      }
    }

    .current-auth-card {
      margin-bottom: 24px;

      .auth-info {
        .auth-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            min-width: 80px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .permissions-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .permission-tag {
              margin: 0;
            }

            .no-data {
              font-style: italic;
              color: var(--el-text-color-placeholder);
            }
          }
        }
      }
    }

    .role-based-section,
    .backend-mode-section,
    .frontend-mode-section,
    .backend-programmatic-section,
    .comparison-section {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      color: var(--el-text-color-primary);

      span {
        flex: 1;
      }
    }

    .demo-content {
      .section-desc {
        padding: 12px;
        margin: 0 0 20px;
        font-size: 14px;
        line-height: 1.6;
        color: var(--el-text-color-regular);
        background: var(--el-bg-color-page);
        border-radius: 4px;
        // border-left: 4px solid var(--el-color-primary);

        code {
          padding: 2px 6px;
          font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
          font-size: 13px;
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          border-radius: 4px;
        }
      }

      .button-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;

        .button-item {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .button-desc {
            font-size: 12px;
            color: var(--el-text-color-secondary);

            code {
              display: block;
              padding: 4px 8px;
              margin-bottom: 4px;
              font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
              color: var(--el-text-color-primary);
              background: var(--el-fill-color-light);
              border: 1px solid var(--el-border-color-lighter);
              border-radius: 4px;
            }

            span {
              color: var(--el-text-color-regular);
            }
          }
        }
      }

      .auth-config-info {
        margin-bottom: 20px;

        h4 {
          margin: 0 0 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .config-display {
          max-height: 120px;
          padding: 12px;
          overflow-y: auto;
          font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
          font-size: 12px;
          color: var(--el-text-color-primary);
          word-break: break-all;
          white-space: pre-wrap;
          background: var(--el-fill-color-light);
          border: 1px solid var(--el-border-color-lighter);
          border-radius: 4px;
        }
      }

      .mode-note {
        margin-top: 16px;
      }

      .operation-area {
        display: flex;
        gap: 8px;
        padding: 12px;
        background: var(--el-bg-color-page);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
      }

      .no-permission-tip {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 12px;
        color: var(--el-text-color-placeholder);
        background: var(--el-fill-color-light);
        border: 1px dashed var(--el-border-color);
        border-radius: 4px;
      }

      .permission-indicators {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .comparison-table {
        margin-top: 16px;
      }
    }
  }

  @media (width <= 768px) {
    .button-auth-page {
      padding: 16px 0;

      .permission-indicators {
        flex-direction: column;
        gap: 8px;
      }

      .operation-area {
        flex-direction: column;
      }
    }
  }
</style>
