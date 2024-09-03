import { useSettingStore } from '@/store/modules/setting'
import { ElNotification } from 'element-plus'

// 检测系统升级
export function checkSystemUpgrade() {
  setTimeout(() => {
    const version = import.meta.env.VITE_VERSION

    // 跳过版本为1.0.0的提示
    if (version === '1.0.0') return

    const oldSysKey = Object.keys(localStorage).find(
      (key) => key.startsWith('sys-v') && key !== `sys-v${version}`
    )

    if (oldSysKey) {
      ElNotification({
        title: '系统升级',
        message: `检测到系统已更新到 ${version} 版本，正在升级中...`,
        type: 'warning',
        duration: 0,
        offset: 50
      })

      setTimeout(() => {
        localStorage.setItem('version', version)
        localStorage.removeItem(oldSysKey)

        ElNotification({
          title: '升级成功',
          message: `系统已升级到 ${version} 版本`,
          type: 'success',
          duration: 0,
          offset: 50
        })

        setTimeout(() => {
          useSettingStore().reload()
        }, 1000)
      }, 3000)
    }
  }, 1000)
}
