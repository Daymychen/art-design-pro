<template>
  <div class="login">
    <div class="left-wrap">
      <LoginLeftView></LoginLeftView>
    </div>
    <div class="right-wrap">
      <div class="top-right-wrap">
        <div class="btn theme-btn" @click="toggleTheme">
          <i class="iconfont-sys">
            {{ isDark ? '&#xe6b5;' : '&#xe725;' }}
          </i>
        </div>
        <el-dropdown @command="changeLanguage" popper-class="langDropDownStyle">
          <div class="btn language-btn">
            <i class="iconfont-sys icon-language">&#xe611;</i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <div v-for="lang in languageOptions" :key="lang.value" class="lang-btn-item">
                <el-dropdown-item
                  :command="lang.value"
                  :class="{ 'is-selected': locale === lang.value }"
                >
                  <span class="menu-txt">{{ lang.label }}</span>
                  <i v-if="locale === lang.value" class="iconfont-sys icon-check">&#xe621;</i>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconsys-zhaopian-copy"></use>
        </svg>
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">{{ $t('login.twoSteps') }}</h3>
          <p class="sub-title">{{ $t('login.twoStepsTips') }}</p>
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            @keyup.enter="handleSubmit"
            style="margin-top: 25px"
          >
            <el-form-item prop="twoStep" validate-on-rule-change="false">
              <div class="towSetps">
                <el-input
                  v-for="(item, index) in 6"
                  :key="index"
                  v-model="formData.twoStep[index]"
                  maxlength="1"
                  ref="inputs"
                  @input="handleInput(index)"
                  @keydown.backspace="handleBackspace(index)"
                />
              </div>
            </el-form-item>

            <div style="margin-top: 30px">
              <el-button
                class="login-btn"
                type="primary"
                @click="handleSubmit"
                :loading="loading"
                v-ripple
              >
                {{ $t('login.btnText') }}
              </el-button>
            </div>

            <div class="footer">
              <p>
                <router-link to="/login">{{ $t('login.backLogin') }}</router-link>
              </p>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { ElMessage, ElNotification } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { HOME_PAGE } from '@/router'
  import { ApiStatus } from '@/utils/http/status'
  import { languageOptions } from '@/language'
  import { LanguageEnum, SystemThemeEnum } from '@/enums/appEnum'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  import { useSettingStore } from '@/store/modules/setting'
  import type { FormInstance, FormRules } from 'element-plus'

  const settingStore = useSettingStore()
  const { isDark, systemThemeType } = storeToRefs(settingStore)

  const userStore = useUserStore()
  const router = useRouter()

  const systemName = AppConfig.systemInfo.name
  const formRef = ref<FormInstance>()
  const formData = reactive({
    twoStep: AppConfig.systemInfo.login.twoStep
  })

  const rules = computed<FormRules>(() => ({
    twoStep: [
      {
        required: true,
        trigger: 'submit',
        validator: (_rule, value: string[], callback) => {
          if (!value || value.length !== 6 || value.some((v) => !v || v.trim() === '')) {
            callback(new Error(t('login.placeholder[3]'))) // 比如 "請輸入完整驗證碼"
          } else {
            callback()
          }
        }
      }
    ]
  }))

  const loading = ref(false)

  const inputs = ref<(ComponentPublicInstance | null)[]>([])
  const handleInput = (index: number) => {
    nextTick(() => {
      if (formData.twoStep[index] !== '' && index < inputs.value.length - 1) {
        const nextInput = inputs.value[index + 1] as any
        nextInput?.focus()
      }
      if (index === inputs.value.length - 1) {
        handleSubmit()
      }
    })
  }

  const handleBackspace = (index: number) => {
    nextTick(() => {
      if (index > 0) {
        setTimeout(() => {
          const prevInput = inputs.value[index - 1] as any
          prevInput.focus()
          prevInput.select()
        }, 0)
      }
    })
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true

        // 延时辅助函数
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

        try {
          const res = await UserService.twoStep({
            body: JSON.stringify({
              twoStep: formData.twoStep.join('')
            })
          })

          if (res.code === ApiStatus.success && res.data) {
            // 设置 token
            userStore.setToken(res.data.accessToken)

            // 获取用户信息
            const userRes = await UserService.getUserInfo()
            if (userRes.code === ApiStatus.success) {
              userStore.setUserInfo(userRes.data)
            }

            // 设置登录状态
            userStore.setLoginStatus(true)
            // 延时辅助函数
            await delay(1000)
            // 登录成功提示
            showLoginSuccessNotice()
            // 跳转首页
            router.push(HOME_PAGE)
          } else {
            ElMessage.error(res.message)
          }
        } finally {
          await delay(1000)
          loading.value = false
        }
      }
    })
  }

  // 登录成功提示
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: t('login.success.title'),
        type: 'success',
        showClose: false,
        duration: 2500,
        zIndex: 10000,
        message: `${t('login.success.message')}, ${systemName}!`
      })
    }, 300)
  }

  // 切换语言
  const { locale } = useI18n()

  const changeLanguage = (lang: LanguageEnum) => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
  }

  // 切换主题
  import { useTheme } from '@/composables/useTheme'
  import { UserService } from '@/api/usersApi'

  const toggleTheme = () => {
    let { LIGHT, DARK } = SystemThemeEnum
    useTheme().switchThemeStyles(systemThemeType.value === LIGHT ? DARK : LIGHT)
  }
</script>

<style lang="scss" scoped>
  @use './index';
</style>
