<!-- 统计卡片 -->
<template>
  <div
    class="art-custom-card flex h-32 cursor-pointer items-center rounded-[calc(var(--custom-radius)+4px)] bg-[var(--art-main-bg-color)] px-5 transition-transform duration-200 ease-in-out hover:-translate-y-0.5"
    :style="{ backgroundColor: backgroundColor }"
  >
    <div
      v-if="icon"
      class="mr-4 flex h-[46px] w-[46px] items-center justify-center rounded-full"
      :style="{ backgroundColor: iconBgColor, borderRadius: iconBgRadius + 'px' }"
    >
      <i
        class="iconfont-sys text-[30px]"
        v-html="icon"
        :style="{
          color: iconColor,
          fontSize: iconSize + 'px'
        }"
      ></i>
    </div>
    <div class="flex-1">
      <p
        class="m-0 text-lg font-medium text-[var(--art-gray-900)]"
        :style="{ color: textColor }"
        v-if="title"
      >
        {{ title }}
      </p>
      <ArtCountTo
        class="m-0 text-[28px] font-medium text-[var(--art-gray-900)]"
        v-if="count !== undefined"
        :target="count"
        :duration="2000"
        :decimals="decimals"
        :separator="separator"
      />
      <p
        class="mt-1 text-sm text-[var(--art-gray-600)] opacity-90"
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
