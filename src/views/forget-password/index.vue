<template>
  <div class="login register">
    <div class="left-wrap">
      <left-view></left-view>
    </div>
    <div class="right-wrap">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconsys-zhaopian-copy"></use>
        </svg>
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>
          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">账号</span>
            <el-input
              :placeholder="$t('forgetPassword.placeholder')"
              size="large"
              v-model.trim="username"
            />
          </div>

          <div style="margin-top: 15px">
            <el-button
              class="login-btn"
              size="large"
              type="primary"
              @click="register"
              :loading="loading"
              v-ripple
            >
              {{ $t('forgetPassword.submitBtnText') }}
            </el-button>
          </div>

          <div style="margin-top: 15px">
            <el-button style="width: 100%; height: 46px" size="large" plain @click="toLogin">
              {{ $t('forgetPassword.backBtnText') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import LeftView from '@/components/Pages/Login/LeftView.vue'
  const router = useRouter()
  const showInputLabel = ref(false)

  const systemName = AppConfig.systemInfo.name
  const username = ref('')
  const loading = ref(false)

  const register = async () => {}

  const toLogin = () => {
    router.push('/login')
  }
</script>

<style lang="scss" scoped>
  @use '../login/index';
</style>
