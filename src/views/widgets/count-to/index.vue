<template>
  <div class="page-content">
    <div class="page-header">
      <h1>基于 VueUse useTransition 的 Count-To 组件</h1>
      <p>高性能数字滚动动画组件，支持完整的动画控制和事件监听</p>
    </div>

    <!-- 基础用法 -->
    <div class="demo-section">
      <h2>基础用法</h2>
      <div class="number-display">
        <ArtCountTo :target="1000" :duration="2000" />
      </div>
    </div>

    <!-- 带前缀后缀 -->
    <div class="demo-section">
      <h2>带前缀后缀</h2>
      <div class="number-display">
        <ArtCountTo :target="20000" :duration="2500" prefix="¥" suffix="元" :decimals="2" />
      </div>
    </div>

    <!-- 小数点和分隔符 -->
    <div class="demo-section">
      <h2>小数点和分隔符</h2>
      <div class="number-display">
        <ArtCountTo :target="2023.45" :duration="3000" :decimals="2" separator="," />
      </div>
    </div>

    <!-- 动画效果对比 -->
    <div class="demo-section">
      <h2>动画效果对比</h2>
      <div class="easing-demo">
        <div class="easing-item" v-for="easing in easingTypes" :key="easing.type">
          <div class="easing-label">{{ easing.name }}</div>
          <div class="number-display">
            <ArtCountTo :target="easingTarget" :duration="3000" :easing="easing.type" />
          </div>
        </div>
      </div>
      <div class="trigger-center">
        <el-button @click="triggerEasing">触发所有动画</el-button>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="demo-section">
      <h2>控制按钮</h2>
      <div class="number-display">
        <ArtCountTo
          ref="countToRef"
          :target="controlTarget"
          :duration="2000"
          @started="handleAnimationStarted"
          @finished="handleAnimationFinished"
          @paused="handleAnimationPaused"
          @reset="handleAnimationReset"
        />
      </div>

      <div class="control-buttons">
        <el-button @click="startCount">开始</el-button>
        <el-button @click="pauseCount">暂停</el-button>
        <el-button @click="resetCount">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ArtCountTo from '@/components/core/text-effect/art-count-to/index.vue'

  // 控制变量
  const controlTarget = ref(0)
  const countToRef = ref()

  // 缓动动画目标值
  const easingTarget = ref(0)

  // 动画类型定义
  const easingTypes = [
    { name: 'Linear', type: 'linear' },
    { name: 'Ease Out Cubic', type: 'easeOutCubic' },
    { name: 'Ease Out Expo', type: 'easeOutExpo' },
    { name: 'Ease Out Sine', type: 'easeOutSine' },
    { name: 'Ease In Out', type: 'easeInOutCubic' },
    { name: 'Ease In Quad', type: 'easeInQuad' }
  ] as const

  // 开始
  const startCount = () => {
    const newTarget = 5000
    controlTarget.value = newTarget
    countToRef.value?.start(newTarget)
  }

  // 暂停
  const pauseCount = () => {
    countToRef.value?.pause()
  }

  // 重置
  const resetCount = () => {
    countToRef.value?.reset()
    controlTarget.value = 0
  }

  // 触发缓动效果演示
  const triggerEasing = () => {
    easingTarget.value = easingTarget.value === 0 ? 1000 : 0
  }

  // 监听动画事件
  const handleAnimationStarted = (value: number) => {
    console.log('动画开始，目标值:', value)
  }

  const handleAnimationFinished = (value: number) => {
    console.log('动画完成，最终值:', value)
  }

  const handleAnimationPaused = (value: number) => {
    console.log('动画暂停，当前值:', value)
  }

  const handleAnimationReset = () => {
    console.log('动画已重置')
  }
</script>

<style scoped lang="scss">
  .page-content {
    .page-header {
      margin-bottom: 60px;
      text-align: center;

      h1 {
        margin: 1rem 0 16px;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.2;
        color: #333;
      }

      p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.6;
        color: #666;
      }
    }

    .demo-section {
      margin-bottom: 60px;

      h2 {
        margin: 0 0 24px;
        font-size: 1.2rem;
        font-weight: 500;
        color: #333;
      }
    }

    .number-display {
      padding: 20px;
      margin-bottom: 20px;
      font-size: 2rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: #495057;
      text-align: center;
      background: var(--art-gray-100);
      border: 1px solid var(--art-border-color);
      border-radius: 8px;
    }

    .control-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .easing-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;

      .easing-item {
        text-align: center;

        .easing-label {
          margin-bottom: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #666;
        }

        .number-display {
          padding: 16px;
          margin-bottom: 0;
          font-size: 1.5rem;
        }
      }
    }

    .trigger-center {
      text-align: center;
    }
  }
</style>
