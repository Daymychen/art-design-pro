<!-- 图片卡片 -->
<template>
  <div class="image-card" @click="handleClick">
    <ElCard :body-style="{ padding: '0px' }" shadow="hover" class="art-custom-card">
      <div class="image-wrapper">
        <ElImage :src="props.imageUrl" fit="cover" loading="lazy">
          <template #placeholder>
            <div class="image-placeholder">
              <ElIcon><Picture /></ElIcon>
            </div>
          </template>
        </ElImage>
        <div class="read-time" v-if="props.readTime"> {{ props.readTime }} 阅读 </div>
      </div>

      <div class="content">
        <div class="category" v-if="props.category">
          {{ props.category }}
        </div>
        <p class="title">{{ props.title }}</p>
        <div class="stats">
          <span class="views" v-if="props.views">
            <ElIcon><View /></ElIcon>
            {{ props.views }}
          </span>
          <span class="comments" v-if="props.comments">
            <ElIcon><ChatLineRound /></ElIcon>
            {{ props.comments }}
          </span>
          <span class="date">{{ props.date }}</span>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { Picture, View, ChatLineRound } from '@element-plus/icons-vue'

  defineOptions({ name: 'ArtImageCard' })

  interface Props {
    /** 图片地址 */
    imageUrl: string
    /** 标题 */
    title: string
    /** 分类 */
    category?: string
    /** 阅读时间 */
    readTime?: string
    /** 浏览量 */
    views?: number
    /** 评论数 */
    comments?: number
    /** 日期 */
    date?: string
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    (e: 'click', card: Props): void
  }>()

  const handleClick = () => {
    emit('click', props)
  }
</script>

<style lang="scss" scoped>
  .image-card {
    width: 100%;
    cursor: pointer;

    .art-custom-card {
      border-radius: calc(var(--custom-radius) + 2px) !important;
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16/10; // 图片宽高比 16:10
      overflow: hidden;

      .el-image {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-in-out;

        &:hover {
          transform: scale(1.05);
        }
      }

      .read-time {
        position: absolute;
        right: 15px;
        bottom: 15px;
        padding: 4px 8px;
        font-size: 12px;
        background: var(--art-gray-200);
        border-radius: 4px;
      }

      .image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
      }
    }

    .content {
      padding: 16px;

      .category {
        display: inline-block;
        padding: 2px 8px;
        margin-bottom: 8px;
        font-size: 12px;
        background: var(--art-gray-200);
        border-radius: 4px;
      }

      .title {
        margin: 0 0 12px;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.4;
        color: var(--art-text-gray-900);
      }

      .stats {
        display: flex;
        gap: 16px;
        align-items: center;
        font-size: 13px;
        color: var(--art-text-gray-600);

        .views,
        .comments {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
</style>
