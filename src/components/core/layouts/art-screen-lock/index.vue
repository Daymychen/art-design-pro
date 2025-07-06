<!-- 锁屏 -->
<template>
  <div class="layout-lock-screen">
    <!-- 开发者工具警告覆盖层 -->
    <div v-if="showDevToolsWarning" class="dev-tools-warning">
      <div class="warning-content">
        <div class="warning-icon">🔒</div>
        <h1 class="warning-title">系统已锁定</h1>
        <p class="warning-text">
          检测到开发者工具已打开<br />
          为了系统安全，请关闭开发者工具后继续使用
        </p>
        <div class="warning-subtitle">Security Lock Activated</div>
      </div>
    </div>

    <!-- 锁屏弹窗 -->
    <div v-if="!isLock">
      <ElDialog v-model="visible" :width="370" :show-close="false" @open="handleDialogOpen">
        <div class="lock-content">
          <img class="cover" src="@imgs/user/avatar.webp" alt="用户头像" />
          <div class="username">{{ userInfo.userName }}</div>
          <ElForm ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleLock">
            <ElFormItem prop="password">
              <ElInput
                v-model="formData.password"
                type="password"
                :placeholder="$t('lockScreen.lock.inputPlaceholder')"
                :show-password="true"
                ref="lockInputRef"
                @keyup.enter="handleLock"
              >
                <template #suffix>
                  <ElIcon class="cursor-pointer" @click="handleLock">
                    <Lock />
                  </ElIcon>
                </template>
              </ElInput>
            </ElFormItem>
            <ElButton type="primary" class="lock-btn" @click="handleLock" v-ripple>
              {{ $t('lockScreen.lock.btnText') }}
            </ElButton>
          </ElForm>
        </div>
      </ElDialog>
    </div>

    <!-- 解锁界面 -->
    <div v-else class="unlock-content">
      <div class="box">
        <img class="cover" src="@imgs/user/avatar.webp" alt="用户头像" />
        <div class="username">{{ userInfo.userName }}</div>
        <ElForm
          ref="unlockFormRef"
          :model="unlockForm"
          :rules="rules"
          @submit.prevent="handleUnlock"
        >
          <ElFormItem prop="password">
            <ElInput
              v-model="unlockForm.password"
              type="password"
              :placeholder="$t('lockScreen.unlock.inputPlaceholder')"
              :show-password="true"
              ref="unlockInputRef"
            >
              <template #suffix>
                <ElIcon class="cursor-pointer" @click="handleUnlock">
                  <Unlock />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>

          <ElButton type="primary" class="unlock-btn" @click="handleUnlock" v-ripple>
            {{ $t('lockScreen.unlock.btnText') }}
          </ElButton>
          <ElButton text class="login-btn" @click="toLogin">
            {{ $t('lockScreen.unlock.backBtnText') }}
          </ElButton>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Lock, Unlock } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import CryptoJS from 'crypto-js'
  import { useUserStore } from '@/store/modules/user'
  import { mittBus } from '@/utils/sys'

  // 国际化
  const { t } = useI18n()

  // 环境变量
  const ENCRYPT_KEY = import.meta.env.VITE_LOCK_ENCRYPT_KEY

  // Store
  const userStore = useUserStore()
  const { info: userInfo, lockPassword, isLock } = storeToRefs(userStore)

  // 响应式数据
  const visible = ref<boolean>(false)
  const lockInputRef = ref<any>(null)
  const unlockInputRef = ref<any>(null)
  const showDevToolsWarning = ref<boolean>(false)

  // 表单相关
  const formRef = ref<FormInstance>()
  const unlockFormRef = ref<FormInstance>()

  const formData = reactive({
    password: ''
  })

  const unlockForm = reactive({
    password: ''
  })

  // 表单验证规则
  const rules = computed<FormRules>(() => ({
    password: [
      {
        required: true,
        message: t('lockScreen.lock.inputPlaceholder'),
        trigger: 'blur'
      }
    ]
  }))

  // 检测是否为移动设备
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }

  // 添加禁用控制台的函数
  const disableDevTools = () => {
    // 禁用右键菜单
    const handleContextMenu = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    document.addEventListener('contextmenu', handleContextMenu, true)

    // 禁用开发者工具相关快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLock.value) return

      // 禁用 F12
      if (e.key === 'F12') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+Shift+I/J/C/K (开发者工具)
      if (e.ctrlKey && e.shiftKey) {
        const key = e.key.toLowerCase()
        if (['i', 'j', 'c', 'k'].includes(key)) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }

      // 禁用 Ctrl+U (查看源代码)
      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+S (保存页面)
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+A (全选)
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+P (打印)
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+F (查找)
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Alt+Tab (切换窗口)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+Tab (切换标签页)
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+W (关闭标签页)
      if (e.ctrlKey && e.key.toLowerCase() === 'w') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+R 和 F5 (刷新页面)
      if ((e.ctrlKey && e.key.toLowerCase() === 'r') || e.key === 'F5') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+Shift+R (强制刷新)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)

    // 禁用选择文本
    const handleSelectStart = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('selectstart', handleSelectStart, true)

    // 禁用拖拽
    const handleDragStart = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('dragstart', handleDragStart, true)

    // 监听开发者工具打开状态（仅在桌面端启用）
    let devtools = { open: false }
    const threshold = 160
    let devToolsInterval: ReturnType<typeof setInterval> | null = null

    const checkDevTools = () => {
      if (!isLock.value || isMobile()) return

      const isDevToolsOpen =
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold

      if (isDevToolsOpen && !devtools.open) {
        devtools.open = true
        showDevToolsWarning.value = true
      } else if (!isDevToolsOpen && devtools.open) {
        devtools.open = false
        showDevToolsWarning.value = false
      }
    }

    // 仅在桌面端启用开发者工具检测
    if (!isMobile()) {
      devToolsInterval = setInterval(checkDevTools, 500)
    }

    // 返回清理函数
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('selectstart', handleSelectStart, true)
      document.removeEventListener('dragstart', handleDragStart, true)
      if (devToolsInterval) {
        clearInterval(devToolsInterval)
      }
    }
  }

  // 工具函数
  const verifyPassword = (inputPassword: string, storedPassword: string): boolean => {
    try {
      const decryptedPassword = CryptoJS.AES.decrypt(storedPassword, ENCRYPT_KEY).toString(
        CryptoJS.enc.Utf8
      )
      return inputPassword === decryptedPassword
    } catch (error) {
      console.error('密码解密失败:', error)
      return false
    }
  }

  // 事件处理函数
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.altKey && event.key.toLowerCase() === '¬') {
      event.preventDefault()
      visible.value = true
    }
  }

  const handleDialogOpen = () => {
    setTimeout(() => {
      lockInputRef.value?.input?.focus()
    }, 100)
  }

  const handleLock = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid, fields) => {
      if (valid) {
        const encryptedPassword = CryptoJS.AES.encrypt(formData.password, ENCRYPT_KEY).toString()
        userStore.setLockStatus(true)
        userStore.setLockPassword(encryptedPassword)
        visible.value = false
        formData.password = ''
      } else {
        console.error('表单验证失败:', fields)
      }
    })
  }

  const handleUnlock = async () => {
    if (!unlockFormRef.value) return

    await unlockFormRef.value.validate((valid, fields) => {
      if (valid) {
        const isValid = verifyPassword(unlockForm.password, lockPassword.value)

        if (isValid) {
          try {
            userStore.setLockStatus(false)
            userStore.setLockPassword('')
            unlockForm.password = ''
            visible.value = false
            showDevToolsWarning.value = false
          } catch (error) {
            console.error('更新store失败:', error)
          }
        } else {
          ElMessage.error(t('lockScreen.pwdError'))
        }
      } else {
        console.error('表单验证失败:', fields)
      }
    })
  }

  const toLogin = () => {
    userStore.logOut()
  }

  const openLockScreen = () => {
    visible.value = true
  }

  // 监听锁屏状态变化
  watch(isLock, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        unlockInputRef.value?.input?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'auto'
      showDevToolsWarning.value = false
    }
  })

  // 存储清理函数
  let cleanupDevTools: (() => void) | null = null

  // 生命周期钩子
  onMounted(() => {
    mittBus.on('openLockScreen', openLockScreen)
    document.addEventListener('keydown', handleKeydown)

    if (isLock.value) {
      visible.value = true
      setTimeout(() => {
        unlockInputRef.value?.input?.focus()
      }, 100)
    }

    // 初始化禁用开发者工具功能
    cleanupDevTools = disableDevTools()
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'auto'
    // 清理禁用开发者工具的事件监听器
    if (cleanupDevTools) {
      cleanupDevTools()
      cleanupDevTools = null
    }
  })
