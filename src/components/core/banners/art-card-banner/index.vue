<!-- 卡片横幅组件 -->
<template>
  <div
    class="flex flex-col justify-center pb-6 bg-[var(--art-main-bg-color)] art-custom-card !rounded-[calc(var(--custom-radius)+2px)]"
    :style="{ height: props.height }"
  >
    <div class="flex flex-col gap-4 items-center text-center">
      <div class="w-[180px]">
        <img :src="props.image" :alt="props.title" class="w-full h-full object-contain" />
      </div>
      <div class="box-border px-4">
        <p class="mb-2 text-lg font-semibold text-[var(--art-text-gray-800)]">{{ props.title }}</p>
        <p class="m-0 text-sm text-[var(--art-text-gray-600)]">{{ props.description }}</p>
      </div>
      <div class="flex gap-3 items-center">
        <div
          v-if="props.cancelButton?.show"
          class="inline-block h-[var(--el-component-custom-height)] px-3 text-sm leading-[var(--el-component-custom-height)] cursor-pointer select-none rounded-md transition-opacity duration-300 hover:opacity-90 border border-[#dcdfe6]"
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
          class="inline-block h-[var(--el-component-custom-height)] px-3 text-sm leading-[var(--el-component-custom-height)] cursor-pointer select-none rounded-md transition-opacity duration-300 hover:opacity-90"
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
