import { upgradeLogList } from '@/mock/upgradeLog'
import { ElNotification } from 'element-plus'

// 检测系统升级
export function checkSystemUpgrade() {
  setTimeout(() => {
    const version = import.meta.env.VITE_VERSION
    const content = upgradeLogList.value[0].title
    const message = `<p style="color: #333; padding-bottom: 5px;">系统已升级到 ${version} 版本，此次更新带来了以下改进：</p>${content}`

    // 跳过版本为1.0.0的提示
    if (version === '1.0.0') return

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
      }, 1000)
    }
  }, 1000)
}
