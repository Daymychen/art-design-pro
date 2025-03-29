/**
 * 标签页容器高度以及顶部距离配置
 * @param {Object} tab-default - 默认标签页样式配置
 * @param {number} openTop - 标签页打开时的顶部填充高度
 * @param {number} closeTop - 标签页关闭时的顶部填充高度
 * @param {number} openHeight - 标签页打开时的总高度
 * @param {number} closeHeight - 标签页关闭时的总高度
 */
export const TAB_CONFIG = {
  'tab-default': {
    openTop: 106,
    closeTop: 60,
    openHeight: 121,
    closeHeight: 75
  },
  'tab-card': {
    openTop: 122,
    closeTop: 78,
    openHeight: 139,
    closeHeight: 95
  },
  'tab-google': {
    openTop: 122,
    closeTop: 78,
    openHeight: 139,
    closeHeight: 95
  }
}

// 获取当前 tab 样式配置，设置默认值
export const getTabConfig = (style: string) => {
  return TAB_CONFIG[style as keyof typeof TAB_CONFIG] || TAB_CONFIG['tab-card'] // 默认使用 tab-card 配置
}
