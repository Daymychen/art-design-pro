<template>
  <ElSubMenu v-if="hasChildren" :index="item.path || item.meta.title" class="!p-0">
    <template #title>
      <ArtSvgIcon :icon="item.meta.icon" :color="theme?.iconColor" class="mr-1 text-lg" />
      <span class="text-md">{{ formatMenuTitle(item.meta.title) }}</span>
      <div v-if="item.meta.showBadge" class="art-badge art-badge-horizontal" />
      <div v-if="item.meta.showTextBadge" class="art-text-badge">
        {{ item.meta.showTextBadge }}
      </div>
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
  </ElSubMenu>

  <ElMenuItem
    v-else-if="!item.meta.isHide"
    :index="item.path || item.meta.title"
    @click="goPage(item)"
  >
    <ArtSvgIcon
      :icon="item.meta.icon"
      :color="theme?.iconColor"
      class="mr-1 text-lg"
      :style="{ color: theme.iconColor }"
    />
    <span class="text-md">{{ formatMenuTitle(item.meta.title) }}</span>
    <div
      v-if="item.meta.showBadge"
      class="art-badge"
      :style="{ right: level === 0 ? '10px' : '20px' }"
    />
    <div v-if="item.meta.showTextBadge && level !== 0" class="art-text-badge">
      {{ item.meta.showTextBadge }}
    </div>
  </ElMenuItem>
</template>

<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { AppRouteRecord } from '@/types/router'
  import { handleMenuJump } from '@/utils/navigation'
  import { formatMenuTitle } from '@/utils/router'

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

  // 过滤后的子菜单项（不包含隐藏的）
  const filteredChildren = computed(() => {
    return props.item.children?.filter((child) => !child.meta.isHide) || []
  })

  // 计算当前项是否有可见的子菜单
  const hasChildren = computed(() => {
    return filteredChildren.value.length > 0
  })

  const goPage = (item: AppRouteRecord) => {
    closeMenu()
    handleMenuJump(item)
  }

  const closeMenu = () => {
    emit('close')
  }
</script>

<style scoped>
  :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
    right: 10px !important;
  }
</style>
