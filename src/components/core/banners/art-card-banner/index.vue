<!-- 卡片横幅组件 -->
<template>
  <div class="card-banner art-custom-card" :style="{ height: props.height }">
    <div class="banner-content">
      <div class="banner-icon">
        <img :src="props.image" :alt="props.title" />
      </div>
      <div class="banner-text">
        <p class="banner-title">{{ props.title }}</p>
        <p class="banner-description">{{ props.description }}</p>
      </div>
      <div class="banner-buttons">
        <div
          v-if="props.cancelButton?.show"
          class="banner-button cancel-button"
          :style="{
            backgroundColor: props.cancelButton?.color,
            color: props.cancelButton?.textColor
          }"
          @click="handleCancel"
        >
          {{ props.cancelButton?.text }}
        </div>
        <div
          v-if="props.button?.show"
          class="banner-button"
          :style="{ backgroundColor: props.button?.color, color: props.button?.textColor }"
          @click="handleClick"
        >
          {{ props.button?.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 导入默认图标
  import defaultIcon from '@imgs/3d/icon1.webp'

  defineOptions({ name: 'ArtCardBanner' })

  // 定义卡片横幅组件的属性接口
  interface CardBannerProps {
    /** 高度 */
    height?: string
    /** 图片路径 */
    image?: string
    /** 标题文本 */
    title: string
    /** 描述文本 */
    description: string
    /** 主按钮配置 */
    button?: {
      /** 是否显示 */
      show?: boolean
      /** 按钮文本 */
      text?: string
      /** 背景颜色 */
      color?: string
      /** 文字颜色 */
      textColor?: string
    }
    /** 取消按钮配置 */
    cancelButton?: {
      /** 是否显示 */
      show?: boolean
      /** 按钮文本 */
      text?: string
      /** 背景颜色 */
      color?: string
      /** 文字颜色 */
      textColor?: string
    }
  }

  // 定义组件属性默认值
  const props = withDefaults(defineProps<CardBannerProps>(), {
    height: '24rem',
    image: defaultIcon,
    title: '',
    description: '',
    // 主按钮默认配置
    button: () => ({
      show: true,
      text: '查看详情',
      color: 'var(--main-color)',
      textColor: '#fff'
    }),
    // 取消按钮默认配置
    cancelButton: () => ({
      show: false,
      text: '取消',
      color: '#f5f5f5',
      textColor: '#666'
    })
  })

  // 定义组件事件
  const emit = defineEmits<{
    (e: 'click'): void // 主按钮点击事件
    (e: 'cancel'): void // 取消按钮点击事件
  }>()

  // 主按钮点击处理函数
  const handleClick = () => {
    emit('click')
  }

  // 取消按钮点击处理函数
  const handleCancel = () => {
    emit('cancel')
  }
</script>

<style lang="scss" scoped>
  .card-banner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 1.5rem;
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
      box-sizing: border-box;
      padding: 0 16px;

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

      &.cancel-button {
        border: 1px solid #dcdfe6;
      }
    }
  }
</style>
