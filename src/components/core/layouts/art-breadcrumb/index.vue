<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadList" :key="item.path">
        <div
          :class="{ clickable: item.path !== '/outside' && !isLastItem(index) }"
          @click="!isLastItem(index) && handleClick(item)"
        >
          <span>
            {{ formatMenuTitle(item.meta?.title as string) }}
          </span>
        </div>
        <i v-if="!isLastItem(index) && item.meta?.title" aria-hidden="true">/</i>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import type { RouteLocationMatched, RouteRecordRaw } from 'vue-router'
  import { formatMenuTitle } from '@/utils/menu'

  export interface BreadcrumbItem {
    path: string
    meta: RouteRecordRaw['meta']
  }

  const route = useRoute()
  const router = useRouter()
  const breadList = ref<BreadcrumbItem[]>([])

  // 计算函数
  const isLastItem = (index: number) => index === breadList.value.length - 1
  const isHome = (route: RouteLocationMatched) => route.name === '/'

  // 获取面包屑数据
  const getBreadcrumb = () => {
    const { matched } = route
    if (isHome(matched[0])) {
      breadList.value = []
      return
    }

    // 如果是主容器内的一级菜单，只显示当前路由的面包屑
    if (matched[0].meta.isInMainContainer) {
      const currentRoute = matched[matched.length - 1]
      breadList.value = [
        {
          path: currentRoute.path,
          meta: currentRoute.meta
        }
      ]
      return
    }

    breadList.value = matched.map(({ path, meta }) => ({ path, meta }))
  }

  // 处理面包屑点击
  const handleClick = async (item: BreadcrumbItem) => {
    const { path } = item

    if (path === '/outside') {
      return
    }

    const currentRoute = router.getRoutes().find((route) => route.path === path)

    if (!currentRoute?.children?.length) {
      await router.push(path)
      return
    }

    const firstValidChild = currentRoute.children.find(
      (child) => !child.redirect && !child.meta?.isHide
    )

    if (firstValidChild) {
      const fullPath = `/${firstValidChild.path}`.replace('//', '/')
      await router.push(fullPath)
    } else {
      await router.push(path)
    }
  }

  // 监听路由变化
  watch(() => route.path, getBreadcrumb, { immediate: true })
</script>

<style lang="scss" scoped>
  @use './style';

  ul {
    li {
      display: flex;
      align-items: center;

      .clickable {
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
</style>
