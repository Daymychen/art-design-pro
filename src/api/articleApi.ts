import request from '@/utils/http'
import { PaginationResponse, BaseResponse } from '@/types/api'
import { ArticleType, ArticleCategoryType, ArticleQueryParams } from './modules/article'

// 文章
export class ArticleService {
  // 获取文章列表
  static getArticleList(params: ArticleQueryParams) {
    const { page, size, searchVal, year } = params
    return request.get<PaginationResponse<ArticleType>>({
      url: `/api/articles/${page}/${size}?title=${searchVal}&year=${year}`
    })
  }

  // 获取文章类型
  static getArticleTypes(params: object) {
    return request.get<BaseResponse<ArticleCategoryType[]>>({
      url: '/api/articles/types',
      params
    })
  }

  // 获取文章详情
  static getArticleDetail(id: number) {
    return request.get<BaseResponse<ArticleType>>({
      url: `/api/articles/${id}`
    })
  }

  // 新增文章
  static addArticle(params: any) {
    return request.post<BaseResponse>({
      url: '/api/articles/',
      data: params
    })
  }

  // 编辑文章
  static editArticle(id: number, params: any) {
    return request.put<BaseResponse>({
      url: `/api/articles/${id}`,
      data: params
    })
  }
}
