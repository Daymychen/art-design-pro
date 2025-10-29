<!-- 右键菜单 -->
<template>
  <div class="menu-right">
    <Transition name="context-menu" @before-enter="onBeforeEnter" @after-leave="onAfterLeave">
      <div
        v-show="visible"
        :style="menuStyle"
        class="context-menu art-card-xs !shadow-xl min-w-[var(--menu-width)] w-[var(--menu-width)]"
      >
        <ul class="menu-list m-0 list-none" :style="menuListStyle">
          <template v-for="item in menuItems" :key="item.key">
            <!-- 普通菜单项 -->
            <li
              v-if="!item.children"
              class="menu-item relative flex-c c-p select-none rounded text-xs transition-colors duration-150 hover:bg-g-200"
              :class="{ 'is-disabled': item.disabled, 'has-line': item.showLine }"
              :style="menuItemStyle"
              @click="handleMenuClick(item)"
            >
              <ArtSvgIcon
                v-if="item.icon"
                class="mr-2 shrink-0 text-base text-g-800"
                :icon="item.icon"
              />
              <span
                class="menu-label flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-g-800"
                >{{ item.label }}</span
              >
            </li>

            <!-- 子菜单 -->
            <li
              v-else
              class="menu-item submenu relative flex-c c-p select-none rounded text-xs transition-colors duration-150 hover:bg-g-200"
              :style="menuItemStyle"
            >
              <div class="submenu-title flex-c w-full">
                <ArtSvgIcon
                  v-if="item.icon"
                  class="mr-2 shrink-0 text-base text-g-800"
                  :icon="item.icon"
                />
                <span
                  class="menu-label flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-g-800"
                  >{{ item.label }}</span
                >
                <ArtSvgIcon
                  icon="ri:arrow-right-s-line"
                  class="ubmenu-arrow ml-auto mr-0 text-base text-g-500 transition-transform duration-150"
                />
              </div>
              <ul
                class="submenu-list art-card-xs absolute left-full top-0 z-[2001] hidden w-max min-w-max list-none !shadow-xl"
                :style="submenuListStyle"
              >
                <li
                  v-for="child in item.children"
                  :key="child.key"
                  class="menu-item relative mx-1.5 flex-c c-p select-none rounded text-xs transition-colors duration-150 hover:bg-g-200"
                  :class="{ 'is-disabled': child.disabled, 'has-line': child.showLine }"
                  :style="menuItemStyle"
                  @click="handleMenuClick(child)"
                >
                  <ArtSvgIcon
                    v-if="child.icon"
                    class="r-2 shrink-0 text-base text-g-800 mr-1"
                    :icon="child.icon"
                  />
                  <span
                    class="menu-label flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-g-800"
                    >{{ child.label }}</span
                  >
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
  import type { CSSProperties } from 'vue'

  defineOptions({ name: 'ArtMenuRight' })

  export interface MenuItemType {
    /** 菜单项唯一标识 */
    key: string
    /** 菜单项标签 */
    label: string
    /** 菜单项图标 */
    icon?: string
    /** 菜单项是否禁用 */
    disabled?: boolean
    /** 菜单项是否显示分割线 */
    showLine?: boolean
    /** 子菜单 */
    children?: MenuItemType[]
    [key: string]: any
  }

  interface Props {
    menuItems: MenuItemType[]
    /** 菜单宽度 */
    menuWidth?: number
    /** 子菜单宽度 */
    submenuWidth?: number
    /** 菜单项高度 */
    itemHeight?: number
    /** 边界距离 */
    boundaryDistance?: number
    /** 菜单内边距 */
    menuPadding?: number
    /** 菜单项水平内边距 */
    itemPaddingX?: number
    /** 菜单圆角 */
    borderRadius?: number
    /** 动画持续时间 */
    animationDuration?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    menuWidth: 120,
    submenuWidth: 150,
    itemHeight: 32,
    boundaryDistance: 10,
    menuPadding: 5,
    itemPaddingX: 6,
    borderRadius: 6,
    animationDuration: 100
  })

  const emit = defineEmits<{
    (e: 'select', item: MenuItemType): void
    (e: 'show'): void
    (e: 'hide'): void
  }>()

  const visible = ref(false)
  const position = ref({ x: 0, y: 0 })

  // 用于清理定时器和事件监听器
  let showTimer: number | null = null
  let eventListenersAdded = false

  // 计算菜单样式
  const menuStyle = computed(
    (): CSSProperties => ({
      position: 'fixed' as const,
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      zIndex: 2000,
      width: `${props.menuWidth}px`
    })
  )

  // 计算菜单列表样式
  const menuListStyle = computed(
    (): CSSProperties => ({
      padding: `${props.menuPadding}px`
    })
  )

  // 计算菜单项样式
  const menuItemStyle = computed(
    (): CSSProperties => ({
      height: `${props.itemHeight}px`,
      padding: `0 ${props.itemPaddingX}px`,
      borderRadius: '4px'
    })
  )

  // 计算子菜单列表样式
  const submenuListStyle = computed(
    (): CSSProperties => ({
      minWidth: `${props.submenuWidth}px`,
      padding: `${props.menuPadding}px 0`,
      borderRadius: `${props.borderRadius}px`
    })
  )

  // 计算菜单高度（用于边界检测）
  const calculateMenuHeight = (): number => {
    let totalHeight = props.menuPadding * 2 // 上下内边距

    props.menuItems.forEach((item) => {
      totalHeight += props.itemHeight
      if (item.showLine) {
        totalHeight += 10 // 分割线额外高度
      }
    })

    return totalHeight
  }

  // 优化的位置计算函数
  const calculatePosition = (e: MouseEvent) => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const menuHeight = calculateMenuHeight()

    let x = e.clientX
    let y = e.clientY

    // 检查右边界 - 优先显示在鼠标右侧，如果空间不足则显示在左侧
    if (x + props.menuWidth > screenWidth - props.boundaryDistance) {
      x = Math.max(props.boundaryDistance, x - props.menuWidth)
    }

    // 检查下边界 - 优先显示在鼠标下方，如果空间不足则向上调整
    if (y + menuHeight > screenHeight - props.boundaryDistance) {
      y = Math.max(props.boundaryDistance, screenHeight - menuHeight - props.boundaryDistance)
    }

    // 确保不会超出边界
    x = Math.max(
      props.boundaryDistance,
      Math.min(x, screenWidth - props.menuWidth - props.boundaryDistance)
    )
    y = Math.max(
      props.boundaryDistance,
      Math.min(y, screenHeight - menuHeight - props.boundaryDistance)
    )

    return { x, y }
  }

  // 添加事件监听器
  const addEventListeners = () => {
    if (eventListenersAdded) return

    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('contextmenu', handleDocumentContextmenu)
    document.addEventListener('keydown', handleKeydown)
    eventListenersAdded = true
  }

  // 移除事件监听器
  const removeEventListeners = () => {
    if (!eventListenersAdded) return

    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('contextmenu', handleDocumentContextmenu)
    document.removeEventListener('keydown', handleKeydown)
    eventListenersAdded = false
  }

  // 处理文档点击事件
  const handleDocumentClick = (e: Event) => {
    // 检查点击是否在菜单内部
    const target = e.target as Element
    const menuElement = document.querySelector('.context-menu')
    if (menuElement && menuElement.contains(target)) {
      return
    }
    hide()
  }

  // 处理文档右键事件
  const handleDocumentContextmenu = () => {
    hide()
  }

  // 处理键盘事件
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hide()
    }
  }

  const show = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // 清理之前的定时器
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }

    // 计算位置
    position.value = calculatePosition(e)
    visible.value = true

    emit('show')

    // 延迟添加事件监听器，避免立即触发关闭
    showTimer = window.setTimeout(() => {
      if (visible.value) {
        addEventListeners()
      }
      showTimer = null
    }, 50) // 减少延迟时间，提升响应性
  }

  const hide = () => {
    if (!visible.value) return

    visible.value = false
    emit('hide')

    // 清理定时器
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }

    // 移除事件监听器
    removeEventListeners()
  }

  const handleMenuClick = (item: MenuItemType) => {
    if (item.disabled) return
    emit('select', item)
    hide()
  }

  // 动画钩子函数
  const onBeforeEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.transformOrigin = 'top left'
  }

  const onAfterLeave = () => {
    // 确保清理所有资源
    removeEventListeners()
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }
  }

  // 组件卸载时清理资源
  onUnmounted(() => {
    removeEventListeners()
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }
  })

  // 导出方法供父组件调用
  defineExpose({
    show,
    hide,
    visible: computed(() => visible.value)
  })
