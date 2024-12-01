<template>
  <div class="page-content">
    <CutterImg
      style="margin-top: 20px"
      v-model:imgUrl="imageUrl"
      :boxWidth="540"
      :boxHeight="300"
      :cutWidth="360"
      :cutHeight="200"
      :quality="1"
      :tool="true"
      :watermarkText="'My Watermark'"
      watermarkColor="#ff0000"
      :showPreview="true"
      :originalGraph="false"
      :previewTitle="'预览效果'"
      @error="handleError"
      @imageLoadComplete="handleLoadComplete"
      @imageLoadError="handleLoadError"
    />
  </div>
</template>

<script setup lang="ts">
  import lockImg from '@imgs/lock/lock_screen_1.png'
  const imageUrl = ref(lockImg)

  const handleError = (error: any) => {
    console.error('裁剪错误:', error)
  }

  const handleLoadComplete = (result: any) => {
    console.log('图片加载完成:', result)
  }

  const handleLoadError = (error: any) => {
    console.error('图片加载失败:', error)
  }
</script>
