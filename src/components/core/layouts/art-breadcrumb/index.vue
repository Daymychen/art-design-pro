<!-- 面包屑导航 -->
<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadcrumbItems" :key="item.path">
        <div
          :class="{ clickable: isClickable(item, index) }"
          @click="handleBreadcrumbClick(item, index)"
        >
          <span>{{ formatMenuTitle(item.meta?.title as string) }}</span>
        </div>
        <div
          v-if="!isLastItem(index) && item.meta?.title"
          class="breadcrumb-separator"
          aria-hidden="true"
        >
          /
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import type { RouteLocationMatched, RouteRecordRaw } from 'vue-router'
  import { formatMenuTitle } from '@/router/utils/utils'

  defineOptions({ name: 'ArtBreadcrumb' })

  export interface BreadcrumbItem {
    path: string
    meta: RouteRecordRaw['meta']
  }

  const route = useRoute()
  const router = useRouter()

  // 使用computed替代watch，提高性能
  const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const { matched } = route

    // 处理首页情况
    if (!matched.length || isHomeRoute(matched[0])) {
      return []
    }

    // 处理一级菜单和普通路由
    const isFirstLevel = matched[0].meta?.isFirstLevel
    const currentRoute = matched[matched.length - 1]

    return isFirstLevel ? [createBreadcrumbItem(currentRoute)] : matched.map(createBreadcrumbItem)
  })

  // 辅助函数：创建面包屑项目
  function createBreadcrumbItem(route: RouteLocationMatched): BreadcrumbItem {
    return {
      path: route.path,
      meta: route.meta
    }
  }

  // 辅助函数：判断是否为首页
  function isHomeRoute(route: RouteLocationMatched): boolean {
    return route.name === '/'
  }

  // 辅助函数：判断是否为最后一项
  function isLastItem(index: number): boolean {
    return index === breadcrumbItems.value.length - 1
  }

  // 辅助函数：判断是否可点击
  function isClickable(item: BreadcrumbItem, index: number): boolean {
    return item.path !== '/outside' && !isLastItem(index)
  }

  // 辅助函数：查找路由的第一个有效子路由
  function findFirstValidChild(route: RouteRecordRaw) {
    return route.children?.find((child) => !child.redirect && !child.meta?.isHide)
  }

  // 辅助函数：构建完整路径
  function buildFullPath(childPath: string): string {
    return `/${childPath}`.replace('//', '/')
  }

  // 处理面包屑点击事件
  async function handleBreadcrumbClick(item: BreadcrumbItem, index: number): Promise<void> {
    // 如果是最后一项或外部链接，不处理
    if (isLastItem(index) || item.path === '/outside') {
      return
    }

    try {
      const targetRoute = router.getRoutes().find((route) => route.path === item.path)

      if (!targetRoute?.children?.length) {
        await router.push(item.path)
        return
      }

      const firstValidChild = findFirstValidChild(targetRoute)
      const navigationPath = firstValidChild ? buildFullPath(firstValidChild.path) : item.path

      await router.push(navigationPath)
    } catch (error) {
      console.error('导航失败:', error)
    }
  }
</script>

<style lang="scss" scoped>
  @use './style';

  .breadcrumb {
    ul {
      display: flex;
      align-items: center;
      height: 100%;

      li {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 28px;
        font-size: 14px;
        line-height: 28px;

        .clickable {
          cursor: pointer;
          border-radius: 4px;
          transition: color 0.2s ease;
          transition: all 0.2s ease;

          &:hover {
            background-color: rgba(var(--art-gray-200-rgb), 0.85);

            span {
              color: var(--art-gray-700);
            }
          }
        }

        span {
          display: block;
          max-width: 200px;
          padding: 0 6px;
          overflow: hidden;
          color: var(--art-gray-600);
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .breadcrumb-separator {
          margin: 0 4px;
          font-style: normal;
          color: var(--art-gray-600);
        }
      }
    }
  }
</style>
