<template>
  <div class="page-content">
    <el-button @contextmenu.prevent="(e: MouseEvent) => showMenu(e)">右键触发菜单</el-button>
    <MenuRight ref="menuRef" :menu-items="menuItems" @select="handleSelect" />
  </div>
</template>

<script setup lang="ts">
  import MenuRight, { MenuItemType } from '@/components/Widgets/MenuRight.vue'
  import { ref } from 'vue'

  const menuRef = ref()

  // 右键菜单选项（图标为Element Plus图标）
  const menuItems = computed(() => [
    {
      key: 'export',
      label: '导出 Excel',
      icon: 'Download'
    },
    {
      key: 'exportPdf',
      label: '导出 PDF',
      icon: 'Folder'
    },
    {
      key: 'disabled',
      label: '禁用选项',
      icon: 'CloseBold',
      disabled: true
    }
  ])

  const handleSelect = (item: MenuItemType) => {
    console.log(item.key)
  }

  const showMenu = (e: MouseEvent) => {
    menuRef.value.show(e)
  }
</script>