</script>

<style scoped>
  .menu-right {
    --menu-width: v-bind('props.menuWidth + "px"');
    --border-radius: v-bind('props.borderRadius + "px"');
  }

  .menu-item.has-line {
    margin-bottom: 10px;
  }

  .menu-item.has-line::after {
    position: absolute;
    right: 0;
    bottom: -5px;
    left: 0;
    height: 1px;
    content: '';
    background-color: var(--art-gray-300);
  }

  .menu-item.is-disabled {
    color: var(--el-text-color-disabled);
    cursor: not-allowed;
  }

  .menu-item.is-disabled:hover {
    background-color: transparent !important;
  }

  .menu-item.is-disabled i:not(.submenu-arrow),
  .menu-item.is-disabled :deep(svg) {
    color: var(--el-text-color-disabled) !important;
  }

  .menu-item.is-disabled .menu-label {
    color: var(--el-text-color-disabled) !important;
  }

  .menu-item.submenu:hover .submenu-list {
    display: block;
  }

  .menu-item.submenu:hover .submenu-title .submenu-arrow {
    transform: rotate(90deg);
  }

  /* 动画样式 */
  .context-menu-enter-active,
  .context-menu-leave-active {
    transition: all v-bind('props.animationDuration + "ms"') ease-out;
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
</style>
