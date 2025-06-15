<!-- 水平菜单 -->
<template>
  <div class="top-menu">
    <el-menu
      :ellipsis="true"
      class="el-menu-popper-demo"
      mode="horizontal"
      :default-active="routerPath"
      text-color="var(--art-text-gray-700)"
      :popper-offset="-6"
      :style="{ width: width + 'px' }"
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
    </el-menu>
  </div>
</template>

<script setup lang="ts">
  import { AppRouteRecord } from '@/types/router'

  const route = useRoute()

  const props = defineProps({
    list: {
      type: [Array] as PropType<AppRouteRecord[]>,
      default: () => []
    },
    width: {
      type: Number,
      default: 500
    }
  })

  const filteredMenuItems = computed(() => {
    return props.list.filter((item) => !item.meta.isHide)
  })

  const routerPath = computed(() => String(route.meta.activePath || route.path))
</script>

<style lang="scss" scoped>
  // 去除 el-sub-menu 的底部横线
  :deep(.el-menu--horizontal .el-sub-menu__title) {
    border: 0 !important;
  }

  // 去除 el-menu 的底部横线
  .top-menu {
    .el-menu {
      border: none;
    }
  }

  // 可自定义选中样式
  // :deep(.el-menu--horizontal .el-sub-menu.is-active) {
  //   background-color: var(--art-gray-200);
  //   margin: 10px 0;
  //   border-radius: 6px;
  // }

  @media only screen and (max-width: $device-notebook) {
    .top-menu {
      .el-menu {
        width: 38vw !important;
      }
    }
  }
</style>
