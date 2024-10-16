<template>
  <li class="comment-item">
    <div class="comment-main">
      <div class="comment-header">
        <div class="avatar" :style="{ background: randomColor() }">{{
          comment.author.substring(0, 1)
        }}</div>
        <strong class="name dark-text">{{ comment.author }}</strong>
      </div>
      <span class="content">{{ comment.content }}</span>
      <div class="comment-info">
        <span class="date">{{ formatDate(comment.timestamp) }}</span>
        <div class="btn-text" @click="toggleReply(comment.id)">回复</div>
      </div>
    </div>
    <ul class="comment-replies" v-if="comment.replies.length > 0">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :show-reply-form="showReplyForm"
        @toggle-reply="toggleReply"
        @add-reply="addReply"
      />
    </ul>

    <form v-if="showReplyForm === comment.id" @submit="handleSubmit">
      <div>
        <input v-model="replyAuthor" placeholder="你的名称" required />
        <textarea v-model="replyContent" placeholder="你的回复" required></textarea>
        <button class="btn" type="submit">发布</button>
      </div>
    </form>
  </li>
</template>

<script setup lang="ts">
  import { SystemMainColor } from '@/config/setting'
  import { ref } from 'vue'

  interface Comment {
    id: number
    author: string
    content: string
    timestamp: string
    replies: Comment[]
  }

  const props = defineProps<{
    comment: Comment
    showReplyForm: number | null
  }>()

  const emit = defineEmits<{
    (event: 'toggle-reply', commentId: number): void
    (event: 'add-reply', commentId: number, replyAuthor: string, replyContent: string): void
  }>()

  const replyAuthor = ref('')
  const replyContent = ref('')

  const toggleReply = (commentId: number) => {
    emit('toggle-reply', commentId)
  }

  const addReply = (commentId: number, author: string, content: string) => {
    emit('add-reply', commentId, author, content)
    replyAuthor.value = ''
    replyContent.value = ''
  }
  const handleSubmit = () => {
    emit('add-reply', props.comment.id, replyAuthor.value, replyContent.value)
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  let lastColor: string | null = null

  const randomColor = () => {
    let newColor: string

    do {
      const index = Math.floor(Math.random() * SystemMainColor.length)
      newColor = SystemMainColor[index]
    } while (newColor === lastColor)

    lastColor = newColor
    return newColor
  }
</script>

<style scoped lang="scss">
  .comment-module {
    margin-top: 40px;

    .comment-item,
    .reply-item {
      .comment-header {
        display: flex;
        align-items: center;

        .avatar {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          font-size: 12px;
          font-weight: 500;
          line-height: 30px;
          color: #fff;
          text-align: center;
          background-color: var(--main-color);
          border-radius: 50%;
        }

        .name {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #000;
        }
      }

      .content {
        display: block;
        margin-top: 10px;
        font-size: 14px;
        color: var(--art-gray-800);
      }

      .comment-info,
      .reply-info {
        display: flex;
        align-items: center;
        margin: 10px 0;
        margin-top: 10px;

        .date {
          font-size: 12px;
          color: var(--art-gray-500);
        }

        .btn-text {
          margin-left: 20px;
          font-size: 12px;
          color: var(--art-gray-800);
          cursor: pointer;
          user-select: none;

          &:hover {
            color: var(--main-color);
          }
        }
      }
    }

    .comment-replies {
      padding-left: 10px;

      .reply-item {
        margin-top: 20px;
      }
    }
  }
</style>
