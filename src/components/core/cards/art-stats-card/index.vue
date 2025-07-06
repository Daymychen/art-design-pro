<!-- 统计卡片 -->
<template>
  <div class="stats-card art-custom-card" :style="{ backgroundColor: backgroundColor }">
    <div
      v-if="icon"
      class="stats-card__icon"
      :style="{ backgroundColor: iconBgColor, borderRadius: iconBgRadius + 'px' }"
    >
      <i
        class="iconfont-sys"
        v-html="icon"
        :style="{
          color: iconColor,
          fontSize: iconSize + 'px'
        }"
      ></i>
    </div>
    <div class="stats-card__content">
      <p class="stats-card__title" :style="{ color: textColor }" v-if="title">
        {{ title }}
      </p>
      <ArtCountTo
        v-if="count"
        class="stats-card__count"
        :target="count"
        :duration="2000"
        separator=","
      />
      <p class="stats-card__description" :style="{ color: textColor }" v-if="description">{{
        description
      }}</p>
    </div>
    <div class="stats-card__arrow" v-if="showArrow">
      <i class="iconfont-sys">&#xe703;</i>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtStatsCard' })

  interface StatsCardProps {
    /** 图标 */
    icon?: string
    /** 标题 */
    title?: string
    /** 数值 */
    count?: number
    /** 描述 */
    description: string
    /** 图标颜色 */
    iconColor?: string
    /** 图标背景颜色 */
    iconBgColor?: string
    /** 图标圆角大小 */
    iconBgRadius?: number
    /** 图标大小 */
    iconSize?: number
    /** 文本颜色 */
    textColor?: string
    /** 背景颜色 */
    backgroundColor?: string
    /** 是否显示箭头 */
    showArrow?: boolean
  }

  withDefaults(defineProps<StatsCardProps>(), {
    iconSize: 30,
    iconBgRadius: 50
  })
</script>

<style lang="scss" scoped>
  .stats-card {
    display: flex;
    align-items: center;
    height: 8rem;
    padding: 0 20px;
    cursor: pointer;
    background-color: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) + 4px) !important;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      margin-right: 16px;
      border-radius: 50%;

      i {
        font-size: 30px;
      }
    }

    &__content {
      flex: 1;
    }

    &__title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: var(--art-gray-900);
    }

    &__count {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      color: var(--art-gray-900);
    }

    &__description {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--art-gray-600);
      opacity: 0.9;
    }

    &__arrow {
      i {
        font-size: 18px;
        color: var(--art-gray-600);
      }
    }
  }
</style>
