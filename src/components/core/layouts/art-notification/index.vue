<!-- 通知组件 -->
<template>
  <div
    class="art-notification-panel art-card-sm !shadow-xl"
    :style="{
      transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
      opacity: show ? 1 : 0
    }"
    v-show="visible"
    @click.stop
  >
    <div class="flex-cb px-3.5 mt-3.5">
      <span class="text-base font-medium text-g-800">{{ $t('notice.title') }}</span>
      <span class="text-xs text-g-800 px-1.5 py-1 c-p select-none rounded hover:bg-g-200">
        {{ $t('notice.btnRead') }}
      </span>
    </div>

    <ul class="box-border flex items-end w-full h-12.5 px-3.5 border-b-d">
      <li
        v-for="(item, index) in barList"
        :key="index"
        class="h-12 leading-12 mr-5 overflow-hidden text-[13px] text-g-700 c-p select-none"
        :class="{ 'bar-active': barActiveIndex === index }"
        @click="changeBar(index)"
      >
        {{ item.name }} ({{ item.num }})
      </li>
    </ul>

    <div class="w-full h-[calc(100%-95px)]">
      <div class="h-[calc(100%-60px)] overflow-y-scroll scrollbar-thin">
        <!-- 通知 -->
        <ul v-show="barActiveIndex === 0">
          <li
            v-for="(item, index) in noticeList"
            :key="index"
            class="box-border flex-c px-3.5 py-3.5 c-p last:border-b-0 hover:bg-g-200/60"
          >
            <div
              class="size-9 leading-9 text-center rounded-lg flex-cc"
              :class="[getNoticeStyle(item.type).iconClass]"
            >
              <ArtSvgIcon class="text-lg !bg-transparent" :icon="getNoticeStyle(item.type).icon" />
            </div>
            <div class="w-[calc(100%-45px)] ml-3.5">
              <h4 class="text-sm font-normal leading-5.5 text-g-900">{{ item.title }}</h4>
              <p class="mt-1.5 text-xs text-g-500">{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- 消息 -->
        <ul v-show="barActiveIndex === 1">
          <li
            v-for="(item, index) in msgList"
            :key="index"
            class="box-border flex-c px-3.5 py-3.5 c-p last:border-b-0 hover:bg-g-200/60"
          >
            <div class="w-9 h-9">
              <img :src="item.avatar" class="w-full h-full rounded-lg" />
            </div>
            <div class="w-[calc(100%-45px)] ml-3.5">
              <h4 class="text-xs font-normal leading-5.5">{{ item.title }}</h4>
              <p class="mt-1.5 text-xs text-g-500">{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- 待办 -->
        <ul v-show="barActiveIndex === 2">
          <li
            v-for="(item, index) in pendingList"
            :key="index"
            class="box-border px-5 py-3.5 last:border-b-0"
          >
            <h4>{{ item.title }}</h4>
            <p class="text-xs text-g-500">{{ item.time }}</p>
          </li>
        </ul>

        <!-- 空状态 -->
        <div
          v-show="currentTabIsEmpty"
          class="relative top-25 h-full text-g-500 text-center !bg-transparent"
        >
          <ArtSvgIcon icon="system-uicons:inbox" class="text-5xl" />
          <p class="mt-3.5 text-xs !bg-transparent"
            >{{ $t('notice.text[0]') }}{{ barList[barActiveIndex].name }}</p
          >
        </div>
      </div>

      <div class="relative box-border w-full px-3.5">
        <ElButton class="w-full mt-3" @click="handleViewAll" v-ripple>
          {{ $t('notice.viewAll') }}
        </ElButton>
      </div>
    </div>

    <div class="h-25"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
  import { useI18n } from 'vue-i18n'

  // 导入头像图片
  import avatar1 from '@/assets/images/avatar/avatar1.webp'
  import avatar2 from '@/assets/images/avatar/avatar2.webp'
  import avatar3 from '@/assets/images/avatar/avatar3.webp'
  import avatar4 from '@/assets/images/avatar/avatar4.webp'
  import avatar5 from '@/assets/images/avatar/avatar5.webp'
  import avatar6 from '@/assets/images/avatar/avatar6.webp'

  defineOptions({ name: 'ArtNotification' })

  interface NoticeItem {
    /** 标题 */
    title: string
    /** 时间 */
    time: string
    /** 类型 */
    type: NoticeType
  }

  interface MessageItem {
    /** 标题 */
    title: string
    /** 时间 */
    time: string
    /** 头像 */
    avatar: string
  }

  interface PendingItem {
    /** 标题 */
    title: string
    /** 时间 */
    time: string
  }

  interface BarItem {
    /** 名称 */
    name: ComputedRef<string>
    /** 数量 */
    num: number
  }

  interface NoticeStyle {
    /** 图标 */
    icon: string
    /** icon 样式 */
    iconClass: string
  }

  type NoticeType = 'email' | 'message' | 'collection' | 'user' | 'notice'

  const { t } = useI18n()

  const props = defineProps<{
    value: boolean
  }>()

  const emit = defineEmits<{
    'update:value': [value: boolean]
  }>()

  const show = ref(false)
  const visible = ref(false)
  const barActiveIndex = ref(0)

  const useNotificationData = () => {
    // 通知数据
    const noticeList = ref<NoticeItem[]>([
      {
        title: '新增国际化',
        time: '2024-6-13 0:10',
        type: 'notice'
      },
      {
        title: '冷月呆呆给你发了一条消息',
        time: '2024-4-21 8:05',
        type: 'message'
      },
      {
        title: '小肥猪关注了你',
        time: '2020-3-17 21:12',
        type: 'collection'
      },
      {
        title: '新增使用文档',
        time: '2024-02-14 0:20',
        type: 'notice'
      },
      {
        title: '小肥猪给你发了一封邮件',
        time: '2024-1-20 0:15',
        type: 'email'
      },
      {
        title: '菜单mock本地真实数据',
        time: '2024-1-17 22:06',
        type: 'notice'
      }
    ])

    // 消息数据
    const msgList = ref<MessageItem[]>([
      {
        title: '池不胖 关注了你',
        time: '2021-2-26 23:50',
        avatar: avatar1
      },
      {
        title: '唐不苦 关注了你',
        time: '2021-2-21 8:05',
        avatar: avatar2
      },
      {
        title: '中小鱼 关注了你',
        time: '2020-1-17 21:12',
        avatar: avatar3
      },
      {
        title: '何小荷 关注了你',
        time: '2021-01-14 0:20',
        avatar: avatar4
      },
      {
        title: '誶誶淰 关注了你',
        time: '2020-12-20 0:15',
        avatar: avatar5
      },
      {
        title: '冷月呆呆 关注了你',
        time: '2020-12-17 22:06',
        avatar: avatar6
      }
    ])

    // 待办数据
    const pendingList = ref<PendingItem[]>([])

    // 标签栏数据
    const barList = computed<BarItem[]>(() => [
      {
        name: computed(() => t('notice.bar[0]')),
        num: noticeList.value.length
      },
      {
        name: computed(() => t('notice.bar[1]')),
        num: msgList.value.length
      },
      {
        name: computed(() => t('notice.bar[2]')),
        num: pendingList.value.length
      }
    ])

    return {
      noticeList,
      msgList,
      pendingList,
      barList
    }
  }

  // 样式管理
  const useNotificationStyles = () => {
    const noticeStyleMap: Record<NoticeType, NoticeStyle> = {
      email: {
        icon: 'ri:mail-line',
        iconClass: 'bg-warning/12 text-warning'
      },
      message: {
        icon: 'ri:volume-down-line',
        iconClass: 'bg-success/12 text-success'
      },
      collection: {
        icon: 'ri:heart-3-line',
        iconClass: 'bg-danger/12 text-danger'
      },
      user: {
        icon: 'ri:volume-down-line',
        iconClass: 'bg-info/12 text-info'
      },
      notice: {
        icon: 'ri:notification-3-line',
        iconClass: 'bg-theme/12 text-theme'
      }
    }

    const getNoticeStyle = (type: NoticeType): NoticeStyle => {
      const defaultStyle: NoticeStyle = {
        icon: 'ri:arrow-right-circle-line',
        iconClass: 'bg-theme/12 text-theme'
      }

      return noticeStyleMap[type] || defaultStyle
    }

    return {
      getNoticeStyle
    }
  }

  // 动画管理
  const useNotificationAnimation = () => {
    const showNotice = (open: boolean) => {
      if (open) {
        visible.value = true
        setTimeout(() => {
          show.value = true
        }, 5)
      } else {
        show.value = false
        setTimeout(() => {
          visible.value = false
        }, 350)
      }
    }

    return {
      showNotice
    }
  }

  // 标签页管理
  const useTabManagement = (
    noticeList: Ref<NoticeItem[]>,
    msgList: Ref<MessageItem[]>,
    pendingList: Ref<PendingItem[]>,
    businessHandlers: {
      handleNoticeAll: () => void
      handleMsgAll: () => void
      handlePendingAll: () => void
    }
  ) => {
    const changeBar = (index: number) => {
      barActiveIndex.value = index
    }

    // 检查当前标签页是否为空
    const currentTabIsEmpty = computed(() => {
      const tabDataMap = [noticeList.value, msgList.value, pendingList.value]

      const currentData = tabDataMap[barActiveIndex.value]
      return currentData && currentData.length === 0
    })

    const handleViewAll = () => {
      // 查看全部处理器映射
      const viewAllHandlers: Record<number, () => void> = {
        0: businessHandlers.handleNoticeAll,
        1: businessHandlers.handleMsgAll,
        2: businessHandlers.handlePendingAll
      }

      const handler = viewAllHandlers[barActiveIndex.value]
      handler?.()

      // 关闭通知面板
      emit('update:value', false)
    }

    return {
      changeBar,
      currentTabIsEmpty,
      handleViewAll
    }
  }

  // 业务逻辑处理
  const useBusinessLogic = () => {
    const handleNoticeAll = () => {
      // 处理查看全部通知
      console.log('查看全部通知')
    }

    const handleMsgAll = () => {
      // 处理查看全部消息
      console.log('查看全部消息')
    }

    const handlePendingAll = () => {
      // 处理查看全部待办
      console.log('查看全部待办')
    }

    return {
      handleNoticeAll,
      handleMsgAll,
      handlePendingAll
    }
  }

  // 组合所有逻辑
  const { noticeList, msgList, pendingList, barList } = useNotificationData()
  const { getNoticeStyle } = useNotificationStyles()
  const { showNotice } = useNotificationAnimation()
  const { handleNoticeAll, handleMsgAll, handlePendingAll } = useBusinessLogic()
  const { changeBar, currentTabIsEmpty, handleViewAll } = useTabManagement(
    noticeList,
    msgList,
    pendingList,
    { handleNoticeAll, handleMsgAll, handlePendingAll }
  )

  // 监听属性变化
  watch(
    () => props.value,
    (newValue) => {
      showNotice(newValue)
    }
  )
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .art-notification-panel {
    @apply absolute 
    top-14.5 
    right-5 
    w-90 
    h-125 
    overflow-hidden 
    transition-all 
    duration-300
    origin-top 
    will-change-[top,left] 
    max-[640px]:top-[65px]
    max-[640px]:right-0
    max-[640px]:w-full 
    max-[640px]:h-[80vh];
  }

  .bar-active {
    color: var(--theme-color) !important;
    border-bottom: 2px solid var(--theme-color);
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 5px !important;
  }

  .dark .scrollbar-thin::-webkit-scrollbar-track {
    background-color: var(--default-box-color);
  }

  .dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #222 !important;
  }
</style>
