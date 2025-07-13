<!-- 通知组件 -->
<template>
  <div
    class="notice"
    v-show="visible"
    :style="{
      transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
      opacity: show ? 1 : 0
    }"
    @click.stop=""
  >
    <div class="header">
      <span class="text">{{ $t('notice.title') }}</span>
      <span class="btn">{{ $t('notice.btnRead') }}</span>
    </div>

    <ul class="bar">
      <li
        v-for="(item, index) in barList"
        :key="index"
        :class="{ active: barActiveIndex === index }"
        @click="changeBar(index)"
      >
        {{ item.name }} ({{ item.num }})
      </li>
    </ul>

    <div class="content">
      <div class="scroll">
        <!-- 通知 -->
        <ul class="notice-list" v-show="barActiveIndex === 0">
          <li v-for="(item, index) in noticeList" :key="index">
            <div
              class="icon"
              :style="{ background: getNoticeStyle(item.type).backgroundColor + '!important' }"
            >
              <i
                class="iconfont-sys"
                :style="{ color: getNoticeStyle(item.type).iconColor + '!important' }"
                v-html="getNoticeStyle(item.type).icon"
              >
              </i>
            </div>
            <div class="text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- 消息 -->
        <ul class="user-list" v-show="barActiveIndex === 1">
          <li v-for="(item, index) in msgList" :key="index">
            <div class="avatar">
              <img :src="item.avatar" />
            </div>
            <div class="text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- 待办 -->
        <ul class="base" v-show="barActiveIndex === 2">
          <li v-for="(item, index) in pendingList" :key="index">
            <h4>{{ item.title }}</h4>
            <p>{{ item.time }}</p>
          </li>
        </ul>

        <!-- 空状态 -->
        <div class="empty-tips" v-show="currentTabIsEmpty">
          <i class="iconfont-sys">&#xe8d7;</i>
          <p>{{ $t('notice.text[0]') }}{{ barList[barActiveIndex].name }}</p>
        </div>
      </div>

      <div class="btn-wrapper">
        <el-button class="view-all" @click="handleViewAll" v-ripple>
          {{ $t('notice.viewAll') }}
        </el-button>
      </div>
    </div>

    <div style="height: 100px"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppConfig from '@/config'

  // 导入头像图片
  import avatar1 from '@/assets/img/avatar/avatar1.webp'
  import avatar2 from '@/assets/img/avatar/avatar2.webp'
  import avatar3 from '@/assets/img/avatar/avatar3.webp'
  import avatar4 from '@/assets/img/avatar/avatar4.webp'
  import avatar5 from '@/assets/img/avatar/avatar5.webp'
  import avatar6 from '@/assets/img/avatar/avatar6.webp'

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
    /** 图标颜色 */
    iconColor: string
    /** 背景颜色 */
    backgroundColor: string
  }

  type NoticeType = 'email' | 'message' | 'collection' | 'user' | 'notice'

  const { t } = useI18n()

  const props = defineProps<{
    value: boolean
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
        icon: '&#xe72e;',
        iconColor: 'rgb(var(--art-warning))',
        backgroundColor: 'rgb(var(--art-bg-warning))'
      },
      message: {
        icon: '&#xe747;',
        iconColor: 'rgb(var(--art-success))',
        backgroundColor: 'rgb(var(--art-bg-success))'
      },
      collection: {
        icon: '&#xe714;',
        iconColor: 'rgb(var(--art-danger))',
        backgroundColor: 'rgb(var(--art-bg-danger))'
      },
      user: {
        icon: '&#xe608;',
        iconColor: 'rgb(var(--art-info))',
        backgroundColor: 'rgb(var(--art-bg-info))'
      },
      notice: {
        icon: '&#xe6c2;',
        iconColor: 'rgb(var(--art-primary))',
        backgroundColor: 'rgb(var(--art-bg-primary))'
      }
    }

    const getRandomColor = (): string => {
      const index = Math.floor(Math.random() * AppConfig.systemMainColor.length)
      return AppConfig.systemMainColor[index]
    }

    const getNoticeStyle = (type: NoticeType): NoticeStyle => {
      const defaultStyle: NoticeStyle = {
        icon: '&#xe747;',
        iconColor: '#FFFFFF',
        backgroundColor: getRandomColor()
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
        visible.value = open
        setTimeout(() => {
          show.value = open
        }, 5)
      } else {
        show.value = open
        setTimeout(() => {
          visible.value = open
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

<style lang="scss" scoped>
  @use './style';
</style>
