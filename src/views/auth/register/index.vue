<!-- 注册页面 — 分步表单 -->
<template>
  <div class="flex w-full h-screen">
    <LoginLeftView />

    <div class="relative flex-1">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('register.title') }}</h3>
          <p class="sub-title">{{ $t('register.subTitle') }}</p>

          <!-- Step 1: 邮箱验证 -->
          <ElForm
            v-if="currentStep === 1"
            class="mt-7.5"
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
                purpose="register"
                i18n-prefix="register"
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
                {{ $t('register.nextStep') }}
              </ElButton>
            </div>

            <div class="mt-5 text-sm text-g-600">
              <span>{{ $t('register.hasAccount') }}</span>
              <RouterLink class="text-theme" :to="{ name: 'Login' }">{{
                $t('register.toLogin')
              }}</RouterLink>
            </div>
          </ElForm>

          <!-- Step 2: 设置密码 -->
          <ElForm
            v-if="currentStep === 2"
            class="mt-7.5"
            ref="step2FormRef"
            :model="step2Form"
            :rules="step2Rules"
            label-position="top"
          >
            <div class="mb-4 text-sm text-gray-500">
              <span>{{ $t('register.generatedUsername') }}：</span>
              <strong class="text-theme">{{ generatedUsername }}</strong>
            </div>

            <ElFormItem prop="password">
              <ElInput
                class="custom-height"
                v-model.trim="step2Form.password"
                :placeholder="$t('register.placeholder.password')"
                type="password"
                autocomplete="off"
                show-password
              />
            </ElFormItem>

            <ElFormItem prop="confirmPassword">
              <ElInput
                class="custom-height"
                v-model.trim="step2Form.confirmPassword"
                :placeholder="$t('register.placeholder.confirmPassword')"
                type="password"
                autocomplete="off"
                @keyup.enter="handleRegister"
                show-password
              />
            </ElFormItem>

            <div style="display: flex; gap: 10px; margin-top: 15px">
              <ElButton class="flex-1 custom-height" @click="currentStep = 1">
                {{ $t('register.prevStep') }}
              </ElButton>
              <ElButton
                class="flex-1 custom-height"
                type="primary"
                @click="handleRegister"
                :loading="loading"
                v-ripple
              >
                {{ $t('register.submitBtnText') }}
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
  import { fetchEmailConfig, fetchRegister } from '@/api/auth'
  import VerifyCodeInput from '@/components/auth/VerifyCodeInput.vue'

  defineOptions({ name: 'Register' })

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

  // 加载邮箱域名配置
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

  const generatedUsername = computed(() => {
    const email = step1Form.email
    return email.includes('@') ? email.split('@')[0] : ''
  })

  // Step 1 表单
  const step1Form = reactive({ email: '', code: '' })

  const validateEmailDomain = (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback(new Error(t('register.rule.emailRequired')))
      return
    }
    if (!value.includes('@')) {
      callback(new Error(t('register.rule.emailInvalid')))
      return
    }
    const domain = value.split('@')[1]?.toLowerCase()
    if (!allowedDomains.value.includes(domain)) {
      callback(new Error(t('register.rule.emailDomainInvalid')))
      return
    }
    callback()
  }

  const step1Rules = computed<FormRules>(() => ({
    email: [{ required: true, validator: validateEmailDomain, trigger: 'blur' }],
    code: [
      { required: true, message: t('register.rule.codeRequired'), trigger: 'blur' },
      { len: 6, message: t('register.rule.codeLength'), trigger: 'blur' }
    ]
  }))

  // Step 2 表单
  const step2Form = reactive({ password: '', confirmPassword: '' })

  const validateConfirmPassword = (
    _rule: any,
    value: string,
    callback: (error?: Error) => void
  ) => {
    if (!value) {
      callback(new Error(t('register.rule.confirmPasswordRequired')))
      return
    }
    if (value !== step2Form.password) {
      callback(new Error(t('register.rule.passwordMismatch')))
      return
    }
    callback()
  }

  const step2Rules = computed<FormRules>(() => ({
    password: [
      { required: true, message: t('register.placeholder.password'), trigger: 'blur' },
      { min: PASSWORD_MIN_LENGTH, message: t('register.rule.passwordLength'), trigger: 'blur' }
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

  const handleRegister = async () => {
    if (!step2FormRef.value) return
    try {
      await step2FormRef.value.validate()
      loading.value = true

      await fetchRegister({
        email: step1Form.email,
        code: step1Form.code,
        password: step2Form.password
      })

      ElMessage.success('注册成功')
      setTimeout(() => {
        router.push({ name: 'Login' })
      }, 1000)
    } catch {
      // http 工具已处理错误提示
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  @import '../login/style.css';
</style>
