export type MenuListType = {
  id: number
  title: string
  name?: string
  icon?: string
  path: string
  title_en?: string
  noMenu?: boolean // 是否在菜单中隐藏
  children?: MenuListType[]
  authList?: Array
  showBadge?: boolean // 是否显示徽标
  showTextBadge?: string // 是否显示新徽标
}
