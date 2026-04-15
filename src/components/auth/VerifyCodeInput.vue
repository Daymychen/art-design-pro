<!-- 验证码输入 + 发送按钮 + 倒计时 -->
<template>
  <div class="verify-code-wrap">
    <ElInput
      class="custom-height"
      v-model.trim="code"
      :placeholder="$t(`${i18nPrefix}.placeholder.verifyCode`)"
      maxlength="6"
      @input="handleInput"
    />
    <ElButton
      class="send-btn"
      type="primary"
      :disabled="countdown > 0 || sending"
      :loading="sending"
      @click="handleSend"
    >
      <template v-if="countdown > 0">
        {{ $t(`${i18nPrefix}.sendCodeCountdown`, { seconds: countdown }) }}
      </template>
      <template v-else>
        {{ $t(`${i18nPrefix}.sendCode`) }}
      </template>
    </ElButton>
  </div>
</template>

<script setup lang="ts">
  import { fetchSendVerifyCode } from '@/api/auth'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'

  const props = defineProps<{
    email: string
    purpose: 'register' | 'reset_password'
    i18nPrefix: string // "register" | "forgetPassword"
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const { t } = useI18n()

  const code = ref('')
  const sending = ref(false)
  const countdown = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  const handleInput = (val: string) => {
    // 只允许数字
    code.value = val.replace(/\D/g, '')
    emit('update:modelValue', code.value)
  }

  const startCountdown = () => {
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (timer) clearInterval(timer)
        timer = null
      }
    }, 1000)
  }

  const handleSend = async () => {
    if (!props.email) {
      ElMessage.warning(t(`${props.i18nPrefix}.rule.emailRequired`))
      return
    }
    sending.value = true
    try {
      await fetchSendVerifyCode({ email: props.email, purpose: props.purpose })
      ElMessage.success(t(`${props.i18nPrefix}.codeSent`))
      startCountdown()
    } catch {
      // http 工具已处理错误提示
    } finally {
      sending.value = false
    }
  }

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })
</script>

<style scoped>
  .verify-code-wrap {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .verify-code-wrap .el-input {
    flex: 1;
  }

  .send-btn {
    min-width: 120px;
    height: 42px;
  }
</style>
