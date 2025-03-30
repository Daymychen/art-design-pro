// 节日礼花、文字滚动配置
import AppConfig from '@/config'
const { name } = AppConfig.systemInfo

// 图片需要在 components/Ceremony/Fireworks 文件预先定义
import sd from '@imgs/ceremony/sd.png'
import yd from '@imgs/ceremony/yd.png'

export const festivalList = [
  {
    date: '2025-01-01',
    name: '元旦',
    image: yd,
    scrollText: `新年快乐！${name} 祝您在2025年万事如意，事业腾飞，阖家幸福，好运连连！`
  },
  {
    date: '2024-12-25',
    name: '圣诞节',
    image: sd,
    scrollText: `Merry Christmas！${name} 祝您圣诞快乐，愿节日的欢乐与祝福如雪花般纷至沓来！`
  }
]
