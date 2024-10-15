<template>
  <div class="worktab">
    <div class="scroll-view" ref="scrollRef">
      <ul
        class="tabs"
        ref="tabsRef"
        :style="{ transform: `translateX(${translateX}px)`, transition: `${transition}` }"
      >
        <li
          v-for="(item, index) in list"
          :key="item.path"
          :ref="item.path"
          :class="{ 'activ-tab': item.path === activeTab }"
          :id="`scroll-li-${index}`"
          @click="clickTab(item.path)"
        >
          {{ getMenuTitle(item) }}
          <el-icon v-if="index !== 0" @click.stop="closeWorktab('current', item.path)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>

    <div class="right">
      <el-dropdown @command="closeWorktab">
        <el-icon class="btn">
          <ArrowDown />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="ArrowLeft" command="left">
              <span>{{ $t('worktab.btn[0]') }}</span>
            </el-dropdown-item>
            <el-dropdown-item :icon="ArrowRight" command="right">
              <span>{{ $t('worktab.btn[1]') }}</span>
            </el-dropdown-item>
            <el-dropdown-item :icon="Close" command="other">
              <span>{{ $t('worktab.btn[2]') }}</span>
            </el-dropdown-item>
            <el-dropdown-item :icon="CircleClose" command="all">
              <span>{{ $t('worktab.btn[3]') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useWorktabStore } from '@/store/modules/worktab'
  import { ArrowDown, ArrowLeft, ArrowRight, Close, CircleClose } from '@element-plus/icons-vue'
  import { useUserStore } from '@/store/modules/user'
  import { getMenuTitle } from '@/utils/menu'
  import { ElMessage } from 'element-plus'
  import { useThrottleFn } from '@vueuse/core'
  import EmojiText from '@/utils/emojo'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const store = useWorktabStore()
  const list = computed(() => store.opened)
  const route = useRoute()
  const router = useRouter()
  const { currentRoute } = router
  const translateX = ref(0)
  const activeTab = computed(() => currentRoute.value.path)
  const transition = ref('')
  const scrollRef = ref<HTMLElement | null>(null)
  const tabsRef = ref<HTMLElement | null>(null)
  const userStore = useUserStore()

  let startX = 0
  let currentX = 0

  // 初始化 DOM 元素
  onMounted(() => {
    listenerScroll()
    addTouchListeners()
    worktabAutoPosition()
  })

  // 监听路由变化
  watch(
    () => currentRoute.value,
    () => {
      setTransition()
      worktabAutoPosition()
    }
  )

  // 切换语言后自动定位
  watch(
    () => userStore.language,
    () => {
      translateX.value = 0
      nextTick(() => {
        worktabAutoPosition()
      })
    }
  )

  const clickTab = (path: string) => {
    router.push(path)
  }

  const setTransition = () => {
    transition.value = 'transform 0.5s ease-in-out'

    setTimeout(() => {
      transition.value = ''
    }, 300)
  }

  // hover 滑动定位
  const listenerScroll = () => {
    const xMax = 0

    if (tabsRef.value) {
      tabsRef.value.addEventListener(
        'wheel',
        (event) => {
          if (scrollRef.value && tabsRef.value) {
            // 检测滚动方向
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
              throttledMessage(`${t('worktab.tips[0]')} ${EmojiText[200]}`)
              event.preventDefault()
              return
            }

            const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth

            event.preventDefault()
            if (tabsRef.value.offsetWidth <= scrollRef.value.offsetWidth) return
            translateX.value = Math.min(Math.max(translateX.value - event.deltaY, xMin), xMax)
          }
        },
        { passive: false }
      )
    }
  }

  const throttledMessage = useThrottleFn((message: string) => {
    ElMessage({ message, type: 'warning' })
  }, 3000)

  // 移动端添加触摸事件监听
  const addTouchListeners = () => {
    if (tabsRef.value) {
      tabsRef.value.addEventListener('touchstart', handleTouchStart)
      tabsRef.value.addEventListener('touchmove', handleTouchMove)
      tabsRef.value.addEventListener('touchend', handleTouchEnd)
    }
  }

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!scrollRef.value || !tabsRef.value) return

    currentX = event.touches[0].clientX
    const deltaX = currentX - startX
    const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth

    translateX.value = Math.min(Math.max(translateX.value + deltaX, xMin), 0)
    startX = currentX
  }

  const handleTouchEnd = () => {
    setTransition()
  }

  const getCurTabIndex = () => {
    return list.value.findIndex((tab) => tab.path === currentRoute.value.path)
  }

  const getCurTabEl = () => {
    return document.getElementById(`scroll-li-${getCurTabIndex()}`) as HTMLElement
  }

  const worktabAutoPosition = () => {
    if (!scrollRef.value || !tabsRef.value) return

    const scrollWidth = scrollRef.value.offsetWidth
    const ulWidth = tabsRef.value.offsetWidth

    const curTabEl = getCurTabEl()

    if (!curTabEl) {
      // 如果当前 tab 元素不存在，直接返回
      return
    }

    const { offsetLeft, clientWidth } = curTabEl
    const curTabRight = offsetLeft + clientWidth
    const targetLeft = scrollWidth - curTabRight

    if (
      (offsetLeft > Math.abs(translateX.value) && curTabRight <= scrollWidth) ||
      (translateX.value < targetLeft && targetLeft < 0)
    )
      return

    requestAnimationFrame(() => {
      if (curTabRight > scrollWidth) {
        translateX.value = Math.max(targetLeft - 6, scrollWidth - ulWidth)
      } else if (offsetLeft < Math.abs(translateX.value)) {
        translateX.value = -offsetLeft
      }
    })
  }

  const worktabClosePosition = () => {
    if (!scrollRef.value || !tabsRef.value) return

    const { offsetLeft, clientWidth } = getCurTabEl()
    const scrollWidth = scrollRef.value.offsetWidth
    const ulWidth = tabsRef.value.offsetWidth
    const curTabLeft = offsetLeft + clientWidth

    requestAnimationFrame(() => {
      translateX.value = curTabLeft > scrollWidth ? scrollWidth - ulWidth : 0
    })
  }

  const closeWorktab = (type: string, tabPath: string) => {
    let path = typeof tabPath === 'string' ? tabPath : route.path

    switch (type) {
      case 'current':
        store.remove(path, router)
        break
      case 'left':
        store.removeLeft(path)
        break
      case 'right':
        store.removeRight(path)
        break
      case 'other':
        store.removeOther(path)
        break
      case 'all':
        store.removeAll(path, router)
        break
    }

    setTimeout(() => {
      worktabClosePosition()
    }, 100)
  }
</script>

<style lang="scss" scoped>
  @import './style';
</style>
