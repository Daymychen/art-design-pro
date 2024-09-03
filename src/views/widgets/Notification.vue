<template>
  <div class="page-content notification">
    <el-button type="success" size="large" @click="open1"> 成功通知 </el-button>
    <el-button type="warning" size="large" @click="open2"> 警告通知 </el-button>
    <el-button type="danger" size="large" @click="open4"> 危险通知 </el-button>
    <el-button type="info" size="large" @click="open3"> 信息通知 </el-button>
  </div>
</template>

<script setup lang="ts">
  import { ElNotification } from 'element-plus'

  const open1 = () => {
    ElNotification({
      title: '通知',
      type: 'success',
      message: '你好世界！这是一条通知消息。'
    })
  }

  const open2 = () => {
    ElNotification({
      title: '通知',
      type: 'warning',
      message: '你好世界！这是一条通知消息。'
    })
  }

  const open3 = () => {
    ElNotification({
      title: '通知',
      type: 'info',
      message: '你好世界！这是一条通知消息。'
    })
  }

  const open4 = () => {
    ElNotification({
      title: '通知',
      type: 'error',
      message: '你好世界！这是一条通知消息。'
    })
  }
</script>

<style lang="scss" scoped>
  .notification {
    :deep(.el-button) {
      width: 150px;
    }
  }
</style>
