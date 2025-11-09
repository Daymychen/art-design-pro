<!-- 进度条卡片 -->
<template>
  <div class="art-card h-32 flex flex-col justify-center px-5">
    <div class="mb-3.5 flex-c" :style="{ justifyContent: icon ? 'space-between' : 'flex-start' }">
      <div v-if="icon" class="size-11 flex-cc bg-g-300 text-xl rounded-lg" :class="iconStyle">
        <ArtSvgIcon :icon="icon" class="text-2xl"></ArtSvgIcon>
      </div>
      <div>
        <ArtCountTo
          class="mb-1 block text-2xl font-semibold"
          :target="percentage"
          :duration="2000"
          suffix="%"
          :style="{ textAlign: icon ? 'right' : 'left' }"
        />
        <p class="text-sm text-g-500">{{ title }}</p>
      </div>
    </div>
    <ElProgress
      :percentage="currentPercentage"
      :stroke-width="strokeWidth"
      :show-text="false"
      :color="color"
      class="[&_.el-progress-bar__outer]:bg-[rgb(240_240_240)]"
    />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtProgressCard' })

  interface Props {
    /** 进度百分比 */
    percentage: number
    /** 标题 */
    title: string
    /** 颜色 */
    color?: string
    /** 图标 */
    icon?: string
    /** 图标样式 */
    iconStyle?: string
    /** 进度条宽度 */
    strokeWidth?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    strokeWidth: 5,
    color: '#67C23A'
  })

  const animationDuration = 500
  const currentPercentage = ref(0)

  const animateProgress = () => {
    const startTime = Date.now()
    const startValue = currentPercentage.value
    const endValue = props.percentage

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      currentPercentage.value = startValue + (endValue - startValue) * progress

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  onMounted(() => {
    animateProgress()
  })

  // 当 percentage 属性变化时重新执行动画
  watch(
    () => props.percentage,
    () => {
      animateProgress()
    }
  )
</script>
