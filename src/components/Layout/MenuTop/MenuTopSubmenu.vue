<template>
  <el-sub-menu v-if="isNotEmpty(item.children)" :index="item.path || item.title" :level="level">
    <template #title>
      <i class="menu-icon iconfont-sys" :style="{ color: theme?.iconColor }">{{ item.icon }}</i>
      <span>{{ getMenuTitle(item) }}</span>
    </template>
    <!-- 递归菜单 -->
    <MenuTopSubmenu
      v-for="child in item.children"
      :key="child.id"
      :item="child"
      @close="closeMenu"
      :level="level + 1"
      :theme="theme"
    />
  </el-sub-menu>

  <el-menu-item
    v-if="!isNotEmpty(item.children) && !item.noMenu"
    :index="item.path || item.title"
    @click="goPage(item)"
    :level-item="level + 1"
  >
    <template #title>
      <i class="menu-icon iconfont-sys">{{ item.icon }}</i>
      <span>{{ getMenuTitle(item) }}</span>
      <div class="badge" v-if="item.showBadge"></div>
    </template>
  </el-menu-item>
</template>

<script lang="ts" setup>
  import { router } from '@/router'
  import { MenuListType } from '@/types/menu'
  import { getMenuTitle } from '@/utils/menu'

  defineProps({
    item: {
      type: Object as PropType<MenuListType>,
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

  const goPage = (item: MenuListType) => {
    const isNewSite = item.path.indexOf('http') !== -1

    if (isNewSite) {
      window.open(item.path, '_blank')
      return
    }

    closeMenu()
    router.push(item.path)
  }

  const closeMenu = () => {
    emit('close')
  }

  const isNotEmpty = (children: MenuListType[] | undefined) => {
    return children && children.length > 0
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
