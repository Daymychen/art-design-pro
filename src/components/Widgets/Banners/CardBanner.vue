<template>
  <div class="card-banner art-custom-card">
    <div class="banner-content">
      <div class="banner-icon">
        <img :src="props.icon" :alt="props.title" />
      </div>
      <div class="banner-text">
        <p class="banner-title">{{ props.title }}</p>
        <p class="banner-description">{{ props.description }}</p>
      </div>
      <div class="banner-buttons">
        <div
          v-if="showCancel"
          class="banner-button cancel-button"
          :style="{ backgroundColor: cancelButtonColor, color: cancelButtonTextColor }"
          @click="handleCancel"
        >
          {{ cancelButtonText }}
        </div>
        <div
          class="banner-button"
          :style="{ backgroundColor: buttonColor, color: buttonTextColor }"
          @click="handleClick"
        >
          {{ buttonText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import defaultIcon from '@imgs/3d/icon1.png'

  interface CardBannerProps {
    icon?: string
    title: string
    description: string
    buttonText?: string
    buttonColor?: string
    buttonTextColor?: string
    showCancel?: boolean
    cancelButtonText?: string
    cancelButtonColor?: string
    cancelButtonTextColor?: string
  }

  const props = withDefaults(defineProps<CardBannerProps>(), {
    icon: defaultIcon,
    title: '',
    description: '',
    buttonText: '重试',
    buttonColor: 'var(--main-color)',
    buttonTextColor: '#fff',
    showCancel: false,
    cancelButtonText: '取消',
    cancelButtonColor: '#f5f5f5',
    cancelButtonTextColor: '#666'
  })

  const emit = defineEmits<{
    (e: 'click'): void
    (e: 'cancel'): void
  }>()

  const handleClick = () => {
    emit('click')
  }

  const handleCancel = () => {
    emit('cancel')
  }
</script>

<style lang="scss" scoped>
  .card-banner {
    padding: 3rem 0 4rem;
    background-color: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) + 2px) !important;

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      text-align: center;
    }

    .banner-icon {
      width: 180px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .banner-text {
      .banner-title {
        margin-bottom: 8px;
        font-size: 18px;
        font-weight: 600;
        color: var(--art-text-gray-800);
      }

      .banner-description {
        margin: 0;
        font-size: 14px;
        color: var(--art-text-gray-600);
      }
    }

    .banner-buttons {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .banner-button {
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

      &.cancel-button {
        border: 1px solid #dcdfe6;
      }
    }
  }
</style>
