<template>
  <div class="chat-modal">
    <el-drawer v-model="isDrawerVisible" :size="isMobile ? '100%' : '480px'" :with-header="false">
      <div class="header">
        <div class="header-left">
          <span class="name">Art Bot</span>
          <div class="status">
            <div class="dot" :class="{ online: isOnline, offline: !isOnline }"></div>
            <span class="status-text">{{ isOnline ? '在线' : '离线' }}</span>
          </div>
        </div>
        <div class="header-right">
          <el-icon class="icon-close" :size="20" @click="closeChat">
            <Close />
          </el-icon>
        </div>
      </div>
      <div class="chat-container">
        <!-- 聊天消息区域 -->
        <div class="chat-messages" ref="messageContainer">
          <template v-for="(message, index) in messages" :key="index">
            <div :class="['message-item', message.isMe ? 'message-right' : 'message-left']">
              <el-avatar :size="32" :src="message.avatar" class="message-avatar" />
              <div class="message-content">
                <div class="message-info">
                  <span class="sender-name">{{ message.sender }}</span>
                  <span class="message-time">{{ message.time }}</span>
                </div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
          </template>
        </div>

        <!-- 聊天输入区域 -->
        <div class="chat-input">
          <el-input
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="输入消息"
            resize="none"
            @keyup.enter.prevent="sendMessage"
          >
            <template #append>
              <div class="input-actions">
                <el-button :icon="Paperclip" circle plain />
                <el-button :icon="Picture" circle plain />
                <el-button type="primary" @click="sendMessage" v-ripple>发送</el-button>
              </div>
            </template>
          </el-input>
          <div class="chat-input-actions">
            <div class="left">
              <i class="iconfont-sys">&#xe634;</i>
              <i class="iconfont-sys">&#xe809;</i>
            </div>
            <el-button type="primary" @click="sendMessage" v-ripple>发送</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Picture, Paperclip } from '@element-plus/icons-vue'
  import mittBus from '@/utils/mittBus'
  import meAvatar from '@/assets/img/avatar/avatar5.jpg'
  import aiAvatar from '@/assets/img/avatar/avatar10.jpg'

  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < 500)

  // 抽屉显示状态
  const isDrawerVisible = ref(false)
  // 是否在线
  const isOnline = ref(true)

  // 消息相关数据
  const messageText = ref('')
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

  const messageId = ref(10) // 用于生成唯一的消息ID

  const userAvatar = ref(meAvatar) // 使用导入的头像

  // 发送消息
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

  // 滚动到底部
  const messageContainer = ref<HTMLElement | null>(null)
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }, 100)
  }

  const openChat = () => {
    isDrawerVisible.value = true
  }

  const closeChat = () => {
    isDrawerVisible.value = false
  }

  onMounted(() => {
    scrollToBottom()
    mittBus.on('openChat', openChat)
  })
</script>

<style lang="scss">
  .chat-modal {
    .el-overlay {
      background-color: rgb(0 0 0 / 20%) !important;
    }
  }
</style>

<style lang="scss" scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .header-left {
      .name {
        font-size: 16px;
        font-weight: 500;
      }

      .status {
        display: flex;
        gap: 4px;
        align-items: center;
        margin-top: 6px;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.online {
            background-color: var(--el-color-success);
          }

          &.offline {
            background-color: var(--el-color-danger);
          }
        }

        .status-text {
          font-size: 12px;
          color: var(--art-gray-500);
        }
      }
    }

    .header-right {
      .icon-close {
        cursor: pointer;
      }
    }
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100% - 40px);

    .chat-messages {
      flex: 1;
      padding: 30px 16px;
      overflow-y: auto;
      border-top: 1px solid var(--el-border-color-lighter);

      &::-webkit-scrollbar {
        width: 5px !important;
      }

      .message-item {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: flex-start;
        width: 100%;
        margin-bottom: 30px;

        .message-text {
          font-size: 14px;
          color: var(--art-gray-900);
          border-radius: 6px;
        }

        &.message-left {
          justify-content: flex-start;

          .message-content {
            align-items: flex-start;

            .message-info {
              flex-direction: row;
            }

            .message-text {
              background-color: #f8f5ff;
            }
          }
        }

        &.message-right {
          flex-direction: row-reverse;

          .message-content {
            align-items: flex-end;

            .message-info {
              flex-direction: row-reverse;
            }

            .message-text {
              background-color: #e9f3ff;
            }
          }
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          max-width: 70%;

          .message-info {
            display: flex;
            gap: 8px;
            margin-bottom: 4px;
            font-size: 12px;

            .message-time {
              color: var(--el-text-color-secondary);
            }

            .sender-name {
              font-weight: 500;
            }
          }

          .message-text {
            padding: 10px 14px;
            line-height: 1.4;
          }
        }
      }
    }

    .chat-input {
      padding: 16px; // 增加填充以提升输入区域的布局

      .input-actions {
        display: flex;
        gap: 8px;
        padding: 8px 0;
      }

      .chat-input-actions {
        display: flex;
        align-items: center; // 修正为单数
        justify-content: space-between;
        margin-top: 12px;

        .left {
          display: flex;
          align-items: center;

          i {
            margin-right: 20px;
            font-size: 16px;
            color: var(--art-gray-500);
            cursor: pointer;
          }
        }

        // 确保发送按钮与输入框对齐
        el-button {
          min-width: 80px;
        }
      }
    }
  }

  .dark {
    .chat-container {
      .chat-messages {
        .message-item {
          &.message-left {
            .message-text {
              background-color: #232323 !important;
            }
          }

          &.message-right {
            .message-text {
              background-color: #182331 !important;
            }
          }
        }
      }
    }
  }
</style>
