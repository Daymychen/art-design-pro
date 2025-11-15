<template>
  <div class="page-content mb-5">
    <div class="mb-15 text-center">
      <h1 class="my-4 text-2xl font-semibold leading-tight">WebSocket 连接示例</h1>
      <p class="m-0 text-base leading-relaxed text-g-700">
        基于 WebSocketClient 的实时通信演示，支持连接管理、消息收发和状态监控
      </p>
    </div>

    <!-- 连接状态和统计信息 -->
    <ElRow :gutter="20" class="mb-15">
      <ElCol :xs="24" :sm="12" :md="8">
        <ElCard class="h-full border-0" :body-style="{ padding: '20px' }" shadow="never">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500 mb-1">{{ messageCount }}</div>
            <div class="text-sm font-medium text-gray-900 mb-1">消息统计</div>
            <div class="text-xs text-gray-500">接收到的消息数量</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="8">
        <ElCard class="h-full border-0" :body-style="{ padding: '20px' }" shadow="never">
          <div class="text-center">
            <ElTag :type="connectionTagType" size="large" class="mb-2">
              {{ wsClient?.connectionStatusText || '未连接' }}
            </ElTag>
            <div class="text-sm font-medium text-gray-900">连接状态</div>
            <div class="text-xs text-gray-500">当前WebSocket连接状态</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="8">
        <ElCard class="h-full border-0" :body-style="{ padding: '20px' }" shadow="never">
          <div class="text-center">
            <div class="text-2xl font-bold text-amber-500 mb-1">{{ reconnectCount }}</div>
            <div class="text-sm font-medium text-gray-900 mb-1">重连次数</div>
            <div class="text-xs text-gray-500">自动重连尝试次数</div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 连接配置和发送消息 -->
    <ElRow :gutter="20" class="mb-15">
      <ElCol :xs="24" :md="12">
        <ElCard class="h-full border-0" shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-base font-bold">连接配置</span>
              <ElTag :type="connectionTagType" size="large">
                {{ wsClient?.connectionStatusText || '未连接' }}
              </ElTag>
            </div>
          </template>

          <ElForm :model="connectForm" label-width="100px" class="max-w-md">
            <ElFormItem label="服务器地址">
              <ElInput v-model="connectForm.url" placeholder="ws://localhost:8080/ws" clearable />
            </ElFormItem>
            <ElFormItem label="连接选项">
              <ElSpace>
                <ElCheckbox v-model="connectForm.autoReconnect">自动重连</ElCheckbox>
                <ElCheckbox v-model="connectForm.heartbeat">心跳检测</ElCheckbox>
              </ElSpace>
            </ElFormItem>
            <ElFormItem>
              <ElSpace>
                <ElButton
                  type="primary"
                  @click="handleConnect"
                  :loading="isConnecting"
                  :disabled="isConnected"
                >
                  {{ isConnecting ? '连接中...' : '连接' }}
                </ElButton>
                <ElButton type="danger" @click="handleDisconnect" :disabled="!isConnected">
                  断开连接
                </ElButton>
                <ElButton @click="handleReconnect" :disabled="isConnecting">重连</ElButton>
              </ElSpace>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>

      <ElCol :xs="24" :md="12">
        <ElCard class="h-full border-0" shadow="never">
          <template #header>
            <span class="text-base font-bold">发送消息</span>
          </template>

          <ElForm :model="messageForm" @submit.prevent="handleSendMessage">
            <ElFormItem label="消息类型">
              <ElSelect v-model="messageForm.type" class="w-full">
                <ElOption label="文本消息" value="text" />
                <ElOption label="JSON数据" value="json" />
                <ElOption label="心跳包" value="ping" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="消息内容">
              <ElInput
                v-model="messageForm.content"
                type="textarea"
                :rows="4"
                placeholder="请输入要发送的消息内容"
              />
            </ElFormItem>
            <ElFormItem>
              <ElSpace>
                <ElButton
                  type="primary"
                  @click="handleSendMessage"
                  :disabled="!isConnected || !messageForm.content"
                >
                  发送消息
                </ElButton>
                <ElButton @click="clearMessageForm">清空</ElButton>
              </ElSpace>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 接收消息 - 单独占一行 -->
    <ElRow class="mb-15">
      <ElCol :span="24">
        <ElCard class="border-0" shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-base font-bold">接收消息</span>
              <ElButton size="small" @click="clearMessages">清空记录</ElButton>
            </div>
          </template>

          <div class="message-container">
            <div v-for="(message, index) in messageList" :key="index" class="message-item">
              <div class="message-header">
                <ElTag size="small" :type="message.type === 'received' ? 'success' : 'info'">
                  {{ message.type === 'received' ? '接收' : '发送' }}
                </ElTag>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>

            <ElEmpty v-if="messageList.length === 0" description="暂无消息记录" :image-size="100" />
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 连接日志 -->
    <ElCard class="border-0" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-bold">连接日志</span>
          <ElButton size="small" @click="clearLogs">清空日志</ElButton>
        </div>
      </template>

      <div class="log-container">
        <ElAlert
          v-for="(log, index) in logList"
          :key="index"
          :type="log.type"
          :closable="false"
          class="!mb-2"
        >
          <template #title>
            <div class="flex items-start gap-2">
              <span class="text-xs opacity-70 whitespace-nowrap">{{ log.time }}</span>
              <span class="flex-1">{{ log.message }}</span>
            </div>
          </template>
        </ElAlert>

        <ElEmpty v-if="logList.length === 0" description="暂无日志记录" :image-size="100" />
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import WebSocketClient from '@/utils/socket'
  import { ElMessage } from 'element-plus'

  defineOptions({ name: 'WidgetsSocketChat' })

  // WebSocket客户端实例
  const wsClient = ref<WebSocketClient | null>(null)

  // 连接状态
  const isConnecting = ref(false)
  const isConnected = ref(false)
  const reconnectCount = ref(0)
  const messageCount = ref(0)

  // 用于清理 watch 的函数
  let stopWatchConnection: (() => void) | null = null
  let stopWatchStatus: (() => void) | null = null

  // 表单数据
  const connectForm = ref({
    url: 'ws://localhost:8080/ws',
    autoReconnect: true,
    heartbeat: true
  })

  const messageForm = ref({
    type: 'text',
    content: ''
  })

  // 消息和日志列表
  const messageList = ref<
    Array<{
      type: 'sent' | 'received'
      content: string
      time: string
    }>
  >([])

  const logList = ref<
    Array<{
      type: 'info' | 'success' | 'warning' | 'error'
      message: string
      time: string
    }>
  >([])

  // 计算属性
  const connectionTagType = computed(() => {
    if (isConnecting.value) return 'warning'
    if (isConnected.value) return 'success'
    return 'danger'
  })

  /**
   * 添加日志
   */
  const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    logList.value.unshift({
      type,
      message,
      time: new Date().toLocaleTimeString()
    })

    // 限制日志数量
    if (logList.value.length > 100) {
      logList.value = logList.value.slice(0, 100)
    }
  }

  /**
   * 添加消息记录
   */
  const addMessage = (type: 'sent' | 'received', content: string) => {
    messageList.value.unshift({
      type,
      content,
      time: new Date().toLocaleTimeString()
    })

    // 限制消息数量
    if (messageList.value.length > 50) {
      messageList.value = messageList.value.slice(0, 50)
    }
  }

  /**
   * 处理WebSocket消息
   */
  const handleSocketMessage = (event: MessageEvent) => {
    messageCount.value++
    addMessage('received', event.data)
    addLog('success', `收到消息: ${event.data}`)
  }

  /**
   * 连接WebSocket
   */
  const handleConnect = () => {
    if (isConnecting.value || isConnected.value) {
      return
    }

    // 清理之前的 watch
    if (stopWatchConnection) {
      stopWatchConnection()
      stopWatchConnection = null
    }
    if (stopWatchStatus) {
      stopWatchStatus()
      stopWatchStatus = null
    }

    isConnecting.value = true
    addLog('info', `开始连接到 ${connectForm.value.url}`)

    try {
      wsClient.value = WebSocketClient.getInstance({
        url: connectForm.value.url,
        messageHandler: handleSocketMessage,
        reconnectInterval: connectForm.value.autoReconnect ? 5000 : 0,
        heartbeatInterval: connectForm.value.heartbeat ? 10000 : 0,
        maxReconnectAttempts: 5
      })

      wsClient.value.init()

      // 监听连接状态变化
      stopWatchConnection = watch(
        () => wsClient.value?.isWebSocketConnected,
        (connected) => {
          isConnected.value = connected || false
          isConnecting.value = false

          if (connected) {
            addLog('success', 'WebSocket连接成功')
            reconnectCount.value = 0
          }
        },
        { immediate: true }
      )

      // 监听连接状态文本变化
      stopWatchStatus = watch(
        () => wsClient.value?.connectionStatusText,
        (status) => {
          if (status && status.includes('重连中')) {
            reconnectCount.value++
            addLog('warning', `自动重连中 (第${reconnectCount.value}次)`)
          }
        }
      )
    } catch (error) {
      isConnecting.value = false
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog('error', `连接失败: ${errorMessage}`)
      ElMessage.error('连接失败，请检查服务器地址')
    }
  }

  /**
   * 断开连接
   */
  const handleDisconnect = () => {
    if (wsClient.value) {
      wsClient.value.close()
      addLog('info', '手动断开WebSocket连接')
    }

    // 清理 watch
    if (stopWatchConnection) {
      stopWatchConnection()
      stopWatchConnection = null
    }
    if (stopWatchStatus) {
      stopWatchStatus()
      stopWatchStatus = null
    }

    isConnected.value = false
    isConnecting.value = false
  }

  /**
   * 重新连接
   */
  const handleReconnect = () => {
    handleDisconnect()
    setTimeout(() => {
      handleConnect()
    }, 1000)
  }

  /**
   * 发送消息
   */
  const handleSendMessage = () => {
    if (!isConnected.value || !wsClient.value) {
      ElMessage.warning('请先建立WebSocket连接')
      return
    }

    let message = messageForm.value.content

    // 根据消息类型处理内容
    switch (messageForm.value.type) {
      case 'json':
        try {
          // 验证是否为有效JSON
          JSON.parse(message)
        } catch {
          ElMessage.error('请输入有效的JSON格式数据')
          return
        }
        break
      case 'ping':
        message = 'ping'
        break
    }

    try {
      wsClient.value.send(message)
      addMessage('sent', message)
      addLog('info', `发送消息: ${message}`)
      ElMessage.success('消息发送成功')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog('error', `发送失败: ${errorMessage}`)
      ElMessage.error('发送消息失败')
    }
  }

  /**
   * 清空消息表单
   */
  const clearMessageForm = () => {
    messageForm.value.content = ''
  }

  /**
   * 清空消息记录
   */
  const clearMessages = () => {
    messageList.value = []
  }

  /**
   * 清空日志
   */
  const clearLogs = () => {
    logList.value = []
  }

  /**
   * 页面卸载时清理连接
   */
  onUnmounted(() => {
    handleDisconnect()
  })

  /**
   * 监听页面可见性变化，页面隐藏时断开连接
   */
  onMounted(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isConnected.value) {
        addLog('info', '页面隐藏，保持连接')
      }
    })
  })
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .message-container {
    @apply max-h-96 overflow-y-auto space-y-3;
  }

  .message-item {
    @apply p-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700;
  }

  .message-header {
    @apply flex items-center justify-between mb-2;
  }

  .message-time {
    @apply text-xs text-gray-500;
  }

  .message-content {
    @apply text-sm text-gray-800 dark:text-gray-200 break-words font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded;
  }

  .log-container {
    @apply max-h-64 overflow-y-auto;
  }

  /* 滚动条样式 */
  .message-container::-webkit-scrollbar,
  .log-container::-webkit-scrollbar {
    @apply w-4;
  }

  .message-container::-webkit-scrollbar-track,
  .log-container::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded;
  }

  .message-container::-webkit-scrollbar-thumb,
  .log-container::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded hover:bg-gray-400;
  }
</style>
