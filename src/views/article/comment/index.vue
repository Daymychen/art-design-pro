<template>
  <div>
    <h1 class="text-4xl font-medium mt-[20px]">留言墙</h1>
    <p class="mt-[15px] text-gray-500">每一份留言都记录了您的想法，也为我们提供了珍贵的回忆</p>

    <ul
      class="mt-[40px] grid grid-cols-5 gap-[20px] max-2xl:grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 mb-[20px]"
    >
      <li
        class="relative p-[16px] cursor-pointer aspect-16/12 duration-300 hover:-translate-y-1.5"
        :style="{ background: item.color }"
        v-for="item in commentsWithColors"
        :key="item.id"
        @click="openDrawer(item)"
      >
        <p class="text-gray-400 text-[14px]">{{ item.date }}</p>
        <p class="mt-[16px] text-[14px] text-gray-800">{{ item.content }}</p>
        <div class="absolute bottom-[16px] left-0 px-[16px] flex-between w-full">
          <div class="flex items-center">
            <div class="flex items-center mr-[20px] text-[12px] text-gray-500">
              <ArtSvgIcon icon="ri:heart-line" class="mr-1 text-[16px]" />
              <span>{{ item.collection }}</span>
            </div>
            <div class="flex items-center mr-[20px] text-[12px] text-gray-500">
              <ArtSvgIcon icon="ri:message-3-line" class="mr-1 text-[16px]" />
              <span>{{ item.comment }}</span>
            </div>
          </div>
          <div>
            <span class="text-[14px] text-gray-700">{{ item.userName }}</span>
          </div>
        </div>
      </li>
    </ul>

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
          <div class="relative p-[16px] aspect-16/12" :style="{ background: clickItem.color }">
            <p class="text-gray-400 text-[14px]">{{ clickItem.date }}</p>
            <p class="mt-[16px] text-[14px] text-gray-800">{{ clickItem.content }}</p>
            <div class="absolute bottom-[16px] left-0 px-[16px] flex-between w-full">
              <div class="flex items-center">
                <div class="flex items-center mr-[20px] text-[12px] text-gray-500">
                  <ArtSvgIcon icon="ri:heart-line" class="mr-1 text-[16px]" />
                  <span>{{ clickItem.collection }}</span>
                </div>
                <div class="flex items-center mr-[20px] text-[12px] text-gray-500">
                  <ArtSvgIcon icon="ri:message-3-line" class="mr-1 text-[16px]" />
                  <span>{{ clickItem.comment }}</span>
                </div>
              </div>
              <span class="text-[14px] text-gray-700">{{ clickItem.userName }}</span>
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
