import { upgradeLogList } from '@/mock/upgradeLog'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

/**
 * 规范化版本号字符串，移除前缀 'v'
 */
const normalizeVersion = (version: string): string => version.replace(/^v/, '')

/**
 * 系统升级处理
 */
export function systemUpgrade(): void {
  const currentVersion = import.meta.env.VITE_VERSION // 当前版本
  const storedVersion = localStorage.getItem('version') // 存储的版本

  // 跳过版本为1.0.0的提示
  if (currentVersion === '1.0.0') return

  // 查找旧系统版本的存储键
  const oldSysKey = Object.keys(localStorage).find(
    (key) => key.startsWith('sys-v') && key !== `sys-v${currentVersion}`
  )

  // 如果没有找到旧版本键，则不需要显示升级提示
  if (!oldSysKey) return

  // 延迟执行，确保应用已完全加载
  setTimeout(() => {
    try {
      if (!upgradeLogList.value.length) return

      const { title: content } = upgradeLogList.value[0]
      const normalizedCurrent = normalizeVersion(currentVersion)
      const normalizedStored = normalizeVersion(storedVersion || '')

      // 判断是否需要重新登录
      const requireReLogin = upgradeLogList.value.some((item) => {
        const itemVersion = normalizeVersion(item.version)
        return (
          item.requireReLogin && itemVersion > normalizedStored && itemVersion <= normalizedCurrent
        )
      })

      // 系统升级公告
      const message = [
        `<p style="color: var(--art-gray-text-800) !important; padding-bottom: 5px;">`,
        `系统已升级到 ${currentVersion} 版本，此次更新带来了以下改进：`,
        `</p>`,
        content,
        requireReLogin
          ? `<p style="color: var(--main-color); padding-top: 5px;">升级完成，请重新登录后继续使用。</p>`
          : ''
      ].join('')

      // 显示升级通知
      ElNotification({
        title: '系统升级公告',
        message,
        duration: 0,
        type: 'success',
        dangerouslyUseHTMLString: true
      })

      // 更新存储的版本信息并处理登录状态
      localStorage.setItem('version', currentVersion)
      localStorage.removeItem(oldSysKey)

      // 如果需要重新登录，则登出
      if (requireReLogin) {
        useUserStore().logOut()
      }
    } catch (error) {
      console.error('系统升级处理失败:', error)
    }
  }, 1000)
}
