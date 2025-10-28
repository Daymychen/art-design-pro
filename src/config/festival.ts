/**
 * 节日配置
 * 包含：礼花效果、滚动文字
 */
// 图片需要在 components/Ceremony/Fireworks 文件预先定义
import { FestivalConfig } from '@/types/config'
// import sd from '@imgs/ceremony/sd.png'
// import yd from '@imgs/ceremony/yd.png'

export const festivalConfigList: FestivalConfig[] = [
  {
    date: '2025-10-28',
    name: 'v3.0 sass 升级到 tailwindcss ',
    image: '',
    scrollText:
      '🎉 v3.0 版本即将进入测试阶段！本次重点升级：以 TailwindCSS 替代 Sass 提升开发效率，使用 Iconify 统一图标方案。正式发布，敬请期待！'
  }
  // {
  //   date: '2024-12-25',
  //   name: '圣诞节',
  //   image: sd,
  //   scrollText: 'Merry Christmas！Art Design Pro 祝您圣诞快乐，愿节日的欢乐与祝福如雪花般纷至沓来！'
  // }
]
