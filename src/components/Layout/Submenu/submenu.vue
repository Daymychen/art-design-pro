<template>
  <template v-for="item in list" :key="item.id">
    <el-sub-menu
      v-if="isNotEmpty(item.children)"
      :index="item.path || item.meta.title"
      :level="level"
    >
      <template #title>
        <i
          class="menu-icon iconfont-sys"
          :style="{ color: theme?.iconColor }"
          v-html="item.meta.icon"
        ></i>
        <span class="menu-name">{{ getMenuTitle(item) }}</span>
        <div class="badge" style="right: 35px" v-if="item.meta.showBadge"></div>
      </template>
      <!-- 递归菜单 -->
      <submenu :list="item.children" :isMobile="isMobile" @close="closeMenu" :level="level + 1" />
    </el-sub-menu>

    <el-menu-item
      v-if="!isNotEmpty(item.children) && !item.meta.isHide"
      :index="item.path || item.meta.title"
      @click="goPage(item)"
      :level-item="level + 1"
    >
      <template #title>
        <i class="menu-icon iconfont-sys" v-html="item.meta.icon"></i>
        <span class="menu-name">{{ getMenuTitle(item) }}</span>
        <div class="badge" v-if="item.meta.showBadge"></div>
        <div class="text-badge" v-if="item.meta.showTextBadge">
          <small class="custom-text">{{ item.meta.showTextBadge }}</small>
        </div>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
  import { router } from '@/router'
  import { MenuListType } from '@/types/menu'
  import { getMenuTitle, openLink } from '@/utils/menu'

  defineProps({
    title: {
      type: String,
      default: ''
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
    let { link } = item.meta

    // 打开链接
    if (link) {
      openLink(link, item.meta.isIframe)
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
