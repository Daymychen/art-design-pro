<template>
  <div class="page-comment">
    <h1 class="title">留言墙</h1>
    <p class="desc">每一份留言都记录了您的想法，也为我们提供了珍贵的回忆</p>

    <div class="list">
      <ul class="offset">
        <li
          class="comment-box"
          v-for="item in commentsWithColors"
          :key="item.id"
          :style="{ background: item.color }"
          @click="openDrawer(item)"
        >
          <p class="date">{{ item.date }}</p>
          <p class="content">{{ item.content }}</p>
          <div class="bottom">
            <div class="left">
              <span><i class="iconfont-sys">&#xe6eb;</i>{{ item.collection }}</span>
              <span><i class="iconfont-sys">&#xe6e9;</i>{{ item.comment }}</span>
            </div>
            <div class="right">
              <span>{{ item.userName }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <ElDrawer
      lDrawer
      v-model="showDrawer"
      :lock-scroll="false"
      :size="360"
      modal-class="comment-modal"
    >
      <template #header>
        <h4>详情</h4>
      </template>
      <template #default>
        <div class="drawer-default">
          <div class="comment-box" :style="{ background: clickItem.color }">
            <p class="date">{{ clickItem.date }}</p>
            <p class="content">{{ clickItem.content }}</p>
            <div class="bottom">
              <div class="left">
                <span><i class="iconfont-sys">&#xe6eb;</i>{{ clickItem.collection }}</span>
                <span><i class="iconfont-sys">&#xe6e9;</i>{{ clickItem.comment }}</span>
              </div>
              <div class="right">
                <span>{{ clickItem.userName }}</span>
              </div>
            </div>
          </div>

          <!-- 评论组件 -->
          <CommentWidget />
        </div>
      </template>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import { commentList } from '@/mock/temp/commentList'

  defineOptions({ name: 'ArticleComment' })

  interface CommentItem {
    id: number
    date: string
    content: string
    collection: number
    comment: number
    userName: string
    color?: string
  }

  const COLOR_LIST = ['#D8F8FF', '#FDDFD9', '#FCE6F0', '#D3F8F0', '#FFEABC', '#F5E1FF', '#E1E6FE']

  const showDrawer = ref(false)
  const clickItem = ref<CommentItem>({
    id: 1,
    date: '2024-9-3',
    content: '加油！学好Node 自己写个小Demo',
    collection: 5,
    comment: 8,
    userName: '匿名',
    color: COLOR_LIST[0]
  })

  /**
   * 为评论列表分配随机颜色
   */
  const commentsWithColors = computed(() => {
    let lastColorIndex = -1

    return commentList.map((item) => {
      let newIndex: number

      do {
        newIndex = Math.floor(Math.random() * COLOR_LIST.length)
      } while (newIndex === lastColorIndex && COLOR_LIST.length > 1)

      lastColorIndex = newIndex

      return {
        ...item,
        color: COLOR_LIST[newIndex]
      }
    })
  })

  /**
   * 打开评论详情抽屉
   */
  const openDrawer = (item: CommentItem) => {
    showDrawer.value = true
    clickItem.value = item
  }
</script>

<style lang="scss" scoped>
  .page-comment {
    background-color: transparent !important;
    box-shadow: none !important;

    :deep(.comment-modal) {
      background-color: transparent;
    }

    .title {
      margin-top: 20px;
      font-size: 36px;
      font-weight: 500;
    }

    .desc {
      margin-top: 15px;
      font-size: 14px;
      color: var(--art-text-gray-600);
    }

    .list {
      margin-top: 40px;

      .offset {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 16px);
      }
    }

    .comment-box {
      position: relative;
      box-sizing: border-box;
      width: calc(20% - 16px);
      aspect-ratio: 16 / 12;
      padding: 16px;
      margin: 0 16px 16px 0;
      cursor: pointer;
      background-color: #eae2cb;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .date {
        font-size: 12px;
        color: #949494;
      }

      .content {
        margin-top: 16px;
        font-size: 14px;
        color: #333;
      }

      .bottom {
        position: absolute;
        bottom: 16px;
        left: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 16px;

        .left {
          display: flex;
          align-items: center;

          span {
            display: flex;
            align-items: center;
            margin-right: 20px;
            font-size: 12px;
            color: #949494;

            i {
              margin-right: 5px;
            }
          }
        }

        .right {
          span {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }

    .drawer-default {
      .comment-box {
        width: 100%;

        &:hover {
          transform: translateY(0);
        }
      }
    }
  }

  @media screen and (max-width: $device-notebook) {
    .page-comment {
      .comment-box {
        width: calc(25% - 16px);
      }
    }
  }

  @media screen and (max-width: $device-ipad-pro) {
    .page-comment {
      .comment-box {
        width: calc(33.333% - 16px);
      }
    }
  }

  @media screen and (max-width: $device-ipad) {
    .page-comment {
      .comment-box {
        width: calc(50% - 16px);
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .page-comment {
      .comment-box {
        width: calc(100% - 16px);
      }
    }
  }

  .dark {
    .page-comment {
      .comment-box {
        color: #333 !important;
      }
    }
  }
</style>
