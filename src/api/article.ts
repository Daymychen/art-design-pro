import request from '@/utils/http'

export interface ArticleListItem {
  id: number
  title: string
  brief: string
  home_img: string
  type_name: string
  blog_class: string
  count: number
  create_time: string
}

interface ArticleListResponse {
  records: ArticleListItem[]
  current: number
  size: number
  total: number
}

interface ArticleDetail {
  id: number
  title: string
  html_content: string
  brief: string
  home_img: string
  type_name: string
  blog_class: string
  count: number
  create_time: string
}

export function fetchArticleTypes() {
  return request.get<{ id: number; name: string }[]>({ url: '/api/article/types' })
}

export function fetchArticleList(params: {
  current: number
  size: number
  keyword?: string
  year?: string
  typeName?: string
}) {
  return request.get<ArticleListResponse>({ url: '/api/article/list', params })
}

export function fetchArticleDetail(id: number) {
  return request.get<ArticleDetail>({ url: `/api/article/${id}` })
}

export function createArticle(data: {
  title: string
  brief?: string
  htmlContent?: string
  homeImg?: string
  typeName?: string
  blogClass?: string
}) {
  return request.post({ url: '/api/article', params: data, showSuccessMessage: true })
}

export function updateArticle(id: number, data: Record<string, any>) {
  return request.put({ url: `/api/article/${id}`, params: data, showSuccessMessage: true })
}

export function deleteArticle(id: number) {
  return request.del({ url: `/api/article/${id}`, showSuccessMessage: true })
}
