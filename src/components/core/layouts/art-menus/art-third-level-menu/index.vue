<template>
  <div class="third-level-menu" :class="{ 'is-empty': !delayShowThirdMenu }">
    <div v-show="delayShowThirdMenu" class="menu-scroll-container">
      <ul class="menu-list">
        <li
          v-for="item in thirdLevelMenus"
          :key="item.path"
          :class="{ 'is-active': isActive(item) }"
          @click="handleClick(item)"
        >
          <div class="menu-content">
            <ArtSvgIcon v-if="item.meta.icon" :icon="item.meta.icon" class="menu-icon" />
            <span class="menu-title">{{ $t(item.meta.title) }}</span>
            <div v-if="item.meta.showBadge" class="art-badge" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuTypeEnum } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import type { AppRouteRecord } from '@/types/router'

  defineOptions({ name: 'ArtThirdLevelMenu' })

  const route = useRoute()
  const router = useRouter()
  const menuStore = useMenuStore()
  const settingStore = useSettingStore()
  const { menuList: originalMenuList } = storeToRefs(menuStore)
  const { menuType } = storeToRefs(settingStore)

  const isTopLeftMiddleMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT_MIDDLE)

  // 获取三级菜单
  const thirdLevelMenus = computed<AppRouteRecord[]>(() => {
    const currentPath = route.path
    const menus = originalMenuList.value

    for (const firstLevel of menus) {
      if (!firstLevel.children) continue
      for (const secondLevel of firstLevel.children) {
        if (secondLevel.children?.some((third) => third.path === currentPath)) {
          return secondLevel.children
        }
        if (secondLevel.path === currentPath) {
          return []
        }
      }
    }
    return []
  })

  // 真实的显示状态
  const realShowThirdMenu = computed(() => {
    return !route.meta?.isFullPage && isTopLeftMiddleMenu.value && thirdLevelMenus.value.length > 0
  })

  // 延迟显示变量（解决卡顿）
  const delayShowThirdMenu = ref(realShowThirdMenu.value)

  // 监听路由切换，延迟 150ms 再隐藏菜单
  watch(
    () => route.path,
    () => {
      setTimeout(() => {
        delayShowThirdMenu.value = realShowThirdMenu.value
      }, 150)
    },
    { immediate: true }
  )

  // 监听菜单类型
  watch(
    () => isTopLeftMiddleMenu.value,
    () => {
      delayShowThirdMenu.value = realShowThirdMenu.value
    },
    { immediate: true }
  )

  // 激活状态
  const isActive = (item: AppRouteRecord): boolean => {
    return route.path === item.path
  }
  // 菜单点击跳转
  const handleClick = (item: AppRouteRecord): void => {
    router.push(item.path)
  }
</script>

<style scoped lang="scss">
  .third-level-menu {
    overflow-x: auto;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgb(0 0 0 / 4%);
    transition: all 0.2s ease-in-out;
    scrollbar-width: thin;

    &.is-empty {
      height: 0 !important;
      padding: 0;
      margin: 0;
      overflow: hidden;
      background-color: transparent;
      border-bottom: none;
      box-shadow: none;
    }

    .menu-scroll-container {
      height: 48px;
    }

    .menu-list {
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 16px;
      margin: 0;
      list-style: none;

      li {
        position: relative;
        display: inline-flex;
        align-items: center;
        height: 100%;
        padding: 0 16px;
        font-size: 12px;
        // 文字颜色调浅，更柔和
        color: #6c757d;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          // hover 时文字颜色加深，不改变背景，避免突兀
          color: #495057;
        }

        .menu-content {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 100%;
        }

        &.is-active {
          // 激活态文字用主题蓝，保持辨识度
          color: #409eff;

          .menu-content::after {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            margin: 0 auto;
            content: '';
            background-color: #409eff;
          }
        }

        .menu-icon {
          margin-right: 6px;
          font-size: 16px;
        }

        .art-badge {
          width: 6px;
          height: 6px;
          margin-left: 6px;
          background-color: #f56c6c;
          border-radius: 50%;
        }
      }
    }
  }

  // 美化滚动条（可选，让滚动更柔和）
  .third-level-menu::-webkit-scrollbar {
    height: 3px;
  }

  .third-level-menu::-webkit-scrollbar-track {
    background: transparent;
  }

  .third-level-menu::-webkit-scrollbar-thumb {
    background-color: #dee2e6;
    border-radius: 3px;
  }

  // 移动端响应式
  @media (width <= 768px) {
    .third-level-menu {
      .menu-list li {
        padding: 0 12px;
      }
    }
  }
</style>
