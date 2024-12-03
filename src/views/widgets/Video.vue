<template>
  <div class="page-content">
    <div class="video-container">
      <VideoPlayer
        playerId="my-video-1"
        :videoUrl="videoUrl"
        :posterUrl="posterUrl"
        :autoplay="false"
        :volume="0.5"
        :playbackRates="[0.5, 1, 1.5, 2]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import lockImg from '@imgs/lock/lock_screen_1.png'

  // 视频源和封面图片URL
  const videoUrl = ref(
    '//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4'
  )
  const posterUrl = ref(lockImg)
</script>

<style scoped>
  .video-container {
    max-width: 600px;
  }
</style>
