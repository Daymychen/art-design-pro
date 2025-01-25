<!-- 统计卡片 -->
<template>
  <div class="stats-card art-custom-card" :style="{ backgroundColor: backgroundColor }">
    <div class="stats-card__icon" :style="{ backgroundColor: iconBgColor }">
      <i
        class="iconfont-sys custom-text"
        v-html="icon"
        :style="{ color: iconColor, fontSize: iconSize + 'px' }"
      ></i>
    </div>
    <div class="stats-card__content">
      <p class="stats-card__title custom-text" :style="{ color: textColor }" v-if="title">
        {{ title }}
      </p>
      <CountTo
        v-if="count"
        class="stats-card__count custom-text"
        :endVal="count"
        :duration="1000"
      ></CountTo>
      <p
        class="stats-card__description custom-text"
        :style="{ color: textColor }"
        v-if="description"
        >{{ description }}</p
      >
    </div>
    <div class="stats-card__arrow" v-if="showArrow">
      <i class="iconfont-sys custom-text">&#xe703;</i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CountTo } from 'vue3-count-to'

  interface StatsCardProps {
    icon: string
    title?: string
    count?: number
    description: string
    iconColor?: string
    iconBgColor?: string
    iconSize?: number
    textColor?: string
    backgroundColor?: string
    showArrow?: boolean
  }

  defineProps<StatsCardProps>()
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
