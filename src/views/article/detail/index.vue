<!-- 文章详情页面 -->
<template>
  <div class="article-detail page-content">
    <div class="max-w-200 m-auto mt-15">
      <h1 class="text-3xl font-semibold">{{ articleTitle }}</h1>
      <div class="markdown-body mt-12.5" v-highlight v-html="articleHtml"></div>
    </div>
    <ArtBackToTop />
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/core/md.scss'
  import '@/assets/styles/custom/one-dark-pro.scss'
  import { useCommon } from '@/hooks/core/useCommon'
  import axios from 'axios'

  defineOptions({ name: 'ArticleDetail' })

  interface ArticleResponse {
    code: number
    data: {
      title: string
      html_content: string
    }
  }

  const route = useRoute()
  const articleId = computed(() => Number(route.params.id))
  const articleTitle = ref('')
  const articleHtml = shallowRef('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getArticleDetail = async () => {
    if (!articleId.value) return

    loading.value = true
    error.value = null

    try {
      const { data } = await axios.get<ArticleResponse>(
        'https://www.qiniu.lingchen.kim/blog_detail.json'
      )

      if (data.code === 200) {
        articleTitle.value = data.data.title
        articleHtml.value = data.data.html_content
      }
    } catch (err) {
      error.value = '文章加载失败'
      console.error('获取文章详情失败:', err)
    } finally {
      loading.value = false
    }
  }

  const { scrollToTop } = useCommon()

  onMounted(() => {
    scrollToTop()
    getArticleDetail()
  })
</script>

<style lang="scss" scoped>
  .article-detail {
    :deep(.markdown-body) {
      margin-top: 60px;

      img {
        width: 100%;
        border: 1px solid var(--art-gray-200);
      }

      pre {
        position: relative;

        &:hover {
          .copy-button {
            opacity: 1;
          }
        }

        &::before {
          position: absolute;
          top: 0;
          left: 50px;
          width: 1px;
          height: 100%;
          content: '';
          background: #0a0a0e;
        }
      }

      .code-wrapper {
        overflow-x: auto;
      }

      .line-number {
        position: sticky;
        left: 0;
        z-index: 2;
        box-sizing: border-box;
        display: inline-block;
        width: 50px;
        margin-right: 10px;
        font-size: 14px;
        color: #9e9e9e;
        text-align: center;
      }

      .copy-button {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        font-size: 20px;
        line-height: 40px;
        color: #999;
        text-align: center;
        cursor: pointer;
        background-color: #000;
        border: none;
        border-radius: 8px;
        opacity: 0;
        transition: all 0.2s;
      }
    }
  }
</style>
