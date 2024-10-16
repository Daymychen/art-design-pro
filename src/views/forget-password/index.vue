<template>
  <div class="login register">
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
          <h3 class="title">忘记密码？</h3>
          <p class="sub-title">输入您的电子邮件来重置您的密码</p>
          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">账号</span>
            <el-input placeholder="请输入电子邮件" size="large" v-model.trim="username" />
          </div>

          <div style="margin-top: 15px">
            <el-button
              class="login-btn"
              size="large"
              type="primary"
              @click="register"
              :loading="loading"
            >
              提交
            </el-button>
          </div>

          <div style="margin-top: 15px">
            <el-button style="width: 100%" size="large" plain @click="toLogin"> 返回 </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SystemInfo } from '@/config/setting'

  const router = useRouter()
  const showInputLabel = ref(false)

  const systemName = SystemInfo.name
  const username = ref('')
  const loading = ref(false)

  const register = async () => {}

  const toLogin = () => {
    router.push('/login')
  }
</script>

<style lang="scss" scoped>
  @import '../login/index';
</style>
