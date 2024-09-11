<template>
  <div class="article-detail page-content">
    <div class="content">
      <h1>{{ articleTitle }}</h1>
      <div class="markdown-body" v-highlight v-html="articleHtml"></div>
    </div>
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/markdown.scss'
  import '@/assets/styles/one-dark-pro.scss'
  import { ApiStatus } from '@/utils/http/status'
  import BackToTop from '@comps/Widgets/BackToTop.vue'
  import axios from 'axios'
  // import 'highlight.js/styles/atom-one-dark.css';
  // import 'highlight.js/styles/vs2015.css';
  // import { ArticleService } from '@/api/articleApi'

  const articleId = ref(0)
  const router = useRoute()
  const articleTitle = ref('')
  const articleHtml = ref('')

  onMounted(() => {
    scrollToTop()
    articleId.value = Number(router.query.id)
    getArticleDetail()
  })

  const getArticleDetail = async () => {
    if (articleId.value) {
      const res = await axios.get('https://www.qiniu.lingchen.kim/blog_detail.json')
      if (res.data.code === ApiStatus.success) {
        articleTitle.value = res.data.data.title
        articleHtml.value = res.data.data.html_content
      }

      // const res = await ArticleService.getArticleDetail(articleId.value)
      // if (res.code === ApiStatus.success) {
      //   articleTitle.value = res.data.title;;
      //   articleHtml.value = res.data.html_content;
      // }
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<style lang="scss">
  .article-detail {
    .content {
      max-width: 800px;
      margin: auto;
      margin-top: 60px;

      .markdown-body {
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

        .line-number {
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
          top: 10px;
          right: 10px;
          z-index: 1;
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
  }
</style>
