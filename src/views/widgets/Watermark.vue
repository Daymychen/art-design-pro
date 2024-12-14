<template>
  <div class="page-content">
    <!-- 基础文字水印 -->
    <el-card class="card" shadow="never">
      <template #header>基础文字水印</template>
      <el-watermark content="Art Design Pro" :font="{ color: 'rgba(128, 128, 128, 0.2)' }">
        <div style="height: 200px"></div>
      </el-watermark>
    </el-card>

    <!-- 多行文字水印 -->
    <el-card class="card" shadow="never">
      <template #header>多行文字水印</template>
      <el-watermark
        :content="['Art Design Pro', '专注用户体验，视觉设计']"
        :font="{ fontSize: 16, color: 'rgba(128, 128, 128, 0.2)' }"
      >
        <div style="height: 200px"></div>
      </el-watermark>
    </el-card>

    <!-- 图片水印 -->
    <el-card class="card" shadow="never">
      <template #header>图片水印</template>
      <el-watermark :image="watermarkImage" :opacity="0.2" :width="80" :height="20">
        <div style="height: 200px"></div>
      </el-watermark>
    </el-card>

    <!-- 自定义样式水印 -->
    <el-card class="card" shadow="never">
      <template #header>自定义样式水印</template>
      <el-watermark
        content="Art Design Pro"
        :font="{
          fontSize: 20,
          fontFamily: 'Arial',
          color: 'rgba(255, 0, 0, 0.3)'
        }"
        :rotate="-22"
        :gap="[100, 100]"
      >
        <div style="height: 200px"></div>
      </el-watermark>
    </el-card>

    <el-button
      :type="settingStore.watermarkVisible ? 'danger' : 'primary'"
      @click="handleWatermarkVisible"
    >
      {{ settingStore.watermarkVisible ? '隐藏全局水印' : '显示全局水印' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'

  const settingStore = useSettingStore()

  // 这里替换成你的实际logo图片地址
  const watermarkImage = ref('https://element-plus.org/images/element-plus-logo.svg')

  const handleWatermarkVisible = () => {
    settingStore.setWatermarkVisible(!settingStore.watermarkVisible)
  }
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;

    .el-card {
      margin-bottom: 30px;
    }
  }
</style>
