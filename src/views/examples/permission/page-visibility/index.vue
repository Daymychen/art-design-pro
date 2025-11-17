<!-- 权限页面可见页面 -->
<template>
  <div class="w-full py-2">
    <!-- 页面头部 -->
    <div class="mb-6">
      <h2 class="m-0 mb-2 text-xl font-medium">{{
        $t('menus.examples.permission.pageVisibility')
      }}</h2>
      <p class="m-0 text-sm leading-[1.6] text-g-700">
        此页面仅对<strong class="font-semibold text-warning">超级管理员</strong
        >用户可见，演示页面级别的权限控制。 如果您能看到此页面，说明您拥有相应的访问权限。
      </p>
    </div>

    <div class="mb-6">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-c gap-2 font-semibold">
            <span>权限验证成功</span>
          </div>
        </template>
        <div>
          <div class="flex-c gap-5">
            <div>
              <h3 class="m-0 mb-2 text-lg font-semibold">您拥有访问此页面的权限</h3>
              <p class="my-1 text-sm text-g-700">
                当前用户：<strong class="font-semibold">{{ currentUser.userName }}</strong>
              </p>
              <p class="my-1 text-sm text-g-700">
                用户角色：
                <ElTag type="warning">{{ getRoleDisplayName(currentUser.roles?.[0] || '') }}</ElTag>
              </p>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 页面级权限控制说明 -->
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-c font-semibold">
            <span>页面级权限控制说明</span>
          </div>
        </template>
        <div>
          <ElTimeline>
            <ElTimelineItem timestamp="前端控制模式" type="primary" size="large">
              <ElCard shadow="never">
                <h4 class="m-0 mb-2 text-base font-semibold">基于角色的权限控制</h4>
                <p class="m-0 mb-2 leading-[1.6] text-g-700">
                  在前端控制模式下，页面访问权限由路由配置文件中的
                  <code class="px-1.5 py-0.5 font-mono text-xs text-theme bg-theme/12 rounded"
                    >meta.roles</code
                  >
                  字段定义，前端会根据用户接口所拥有的角色对路由和菜单进行过滤与控制
                </p>
                <pre
                  class="p-4 mt-3 mb-0 overflow-x-auto font-mono text-xs leading-[1.5] bg-g-200 border-full-d rounded-md"
                ><code class="">{
  path: 'page-visibility',
  name: 'PermissionPageVisibility',
  component: '/examples/permission/page-visibility',
  meta: {
    title: 'menus.permission.pageVisibility',
    roles: ['R_SUPER'], // 仅超级管理员可访问
    keepAlive: true
  }
}</code></pre>
                <p class="m-0 mb-2 leading-[1.6] text-g-700"><strong>权限验证流程：</strong></p>
                <ul class="pl-5 my-2">
                  <li class="my-1 leading-[1.5] text-g-700"
                    >用户登录后，接口返回用户角色信息（如 R_SUPER、R_ADMIN、R_USER）</li
                  >
                  <li class="my-1 leading-[1.5] text-g-700">
                    在
                    <code class="px-1.5 py-0.5 font-mono text-xs text-theme bg-theme/12 rounded"
                      >beforeEach</code
                    >
                    路由守卫中检查目标路由的
                    <code class="px-1.5 py-0.5 font-mono text-xs text-theme bg-theme/12 rounded"
                      >roles</code
                    >
                    配置
                  </li>
                  <li class="my-1 leading-[1.5] text-g-700"
                    >比较用户角色是否包含在允许访问的角色列表中</li
                  >
                  <li class="my-1 leading-[1.5] text-g-700">权限不足时跳转到 403 页面</li>
                </ul>
              </ElCard>
            </ElTimelineItem>

            <ElTimelineItem timestamp="后端控制模式" type="warning" size="large">
              <ElCard shadow="never">
                <h4 class="m-0 mb-2 text-base font-semibold">基于菜单接口的权限控制</h4>
                <p class="m-0 mb-2 leading-[1.6] text-g-700"
                  >在后端控制模式下，页面访问权限由后端统一管理，前端通过解析后端接口返回的菜单列表来生成可访问的路由，从而实现权限控制</p
                >
                <p class="m-0 mb-2 leading-[1.6] text-g-700"
                  >接口地址：src/api/menuApi.ts getMenuList</p
                >
                <pre
                  class="p-4 mt-3 mb-0 overflow-x-auto font-mono text-xs leading-[1.5] bg-g-200 border-full-d rounded-md"
                ><code class="">
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "path": "/permission",
      "name": "Permission",
      "component": "Layout",
      "meta": {
        "title": "menus.permission.title",
        "icon": ""
      },
      "children": [
        {
          "id": 11,
          "path": "page-visibility",
          "name": "PermissionPageVisibility",
          "component": "permission/page-visibility/index",
          "meta": {
            "title": "menus.permission.pageVisibility",
            "keepAlive": true
          }
        }
      ]
    }
  ]
}</code></pre>
                <p><strong>权限验证流程：</strong></p>
                <ul>
                  <li>用户登录成功后获取 Token</li>
                  <li>前端调用菜单接口获取用户可访问的菜单列表</li>
                  <li>前端根据菜单列表动态注册路由</li>
                  <li>菜单中存在的页面用户可以正常访问，不存在的页面会跳转到 404</li>
                </ul>
              </ElCard>
            </ElTimelineItem>

            <ElTimelineItem timestamp="菜单显示控制" type="success" size="large">
              <ElCard shadow="never">
                <h4>侧边栏菜单可见性</h4>
                <p><strong>前端控制模式：</strong></p>
                <ul>
                  <li>有权限的用户：菜单项正常显示，可以点击访问</li>
                  <li>无权限的用户：菜单项不显示，无法通过菜单导航到页面</li>
                  <li>即使通过直接输入URL尝试访问，也会被路由守卫拦截</li>
                </ul>
                <p><strong>后端控制模式：</strong></p>
                <ul>
                  <li>侧边栏菜单根据后端返回的菜单列表进行渲染</li>
                  <li>后端应该根据用户权限过滤，只返回用户有权限访问的菜单项</li>
                  <li>前端只显示后端返回的菜单，确保用户只能看到和访问有权限的页面</li>
                </ul>
              </ElCard>
            </ElTimelineItem>
          </ElTimeline>
        </div>
      </ElCard>
    </div>

    <!-- 权限控制最佳实践 -->
    <div class="best-practices">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="card-header">
            <span>权限控制最佳实践</span>
          </div>
        </template>
        <div class="practices-content">
          <ElRow :gutter="24">
            <ElCol :span="12" class="!mb-5">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#409EFF"><Lock /></ElIcon>
                </div>
                <div>
                  <h4>多层权限验证</h4>
                  <p class="text-g-700 text-sm"
                    >在前端路由、后端接口、UI组件等多个层面实施权限控制，确保安全性。</p
                  >
                </div>
              </div>
            </ElCol>
            <ElCol :span="12">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#67C23A"><User /></ElIcon>
                </div>
                <div>
                  <h4>基于角色的访问控制</h4>
                  <p class="text-g-700 text-sm"
                    >采用RBAC模型，通过角色分配权限，简化权限管理复杂度。</p
                  >
                </div>
              </div>
            </ElCol>
            <ElCol :span="12">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#E6A23C"><Key /></ElIcon>
                </div>
                <div>
                  <h4>细粒度权限控制</h4>
                  <p class="text-g-700 text-sm">支持页面级、按钮级、数据级等多种粒度的权限控制。</p>
                </div>
              </div>
            </ElCol>
            <ElCol :span="12">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#F56C6C"><View /></ElIcon>
                </div>
                <div>
                  <h4>安全性优先原则</h4>
                  <p class="text-g-700 text-sm"
                    >始终遵循最小权限原则，确保用户只能访问必要的功能和数据。</p
                  >
                </div>
              </div>
            </ElCol>
          </ElRow>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import { Lock, User, Key, View } from '@element-plus/icons-vue'
  import { useUserStore } from '@/store/modules/user'

  defineOptions({ name: 'PermissionPageVisibility' })

  const userStore = useUserStore()

  // 当前用户信息
  const currentUser = computed(() => userStore.info)

  // 获取角色显示名称
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      R_SUPER: '超级管理员',
      R_ADMIN: '管理员',
      R_USER: '普通用户'
    }
    return roleMap[role] || '未知角色'
  }
</script>
