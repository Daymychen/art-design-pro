<!-- 视频播放器组件：https://h5player.bytedance.com/-->
<template>
  <div :id="playerId" />
</template>

<script setup lang="ts">
  import Player from 'xgplayer'
  import 'xgplayer/dist/index.min.css'

  // 组件属性定义
  const props = defineProps<{
    playerId: string // 播放器容器的唯一标识
    videoUrl: string // 视频源URL
    posterUrl: string // 视频封面图URL
    autoplay?: boolean // 是否自动播放
    volume?: number // 音量大小(0-1)
    playbackRates?: number[] // 可选的播放速率
    loop?: boolean // 是否循环播放
    muted?: boolean // 是否静音
    commonStyle?: VideoPlayerStyle // 播放器样式配置
  }>()

  // 设置属性默认值
  const defaultAutoplay = props.autoplay ?? false
  const defaultVolume = props.volume ?? 0.5
  const defaultPlaybackRates = props.playbackRates ?? [0.5, 0.75, 1, 1.5, 2]
  const defaultLoop = props.loop ?? false
  const defaultMuted = props.muted ?? false

  // 播放器实例引用
  const playerInstance = ref<Player | null>(null)

  // 播放器样式接口定义
  interface VideoPlayerStyle {
    progressColor?: string // 进度条背景色
    playedColor?: string // 已播放部分颜色
    cachedColor?: string // 缓存部分颜色
    sliderBtnStyle?: Record<string, string> // 滑块按钮样式
    volumeColor?: string // 音量控制器颜色
  }

  // 默认样式配置
  const defaultStyle: VideoPlayerStyle = {
    progressColor: 'rgba(255, 255, 255, 0.3)',
    playedColor: '#00AEED',
    cachedColor: 'rgba(255, 255, 255, 0.6)',
    sliderBtnStyle: {
      width: '10px',
      height: '10px',
      backgroundColor: '#00AEED'
    },
    volumeColor: '#00AEED'
  }

  // 组件挂载时初始化播放器
  onMounted(() => {
    playerInstance.value = new Player({
      id: props.playerId,
      lang: 'zh', // 设置界面语言为中文
      volume: defaultVolume,
      autoplay: defaultAutoplay,
      screenShot: true, // 启用截图功能
      url: props.videoUrl,
      poster: props.posterUrl,
      fluid: true, // 启用流式布局，自适应容器大小
      playbackRate: defaultPlaybackRates,
      loop: defaultLoop,
      muted: defaultMuted,
      commonStyle: {
        ...defaultStyle,
        ...props.commonStyle
      }
    })

    // 播放事件监听器
    playerInstance.value.on('play', () => {
      console.log('Video is playing')
    })

    // 暂停事件监听器
    playerInstance.value.on('pause', () => {
      console.log('Video is paused')
    })

    // 错误事件监听器
    playerInstance.value.on('error', (error) => {
      console.error('Error occurred:', error)
    })
  })

  // 组件卸载前清理播放器实例
  onBeforeUnmount(() => {
    if (playerInstance.value) {
      playerInstance.value.destroy()
    }
  })
</script>
