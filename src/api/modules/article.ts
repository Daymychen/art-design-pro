/**
 * 文章相关类型定义
 */

// 文章类型 (新命名规范)
export interface Article {
  id?: number
  blogClass: string
  title: string
  count?: number
  htmlContent: string
  createTime: string
  homeImg: string
  brief: string
  typeName?: string
  status?: number
  author?: string
  tags?: string[]
}

// 兼容原有的文章类型命名
export interface ArticleType {
  id?: number
  blog_class: string
  title: string
  count?: number
  html_content: string
  create_time: string
  home_img: string
  brief: string
  type_name?: string
}

// 文章分类类型 (新命名规范)
export interface ArticleCategory {
  id: number
  name: string
  icon: string
  count: number
  description?: string
  sortOrder?: number
}

// 兼容原有的文章分类类型命名
export interface ArticleCategoryType {
  id: number
  name: string
  icon: string
  count: number
}

// 文章查询参数
export interface ArticleQueryParams {
  page?: number
  size?: number
  searchVal?: string
  year?: string
  categoryId?: number
  status?: number
}

// 文章创建/更新参数
export interface ArticleFormData {
  blogClass: string
  title: string
  htmlContent: string
  homeImg: string
  brief: string
  author?: string
  tags?: string[]
  status?: number
}
