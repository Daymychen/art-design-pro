<template>
  <div class="page-content">
    <h1 class="title">留言墙</h1>
    <p class="desc">每一份留言都记录了您的想法，也为我们提供了珍贵的回忆</p>

    <div class="list">
      <ul class="offset">
        <li
          class="comment-box"
          v-for="item in commentList"
          :key="item.id"
          :style="{ background: randomColor() }"
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

    <el-drawer v-model="showDrawer" :lock-scroll="false" :size="360" modal-class="comment-modal">
      <template #header>
        <h4>详情</h4>
      </template>
      <template #default>
        <div class="drawer-default">
          <div class="comment-box" :style="{ background: randomColor() }">
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
          <CommentWidget></CommentWidget>
        </div>
      </template>
      <template #footer>
        <div>
          <!-- <el-button @click="cancelClick">cancel</el-button> -->
          <!-- <el-button type="primary" @click="confirmClick">confirm</el-button> -->
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { commentList } from '@/mock/temp/commentList'
  const showDrawer = ref(false)

  // const colorList = reactive([
  //   'rgba(216, 248, 255, 0.8)',
  //   'rgba(253, 223, 217, 0.8)',
  //   'rgba(252, 230, 240, 0.8)',
  //   'rgba(211, 248, 240, 0.8)',
  //   'rgba(255, 234, 188, 0.8)',
  //   'rgba(245, 225, 255, 0.8)',
  //   'rgba(225, 230, 254, 0.8)'
  // ])

  const colorList = reactive([
    '#D8F8FF',
    '#FDDFD9',
    '#FCE6F0',
    '#D3F8F0',
    '#FFEABC',
    '#F5E1FF',
    '#E1E6FE'
  ])

  let lastColor: string | null = null

  const randomColor = () => {
    let newColor: string

    do {
      const index = Math.floor(Math.random() * colorList.length)
      newColor = colorList[index]
    } while (newColor === lastColor)

    lastColor = newColor
    return newColor
  }

  const clickItem = ref({
    id: 1,
    date: '2024-9-3',
    content: '加油！学好Node 自己写个小Demo',
    collection: 5,
    comment: 8,
    userName: '匿名'
  })

  const openDrawer = (item: any) => {
    showDrawer.value = true
    clickItem.value = item
  }
</script>

<style lang="scss" scoped>
  .page-content {
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
    .page-content {
      .comment-box {
        width: calc(25% - 16px);
      }
    }
  }

  @media screen and (max-width: $device-ipad-pro) {
    .page-content {
      .comment-box {
        width: calc(33.333% - 16px);
      }
    }
  }

  @media screen and (max-width: $device-ipad) {
    .page-content {
      .comment-box {
        width: calc(50% - 16px);
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .page-content {
      .comment-box {
        width: calc(100% - 16px);
      }
    }
  }

  .dark {
    .page-content {
      .comment-box {
        color: #333 !important;
      }
    }
  }
</style>
