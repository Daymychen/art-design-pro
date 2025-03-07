<template>
  <div
    class="basic-banner art-custom-card"
    :class="{ 'has-decoration': showDecoration }"
    :style="{ backgroundColor: backgroundColor, height: height }"
  >
    <div class="basic-banner__content">
      <p class="basic-banner__title" :style="{ color: titleColor }"> {{ title }}</p>
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
  }

  withDefaults(defineProps<Props>(), {
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
    showDecoration: true
  })

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  const handleClick = () => {
    emit('click')
  }
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
      padding: 0.62rem 1.6rem;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
      border-radius: 8px;
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

    // 添加装饰性背景图案
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
  }

  @media (max-width: $device-phone) {
    .basic-banner {
      &__background-image {
        display: none !important;
      }
    }
  }
</style>
