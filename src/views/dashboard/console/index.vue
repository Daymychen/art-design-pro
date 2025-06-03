<template>
  <div class="console">
    <CardList></CardList>

    <div class="column column2">
      <ActiveUser></ActiveUser>
      <SalesOverview></SalesOverview>
    </div>

    <div class="column column3">
      <NewUser></NewUser>
      <Dynamic></Dynamic>
      <TodoList></TodoList>
    </div>

    <div class="bottom-wrap art-custom-card">
      <div>
        <h2 class="box-title">关于项目</h2>
        <p>{{ systemName }} 是一款专注于用户体验和视觉设计的后台管理系统模版</p>
        <p>使用了 Vue3、TypeScript、Vite、Element Plus 等前沿技术</p>

        <div class="button-wrap">
          <div class="btn art-custom-card" @click="goPage(WEB_LINKS.DOCS)">
            <span>项目官网</span>
            <i class="iconfont-sys">&#xe703;</i>
          </div>
          <div class="btn art-custom-card" @click="goPage(WEB_LINKS.INTRODUCE)">
            <span>文档</span>
            <i class="iconfont-sys">&#xe703;</i>
          </div>
          <div class="btn art-custom-card" @click="goPage(WEB_LINKS.GITHUB_HOME)">
            <span>Github</span>
            <i class="iconfont-sys">&#xe703;</i>
          </div>
          <div class="btn art-custom-card" @click="goPage(WEB_LINKS.BLOG)">
            <span>博客</span>
            <i class="iconfont-sys">&#xe703;</i>
          </div>
        </div>
      </div>
      <img class="right-img" src="@imgs/draw/draw1.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import CardList from './widget/CardList.vue'
  import ActiveUser from './widget/ActiveUser.vue'
  import SalesOverview from './widget/SalesOverview.vue'
  import NewUser from './widget/NewUser.vue'
  import Dynamic from './widget/Dynamic.vue'
  import AppConfig from '@/config'
  import TodoList from './widget/TodoList.vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { WEB_LINKS } from '@/utils/links'
  import { useCommon } from '@/composables/useCommon'
  const settingStore = useSettingStore()
  const currentGlopTheme = computed(() => settingStore.systemThemeType)

  // 系统主题风格变化时，刷新页面重写渲染 Echarts
  watch(currentGlopTheme, () => {
    settingStore.reload()
  })

  const systemName = AppConfig.systemInfo.name
  useCommon().scrollToTop()

  const goPage = (url: string) => {
    // 跳转到新页面
    window.open(url)
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>
