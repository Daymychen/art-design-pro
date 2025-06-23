<!-- 顶部快速入口面板 -->
<template>
  <ElPopover
    ref="popoverRef"
    :width="700"
    trigger="hover"
    popper-class="fast-enter-popover"
    :show-arrow="false"
    placement="bottom-start"
    :offset="0"
    :popper-style="{
      border: '1px solid var(--art-border-dashed-color)',
      borderRadius: 'calc(var(--custom-radius) / 2 + 4px)'
    }"
  >
    <template #reference>
      <div class="fast-enter-trigger">
        <div class="btn">
          <i class="iconfont-sys">&#xe81a;</i>
          <span class="red-dot"></span>
        </div>
      </div>
    </template>

    <div class="fast-enter">
      <div class="apps-section">
        <div class="apps-grid">
          <!-- 应用列表 -->
          <div
            v-for="application in applicationList"
            :key="application.name"
            class="app-item"
            @click="handleNavigate(application.path)"
          >
            <div class="app-icon">
              <i
                class="iconfont-sys"
                v-html="application.icon"
                :style="{ color: application.iconColor }"
              />
            </div>
            <div class="app-info">
              <h3>{{ application.name }}</h3>
              <p>{{ application.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-links">
        <h3>快速链接</h3>
        <ul>
          <li
            v-for="quickLink in quickLinkList"
            :key="quickLink.name"
            @click="handleNavigate(quickLink.path)"
          >
            <span>{{ quickLink.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </ElPopover>
</template>

<script setup lang="ts">
  import { RoutesAlias } from '@/router/routesAlias'
  import { WEB_LINKS } from '@/utils/constants'

  defineOptions({ name: 'ArtFastEnter' })

  interface ApplicationItem {
    /** 应用名称 */
    name: string
    /** 应用描述 */
    description: string
    /** 图标代码 */
    icon: string
    /** 图标颜色 */
    iconColor: string
    /** 跳转路径 */
    path: string
  }

  interface QuickLinkItem {
    /** 链接名称 */
    name: string
    /** 跳转路径 */
    path: string
  }

  const router = useRouter()
  const popoverRef = ref()

  const applicationList: ApplicationItem[] = [
    {
      name: '工作台',
      description: '系统概览与数据统计',
      icon: '&#xe721;',
      iconColor: '#377dff',
      path: RoutesAlias.Dashboard
    },
    {
      name: '分析页',
      description: '数据分析与可视化',
      icon: '&#xe812;',
      iconColor: '#ff3b30',
      path: RoutesAlias.Analysis
    },
    {
      name: '礼花效果',
      description: '动画特效展示',
      icon: '&#xe7ed;',
      iconColor: '#7A7FFF',
      path: RoutesAlias.Fireworks
    },
    {
      name: '聊天',
      description: '即时通讯功能',
      icon: '&#xe70a;',
      iconColor: '#13DEB9',
      path: RoutesAlias.Chat
    },
    {
      name: '官方文档',
      description: '使用指南与开发文档',
      icon: '&#xe788;',
      iconColor: '#ffb100',
      path: WEB_LINKS.DOCS
    },
    {
      name: '技术支持',
      description: '技术支持与问题反馈',
      icon: '&#xe86e;',
      iconColor: '#ff6b6b',
      path: WEB_LINKS.COMMUNITY
    },
    {
      name: '更新日志',
      description: '版本更新与变更记录',
      icon: '&#xe81c;',
      iconColor: '#38C0FC',
      path: RoutesAlias.ChangeLog
    },
    {
      name: '哔哩哔哩',
      description: '技术分享与交流',
      icon: '&#xe6b4;',
      iconColor: '#FB7299',
      path: WEB_LINKS.BILIBILI
    }
  ]

  const quickLinkList: QuickLinkItem[] = [
    { name: '登录', path: RoutesAlias.Login },
    { name: '注册', path: RoutesAlias.Register },
    { name: '忘记密码', path: RoutesAlias.ForgetPassword },
    { name: '定价', path: RoutesAlias.Pricing },
    { name: '个人中心', path: RoutesAlias.UserCenter },
    { name: '留言管理', path: RoutesAlias.Comment }
  ]

  const isExternalLink = (path: string): boolean => path.startsWith('http')

  const handleNavigate = (path: string): void => {
    if (isExternalLink(path)) {
      window.open(path, '_blank')
    } else {
      router.push(path)
    }
    popoverRef.value?.hide()
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>
