import { AppRouteRecord } from '@/types/router'

export const articleRoutes: AppRouteRecord = {
  path: '/article',
  name: 'Article',
  component: '/index/index',
  meta: {
    title: 'menus.article.title',
    icon: 'ri:book-2-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'article-list',
      name: 'ArticleList',
      component: '/article/list',
      meta: {
        title: 'menus.article.articleList',
        icon: 'ri:article-line',
        keepAlive: true,
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' }
        ]
      }
    },
    {
      path: 'detail/:id',
      name: 'ArticleDetail',
      component: '/article/detail',
      meta: {
        title: 'menus.article.articleDetail',
        isHide: true,
        keepAlive: true,
        activePath: '/article/article-list'
      }
    },
    {
      path: 'comment',
      name: 'ArticleComment',
      component: '/article/comment',
      meta: {
        title: 'menus.article.comment',
        icon: 'ri:mail-line',
        keepAlive: true
      }
    },
    {
      path: 'publish',
      name: 'ArticlePublish',
      component: '/article/publish',
      meta: {
        title: 'menus.article.articlePublish',
        icon: 'ri:telegram-2-line',
        keepAlive: true,
        authList: [{ title: '发布', authMark: 'add' }]
      }
    }
  ]
}
