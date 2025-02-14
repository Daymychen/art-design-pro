<!-- 右键菜单 -->
<template>
  <div class="menu-right">
    <Transition name="context-menu" @before-enter="onBeforeEnter" @after-leave="onAfterLeave">
      <div v-show="visible" :style="menuStyle" class="context-menu">
        <ul class="menu-list">
          <template v-for="item in menuItems" :key="item.key">
            <!-- 普通菜单项 -->
            <li
              v-if="!item.children"
              class="menu-item"
              :class="{ 'is-disabled': item.disabled }"
              @click="handleMenuClick(item)"
            >
              <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
              <span class="menu-label">{{ item.label }}</span>
            </li>

            <!-- 子菜单 -->
            <li v-else class="menu-item submenu">
              <div class="submenu-title">
                <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
                <span class="menu-label">{{ item.label }}</span>
                <el-icon><ArrowRight /></el-icon>
              </div>
              <ul class="submenu-list">
                <li
                  v-for="child in item.children"
                  :key="child.key"
                  class="menu-item"
                  :class="{ 'is-disabled': child.disabled }"
                  @click="handleMenuClick(child)"
                >
                  <el-icon v-if="child.icon"><component :is="child.icon" /></el-icon>
                  <span class="menu-label">{{ child.label }}</span>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { CSSProperties } from 'vue'

  export interface MenuItemType {
    key: string
    label: string
    icon?: string
    disabled?: boolean
    children?: MenuItemType[]
    [key: string]: any
  }

  interface Props {
    menuItems: MenuItemType[]
  }

  defineProps<Props>()
  const emit = defineEmits<{
    (e: 'select', item: MenuItemType): void
  }>()

  const visible = ref(false)
  const position = ref({ x: 0, y: 0 })

  const menuStyle = computed(
    (): CSSProperties => ({
      position: 'fixed' as const,
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      zIndex: 2000
    })
  )

  const show = (e: MouseEvent) => {
    e.preventDefault()
    position.value = { x: e.clientX, y: e.clientY }
    visible.value = true

    // 添加一次性点击事件监听器来关闭菜单
    document.addEventListener('click', hide, { once: true })
  }

  const hide = () => {
    visible.value = false
  }

  const handleMenuClick = (item: MenuItemType) => {
    if (item.disabled) return
    emit('select', item)
    hide()
  }

  // 添加动画钩子函数
  const onBeforeEnter = (el: Element) => {
    ;(el as HTMLElement).style.transformOrigin = 'top left'
  }

  const onAfterLeave = () => {
    // 可以在这里添加退场后的清理逻辑
  }

  // 导出方法供父组件调用
  defineExpose({
    show,
    hide
  })
</script>

<style lang="scss" scoped>
  .menu-right {
    .context-menu {
      min-width: 120px;
      padding: 4px 0;
      background: var(--el-bg-color);
      border-radius: var(--el-border-radius-base);
      box-shadow: var(--el-box-shadow-light);

      .menu-list {
        padding: 0;
        padding: 5px;
        margin: 0;
        list-style: none;

        .menu-item {
          position: relative;
          display: flex;
          align-items: center;
          height: 32px;
          padding: 0 16px;
          font-size: 13px;
          color: var(--el-text-color-primary);
          cursor: pointer;
          border-radius: 4px;

          &:hover {
            background-color: rgba(var(--art-gray-200-rgb), 0.7);
          }

          .el-icon {
            margin-right: 8px;
            font-size: 16px;
            color: var(--art-gray-800);
          }

          .menu-label {
            color: var(--art-gray-800);
          }

          &.is-disabled {
            color: var(--el-text-color-disabled);
            cursor: not-allowed;
            background-color: transparent !important;

            .el-icon {
              color: var(--el-text-color-disabled) !important;
            }

            .menu-label {
              color: var(--el-text-color-disabled) !important;
            }
          }

          &.submenu {
            position: relative;

            &:hover {
              .submenu-list {
                display: block;
              }
            }

            .submenu-title {
              display: flex;
              align-items: center;
              width: 100%;

              .el-icon:last-child {
                margin-left: auto;
                font-size: 12px;
              }
            }

            .submenu-list {
              position: absolute;
              top: 0;
              left: 100%;
              display: none;
              min-width: 150px;
              padding: 4px 0;
              list-style: none;
              background: var(--el-bg-color);
              border-radius: var(--el-border-radius-base);
              box-shadow: var(--el-box-shadow-light);

              .menu-item {
                &:hover {
                  background-color: var(--el-menu-hover-bg-color);
                }
              }
            }
          }
        }
      }
    }

    // 添加动画相关样式
    .context-menu-enter-active,
    .context-menu-leave-active {
      transition: all 0.1s ease-out;
    }

    .context-menu-enter-from,
    .context-menu-leave-to {
      opacity: 0;
      transform: scale(0.9);
    }

    .context-menu-enter-to,
    .context-menu-leave-from {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
