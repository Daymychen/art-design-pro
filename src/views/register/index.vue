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
          <h3 class="title">创建账号</h3>
          <p class="sub-title">欢迎加入我们，请填写以下信息完成注册</p>
          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">账号</span>
            <el-input placeholder="请输入账号" size="large" v-model.trim="username" />
          </div>
          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">密码</span>
            <el-input
              placeholder="请输入密码"
              size="large"
              v-model.trim="password"
              type="password"
              radius="8px"
              autocomplete="off"
            />
          </div>

          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">确认密码</span>
            <el-input
              placeholder="请再次输入密码"
              size="large"
              v-model.trim="confirmPassword"
              type="password"
              radius="8px"
              autocomplete="off"
              @keyup.enter="register"
            />
          </div>

          <div class="privacy-policy">
            <el-checkbox v-model="rememberPassword">
              我同意
              <router-link to="/privacy-policy">《隐私协议》</router-link>
            </el-checkbox>
          </div>

          <div style="margin-top: 15px">
            <el-button
              class="register-btn"
              size="large"
              type="primary"
              @click="register"
              :loading="loading"
            >
              注册
            </el-button>
          </div>

          <div class="footer">
            <p>
              已有账号？
              <router-link to="/login">去登录</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SystemInfo } from '@/config/setting'
  import { ElMessage } from 'element-plus'

  const router = useRouter()
  const showInputLabel = ref(false)

  const systemName = SystemInfo.name
  const username = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const rememberPassword = ref(false)

  const register = async () => {
    if (!username.value) {
      ElMessage.error('请输入账号')
      return
    }

    if (!password.value) {
      ElMessage.error('请输入密码')
      return
    }

    if (password.value !== confirmPassword.value) {
      ElMessage.error('两次输入的密码不一致')
      return
    }

    if (!rememberPassword.value) {
      ElMessage.error('请同意隐私协议')
      return
    }

    loading.value = true

    setTimeout(() => {
      loading.value = false
      ElMessage.success('注册成功')
      toLogin()
    }, 1000)
  }

  const toLogin = () => {
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
</script>

<style lang="scss" scoped>
  @import '../login/index';
  @import './index';
</style>
