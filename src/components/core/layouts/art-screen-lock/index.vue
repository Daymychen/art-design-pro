<template>
  <div class="layout-lock-screen">
    <div v-if="!isLock">
      <el-dialog v-model="visible" :width="370" :show-close="false" @open="handleDialogOpen">
        <div class="lock-content">
          <img class="cover" src="@imgs/user/avatar.webp" />
          <div class="username">{{ userInfo.userName }}</div>
          <el-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleLock">
            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                :placeholder="$t(`lockScreen.lock.inputPlaceholder`)"
                :show-password="true"
                ref="lockInputRef"
                @keyup.enter="handleLock"
              >
                <template #suffix>
                  <el-icon class="cursor-pointer" @click="handleLock">
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-button type="primary" class="lock-btn" @click="handleLock" v-ripple>
              {{ $t(`lockScreen.lock.btnText`) }}
            </el-button>
          </el-form>
        </div>
      </el-dialog>
    </div>

    <div class="unlock-content" v-else>
      <div class="box">
        <img class="cover" src="@imgs/user/avatar.webp" />
        <div class="username">{{ userInfo.userName }}</div>
        <el-form
          ref="unlockFormRef"
          :model="unlockForm"
          :rules="rules"
          @submit.prevent="handleUnlock"
        >
          <el-form-item prop="password">
            <el-input
              v-model="unlockForm.password"
              type="password"
              :placeholder="$t(`lockScreen.unlock.inputPlaceholder`)"
              :show-password="true"
              ref="unlockInputRef"
            >
              <template #suffix>
                <el-icon class="cursor-pointer" @click="handleUnlock">
                  <Unlock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-button type="primary" class="unlock-btn" @click="handleUnlock" v-ripple>
            {{ $t(`lockScreen.unlock.btnText`) }}
          </el-button>
          <el-button text class="login-btn" @click="toLogin">
            {{ $t(`lockScreen.unlock.backBtnText`) }}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Lock, Unlock } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import CryptoJS from 'crypto-js'
  import { ElMessage } from 'element-plus'
  import { mittBus } from '@/utils/sys'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const ENCRYPT_KEY = import.meta.env.VITE_LOCK_ENCRYPT_KEY
  const userStore = useUserStore()
  const { info: userInfo, lockPassword, isLock } = storeToRefs(userStore)

  const visible = ref(false)
  const formRef = ref<FormInstance>()
  const formData = reactive({
    password: ''
  })

  const rules = computed<FormRules>(() => ({
    password: [
      {
        required: true,
        message: t('lockScreen.lock.inputPlaceholder'),
        trigger: 'blur'
      }
    ]
  }))

  const unlockFormRef = ref<FormInstance>()
  const unlockForm = reactive({
    password: ''
  })

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

    // 监听开发者工具打开状态
    let devtools = { open: false, orientation: null }
    const threshold = 160

    const checkDevTools = () => {
      if (!isLock.value) return

      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true
          // 检测到开发者工具打开，可以在这里添加额外的处理逻辑
          console.clear()
          document.body.innerHTML =
            '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;z-index:99999;">系统已锁定，请勿尝试打开开发者工具</div>'
        }
      } else {
        devtools.open = false
      }
    }

    // 定期检查开发者工具状态
    const devToolsInterval = setInterval(checkDevTools, 500)

    // 返回清理函数
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('selectstart', handleSelectStart, true)
      document.removeEventListener('dragstart', handleDragStart, true)
      clearInterval(devToolsInterval)
    }
  }

  watch(isLock, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        unlockInputRef.value?.input?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'auto'
    }
  })

  // 存储清理函数
  let cleanupDevTools: (() => void) | null = null

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

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.altKey && event.key.toLowerCase() === '¬') {
      event.preventDefault()
      visible.value = true
    }
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

  const toLogin = () => {
    userStore.logOut()
  }

  const openLockScreen = () => {
    visible.value = true
  }

  // 添加输入框的 ref
  const lockInputRef = ref<any>(null)
  const unlockInputRef = ref<any>(null)

  // 修改处理方法
  const handleDialogOpen = () => {
    setTimeout(() => {
      lockInputRef.value?.input?.focus()
    }, 100)
  }
</script>

<style scoped lang="scss">
  .layout-lock-screen {
    .el-dialog {
      border-radius: 10px;
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
      z-index: 1000;
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
</style>
