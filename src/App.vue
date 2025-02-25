<template>
  <el-config-provider :size="elSize" :locale="locales[language]" :z-index="3000">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
  import { useUserStore } from './store/modules/user'
  import zh from 'element-plus/es/locale/lang/zh-cn'
  import en from 'element-plus/es/locale/lang/en'
  import { systemUpgrade } from './utils/upgrade'
  import { initState, saveUserData } from './utils/storage'
  import { UserService } from './api/usersApi'
  import { ApiStatus } from './utils/http/status'

  const userStore = useUserStore()
  const language = computed(() => userStore.language)
  const elSize = computed(() => (document.body.clientWidth >= 500 ? 'large' : 'default'))

  const locales = {
    zh: zh,
    en: en
  }

  onBeforeMount(() => {
    setBodyClass(true)
  })

  onMounted(() => {
    initState()
    saveUserData()
    setBodyClass(false)
    systemUpgrade()
    getUserInfo()
  })

  // 获取用户信息
  const getUserInfo = async () => {
    if (userStore.isLogin) {
      const userRes = await UserService.getUserInfo()
      if (userRes.code === ApiStatus.success) {
        userStore.setUserInfo(userRes.data)
      }
    }
  }

  // 提升暗黑主题下页面刷新视觉体验
  const setBodyClass = (addClass: boolean) => {
    let el = document.getElementsByTagName('body')[0]

    if (addClass) {
      el.setAttribute('class', 'theme-change')
    } else {
      setTimeout(() => {
        el.removeAttribute('class')
      }, 300)
    }
  }
</script>