</script>

<style scoped lang="scss">
  .layout-lock-screen {
    :deep(.el-dialog) {
      border-radius: 10px;
    }

    // 开发者工具警告样式
    .dev-tools-warning {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #fff;
      background: linear-gradient(135deg, #1e1e1e 0%, #000 100%);
      animation: fadeIn 0.3s ease-in-out;

      .warning-content {
        padding: 20px;
        text-align: center;
        user-select: none;

        .warning-icon {
          margin-bottom: 30px;
          font-size: 48px;
        }

        .warning-title {
          margin: 0 0 20px;
          font-size: 28px;
          font-weight: 600;
          color: #ff6b6b;
        }

        .warning-text {
          max-width: 500px;
          margin: 0;
          font-size: 18px;
          line-height: 1.6;
          color: #ccc;
        }

        .warning-subtitle {
          margin-top: 30px;
          font-size: 14px;
          color: #888;
        }
      }
    }

    .lock-content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .cover {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }

      .username {
        margin: 15px 0;
        margin-top: 30px;
        font-size: 16px;
        font-weight: 500;
      }

      .el-form {
        width: 90%;
      }

      .el-input {
        width: 100%;
        margin-top: 35px;
      }

      .lock-btn {
        width: 100%;
      }
    }

    .unlock-content {
      position: fixed;
      inset: 0;
      z-index: 2500;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: #fff;
      background-image: url('@imgs/lock/lock_screen_1.webp');
      background-size: cover;
      transition: transform 0.3s ease-in-out;

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 320px;
        padding: 30px;
        background: rgb(255 255 255 / 90%);
        border-radius: 10px;

        .cover {
          width: 64px;
          height: 64px;
          margin-top: 20px;
          border-radius: 50%;
        }

        .username {
          margin: 15px 0;
          margin-top: 30px;
          font-size: 16px;
          font-weight: 500;
          color: #333 !important;
        }

        .el-form {
          width: 100%;
          padding: 0 10px !important;
        }

        .el-input {
          margin-top: 20px;
          color: #333;
        }

        .unlock-btn {
          width: 100%;
        }

        .login-btn {
          display: block;
          margin: 10px auto;
          color: #333 !important;

          &:hover {
            color: var(--main-color) !important;
            background-color: transparent !important;
          }
        }
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
