<template>
  <div class="page-content">
    <div class="action-buttons">
      <ElButton :disabled="isLaunching" v-ripple @click="handleSingleLaunch"
        >✨ 放个小烟花</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleImageLaunch(bp)"
        >🎉 打开幸运红包</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleMultipleLaunch('')"
        >🎆 璀璨烟火秀</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleImageLaunch(sd)"
        >❄️ 飘点小雪花</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleMultipleLaunch(sd)"
        >❄️ 浪漫暴风雪</ElButton
      >
    </div>

    <ElDescriptions
      title="礼花组件说明"
      direction="vertical"
      :column="1"
      border
      style="margin-top: 50px"
    >
      <ElDescriptionsItem label="显示时机">
        礼花效果组件全局注册了，在节假日的时候，会自动显示，你可以通过配置文件来控制显示时机
      </ElDescriptionsItem>
      <ElDescriptionsItem label="礼花样式">
        默认显示几何图形，可以配置图片，图片需要提前在 components/Ceremony/Fireworks 文件预先定义
      </ElDescriptionsItem>
      <ElDescriptionsItem label="节日配置">
        在 src/config/festival.ts 文件中，可以配置节日和对应的礼花样式
      </ElDescriptionsItem>
      <ElDescriptionsItem label="快捷键">
        command + shift + p 或者 ctrl + shift + p
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<script setup lang="ts">
  import { mittBus } from '@/utils/sys'

  import bp from '@imgs/ceremony/hb.png'
  import sd from '@imgs/ceremony/sd.png'

  const timerRef = ref<ReturnType<typeof setInterval> | null>(null)
  const isLaunching = ref(false)

  const triggerFireworks = (count: number, src: string) => {
    // 清除之前的定时器
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }

    isLaunching.value = true // 开始发射时设置状态

    let fired = 0
    timerRef.value = setInterval(() => {
      mittBus.emit('triggerFireworks', src)
      fired++

      // 达到指定次数后清除定时器
      if (fired >= count) {
        clearInterval(timerRef.value!)
        timerRef.value = null
        isLaunching.value = false // 发射完成后解除禁用
      }
    }, 1000)
  }

  // 简化后的处理函数
  const handleSingleLaunch = () => {
    mittBus.emit('triggerFireworks')
  }

  const handleMultipleLaunch = (src: string) => {
    triggerFireworks(10, src)
  }

  const handleImageLaunch = (src: string) => {
    mittBus.emit('triggerFireworks', src)
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }
  })
</script>

<style lang="scss" scoped>
  .action-buttons {
    margin-bottom: 20px;
  }
</style>
