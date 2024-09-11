<template>
  <div class="comment-module">
    <form @submit.prevent="addComment">
      <div>
        <input v-model="newComment.author" placeholder="你的名称" required />
        <textarea v-model="newComment.content" placeholder="简单说两句..." required></textarea>
        <button class="btn" type="submit">发布</button>
      </div>
    </form>

    <ul>
      <div class="comment-header">评论 {{ comments.length }}</div>
      <CommentItem
        class="comment-item"
        v-for="comment in comments.slice().reverse()"
        :key="comment.id"
        :comment="comment"
        :show-reply-form="showReplyForm"
        @toggle-reply="toggleReply"
        @add-reply="addReply"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CommentItem from './CommentItem.vue'
  import { commentList, Comment } from '@/mock/temp/commentDetail'
  const comments = commentList

  const newComment = ref<Partial<Comment>>({
    author: '',
    content: ''
  })

  const showReplyForm = ref<number | null>(null)

  const addComment = () => {
    if (newComment.value.author && newComment.value.content) {
      comments.value.push({
        id: Date.now(),
        author: newComment.value.author,
        content: newComment.value.content,
        timestamp: new Date().toISOString(),
        replies: []
      })
      newComment.value.author = ''
      newComment.value.content = ''
    } else {
      alert('请填写完整的评论信息')
    }
  }

  const addReply = (commentId: number, replyAuthor: string, replyContent: string) => {
    const comment = findComment(comments.value, commentId)
    if (comment && replyAuthor && replyContent) {
      comment.replies.push({
        id: Date.now(),
        author: replyAuthor,
        content: replyContent,
        timestamp: new Date().toISOString(),
        replies: []
      })
      showReplyForm.value = null
    } else {
      alert('请填写完整的回复信息')
    }
  }

  const toggleReply = (commentId: number) => {
    showReplyForm.value = showReplyForm.value === commentId ? null : commentId
  }

  const findComment = (comments: Comment[], commentId: number): Comment | undefined => {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment
      }
      const found = findComment(comment.replies, commentId)
      if (found) {
        return found
      }
    }
    return undefined
  }
</script>

<style scoped lang="scss">
  .comment-module {
    .comment-header {
      color: var(--art-gray-900);
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 20px;
    }

    .comment-item {
      border-bottom: 1px solid var(--art-border-dashed-color);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    form {
      margin-bottom: 40px !important;
    }

    :deep(form) {
      width: 100%;
      margin: auto;
      box-sizing: border-box;
      padding-bottom: 50px;
      position: relative;

      > div {
        input,
        textarea {
          width: 100%;
          border: 1px solid var(--art-border-dashed-color);
          display: block;
          outline: none;
          box-sizing: border-box;
          margin-top: 10px;
        }

        input {
          height: 36px;
          padding-left: 10px;
        }

        textarea {
          height: 100px;
          padding: 10px;
        }

        .btn {
          width: 60px;
          height: 32px;
          line-height: 30px;
          color: #fff;
          font-size: 14px;
          border-radius: 4px;
          text-align: center;
          display: inline-block;
          border: 0;
          background-color: var(--main-color);
          margin-top: 15px;
          border: 0;
          position: absolute;
          right: 0;
          bottom: 0;
          cursor: pointer;
        }
      }
    }
  }
</style>
