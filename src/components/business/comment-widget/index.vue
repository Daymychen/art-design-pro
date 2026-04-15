<template>
  <div>
    <ElForm @submit.prevent="addComment" class="w-full mx-auto mb-10">
      <ElFormItem prop="author" class="mt-5">
        <ElInput
          v-model="newComment.author"
          placeholder="你的名称"
          class="block w-full"
          clearable
        />
      </ElFormItem>
      <ElFormItem prop="content">
        <ElInput
          v-model="newComment.content"
          placeholder="简单说两句..."
          type="textarea"
          :rows="5"
          clearable
        />
      </ElFormItem>
      <ElFormItem>
        <div class="flex justify-end w-full">
          <ElButton type="primary" @click="addComment"> 发布 </ElButton>
        </div>
      </ElFormItem>
    </ElForm>

    <ul>
      <div class="pb-5 text-lg font-medium"> 评论 {{ comments.length }} </div>
      <CommentItem
        v-for="comment in comments.slice().reverse()"
        :key="comment.id"
        :comment="comment"
        :show-reply-form="showReplyForm"
        @toggle-reply="toggleReply"
        @add-reply="addReply"
        class="pb-2.5 mb-5 border-b border-g-400"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CommentItem from './widget/CommentItem.vue'
  import { fetchCommentList, addComment as apiAddComment } from '@/api/comment'
  import type { Comment } from '@/api/comment'

  const props = defineProps<{ articleId?: number }>()
  const comments = ref<Comment[]>([])

  onMounted(async () => {
    if (props.articleId) {
      try {
        comments.value = await fetchCommentList(props.articleId)
      } catch (e) {
        console.error('获取评论失败:', e)
      }
    }
  })

  const newComment = ref<Partial<Comment>>({
    author: '',
    content: ''
  })

  const showReplyForm = ref<number | null>(null)

  const addComment = async () => {
    if (!newComment.value.author?.trim() || !newComment.value.content?.trim()) {
      ElMessage.warning('请填写完整的评论信息')
      return
    }

    try {
      await apiAddComment({
        articleId: props.articleId,
        author: newComment.value.author.trim(),
        content: newComment.value.content.trim()
      })

      // 重新加载评论列表
      if (props.articleId) {
        comments.value = await fetchCommentList(props.articleId)
      }

      newComment.value.author = ''
      newComment.value.content = ''
    } catch (e) {
      console.error('发布评论失败:', e)
    }
  }

  const addReply = async (commentId: number, replyAuthor: string, replyContent: string) => {
    if (!replyAuthor?.trim() || !replyContent?.trim()) {
      ElMessage.warning('请填写完整的回复信息')
      return
    }

    try {
      await apiAddComment({
        articleId: props.articleId,
        parentId: commentId,
        author: replyAuthor.trim(),
        content: replyContent.trim()
      })
      showReplyForm.value = null
      // 重新加载评论列表
      if (props.articleId) {
        comments.value = await fetchCommentList(props.articleId)
      }
    } catch (e) {
      console.error('回复失败:', e)
    }
  }

  const toggleReply = (commentId: number) => {
    showReplyForm.value = showReplyForm.value === commentId ? null : commentId
  }
</script>
