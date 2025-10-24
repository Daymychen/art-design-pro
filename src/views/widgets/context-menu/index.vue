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
  import { computed, nextTick } from 'vue'
  import ArtMenuRight from '@/components/core/others/art-menu-right/index.vue'
  import type { MenuItemType } from '@/components/core/others/art-menu-right/index.vue'

  defineOptions({ name: 'TemplateContextMenu' })

  const menuRef = ref<InstanceType<typeof ArtMenuRight>>()
  const lastAction = ref('')

  /**
   * 右键菜单选项配置
   */
  const menuItems = computed((): MenuItemType[] => [
    {
      key: 'copy',
      label: '复制',
      icon: 'ri:file-copy-line'
    },
    {
      key: 'paste',
      label: '粘贴',
      icon: 'ri:capsule-line'
    },
    {
      key: 'cut',
      label: '剪切',
      icon: 'ri:clipboard-line',
      showLine: true
    },
    {
      key: 'export',
      label: '导出选项',
      icon: 'ri:export-line',
      children: [
        {
          key: 'exportExcel',
          label: '导出 Excel',
          icon: 'ri:file-excel-2-line'
        },
        {
          key: 'exportPdf',
          label: '导出 PDF',
          icon: 'ri:file-pdf-2-line'
        }
      ]
    },
    {
      key: 'edit',
      label: '编辑选项',
      icon: 'ri:edit-2-line',
      children: [
        {
          key: 'rename',
          label: '重命名'
        },
        {
          key: 'duplicate',
          label: '复制副本'
        }
      ]
    },
    {
      key: 'share',
      label: '分享',
      icon: 'ri:share-forward-line',
      showLine: true
    },
    {
      key: 'delete',
      label: '删除',
      icon: 'ri:delete-bin-line'
    },
    {
      key: 'disabled',
      label: '禁用选项',
      icon: 'ri:close-circle-line',
      disabled: true
    }
  ])

  /**
   * 处理菜单项选择
   * @param item 选中的菜单项
   */
  const handleSelect = (item: MenuItemType) => {
    lastAction.value = `${item.label} (${item.key})`
    ElMessage.success(`执行操作: ${item.label}`)
    console.log('选择了菜单项:', item)
  }

  /**
   * 显示右键菜单
   * @param e 鼠标事件
   */
  const showMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    nextTick(() => {
      menuRef.value?.show(e)
    })
  }

  /**
   * 菜单显示回调
   */
  const onMenuShow = () => {
    console.log('菜单显示')
  }

  /**
   * 菜单隐藏回调
   */
  const onMenuHide = () => {
    console.log('菜单隐藏')
  }
</script>
