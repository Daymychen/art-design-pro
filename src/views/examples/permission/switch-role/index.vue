<template>
  <div class="switch-role-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>权限切换演示</h2>
      <p class="description">
        点击下方按钮切换不同用户身份，模拟不同用户登录系统的效果。切换后会影响整个系统的菜单显示和按钮权限。
      </p>
    </div>

    <!-- 当前用户信息 -->
    <div class="current-user-card">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>当前登录用户</span>
          </div>
        </template>
        <div class="user-info">
          <div class="user-details">
            <div class="info-item">
              <span class="label">用户名：</span>
              <span class="value">{{ currentUser.userName || '未登录' }}</span>
            </div>
            <div class="info-item">
              <span class="label">角色：</span>
              <ElTag :type="getRoleTagType(currentUser.roles?.[0])">
                {{ getRoleDisplayName(currentUser.roles?.[0]) }}
              </ElTag>
            </div>
            <div class="info-item">
              <span class="label">权限码：</span>
              <div class="buttons-list">
                <ElTag
                  v-for="button in currentUser.buttons"
                  :key="button"
                  size="small"
                  type="info"
                  class="button-tag"
                >
                  {{ button }}
                </ElTag>
                <span v-if="!currentUser.buttons?.length" class="no-data">无权限码</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 用户角色切换 -->
    <div class="role-switch-section">
      <ElCard shadow="never">
        <template #header>
          <div class="card-header">
            <span>账号切换</span>
          </div>
        </template>
        <div class="role-buttons">
          <div
            v-for="account in accounts"
            :key="account.key"
            class="role-card"
            :class="{ active: currentUser.userName === account.userName }"
          >
            <div class="role-info">
              <div class="role-details">
                <h4>{{ account.label }}</h4>
                <p>{{ account.description }}</p>
                <div class="role-meta">
                  <span>用户名: {{ account.userName }}</span>
                  <span>角色: {{ account.roles.join(', ') }}</span>
                </div>
              </div>
            </div>
            <div class="role-actions">
              <ElButton
                v-if="currentUser.userName !== account.userName"
                type="primary"
                @click="switchRole(account)"
                :loading="switching"
              >
                切换到此角色
              </ElButton>
              <ElTag v-else type="success">当前用户</ElTag>
            </div>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  import { fetchLogin, fetchGetUserInfo } from '@/api/auth'

  defineOptions({ name: 'PermissionSwitchRole' })

  const { t } = useI18n()
  const userStore = useUserStore()

  // 响应式数据
  const switching = ref(false)

  // 当前用户信息
  const currentUser = computed(() => userStore.info)

  // 账号列表 - 与登录页面保持一致
  const accounts = computed(() => [
    {
      key: 'super',
      label: t('login.roles.super'),
      userName: 'Super',
      password: '123456',
      roles: ['R_SUPER'],
      color: '#E6A23C',
      description: '拥有系统最高权限，可以访问所有功能模块'
    },
    {
      key: 'admin',
      label: t('login.roles.admin'),
      userName: 'Admin',
      password: '123456',
      roles: ['R_ADMIN'],
      color: '#409EFF',
      description: '拥有管理权限，可以管理用户和部分系统设置'
    },
    {
      key: 'user',
      label: t('login.roles.user'),
      userName: 'User',
      password: '123456',
      roles: ['R_USER'],
      color: '#67C23A',
      description: '普通用户权限，只能访问基础功能模块'
    }
  ])

  // 获取角色标签类型
  const getRoleTagType = (role?: string): 'info' | 'warning' | 'primary' | 'success' | 'danger' => {
    if (!role) return 'info'
    const roleMap: Record<string, 'info' | 'warning' | 'primary' | 'success' | 'danger'> = {
      R_SUPER: 'warning',
      R_ADMIN: 'primary',
      R_USER: 'success'
    }
    return roleMap[role] || 'info'
  }

  // 获取角色显示名称
  const getRoleDisplayName = (role?: string): string => {
    if (!role) return '未知角色'
    const roleMap: Record<string, string> = {
      R_SUPER: '超级管理员',
      R_ADMIN: '管理员',
      R_USER: '普通用户'
    }
    return roleMap[role] || '未知角色'
  }

  // 切换角色
  const switchRole = async (account: any) => {
    try {
      switching.value = true

      // 模拟登录请求
      const { token, refreshToken } = await fetchLogin({
        userName: account.userName,
        password: account.password
      })

      // 验证token
      if (!token) {
        throw new Error('Login failed - no token received')
      }

      // 存储token和用户信息
      userStore.setToken(token, refreshToken)
      const userInfo = await fetchGetUserInfo()
      userStore.setUserInfo(userInfo)

      // 延迟刷新页面以应用新权限
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('切换用户身份失败，请稍后重试')
        console.error('[SwitchRole] Error:', error)
      }
    } finally {
      switching.value = false
    }
  }
</script>

<style lang="scss" scoped>
  .switch-role-page {
    padding: 10px 0;

    .page-header {
      margin-bottom: 24px;

      h2 {
        margin: 0 0 8px;
        font-size: 22px;
        font-weight: 500;
      }

      .description {
        margin: 0;
        line-height: 1.6;
        color: var(--el-text-color-regular);
      }
    }

    .current-user-card,
    .role-switch-section {
      margin-bottom: 24px;
    }

    .card-header {
      font-weight: 600;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        min-width: 80px;
        font-weight: 600;
      }

      .buttons-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .no-data {
          font-style: italic;
          color: var(--el-text-color-placeholder);
        }
      }
    }

    .role-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .role-card {
      padding: 20px;
      border: 1.5px solid var(--el-border-color-light);
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--el-color-primary);
        box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
      }

      &.active {
        background: var(--el-color-success-light-9);
        border-color: var(--el-color-success);
      }

      .role-info {
        margin-bottom: 16px;
      }

      .role-details {
        h4 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
        }

        p {
          margin: 0 0 8px;
          line-height: 1.5;
          color: var(--el-text-color-regular);
        }

        .role-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;

          span {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }

      .role-actions {
        text-align: right;
      }
    }

    @media (width <= 768px) {
      padding: 16px 0;

      .role-buttons {
        grid-template-columns: 1fr;
      }

      .user-info {
        flex-direction: column;
        gap: 16px;
      }
    }
  }
</style>
