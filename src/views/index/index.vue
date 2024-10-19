<template>
  <div class="frame" :style="{ paddingLeft, paddingTop }">
    <!-- 左侧菜单 -->
    <menu-left v-if="menuType === MenuTypeEnum.LEFT"></menu-left>

    <!-- 搜索组件 -->
    <search></search>

    <!-- 顶栏 -->
    <top-bar>
      <template #default>
        <work-tab v-if="showWorkTab"></work-tab>
      </template>
    </top-bar>

    <!-- 内容区域 -->
    <div class="container">
      <router-view
        v-if="isRefresh && isOnline"
        v-slot="{ Component, route }"
        :style="{ minHeight }"
      >
        <transition :name="pageTransition" mode="out-in" appear>
          <keep-alive :max="10">
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
    <setting />
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

  // 网络状态
  const { isOnline } = useNetwork()

  // 获取菜单和设置信息的 store
  const settingStore = useSettingStore()
  const menuStore = useMenuStore()

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

  // 根据菜单是否打开来设置左侧填充宽度
  const paddingLeft = computed(() => {
    const width = menuOpen.value ? MenuWidth.OPEN : MenuWidth.CLOSE
    menuStore.setMenuWidth(width) // 更新菜单宽度
    return menuType.value === MenuTypeEnum.LEFT ? width : 0
  })

  // 根据是否显示工作标签来设置最小高度
  const minHeight = computed(() => `calc(100vh - ${showWorkTab.value ? 120 : 75}px)`)

  const paddingTop = computed(() => {
    return showWorkTab.value ? '110px' : '60px'
  })

  // 是否刷新页面的状态
  const isRefresh = ref(true)

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
    padding: 108px 0 15px;
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
        border-radius: 6px;
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
