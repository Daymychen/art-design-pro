/**
 * 节日庆祝配置
 *
 * 配置系统的节日烟花效果和祝福文本。
 * 支持单日节日和跨日期节日，可自定义烟花播放次数。
 *
 * ## 配置说明
 *
 * - name: 节日名称
 * - date: 节日开始日期（格式：YYYY-MM-DD）
 * - endDate: 节日结束日期（可选，用于跨日期节日）
 * - image: 烟花图片（需要预先导入）
 * - scrollText: 滚动显示的祝福文本
 * - count: 烟花播放次数（可选，默认为 3 次）
 *
 * ## 注意事项
 *
 * - 图片需要预先导入并在配置中引用
 * - 跨日期节日会在整个日期范围内生效
 * - 每个用户每天只会播放一次烟花效果
 *
 * @module config/modules/festival
 * @author Art Design Pro Team
 */

import { FestivalConfig } from '@/types/config'

// 导入烟花图片（根据需要取消注释）
// import sd from '@imgs/ceremony/sd.png'
// import yd from '@imgs/ceremony/yd.png'

export const festivalConfigList: FestivalConfig[] = [
  // 跨日期示例
  // {
  //   name: 'v3.0 Sass 升级至 TailwindCSS',
  //   date: '2025-11-03',
  //   endDate: '2025-11-09',
  //   image: '',
  //   count: 3,
  //   scrollText:
  //     '🚀 系统 v3.0 测试阶段正式开启！测试周期为 11 月 3 日 - 11 月 16 日，通过 TailwindCSS 重构样式体系、统一 Iconify 图标方案，带来更高效现代的开发体验，正式发布敬请期待～'
  // }
  // 单日示例：圣诞节
  // {
  //   name: '圣诞节',
  //   date: '2024-12-25',
  //   image: sd,
  //   count: 3 // 可选，不设置则使用默认值 3 次
  //   scrollText: 'Merry Christmas！Art Design Pro 祝您圣诞快乐，愿节日的欢乐与祝福如雪花般纷至沓来！',
  // }
]
