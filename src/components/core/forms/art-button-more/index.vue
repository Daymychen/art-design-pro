<!-- 更多按钮 -->
<template>
  <div class="btn-more">
    <ElDropdown v-if="hasAnyAuthItem">
      <ArtButtonTable type="more" :iconBgColor="!hasBackground ? 'transparent' : ''" />
      <template #dropdown>
        <ElDropdownMenu>
          <template v-for="item in list" :key="item.key">
            <ElDropdownItem
              v-if="!item.auth || hasAuth(item.auth)"
              :disabled="item.disabled"
              @click="handleClick(item)"
              class="custom-dropdown-item"
            >
              <div class="dropdown-item-content">
                <ElIcon
                  v-if="item.icon"
                  :size="15"
                  :style="{ color: item.iconColor || item.color, margin: 0 }"
                >
                  <component :is="item.icon" />
                </ElIcon>
                <span :style="{ color: item.color }">{{ item.label }}</span>
              </div>
            </ElDropdownItem>
          </template>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup lang="ts">
  import { useAuth } from '@/composables/useAuth'

  defineOptions({ name: 'ArtButtonMore' })

  const { hasAuth } = useAuth()

  export interface ButtonMoreItem {
    /** 按钮标识，可用于点击事件 */
    key: string | number
    /** 按钮文本 */
    label: string
    /** 是否禁用 */
    disabled?: boolean
    /** 权限标识 */
    auth?: string
    /** 图标组件 */
    icon?: any
    /** 文本颜色 */
    color?: string
    /** 图标颜色（优先级高于 color） */
    iconColor?: string
  }

  interface Props {
    /** 下拉项列表 */
    list: ButtonMoreItem[]
    /** 整体权限控制 */
    auth?: string
    /** 是否显示背景 */
    hasBackground?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    hasBackground: true
  })

  // 检查是否有任何有权限的 item
  const hasAnyAuthItem = computed(() => {
    return props.list.some((item) => !item.auth || hasAuth(item.auth))
  })

  const emit = defineEmits<{
    (e: 'click', item: ButtonMoreItem): void
  }>()

  const handleClick = (item: ButtonMoreItem) => {
    emit('click', item)
  }
</script>

<style lang="scss" scoped>
  .dropdown-item-content {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>
