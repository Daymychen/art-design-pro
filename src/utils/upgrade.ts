import { upgradeLogList } from '@/mock/upgradeLog'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

// 系统升级
export function systemUpgrade() {
  const version = import.meta.env.VITE_VERSION
  // 跳过版本为1.0.0的提示
  if (version === '1.0.0') return

  setTimeout(() => {
    const { title: content, requireReLogin } = upgradeLogList.value[0]
    // 系统升级公告
    const message = [
      `<p style="color: var(--art-gray-text-800) !important; padding-bottom: 5px;">`,
      `系统已升级到 ${version} 版本，此次更新带来了以下改进：`,
      `</p>`,
      content,
      requireReLogin
        ? `<p style="color: var(--main-color); padding-top: 5px;">升级完成，请重新登录后继续使用。</p>`
        : ''
    ].join('')

    const oldSysKey = Object.keys(localStorage).find(
      (key) => key.startsWith('sys-v') && key !== `sys-v${version}`
    )

    if (oldSysKey) {
      ElNotification({
        title: '系统升级公告',
        message,
        duration: 0,
        type: 'success',
        dangerouslyUseHTMLString: true
      })

      setTimeout(() => {
        // 更新版本号
        localStorage.setItem('version', version)
        // 删除旧版本号
        localStorage.removeItem(oldSysKey)
        // 需要重新登录
        if (requireReLogin) {
          useUserStore().logOut()
        }
      }, 1000)
    }
  }, 1000)
}
