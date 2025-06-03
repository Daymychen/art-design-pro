<!-- 文档：https://github.com/PanJiaChen/vue-countTo -->
<template>
  <div class="page-content">
    <!-- 基础用法 -->
    <h2>基础用法</h2>
    <CountTo :endVal="count1" :duration="1000"></CountTo>

    <!-- 带前缀后缀 -->
    <h2>带前缀后缀</h2>
    <CountTo prefix="¥" suffix="元" :startVal="0" :endVal="count2" :duration="2000"></CountTo>

    <!-- 小数点和分隔符 -->
    <h2>小数点和分隔符</h2>
    <CountTo
      :startVal="0"
      :endVal="count3"
      :decimals="2"
      decimal="."
      separator=","
      :duration="2500"
    ></CountTo>

    <!-- 控制按钮 -->
    <h2>控制按钮</h2>
    <CountTo
      ref="countTo"
      :startVal="0"
      :endVal="count4"
      :duration="3000"
      :autoplay="false"
    ></CountTo>

    <div class="mt-4">
      <el-button-group>
        <el-button @click="start" v-ripple>开始</el-button>
        <el-button @click="pause" v-ripple>暂停</el-button>
        <el-button @click="reset" v-ripple>重置</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { CountTo } from 'vue3-count-to'

  const count1 = ref(1000)
  const count2 = ref(19999.99)
  const count3 = ref(2023.45)
  const count4 = ref(5000)

  const countTo = ref()
  const isCounting = ref(false)

  // 控制方法
  const start = () => {
    if (isCounting.value) return

    try {
      countTo.value?.reset()
      countTo.value?.start()
      isCounting.value = true
    } catch (error) {
      console.error('启动计数器失败:', error)
    }
  }

  const pause = () => {
    if (!isCounting.value) return

    try {
      countTo.value?.pause()
      isCounting.value = false
    } catch (error) {
      console.error('暂停计数器失败:', error)
    }
  }

  const reset = () => {
    try {
      countTo.value?.reset()
      isCounting.value = false
    } catch (error) {
      console.error('重置计数器失败:', error)
    }
  }
</script>

<style scoped>
  .page-content {
    padding: 20px;
  }

  h2 {
    margin: 20px 0;
    font-size: 18px;
    color: #333;
  }

  .mt-4 {
    margin-top: 16px;
  }
</style>
