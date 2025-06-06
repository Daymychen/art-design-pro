<template>
  <el-sub-menu v-if="hasChildren" :index="item.path || item.meta.title">
    <template #title>
      <i
        class="menu-icon iconfont-sys"
        :style="{ color: theme?.iconColor }"
        v-html="item.meta.icon"
      ></i>
      <span>{{ formatMenuTitle(item.meta.title) }}</span>
    </template>

    <!-- 递归调用自身处理子菜单 -->
    <HorizontalSubmenu
      v-for="child in filteredChildren"
      :key="child.path"
      :item="child"
      :theme="theme"
      :is-mobile="isMobile"
      :level="level + 1"
      @close="closeMenu"
    />
  </el-sub-menu>

  <el-menu-item
    v-else-if="!item.meta.isHide"
    :index="item.path || item.meta.title"
    @click="goPage(item)"
  >
    <i
      class="menu-icon iconfont-sys"
      :style="{ color: theme?.iconColor }"
      v-html="item.meta.icon"
    ></i>
    <span>{{ formatMenuTitle(item.meta.title) }}</span>
    <div class="badge" v-if="item.meta.showBadge"></div>
  </el-menu-item>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { AppRouteRecord } from '@/types/router'
  import { handleMenuJump } from '@/utils/navigation'
  import { formatMenuTitle } from '@/router/utils/utils'

  const props = defineProps({
    item: {
      type: Object as PropType<AppRouteRecord>,
      required: true
    },
    theme: {
      type: Object,
      default: () => ({})
    },
    isMobile: Boolean,
    level: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['close'])

  // 计算当前项是否有子菜单
  const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0
  })

  // 过滤后的子菜单项（不包含隐藏的）
  const filteredChildren = computed(() => {
    return props.item.children?.filter((child) => !child.meta.isHide) || []
  })

  const goPage = (item: AppRouteRecord) => {
    closeMenu()
    handleMenuJump(item)
  }

  const closeMenu = () => {
    emit('close')
  }
</script>

<style lang="scss" scoped>
  .el-sub-menu {
    padding: 0 !important;

    :deep(.el-sub-menu__title) {
      padding: 0 30px 0 15px !important;

      .el-sub-menu__icon-arrow {
        right: 10px !important;
      }
    }
  }

  .menu-icon {
    margin-right: 5px;
    font-size: 16px;
  }
</style>
