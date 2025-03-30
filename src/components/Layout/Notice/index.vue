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
        <ul class="base" v-show="barActiveIndex === 3">
          <li v-for="(item, index) in pendingList" :key="index">
            <h4>{{ item.title }}</h4>
            <p>{{ item.time }}</p>
          </li>
        </ul>

        <div class="empty-tips" v-show="barActiveIndex === 0 && noticeList.length === 0">
          <i class="iconfont-sys">&#xe8d7;</i>
          <p>{{ $t('notice.text[0]') }}{{ barList[barActiveIndex].name }}</p>
        </div>
        <div class="empty-tips" v-show="barActiveIndex === 1 && msgList.length === 0">
          <i class="iconfont-sys">&#xe8d7;</i>
          <p>{{ $t('notice.text[0]') }}{{ barList[barActiveIndex].name }}</p>
        </div>
        <div class="empty-tips" v-show="barActiveIndex === 2 && pendingList.length === 0">
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
  import avatar1 from '@/assets/img/avatar/avatar1.jpg'
  import avatar2 from '@/assets/img/avatar/avatar2.jpg'
  import avatar3 from '@/assets/img/avatar/avatar3.jpg'
  import avatar4 from '@/assets/img/avatar/avatar4.jpg'
  import avatar5 from '@/assets/img/avatar/avatar5.jpg'
  import avatar6 from '@/assets/img/avatar/avatar6.jpg'
  import AppConfig from '@/config'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    value: {
      type: Boolean,
      default: false
    }
  })

  watch(
    () => props.value,
    () => {
      showNotice(props.value)
    }
  )

  const show = ref(false)
  const visible = ref(false)
  const barActiveIndex = ref(0)
  const pendingList: any = []

  const barList = ref([
    {
      name: computed(() => t('notice.bar[0]')),
      num: 1
    },
    {
      name: computed(() => t('notice.bar[1]')),
      num: 1
    },
    {
      name: computed(() => t('notice.bar[2]')),
      num: 0
    }
  ])

  const noticeList = [
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
  ]
  const msgList: any = [
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
  ]

  const changeBar = (index: number) => {
    barActiveIndex.value = index
  }

  const getRandomColor = () => {
    const index = Math.floor(Math.random() * AppConfig.systemMainColor.length)
    return AppConfig.systemMainColor[index]
  }

  const noticeStyleMap = {
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

  const getNoticeStyle = (type: string) => {
    const defaultStyle = {
      icon: '&#xe747;',
      iconColor: '#FFFFFF',
      backgroundColor: getRandomColor()
    }

    const style = noticeStyleMap[type as keyof typeof noticeStyleMap] || defaultStyle

    return {
      ...style,
      backgroundColor: style.backgroundColor
    }
  }

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

  // 查看全部
  const handleViewAll = () => {
    switch (barActiveIndex.value) {
      case 0:
        handleNoticeAll()
        break
      case 1:
        handleMsgAll()
        break
      case 2:
        handlePendingAll()
        break
    }
  }

  const handleNoticeAll = () => {}
  const handleMsgAll = () => {}
  const handlePendingAll = () => {}
</script>

<style lang="scss" scoped>
  @use './style';
</style>
