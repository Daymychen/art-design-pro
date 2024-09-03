export interface ArticleType {
  id?: number
  blog_class: string
  title: string
  count?: number
  html_content: string
  create_time: string // 或者使用 Date 类型
  home_img: string
  brief: string
  type_name?: string
}

export interface ArticleCategoryType {
  id: number
  name: string
  icon: string
  count: number
}
