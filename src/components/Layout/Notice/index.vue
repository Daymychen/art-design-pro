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
      <span class="text">通知</span>
      <span class="btn">标为已读</span>
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
        <ul class="notice-list" v-show="barActiveIndex === 0">
          <li v-for="(item, index) in noticeList" :key="index">
            <div class="icon" :style="{ background: getIcon(item.type)[0] + '!important' }">
              <i class="iconfont-sys">{{ getIcon(item.type)[1] }}</i>
            </div>
            <div class="text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.time }}</p>
            </div>
          </li>
        </ul>
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
        <ul class="base" v-show="barActiveIndex === 3">
          <li v-for="(item, index) in pendingList" :key="index">
            <h4>{{ item.title }}</h4>
            <p>{{ item.time }}</p>
          </li>
        </ul>

        <div class="empty-tips" v-show="barActiveIndex === 0 && noticeList.length === 0">
          <i class="iconfont">&#xe707;</i>
          <p>暂无{{ barList[barActiveIndex].name }}</p>
        </div>
        <div class="empty-tips" v-show="barActiveIndex === 1 && msgList.length === 0">
          <i class="iconfont">&#xe707;</i>
          <p>暂无{{ barList[barActiveIndex].name }}</p>
        </div>
        <div class="empty-tips" v-show="barActiveIndex === 2 && pendingList.length === 0">
          <i class="iconfont">&#xe707;</i>
          <p>暂无{{ barList[barActiveIndex].name }}</p>
        </div>
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
  import { SystemMainColor } from '@/config/setting'

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

  const barList = [
    {
      name: '通知',
      num: 1
    },
    {
      name: '消息',
      num: 1
    },
    {
      name: '代办',
      num: 0
    }
  ]

  const noticeList = [
    {
      title: '通知中心样式优化',
      time: '2024-8-30 09:00',
      type: 'notice'
    },
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

  // 优化这个随机数，相邻不重复
  const getRandomColor = () => {
    const index = Math.floor(Math.random() * SystemMainColor.length)
    return SystemMainColor[index]
  }

  const getIcon = (type: string) => {
    let icon = '\ue747'

    switch (type) {
      case 'email':
        icon = '\ue72e'
        break
      case 'message':
        icon = '\ue747'
        break
      case 'collection':
        icon = '\ue714'
        break
      case 'user':
        icon = '\ue608'
        break
      case 'notice':
        icon = '\ue6c2'
        break
    }

    return [getRandomColor(), icon]
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
</script>

<style lang="scss" scoped>
  @import './style';
</style>
