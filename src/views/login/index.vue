<template>
  <div class="login">
    <div class="left-wrap">
      <div class="logo">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zhaopian-copy"></use>
        </svg>
        <h1 class="title">{{ systemName }}</h1>
      </div>
      <img class="left-bg" src="@imgs/login/lf_bg.png" />
      <img class="left-img" src="@imgs/login/lf_icon.svg" />
    </div>
    <div class="right-wrap">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zhaopian-copy"></use>
        </svg>
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3>登录</h3>
          <div style="margin-top: 30px">
            <span class="input-label">账号</span>
            <el-input placeholder="请输入账号" size="large" v-model.trim="username" />
          </div>
          <div style="margin-top: 15px">
            <span class="input-label">密码</span>
            <el-input
              placeholder="请输入密码"
              size="large"
              v-model.trim="password"
              type="password"
              autocomplete="off"
              @keyup.enter="login"
            />
          </div>

          <div style="margin-top: 30px">
            <el-button
              class="login-btn"
              size="large"
              type="primary"
              @click="login"
              :loading="loading"
            >
              登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SystemInfo } from '@/config/setting'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { HOME_PAGE } from '@/router'
  import { ApiStatus } from '@/utils/http/status'
  import axios from 'axios'

  const userStore = useUserStore()
  const router = useRouter()

  const systemName = SystemInfo.name
  const username = ref(SystemInfo.login.username)
  const password = ref(SystemInfo.login.password)
  const loading = ref(false)

  const login = async () => {
    if (!username.value) {
      ElMessage.error('请输入账号')
      return
    }

    if (!password.value) {
      ElMessage.error('请输入密码')
      return
    }

    loading.value = true

    const params = {
      username: username.value,
      password: password.value
    }

    try {
      // 模拟登录
      const res = await axios.post('/api/login', params)
      let { code, data } = res.data
      if (code === ApiStatus.success) {
        userStore.setUserInfo(data)
        userStore.setLoginStatus(true)
        router.push(HOME_PAGE)
      } else {
        ElMessage.error(res.data.message)
      }

      // 封装 axios 登录，替换掉 .env 中的 VITE_API_URL 为你的 api 地址
      // const res = await UserService.login(params);

      // if (res.code === ApiStatus.success) {
      //   const { token, data } = res;

      //   if (token) {
      //     const user = { ...data, token };
      //     userStore.setUserInfo(user);
      //     userStore.setLoginStatus(true);
      //     router.push(HOME_PAGE); // 登录成功后跳转到主页
      //   }
      // }
    } finally {
      loading.value = false // 无论成功还是失败，都停止加载
    }
  }
</script>

<style lang="scss" scoped>
  @import './index';
</style>
