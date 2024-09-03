<template>
  <div class="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadList" :key="index">
        <span>{{ getLocaleMenuTitle(item) }}</span>
        <i v-if="index !== breadList.length - 1">/</i>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { LanguageEnum } from '@/enums/appEnum'
  import { useUserStore } from '@/store/modules/user'
  import { RouteLocationMatched } from 'vue-router'

  const route = useRoute()
  const breadList: any = ref([])

  const isHome = (route: RouteLocationMatched) => {
    return route.name === '/'
  }

  const getBreadcrumb = () => {
    let { matched } = route
    let list: any = []

    //如果不是首页
    if (!isHome(matched[0])) {
      matched.map((item) => {
        let { path, meta } = item
        list.push({
          path,
          meta
        })
      })
    }
    breadList.value = list
  }

  watch(
    () => route.path,
    () => {
      // console.log(route.meta)
      getBreadcrumb()
    },
    {
      immediate: true
    }
  )

  const userStore = useUserStore()
  const language = computed(() => userStore.language)
  const getLocaleMenuTitle = (item: any) => {
    return language.value === LanguageEnum.ZH ? item.meta.title : item.meta.title_en
  }
</script>

<style lang="scss" scoped>
  @import './style';
</style>
