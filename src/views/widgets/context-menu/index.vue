<template>
  <div class="page-content">
    <ElButton @contextmenu.prevent="showMenu"> 右键触发菜单 </ElButton>

    <!-- 右键菜单组件 -->
    <ArtMenuRight
      ref="menuRef"
      :menu-items="menuItems"
      :menu-width="180"
      :submenu-width="140"
      :border-radius="10"
      @select="handleSelect"
      @show="onMenuShow"
      @hide="onMenuHide"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import ArtMenuRight from '@/components/core/others/art-menu-right/index.vue'
  import type { MenuItemType } from '@/components/core/others/art-menu-right/index.vue'
  import { ElMessage } from 'element-plus'

  const menuRef = ref<InstanceType<typeof ArtMenuRight>>()
  const lastAction = ref('')

  // 右键菜单选项
  const menuItems = computed((): MenuItemType[] => [
    {
      key: 'copy',
      label: '复制',
      icon: '&#xe7b2;'
    },
    {
      key: 'paste',
      label: '粘贴',
      icon: '&#xe70b;'
    },
    {
      key: 'cut',
      label: '剪切',
      icon: '&#xe7b8;',
      showLine: true
    },
    {
      key: 'export',
      label: '导出选项',
      icon: '&#xe78b;',
      children: [
        {
          key: 'exportExcel',
          label: '导出 Excel',
          icon: '&#xe604;'
        },
        {
          key: 'exportPdf',
          label: '导出 PDF',
          icon: '&#xe89e;'
        }
      ]
    },
    {
      key: 'edit',
      label: '编辑选项',
      icon: '&#xe706;',
      children: [
        {
          key: 'rename',
          label: '重命名',
          icon: '&#xe607;'
        },
        {
          key: 'duplicate',
          label: '复制副本',
          icon: '&#xe608;'
        }
      ]
    },
    {
      key: 'share',
      label: '分享',
      icon: '&#xe73b;',
      showLine: true
    },
    {
      key: 'delete',
      label: '删除',
      icon: '&#xe850;'
    },
    {
      key: 'disabled',
      label: '禁用选项',
      icon: '&#xe619;',
      disabled: true
    }
  ])

  const handleSelect = (item: MenuItemType) => {
    lastAction.value = `${item.label} (${item.key})`
    ElMessage.success(`执行操作: ${item.label}`)
    console.log('选择了菜单项:', item)
  }

  const showMenu = (e: MouseEvent) => {
    console.log('触发右键菜单', e)
    // 确保阻止默认行为
    e.preventDefault()
    e.stopPropagation()

    // 延迟一帧执行，确保事件处理完成
    nextTick(() => {
      menuRef.value?.show(e)
    })
  }

  const onMenuShow = () => {
    console.log('菜单显示')
  }

  const onMenuHide = () => {
    console.log('菜单隐藏')
  }
</script>
