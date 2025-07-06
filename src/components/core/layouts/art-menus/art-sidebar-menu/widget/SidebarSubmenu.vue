<template>
  <template v-for="item in filteredMenuItems" :key="item.path">
    <!-- 包含子菜单的项目 -->
    <ElSubMenu v-if="hasChildren(item)" :index="item.path || item.meta.title" :level="level">
      <template #title>
        <MenuItemIcon :icon="item.meta.icon" :color="theme?.iconColor" />
        <span class="menu-name">
          {{ formatMenuTitle(item.meta.title) }}
        </span>
        <div v-if="item.meta.showBadge" class="badge" style="right: 10px" />
      </template>

      <SidebarSubmenu
        :list="item.children"
        :is-mobile="isMobile"
        :level="level + 1"
        :theme="theme"
        @close="closeMenu"
      />
    </ElSubMenu>

    <!-- 普通菜单项 -->
    <ElMenuItem
      v-else
      :index="item.path || item.meta.title"
      :level-item="level + 1"
      @click="goPage(item)"
    >
      <MenuItemIcon :icon="item.meta.icon" :color="theme?.iconColor" />

      <template #title>
        <span class="menu-name">
          {{ formatMenuTitle(item.meta.title) }}
        </span>
        <div v-if="item.meta.showBadge" class="badge" />
        <div v-if="item.meta.showTextBadge" class="text-badge">
          {{ item.meta.showTextBadge }}
        </div>
      </template>
    </ElMenuItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { AppRouteRecord } from '@/types/router'
  import { formatMenuTitle } from '@/router/utils/utils'
  import { handleMenuJump } from '@/utils/navigation'

  interface MenuTheme {
    iconColor?: string
  }

  interface Props {
    /** 菜单标题 */
    title?: string
    /** 菜单列表 */
    list?: AppRouteRecord[]
    /** 主题配置 */
    theme?: MenuTheme
    /** 是否为移动端模式 */
    isMobile?: boolean
    /** 菜单层级 */
    level?: number
  }

  interface Emits {
    /** 关闭菜单事件 */
    (e: 'close'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    list: () => [],
    theme: () => ({}),
    isMobile: false,
    level: 0
  })

  const emit = defineEmits<Emits>()

  /**
   * 过滤后的菜单项列表
   * 只显示未隐藏的菜单项
   */
  const filteredMenuItems = computed(() => filterRoutes(props.list))

  /**
   * 跳转到指定页面
   * @param item 菜单项数据
   */
  const goPage = (item: AppRouteRecord): void => {
    closeMenu()
    handleMenuJump(item)
  }

  /**
   * 关闭菜单
   * 触发父组件的关闭事件
   */
  const closeMenu = (): void => {
    emit('close')
  }

  /**
   * 判断菜单项是否包含子菜单
   * @param item 菜单项数据
   * @returns 是否包含子菜单
   */
  const hasChildren = (item: AppRouteRecord): boolean => {
    return Boolean(item.children?.length)
  }

  /**
   * 递归过滤菜单路由，移除隐藏的菜单项
   * @param items 菜单项数组
   * @returns 过滤后的菜单项数组
   */
  const filterRoutes = (items: AppRouteRecord[]): AppRouteRecord[] => {
    return items
      .filter((item) => !item.meta.isHide)
      .map((item) => ({
        ...item,
        children: item.children ? filterRoutes(item.children) : undefined
      }))
  }
</script>

<script lang="ts">
  /**
   * 菜单图标组件
   * 用于渲染菜单项的图标
   */
  const MenuItemIcon = defineComponent({
    name: 'MenuItemIcon',
    props: {
      /** 图标内容 */
      icon: {
        type: String,
        default: ''
      },
      /** 图标颜色 */
      color: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      return () =>
        h('i', {
          class: 'menu-icon iconfont-sys',
          style: props.color ? { color: props.color } : undefined,
          innerHTML: props.icon
        })
    }
  })
</script>
