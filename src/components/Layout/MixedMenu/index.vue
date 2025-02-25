<template>
  <div class="mixed-top-menu">
    <div class="scroll-btn left" v-show="showLeftArrow" @click="scroll('left')">
      <el-icon><ArrowLeft /></el-icon>
    </div>

    <el-scrollbar
      ref="scrollbarRef"
      wrap-class="scrollbar-wrapper"
      :horizontal="true"
      @scroll="handleScroll"
    >
      <div class="scroll-bar">
        <template v-for="item in list" :key="item.meta.title">
          <div
            class="item"
            :class="{ active: isActive(item) }"
            @click="handleMenuJump(item, true)"
            v-if="!item.meta.isHide"
          >
            <i class="iconfont-sys" v-html="item.meta.icon"></i>
            <span>{{ formatMenuTitle(item.meta.title) }}</span>
          </div>
        </template>
      </div>
    </el-scrollbar>

    <div class="scroll-btn right" v-show="showRightArrow" @click="scroll('right')">
      <el-icon><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuListType } from '@/types/menu'
  const route = useRoute()
  import { ref, onMounted } from 'vue'
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
  import { formatMenuTitle } from '@/utils/menu'
  import { handleMenuJump } from '@/utils/jump'

  const settingStore = useSettingStore()
  const menuopenwidth = computed(() => settingStore.getMenuOpenWidth)

  defineProps({
    list: {
      type: [Array] as PropType<MenuListType[]>,
      default: () => []
    }
  })

  const isActive = (item: MenuListType): boolean => {
    const currentPath = route.path

    if (item.children?.length) {
      return item.children.some((child) => {
        if (child.children?.length) {
          return isActive(child)
        }
        return child.path === currentPath
      })
    }

    return item.path === currentPath
  }

  const scrollbarRef = ref()
  const showLeftArrow = ref(false)
  const showRightArrow = ref(false)

  const handleScroll = () => {
    if (!scrollbarRef.value) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollbarRef.value.wrapRef
    showLeftArrow.value = scrollLeft > 0
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollbarRef.value) return

    const scrollDistance = 200
    const currentScroll = scrollbarRef.value.wrapRef.scrollLeft
    const targetScroll =
      direction === 'left' ? currentScroll - scrollDistance : currentScroll + scrollDistance

    scrollbarRef.value.wrapRef.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  onMounted(() => {
    handleScroll()
  })
</script>

<style lang="scss" scoped>
  .mixed-top-menu {
    position: relative;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    overflow: hidden;

    :deep(.el-scrollbar__bar.is-horizontal) {
      bottom: 5px;
      display: none;
      height: 2px;
    }

    :deep(.scrollbar-wrapper) {
      width: calc(60vw - v-bind(menuopenwidth));
      margin: 0 30px;
    }

    .scroll-bar {
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      flex-wrap: nowrap;
      align-items: center;
      height: 60px;
      white-space: nowrap;

      .item {
        position: relative;
        height: 40px;
        padding: 0 12px;
        font-size: 14px;
        line-height: 40px;
        cursor: pointer;
        border-radius: 6px;

        i {
          margin-right: 5px;
          font-size: 15px;
        }

        &:hover {
          color: var(--main-color);
        }

        &.active {
          color: var(--main-color);
          background-color: var(--main-bg-color);

          &::after {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            margin: auto;
            content: '';
            background-color: var(--main-color);
          }
        }
      }
    }

    .scroll-btn {
      position: absolute;
      top: 50%;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      cursor: pointer;
      transform: translateY(-50%);

      &:hover {
        color: var(--main-color);
      }

      &.left {
        left: 0;
      }

      &.right {
        right: 0;
      }
    }
  }

  @media (max-width: $device-notebook) {
    .mixed-top-menu {
      :deep(.scrollbar-wrapper) {
        width: calc(48vw - v-bind(menuopenwidth));
        margin: 0 30px;
      }
    }
  }
</style>
