<template>
  <div
    class="basic-banner art-custom-card"
    :class="{ 'has-decoration': showDecoration }"
    :style="{ backgroundColor: backgroundColor, height: height }"
  >
    <div v-if="showMeteors && isDark" class="basic-banner__meteors">
      <span
        v-for="(meteor, index) in meteors"
        :key="index"
        class="meteor"
        :style="{
          top: '-60px',
          left: `${meteor.x}%`,
          animationDuration: `${meteor.speed}s`,
          animationDelay: `${meteor.delay}s`
        }"
      ></span>
    </div>

    <div class="basic-banner__content">
      <p class="basic-banner__title" :style="{ color: titleColor }">{{ title }}</p>
      <p class="basic-banner__subtitle" :style="{ color: subtitleColor }">{{ subtitle }}</p>
      <div
        v-if="showButton"
        class="basic-banner__button"
        :style="{ backgroundColor: buttonColor, color: buttonTextColor }"
        @click="handleClick"
      >
        {{ buttonText }}
      </div>
      <slot></slot>
      <img
        v-if="backgroundImage"
        class="basic-banner__background-image"
        :src="backgroundImage"
        :style="{ width: imgWidth, bottom: imgBottom }"
        alt="背景图片"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)

  interface Props {
    height?: string
    title: string
    subtitle?: string
    buttonText?: string
    buttonColor?: string
    buttonTextColor?: string
    titleColor?: string
    subtitleColor?: string
    backgroundColor?: string
    backgroundImage?: string
    imgWidth?: string
    imgBottom?: string
    showButton?: boolean
    showDecoration?: boolean
    showMeteors?: boolean // 新增 props 控制流星显示
    meteorCount?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    height: '11rem',
    buttonText: '查看',
    buttonColor: '#fff',
    buttonTextColor: '#333',
    backgroundColor: 'var(--el-color-primary-light-2)',
    titleColor: 'white',
    subtitleColor: 'white',
    backgroundImage: '',
    showButton: true,
    imgWidth: '12rem',
    imgBottom: '-3rem',
    showDecoration: true,
    showMeteors: false,
    meteorCount: 10
  })

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  const handleClick = () => {
    emit('click')
  }

  // 生成指定数量的流星，分散x坐标，混合快慢速度
  const meteors = computed(() => {
    const segmentWidth = 100 / props.meteorCount // Divide container into segments
    return Array.from({ length: props.meteorCount }, (_, index) => {
      const segmentStart = index * segmentWidth
      const x = segmentStart + Math.random() * segmentWidth // Random x within segment
      const isSlow = Math.random() > 0.5 // Roughly 50% chance for slow meteors
      return {
        x,
        speed: isSlow ? 5 + Math.random() * 3 : 2 + Math.random() * 2, // Slow: 5-8s, Fast: 2-4s
        delay: Math.random() * 5 // 0-5s delay
      }
    })
  })
</script>

<style lang="scss" scoped>
  .basic-banner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 11rem;
    padding: 0 2rem;
    overflow: hidden;
    color: white;
    background: var(--el-color-primary);
    border-radius: calc(var(--custom-radius) + 2px) !important;

    &__content {
      position: relative;
      z-index: 1;
    }

    &__title {
      position: relative;
      z-index: 1;
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
    }

    &__subtitle {
      position: relative;
      z-index: 1;
      margin: 0 0 1.5rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    &__button {
      display: inline-block;
      height: var(--el-component-custom-height);
      padding: 0 12px;
      font-size: 14px;
      line-height: var(--el-component-custom-height);
      cursor: pointer;
      user-select: none;
      border-radius: 6px;
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.9;
      }
    }

    &__background-image {
      position: absolute;
      right: 0;
      bottom: -3rem;
      z-index: 0;
      width: 12rem;
    }

    // 背景装饰
    &.has-decoration::after {
      position: absolute;
      right: -10%;
      bottom: -20%;
      width: 60%;
      height: 140%;
      content: '';
      background: rgb(255 255 255 / 10%);
      border-radius: 30%;
      transform: rotate(-20deg);
    }

    // 流星容器
    &__meteors {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      .meteor {
        position: absolute;
        width: 2px;
        height: 60px;
        background: linear-gradient(
          to top,
          rgb(255 255 255 / 40%),
          rgb(255 255 255 / 10%),
          transparent
        );
        opacity: 0;
        transform-origin: top left;
        animation-name: meteor-fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;

        &::before {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 2px;
          height: 2px;
          content: '';
          background: rgb(255 255 255 / 50%);
        }
      }
    }
  }

  @keyframes meteor-fall {
    0% {
      opacity: 1;
      transform: translate(0, -60px) rotate(-45deg);
    }

    100% {
      opacity: 0;
      transform: translate(400px, 340px) rotate(-45deg);
    }
  }

  @media (max-width: $device-phone) {
    .basic-banner__background-image {
      display: none !important;
    }
  }
</style>
