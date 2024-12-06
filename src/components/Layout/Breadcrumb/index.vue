<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadList" :key="item.path">
        <div
          :class="{ clickable: item.path !== '/outside' && !isLastItem(index) }"
          @click="!isLastItem(index) && handleClick(item)"
        >
          <span>
            {{ getMetaMenuTitle(item) === 'iframe' ? getIframeTitle() : getMetaMenuTitle(item) }}
          </span>
        </div>
        <i v-if="!isLastItem(index)" aria-hidden="true">/</i>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { getMetaMenuTitle } from '@/utils/menu'
  import type { RouteLocationMatched, RouteRecordRaw } from 'vue-router'

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

  // 获取iframe标题
  const getIframeTitle = (): string => {
    const title = location.href.split('/').pop()
    const decodeTitle = decodeURIComponent(title || '')
    return decodeTitle
  }
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
