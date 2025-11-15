<template>
  <div class="page-content">
    <ArtCutterImg
      v-model:imgUrl="imageUrl"
      :boxWidth="530"
      :boxHeight="300"
      :cutWidth="360"
      :cutHeight="200"
      :quality="1"
      :tool="true"
      :watermarkText="'My Watermark'"
      watermarkColor="#ff0000"
      :showPreview="true"
      :originalGraph="false"
      :title="'图片裁剪'"
      :previewTitle="'预览效果'"
      @error="handleError"
      @imageLoadComplete="handleLoadComplete"
      @imageLoadError="handleLoadError"
    />
  </div>
</template>

<script setup lang="ts">
  import lockImg from '@imgs/lock/bg_dark.webp'

  defineOptions({ name: 'WidgetsImageCrop' })

  /**
   * 图片 URL
   */
  const imageUrl = ref(lockImg)

  /**
   * 处理裁剪错误
   * @param error 错误对象
   */
  const handleError = (error: Error) => {
    console.error('裁剪错误:', error)
    ElMessage.error('图片裁剪失败')
  }

  /**
   * 处理图片加载完成
   * @param result 加载结果
   */
  const handleLoadComplete = (result: { url: string; width: number; height: number }) => {
    console.log('图片加载完成:', result)
  }

  /**
   * 处理图片加载错误
   * @param error 错误对象
   */
  const handleLoadError = (error: Error) => {
    console.error('图片加载失败:', error)
    ElMessage.error('图片加载失败')
  }
</script>
