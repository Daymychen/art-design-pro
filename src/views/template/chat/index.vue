<!-- 聊天页 -->
<template>
  <div class="page-content flex !p-0 max-md:flex-col" :style="{ height: containerMinHeight }">
    <ElRow>
      <ElCol :span="12">
        <div class="grid-content ep-bg-purple" />
      </ElCol>
      <ElCol :span="12">
        <div class="grid-content ep-bg-purple-light" />
      </ElCol>
    </ElRow>
    <div
      class="box-border w-90 h-full p-5 border-r border-g-300 max-md:w-full max-md:h-42 max-md:border-r-0"
    >
      <div class="pb-5 max-md:!hidden">
        <div class="flex-c gap-3">
          <ElAvatar :size="50" :src="selectedPerson?.avatar" />
          <div>
            <div class="text-base font-medium">{{ selectedPerson?.name }}</div>
            <div class="mt-1 text-xs text-g-500">{{ selectedPerson?.email }}</div>
          </div>
        </div>
        <div class="mt-3">
          <ElInput v-model="searchQuery" placeholder="搜索联系人" prefix-icon="Search" clearable />
        </div>
        <ElDropdown trigger="click" placement="bottom-start">
          <span class="mt-5 c-p">
            排序方式
            <ElIcon class="el-icon--right">
              <arrow-down />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>按时间排序</ElDropdownItem>
              <ElDropdownItem>按名称排序</ElDropdownItem>
              <ElDropdownItem>全部标为已读</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
      <ElScrollbar>
        <div
          v-for="item in personList"
          :key="item.id"
          class="flex-c p-3 c-p rounded-lg tad-300 ease-in-out hover:bg-g-200"
          :class="{ 'bg-g-200': selectedPerson?.id === item.id }"
          @click="selectPerson(item)"
        >
          <div class="relative mr-3">
            <ElAvatar :size="40" :src="item.avatar">
              {{ item.name.charAt(0) }}
            </ElAvatar>
            <div
              class="absolute right-1 bottom-1 size-2 rounded-full"
              :class="item.online ? 'bg-success/100' : 'bg-error/100'"
            ></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex-cb mb-1">
              <span class="text-sm font-medium">{{ item.name }}</span>
              <span class="text-xs text-g-600">{{ item.lastTime }}</span>
            </div>
            <div class="flex-cb">
              <span class="overflow-hidden text-xs text-g-600 text-ellipsis whitespace-nowrap">{{
                item.email
              }}</span>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <div class="box-border flex-1 h-full max-md:h-[calc(70%-30px)]">
      <div class="flex-cb pt-4 px-4 pb-0 mb-5">
        <div>
          <span class="text-base font-medium">Art Bot</span>
          <div class="flex-c gap-1 mt-1.5">
            <div
              class="w-2 h-2 rounded-full"
              :class="isOnline ? 'bg-success/100' : 'bg-danger/100'"
            ></div>
            <span class="text-xs text-g-600">{{ isOnline ? '在线' : '离线' }}</span>
          </div>
        </div>
        <div class="flex-c gap-2">
          <ArtIconButton icon="ri:phone-line" circle class="size-11 text-g-600" />
          <ArtIconButton icon="ri:video-on-line" circle class="size-11 text-g-600" />
          <ArtIconButton icon="ri:more-2-fill" circle class="size-11 text-g-600" />
        </div>
      </div>
      <div class="flex flex-col h-[calc(100%-85px)]">
        <!-- 聊天消息区域 -->
        <div
          class="flex-1 py-7.5 px-4 overflow-y-auto border-t-d [&::-webkit-scrollbar]:!w-1"
          ref="messageContainer"
        >
          <template v-for="message in messages" :key="message.id">
            <div
              :class="[
                'flex gap-2 items-start w-full mb-7.5',
                message.isMe ? 'flex-row-reverse' : 'flex-row justify-start'
              ]"
            >
              <ElAvatar :size="32" :src="message.avatar" class="flex-shrink-0" />
              <div
                class="flex flex-col max-w-[70%]"
                :class="message.isMe ? 'items-end' : 'items-start'"
              >
                <div
                  class="flex gap-2 mb-1 text-xs"
                  :class="message.isMe ? 'flex-row-reverse' : 'flex-row'"
                >
                  <span class="font-medium">{{ message.sender }}</span>
                  <span class="text-g-600">{{ message.time }}</span>
                </div>
                <div
                  class="py-2.5 px-3.5 text-sm leading-[1.4] rounded-md"
                  :class="message.isMe ? '!bg-theme/15' : '!bg-g-300/60'"
                  >{{ message.content }}</div
                >
              </div>
            </div>
          </template>
        </div>

        <!-- 聊天输入区域 -->
        <div class="p-4">
          <ElInput
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="输入消息"
            resize="none"
            @keyup.enter.prevent="sendMessage"
          >
            <template #append>
              <div class="flex gap-2 py-2">
                <ElButton :icon="Paperclip" circle plain />
                <ElButton :icon="Picture" circle plain />
                <ElButton type="primary" @click="sendMessage" v-ripple>发送</ElButton>
              </div>
            </template>
          </ElInput>
          <div class="flex-cb mt-3">
            <div class="flex-c">
              <ArtSvgIcon icon="ri:image-line" class="mr-5 c-p text-g-400 text-lg" />
              <ArtSvgIcon icon="ri:emotion-happy-line" class="mr-5 c-p text-g-400 text-lg" />
            </div>
            <ElButton type="primary" @click="sendMessage" v-ripple class="min-w-20">发送</ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Picture, Paperclip, ArrowDown } from '@element-plus/icons-vue'
  import { mittBus } from '@/utils/sys'
  import meAvatar from '@/assets/img/avatar/avatar5.webp'
  import aiAvatar from '@/assets/img/avatar/avatar10.webp'
  import avatar2 from '@/assets/img/avatar/avatar2.webp'
  import avatar3 from '@/assets/img/avatar/avatar3.webp'
  import avatar4 from '@/assets/img/avatar/avatar4.webp'
  import avatar5 from '@/assets/img/avatar/avatar5.webp'
  import avatar6 from '@/assets/img/avatar/avatar6.webp'
  import avatar7 from '@/assets/img/avatar/avatar7.webp'
  import avatar8 from '@/assets/img/avatar/avatar8.webp'
  import avatar9 from '@/assets/img/avatar/avatar9.webp'
  import avatar10 from '@/assets/img/avatar/avatar10.webp'
  import { useCommon } from '@/composables/useCommon'

  defineOptions({ name: 'TemplateChat' })

  const { containerMinHeight } = useCommon()

  /**
   * 联系人类型定义
   */
  interface Person {
    id: number
    name: string
    email: string
    avatar: string
    online?: boolean
    lastTime: string
    unread?: number
  }

  const searchQuery = ref('')
  const isDrawerVisible = ref(false)
  const isOnline = ref(true)
  const selectedPerson = ref<Person | null>(null)
  const messageText = ref('')
  const messageId = ref(10)
  const userAvatar = ref(meAvatar)
  const messageContainer = ref<HTMLElement | null>(null)

  /**
   * 联系人列表数据
   */
  const personList = ref<Person[]>([
    {
      id: 1,
      name: '梅洛迪·梅西',
      email: 'melody@altbox.com',
      avatar: meAvatar,
      online: true,
      lastTime: '20小时前',
      unread: 0
    },
    {
      id: 2,
      name: '马克·史密斯',
      email: 'max@kt.com',
      avatar: avatar2,
      online: true,
      lastTime: '2周前',
      unread: 6
    },
    {
      id: 3,
      name: '肖恩·宾',
      email: 'sean@dellito.com',
      avatar: avatar3,
      online: false,
      lastTime: '5小时前',
      unread: 5
    },
    {
      id: 4,
      name: '爱丽丝·约翰逊',
      email: 'alice@domain.com',
      avatar: avatar4,
      online: true,
      lastTime: '1小时前',
      unread: 2
    },
    {
      id: 5,
      name: '鲍勃·布朗',
      email: 'bob@domain.com',
      avatar: avatar5,
      online: false,
      lastTime: '3天前',
      unread: 1
    },
    {
      id: 6,
      name: '查理·戴维斯',
      email: 'charlie@domain.com',
      avatar: avatar6,
      online: true,
      lastTime: '10分钟前',
      unread: 0
    },
    {
      id: 7,
      name: '戴安娜·普林斯',
      email: 'diana@domain.com',
      avatar: avatar7,
      online: true,
      lastTime: '15分钟前',
      unread: 3
    },
    {
      id: 8,
      name: '伊桑·亨特',
      email: 'ethan@domain.com',
      avatar: avatar8,
      online: true,
      lastTime: '5分钟前',
      unread: 0
    },
    {
      id: 9,
      name: '杰西卡·琼斯',
      email: 'jessica@domain.com',
      avatar: avatar9,
      online: false,
      lastTime: '1天前',
      unread: 4
    },
    {
      id: 10,
      name: '彼得·帕克',
      email: 'peter@domain.com',
      avatar: avatar10,
      online: true,
      lastTime: '2小时前',
      unread: 1
    },
    {
      id: 11,
      name: '克拉克·肯特',
      email: 'clark@domain.com',
      avatar: avatar3,
      online: true,
      lastTime: '30分钟前',
      unread: 2
    },
    {
      id: 12,
      name: '布鲁斯·韦恩',
      email: 'bruce@domain.com',
      avatar: avatar5,
      online: false,
      lastTime: '3天前',
      unread: 0
    },
    {
      id: 13,
      name: '韦德·威尔逊',
      email: 'wade@domain.com',
      avatar: avatar6,
      online: true,
      lastTime: '10分钟前',
      unread: 5
    }
  ])

  /**
   * 选择联系人
   * @param person 联系人对象
   */
  const selectPerson = (person: Person) => {
    selectedPerson.value = person
  }

  /**
   * 消息列表数据
   */
  const messages = ref([
    {
      id: 1,
      sender: 'Art Bot',
      content: '你好！我是你的AI助手，有什么我可以帮你的吗？',
      time: '10:00',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 2,
      sender: 'Ricky',
      content: '我想了解一下系统的使用方法。',
      time: '10:01',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 3,
      sender: 'Art Bot',
      content: '好的，我来为您介绍系统的主要功能。首先，您可以通过左侧菜单访问不同的功能模块...',
      time: '10:02',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 4,
      sender: 'Ricky',
      content: '听起来很不错，能具体讲讲数据分析部分吗？',
      time: '10:05',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 5,
      sender: 'Art Bot',
      content: '当然可以。数据分析模块可以帮助您实时监控关键指标，并生成详细的报表...',
      time: '10:06',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 6,
      sender: 'Ricky',
      content: '太好了，那我如何开始使用呢？',
      time: '10:08',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 7,
      sender: 'Art Bot',
      content: '您可以先创建一个项目，然后在项目中添加相关的数据源，系统会自动进行分析。',
      time: '10:09',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 8,
      sender: 'Ricky',
      content: '明白了，谢谢你的帮助！',
      time: '10:10',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 9,
      sender: 'Art Bot',
      content: '不客气，有任何问题随时联系我。',
      time: '10:11',
      isMe: false,
      avatar: aiAvatar
    }
  ])

  /**
   * 发送消息
   * 添加新消息到消息列表并滚动到底部
   */
  const sendMessage = () => {
    const text = messageText.value.trim()
    if (!text) return

    messages.value.push({
      id: messageId.value++,
      sender: 'Ricky',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatar: userAvatar.value
    })

    messageText.value = ''
    scrollToBottom()
  }

  /**
   * 滚动到消息列表底部
   */
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }, 100)
  }

  /**
   * 打开聊天窗口
   */
  const openChat = () => {
    isDrawerVisible.value = true
  }

  onMounted(() => {
    scrollToBottom()
    mittBus.on('openChat', openChat)
    selectedPerson.value = personList.value[0]
  })
</script>
