import request from '@/utils/http'

export interface Comment {
  id: number
  author: string
  content: string
  timestamp: string
  replies: Comment[]
}

export interface CommentWallItem {
  id: number
  date: string
  content: string
  collection: number
  comment: number
  userName: string
}

export function fetchCommentList(articleId: number) {
  return request.get<Comment[]>({ url: '/api/comment/list', params: { articleId } })
}

export function fetchCommentWall() {
  return request.get<CommentWallItem[]>({ url: '/api/comment/wall' })
}

export function addComment(data: {
  articleId?: number
  parentId?: number
  author: string
  content: string
}) {
  return request.post({ url: '/api/comment', params: data, showSuccessMessage: true })
}

export function deleteComment(id: number) {
  return request.del({ url: `/api/comment/${id}`, showSuccessMessage: true })
}
