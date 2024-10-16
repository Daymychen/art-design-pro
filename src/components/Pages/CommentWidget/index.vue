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
      padding-bottom: 20px;
      font-size: 18px;
      font-weight: 500;
      color: var(--art-gray-900);
    }

    .comment-item {
      padding-bottom: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--art-border-dashed-color);
    }

    form {
      margin-bottom: 40px !important;
    }

    :deep(form) {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      padding-bottom: 50px;
      margin: auto;

      > div {
        input,
        textarea {
          box-sizing: border-box;
          display: block;
          width: 100%;
          margin-top: 10px;
          border: 1px solid var(--art-border-dashed-color);
          outline: none;
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
          position: absolute;
          right: 0;
          bottom: 0;
          display: inline-block;
          width: 60px;
          height: 32px;
          margin-top: 15px;
          font-size: 14px;
          line-height: 30px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          background-color: var(--main-color);
          border: 0;
          border-radius: 4px;
        }
      }
    }
  }
</style>
