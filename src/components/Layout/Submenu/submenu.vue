<template>
  <template v-for="item in list" :key="item.id">
    <el-sub-menu v-if="isNotEmpty(item.children)" :index="item.path || item.title" :level="level">
      <template #title>
        <i class="iconfont-sys" :style="{ color: theme?.iconColor }">{{ item.icon }}</i>
        <span>{{ getMenuTitle(item) }}</span>
        <div class="badge" style="right: 35px" v-if="item.showBadge"></div>
      </template>
      <!-- 递归菜单 -->
      <submenu :list="item.children" :isMobile="isMobile" @close="closeMenu" :level="level + 1" />
    </el-sub-menu>

    <el-menu-item
      v-if="!isNotEmpty(item.children) && !item.noMenu"
      :index="item.path || item.title"
      @click="goPage(item)"
      :level-item="level + 1"
    >
      <template #title>
        <i class="iconfont-sys">{{ item.icon }}</i>
        <span>{{ getMenuTitle(item) }}</span>
        <div class="badge" v-if="item.showBadge"></div>
        <div class="text-badge" v-if="item.showTextBadge">
          <small class="custom-text">{{ item.showTextBadge }}</small>
        </div>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
  import { router } from '@/router'
  import { MenuListType } from '@/types/menu'
  import { getMenuTitle } from '@/utils/menu'

  defineProps({
    title: {
      type: String,
      default: '666'
    },
    list: {
      type: [Array] as PropType<MenuListType[]>,
      default: () => []
    },
    theme: {
      type: Object,
      default: () => {}
    },
    isMobile: Boolean,
    level: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['close'])

  const goPage = (item: MenuListType) => {
    let isNewSite = item.path.indexOf('http') !== -1 ? true : false

    // 打开新窗口
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
