<!-- 忘记密码页面 — 分步表单 -->
<template>
  <div class="flex w-full h-screen">
    <LoginLeftView />

    <div class="relative flex-1">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>

          <!-- Step 1: 邮箱验证 -->
          <ElForm
            v-if="currentStep === 1"
            class="mt-5"
            ref="step1FormRef"
            :model="step1Form"
            :rules="step1Rules"
            label-position="top"
            :key="formKey"
          >
            <ElFormItem prop="email">
              <ElInput
                class="custom-height"
                v-model.trim="step1Form.email"
                :placeholder="emailPlaceholder"
              />
            </ElFormItem>

            <ElFormItem prop="code">
              <VerifyCodeInput
                v-model="step1Form.code"
                :email="step1Form.email"
                purpose="reset_password"
                i18n-prefix="forgetPassword"
              />
            </ElFormItem>

            <div style="margin-top: 15px">
              <ElButton
                class="w-full custom-height"
                type="primary"
                @click="goStep2"
                :loading="loading"
                v-ripple
              >
                {{ $t('forgetPassword.nextStep') }}
              </ElButton>
            </div>

            <div style="margin-top: 15px">
              <ElButton class="w-full custom-height" plain @click="toLogin">
                {{ $t('forgetPassword.backBtnText') }}
              </ElButton>
            </div>
          </ElForm>

          <!-- Step 2: 设置新密码 -->
          <ElForm
            v-if="currentStep === 2"
            class="mt-5"
            ref="step2FormRef"
            :model="step2Form"
            :rules="step2Rules"
            label-position="top"
          >
            <ElFormItem prop="newPassword">
              <ElInput
                class="custom-height"
                v-model.trim="step2Form.newPassword"
                :placeholder="$t('forgetPassword.placeholder.newPassword')"
                type="password"
                autocomplete="off"
                show-password
              />
            </ElFormItem>

            <ElFormItem prop="confirmPassword">
              <ElInput
                class="custom-height"
                v-model.trim="step2Form.confirmPassword"
                :placeholder="$t('forgetPassword.placeholder.confirmPassword')"
                type="password"
                autocomplete="off"
                @keyup.enter="handleReset"
                show-password
              />
            </ElFormItem>

            <div style="margin-top: 15px">
              <ElButton
                class="w-full custom-height"
                type="primary"
                @click="handleReset"
                :loading="loading"
                v-ripple
              >
                {{ $t('forgetPassword.submitBtnText') }}
              </ElButton>
            </div>

            <div style="margin-top: 15px">
              <ElButton class="w-full custom-height" plain @click="toLogin">
                {{ $t('forgetPassword.backBtnText') }}
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { fetchEmailConfig, fetchForgotPassword } from '@/api/auth'
  import VerifyCodeInput from '@/components/auth/VerifyCodeInput.vue'

  defineOptions({ name: 'ForgetPassword' })

  const PASSWORD_MIN_LENGTH = 6

  const { t, locale } = useI18n()
  const router = useRouter()

  const step1FormRef = ref<FormInstance>()
  const step2FormRef = ref<FormInstance>()
  const loading = ref(false)
  const formKey = ref(0)
  const currentStep = ref(1)
  const allowedDomains = ref<string[]>([])

  watch(locale, () => {
    formKey.value++
  })

  onMounted(async () => {
    try {
      const data = await fetchEmailConfig()
      allowedDomains.value = data.allowed_domains
    } catch {
      console.error('获取邮箱配置失败')
    }
  })

  const emailPlaceholder = computed(() => {
    const domain = allowedDomains.value[0] || 'yourcompany.com'
    return `yourname@${domain}`
  })

  // Step 1 表单
  const step1Form = reactive({ email: '', code: '' })

  const validateEmailDomain = (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback(new Error(t('forgetPassword.rule.emailRequired')))
      return
    }
    if (!value.includes('@')) {
      callback(new Error(t('forgetPassword.rule.emailInvalid')))
      return
    }
    const domain = value.split('@')[1]?.toLowerCase()
    if (!allowedDomains.value.includes(domain)) {
      callback(new Error(t('forgetPassword.rule.emailDomainInvalid')))
      return
    }
    callback()
  }

  const step1Rules = computed<FormRules>(() => ({
    email: [{ required: true, validator: validateEmailDomain, trigger: 'blur' }],
    code: [
      { required: true, message: t('forgetPassword.rule.codeRequired'), trigger: 'blur' },
      { len: 6, message: t('forgetPassword.rule.codeLength'), trigger: 'blur' }
    ]
  }))

  // Step 2 表单
  const step2Form = reactive({ newPassword: '', confirmPassword: '' })

  const validateConfirmPassword = (
    _rule: any,
    value: string,
    callback: (error?: Error) => void
  ) => {
    if (!value) {
      callback(new Error(t('forgetPassword.rule.confirmPasswordRequired')))
      return
    }
    if (value !== step2Form.newPassword) {
      callback(new Error(t('forgetPassword.rule.passwordMismatch')))
      return
    }
    callback()
  }

  const step2Rules = computed<FormRules>(() => ({
    newPassword: [
      {
        required: true,
        message: t('forgetPassword.rule.newPasswordRequired'),
        trigger: 'blur'
      },
      {
        min: PASSWORD_MIN_LENGTH,
        message: t('forgetPassword.rule.passwordLength'),
        trigger: 'blur'
      }
    ],
    confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
  }))

  const goStep2 = async () => {
    if (!step1FormRef.value) return
    try {
      await step1FormRef.value.validate()
      currentStep.value = 2
    } catch {
      // 表单验证失败
    }
  }

  const handleReset = async () => {
    if (!step2FormRef.value) return
    try {
      await step2FormRef.value.validate()
      loading.value = true

      await fetchForgotPassword({
        email: step1Form.email,
        code: step1Form.code,
        new_password: step2Form.newPassword
      })

      ElMessage.success(t('forgetPassword.resetSuccess'))
      setTimeout(() => {
        router.push({ name: 'Login' })
      }, 1500)
    } catch {
      // http 工具已处理错误提示
    } finally {
      loading.value = false
    }
  }

  const toLogin = () => {
    router.push({ name: 'Login' })
  }
</script>

<style scoped>
  @import '../login/style.css';
</style>
