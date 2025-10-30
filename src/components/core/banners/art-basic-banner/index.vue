<!-- 基础横幅组件 -->
<template>
  <div
    class="art-card basic-banner"
    :class="[{ 'has-decoration': decoration }, boxStyle]"
    :style="{ height }"
    @click="emit('click')"
  >
    <!-- 流星效果 -->
    <div v-if="meteorConfig?.enabled && isDark" class="basic-banner__meteors">
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
      <!-- title slot -->
      <slot name="title">
        <p v-if="title" class="basic-banner__title" :style="{ color: titleColor }">{{ title }}</p>
      </slot>

      <!-- subtitle slot -->
      <slot name="subtitle">
        <p v-if="subtitle" class="basic-banner__subtitle" :style="{ color: subtitleColor }">{{
          subtitle
        }}</p>
      </slot>

      <!-- button slot -->
      <slot name="button">
        <div
          v-if="buttonConfig?.show"
          class="basic-banner__button"
          :style="{
            backgroundColor: buttonColor,
            color: buttonTextColor,
            borderRadius: buttonRadius
          }"
          @click.stop="emit('buttonClick')"
        >
          {{ buttonConfig?.text }}
        </div>
      </slot>

      <!-- default slot -->
      <slot></slot>

      <!-- background image -->
      <img
        v-if="imageConfig.src"
        class="basic-banner__background-image"
        :src="imageConfig.src"
        :style="{ width: imageConfig.width, bottom: imageConfig.bottom, right: imageConfig.right }"
        loading="lazy"
        alt="背景图片"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)

  defineOptions({ name: 'ArtBasicBanner' })

  // 流星对象接口定义
  interface Meteor {
    /** 流星的水平位置(百分比) */
    x: number
    /** 流星划过的速度 */
    speed: number
    /** 流星出现的延迟时间 */
    delay: number
  }

  // 按钮配置接口定义
  interface ButtonConfig {
    /** 是否启用按钮 */
    show: boolean
    /** 按钮文本 */
    text: string
    /** 按钮背景色 */
    color?: string
    /** 按钮文字颜色 */
    textColor?: string
    /** 按钮圆角大小 */
    radius?: string
  }

  // 流星效果配置接口定义
  interface MeteorConfig {
    /** 是否启用流星效果 */
    enabled: boolean
    /** 流星数量 */
    count?: number
  }

  // 背景图片配置接口定义
  interface ImageConfig {
    /** 图片源地址 */
    src: string
    /** 图片宽度 */
    width?: string
    /** 距底部距离 */
    bottom?: string
    /** 距右侧距离 */
    right?: string // 距右侧距离
  }

  // 组件属性接口定义
  interface Props {
    /** 横幅高度 */
    height?: string
    /** 标题文本 */
    title?: string
    /** 副标题文本 */
    subtitle?: string
    /** 盒子样式 */
    boxStyle?: string
    /** 是否显示装饰效果 */
    decoration?: boolean
    /** 按钮配置 */
    buttonConfig?: ButtonConfig
    /** 流星配置 */
    meteorConfig?: MeteorConfig
    /** 图片配置 */
    imageConfig?: ImageConfig
    /** 标题颜色 */
    titleColor?: string
    /** 副标题颜色 */
    subtitleColor?: string
  }

  // 组件属性默认值设置
  const props = withDefaults(defineProps<Props>(), {
    height: '11rem',
    titleColor: 'white',
    subtitleColor: 'white',
    boxStyle: '!bg-theme/60',
    decoration: true,
    buttonConfig: () => ({
      show: true,
      text: '查看',
      color: '#fff',
      textColor: '#333',
      radius: '6px'
    }),
    meteorConfig: () => ({ enabled: false, count: 10 }),
    imageConfig: () => ({ src: '', width: '12rem', bottom: '-3rem', right: '0' })
  })

  // 定义组件事件
  const emit = defineEmits<{
    (e: 'click'): void // 整体点击事件
    (e: 'buttonClick'): void // 按钮点击事件
  }>()

  // 计算按钮样式属性
  const buttonColor = computed(() => props.buttonConfig?.color ?? '#fff')
  const buttonTextColor = computed(() => props.buttonConfig?.textColor ?? '#333')
  const buttonRadius = computed(() => props.buttonConfig?.radius ?? '6px')

  // 流星数据初始化
  const meteors = ref<Meteor[]>([])
  onMounted(() => {
    if (props.meteorConfig?.enabled) {
      meteors.value = generateMeteors(props.meteorConfig?.count ?? 10)
    }
  })

  /**
   * 生成流星数据数组
   * @param count 流星数量
   * @returns 流星数据数组
   */
  function generateMeteors(count: number): Meteor[] {
    // 计算每个流星的区域宽度
    const segmentWidth = 100 / count
    return Array.from({ length: count }, (_, index) => {
      // 计算流星起始位置
      const segmentStart = index * segmentWidth
      // 在区域内随机生成x坐标
      const x = segmentStart + Math.random() * segmentWidth
      // 随机决定流星速度快慢
      const isSlow = Math.random() > 0.5
      return {
        x,
        speed: isSlow ? 5 + Math.random() * 3 : 2 + Math.random() * 2,
        delay: Math.random() * 5
      }
    })
  }
</script>

<style lang="scss" scoped>
  .basic-banner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 2rem;
    overflow: hidden;
    color: white;
    border-radius: calc(var(--custom-radius) + 2px) !important;

    &__content {
      position: relative;
      z-index: 1;
    }

    &__title {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    &__subtitle {
      position: relative;
      z-index: 10;
      margin: 0 0 1.5rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    &__button {
      box-sizing: border-box;
      display: inline-block;
      min-width: 80px;
      height: var(--el-component-custom-height);
      padding: 0 12px;
      font-size: 14px;
      line-height: var(--el-component-custom-height);
      text-align: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s;

      &:hover {
        opacity: 0.8;
      }
    }

    &__background-image {
      position: absolute;
      right: 0;
      bottom: -3rem;
      z-index: 0;
      width: 12rem;
    }

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

  @media (width <= 640px) {
    .basic-banner {
      box-sizing: border-box;
      justify-content: flex-start;
      padding: 16px;

      &__title {
        font-size: 1.4rem;
      }

      &__background-image {
        display: none;
      }

      &.has-decoration::after {
        display: none;
      }
    }
  }
</style>
