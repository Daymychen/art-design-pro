<!-- 水平菜单 -->
<template>
  <div class="top-menu">
    <ElMenu
      :ellipsis="true"
      class="el-menu-popper-demo"
      mode="horizontal"
      :default-active="routerPath"
      text-color="var(--art-text-gray-700)"
      :popper-offset="-6"
      background-color="transparent"
      :show-timeout="50"
      :hide-timeout="50"
    >
      <HorizontalSubmenu
        v-for="item in filteredMenuItems"
        :key="item.path"
        :item="item"
        :isMobile="false"
        :level="0"
      />
    </ElMenu>
  </div>
</template>

<script setup lang="ts">
  import type { AppRouteRecord } from '@/types/router'
  import HorizontalSubmenu from './widget/HorizontalSubmenu.vue'

  defineOptions({ name: 'ArtHorizontalMenu' })

  interface Props {
    /** 菜单列表数据 */
    list: AppRouteRecord[]
  }

  const route = useRoute()

  const props = withDefaults(defineProps<Props>(), {
    list: () => []
  })

  /**
   * 过滤后的菜单项列表
   * 只显示未隐藏的菜单项
   */
  const filteredMenuItems = computed(() => {
    return filterMenuItems(props.list)
  })

  /**
   * 当前激活的路由路径
   * 用于菜单高亮显示
   */
  const routerPath = computed(() => String(route.meta.activePath || route.path))

  /**
   * 过滤菜单项，移除隐藏的菜单
   * @param items 菜单项数组
   * @returns 过滤后的菜单项数组
   */
  const filterMenuItems = (items: AppRouteRecord[]): AppRouteRecord[] => {
    return items.filter((item) => !item.meta.isHide)
  }
</script>

<style lang="scss" scoped>
  .top-menu {
    flex: 1;
    overflow: hidden;

    .el-menu {
      width: 100%;
      border: none;
    }
  }

  // 去除 el-sub-menu 的底部横线
  :deep(.el-menu--horizontal .el-sub-menu__title) {
    padding: 0 30px 0 10px !important;
    border: 0 !important;
  }
</style>
