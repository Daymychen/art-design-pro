<template>
  <div class="frame" :style="{ paddingLeft, paddingTop }">
    <!-- 左侧菜单 -->
    <menu-left v-if="showLeftMenu || isDualMenu"></menu-left>

    <!-- 搜索组件 -->
    <search></search>

    <!-- 锁屏组件 -->
    <lock-screen></lock-screen>

    <!-- 顶栏 -->
    <top-bar>
      <work-tab v-if="showWorkTab"></work-tab>
    </top-bar>

    <!-- 内容区域 -->
    <div class="container" :style="{ maxWidth: containerWidth }">
      <!-- 节日文本滚动 -->
      <festival-text-scroll></festival-text-scroll>

      <router-view
        v-if="isRefresh && isOnline"
        v-slot="{ Component, route }"
        :style="{ minHeight: containerMinHeight }"
      >
        <!-- 路由信息，方便开发者调试 -->
        <div v-if="isOpenRouteInfo === 'true'">
          {{ route.meta }}
        </div>
        <transition :name="pageTransition" mode="out-in" appear>
          <keep-alive :max="10" :exclude="keepAliveExclude">
            <component :is="Component" :key="route.path" v-if="route.meta.keepAlive" />
          </keep-alive>
        </transition>
        <transition :name="pageTransition" mode="out-in" appear>
          <component :is="Component" :key="route.path" v-if="!route.meta.keepAlive" />
        </transition>
      </router-view>

      <!-- 网络异常提示组件 -->
      <network v-else></network>
    </div>

    <!-- 个性化设置 -->
    <setting></setting>

    <!-- 聊天组件 -->
    <chat></chat>

    <!-- 烟花组件 -->
    <fireworks></fireworks>

    <!-- 水印组件 -->
    <Watermark :visible="watermarkVisible"></Watermark>
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/transition.scss'
  import { computed, ref, watch, nextTick } from 'vue'
  import MenuLeft from '@comps/Layout/MenuLeft/index.vue'
  import TopBar from '@comps/Layout/TopBar/index.vue'
  import WorkTab from '@comps/Layout/WorkTab/index.vue'
  import Setting from '@comps/Layout/Setting/index.vue'
  import { MenuWidth, MenuTypeEnum } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { useSettingStore } from '@/store/modules/setting'
  import { useWorktabStore } from '@/store/modules/worktab'
  import { useCommon } from '@/composables/useCommon'
  import { getTabConfig } from '@/utils/tabs'

  const { containerMinHeight } = useCommon()

  // 网络状态
  const { isOnline } = useNetwork()
  // 获取菜单和设置信息的 store
  const settingStore = useSettingStore()
  const menuStore = useMenuStore()
  const worktabStore = useWorktabStore()
  // 是否显示左侧菜单
  const showLeftMenu = computed(
    () => menuType.value === MenuTypeEnum.LEFT || menuType.value === MenuTypeEnum.TOP_LEFT
  )
  // 菜单是否打开
  const menuOpen = computed(() => settingStore.menuOpen)
  // 是否显示工作标签
  const showWorkTab = computed(() => settingStore.showWorkTab)
  // 是否需要刷新
  const refresh = computed(() => settingStore.refresh)
  // 页面动画
  const pageTransition = computed(() => settingStore.pageTransition)
  // 菜单类型
  const menuType = computed(() => settingStore.menuType)
  // 水印是否显示
  const watermarkVisible = computed(() => settingStore.watermarkVisible)
  // 是否是双列菜单
  const isDualMenu = computed(() => settingStore.menuType === MenuTypeEnum.DUAL_MENU)
  // 容器宽度
  const containerWidth = computed(() => settingStore.containerWidth)
  // keepAlive 排除的组件
  const keepAliveExclude = computed(() => worktabStore.keepAliveExclude)
  // 标签页风格
  const tabStyle = computed(() => settingStore.tabStyle)

  // 根据菜单是否打开来设置左侧填充宽度
  const paddingLeft = computed(() => {
    const width = menuOpen.value ? settingStore.getMenuOpenWidth : MenuWidth.CLOSE
    menuStore.setMenuWidth(width) // 更新菜单宽度

    // 双列菜单
    if (menuType.value === MenuTypeEnum.DUAL_MENU) {
      return `calc(${width} + 80px)`
    }
    return menuType.value !== MenuTypeEnum.TOP ? width : 0
  })

  // 计算顶部填充高度
  const paddingTop = computed(() => {
    const { openTop, closeTop } = getTabConfig(tabStyle.value)
    return `${showWorkTab.value ? openTop : closeTop}px`
  })

  // 是否刷新页面的状态
  const isRefresh = ref(true)

  // 是否开启路由信息
  const isOpenRouteInfo = import.meta.env.VITE_OPEN_ROUTE_INFO

  // 监听刷新状态变化并调用 reload 函数
  watch(refresh, () => {
    reload()
  })

  // 刷新页面
  const reload = () => {
    isRefresh.value = false
    nextTick(() => {
      isRefresh.value = true
    })
  }
</script>

<style lang="scss" scoped>
  .frame {
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background: var(--art-bg-color);
    transition: padding 0.3s ease-in-out;

    .container {
      box-sizing: border-box;
      width: calc(100% - 40px);
      margin: auto;

      // 子页面默认style
      :deep(.page-content) {
        position: relative;
        box-sizing: border-box;
        padding: 20px;
        overflow: hidden;
        background: var(--art-main-bg-color);
        border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
      }
    }
  }

  @media only screen and (max-width: $device-ipad) {
    .frame {
      width: 100%;
      min-height: 100vh;
      padding-left: 0 !important;
      overflow-y: scroll;

      .container {
        width: calc(100% - 20px);
      }
    }
  }

  @media only screen and (max-width: $device-phone) {
    .frame {
      .container {
        width: calc(100% - 32px);
      }
    }
  }
</style>
