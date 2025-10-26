<!-- 统计卡片 -->
<template>
  <div
    class="art-card h-32 flex-c px-5 transition-transform duration-200 hover:-translate-y-0.5"
    :style="{ backgroundColor: backgroundColor }"
  >
    <div
      v-if="icon"
      class="mr-4 size-[46px] flex-center rounded-full"
      :style="{ backgroundColor: iconBgColor, borderRadius: iconBgRadius + 'px' }"
    >
      <ArtSvgIcon
        :icon="icon"
        :style="{
          color: iconColor,
          fontSize: iconSize + 'px'
        }"
      ></ArtSvgIcon>
    </div>
    <div class="flex-1">
      <p class="m-0 text-lg font-medium" :style="{ color: textColor }" v-if="title">
        {{ title }}
      </p>
      <ArtCountTo
        class="m-0 text-2xl font-medium"
        v-if="count !== undefined"
        :target="count"
        :duration="2000"
        :decimals="decimals"
        :separator="separator"
      />
      <p
        class="mt-1 text-sm text-g-500 opacity-90"
        :style="{ color: textColor }"
        v-if="description"
        >{{ description }}</p
      >
    </div>
    <div v-if="showArrow">
      <ArtSvgIcon icon="ri:arrow-right-s-line" class="text-xl text-g-400" />
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
    /** 小数位 */
    decimals?: number
    /** 分隔符 */
    separator?: string
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
    iconBgRadius: 50,
    decimals: 0,
    separator: ','
  })
</script>
