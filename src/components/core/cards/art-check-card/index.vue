<template>
  <div
    class="art-check-card"
    :class="[
      `art-check-card--${size}`,
      {
        'art-check-card--checked': isChecked,
        'art-check-card--disabled': disabled
      }
    ]"
    @click="handleClick"
  >
    <!-- 卡片内容区域 -->
    <div class="art-check-card__content">
      <!-- 头像区域 -->
      <div v-if="avatar || $slots.avatar" class="art-check-card__avatar">
        <slot name="avatar" :avatar="avatar" :title="title" :description="description">
          <ElAvatar
            v-if="typeof avatar === 'string'"
            :src="avatar"
            v-bind="avatarProps"
            class="art-check-card__avatar-img"
          />
          <div
            v-else-if="typeof avatar === 'object' && avatar.icon"
            class="art-check-card__avatar-icon"
          >
            <ArtSvgIcon :icon="avatar.icon" :style="{ color: avatar.color || '#3b82f6' }" />
          </div>
        </slot>
      </div>

      <!-- 主要内容区域 -->
      <div class="art-check-card__body">
        <!-- 标题区域 -->
        <div v-if="title || $slots.title" class="art-check-card__header">
          <div class="art-check-card__title">
            <slot name="title" :title="title" :description="description">
              {{ title }}
            </slot>
          </div>

          <!-- 额外操作区域 -->
          <div v-if="extra || $slots.extra" class="art-check-card__extra" @click.stop="handleExtra">
            <slot name="extra" :title="title" :description="description">
              <ArtSvgIcon
                v-if="typeof extra === 'object' && extra.icon"
                :icon="extra.icon"
                :style="{ color: extra.color || '#6b7280' }"
              />
            </slot>
          </div>
        </div>

        <!-- 描述区域 -->
        <div v-if="description || $slots.description" class="art-check-card__description">
          <slot name="description" :title="title" :description="description">
            {{ description }}
          </slot>
        </div>

        <!-- 标签区域 -->
        <div v-if="tags && tags.length > 0" class="art-check-card__tags">
          <ElTag
            v-for="tag in tags"
            :key="tag.text"
            :type="tag.type"
            size="small"
            class="art-check-card__tag"
          >
            {{ tag.text }}
          </ElTag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ElAvatar, ElTag } from 'element-plus'
  import type { ComponentSize } from 'element-plus'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

  export interface CheckCardTag {
    text: string
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }

  export interface CheckCardAvatar {
    icon?: any
    color?: string
  }

  export interface CheckCardExtra {
    icon?: any
    color?: string
  }

  export interface ArtCheckCardProps {
    modelValue?: boolean
    size?: ComponentSize
    avatar?: string | CheckCardAvatar
    avatarProps?: Record<string, any>
    title?: string
    description?: string
    tags?: CheckCardTag[]
    extra?: CheckCardExtra
    disabled?: boolean
  }

  export interface ArtCheckCardEmits {
    (e: 'update:modelValue', checked: boolean): void
    (e: 'change', checked: boolean): void
    (e: 'extra'): void
  }

  defineOptions({
    name: 'ArtCheckCard'
  })

  const props = withDefaults(defineProps<ArtCheckCardProps>(), {
    modelValue: false,
    size: 'default',
    avatar: undefined,
    avatarProps: () => ({}),
    title: undefined,
    description: undefined,
    tags: () => [],
    extra: undefined,
    disabled: false
  })

  const emit = defineEmits<ArtCheckCardEmits>()

  const isChecked = computed(() => props.modelValue)

  const handleClick = () => {
    if (props.disabled) return
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  const handleExtra = () => {
    if (props.disabled) return
    emit('extra')
  }
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .art-check-card {
    @apply relative flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 bg-white hover:border-blue-300 hover:shadow-sm;
  }

  .art-check-card--small {
    @apply p-3;
  }

  .art-check-card--large {
    @apply p-5;
  }

  .art-check-card--checked {
    @apply border-blue-500 bg-blue-50;
  }

  .art-check-card--disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  .art-check-card--disabled:hover {
    @apply border-gray-200 bg-white;
  }

  /* 内容区域 */
  .art-check-card__content {
    @apply flex-1 flex items-start gap-3;
  }

  .art-check-card__avatar {
    @apply flex-shrink-0;
  }

  .art-check-card__avatar-img {
    @apply w-10 h-10 rounded-lg;
  }

  .art-check-card__avatar-icon {
    @apply flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-lg;
  }

  .art-check-card__body {
    @apply flex-1 min-w-0;
  }

  .art-check-card__header {
    @apply flex items-center justify-between mb-1;
  }

  .art-check-card__title {
    @apply font-medium text-gray-900 text-sm leading-tight;
  }

  .art-check-card--checked .art-check-card__title {
    @apply text-blue-900;
  }

  .art-check-card__extra {
    @apply flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors duration-150;
  }

  .art-check-card__description {
    @apply text-xs text-gray-500 leading-relaxed;
  }

  .art-check-card--checked .art-check-card__description {
    @apply text-blue-600;
  }

  .art-check-card__tags {
    @apply flex flex-wrap gap-1 mt-2;
  }

  .art-check-card__tag {
    @apply text-xs;
  }

  /* 不同尺寸调整 */
  .art-check-card--small .art-check-card__avatar-img,
  .art-check-card--small .art-check-card__avatar-icon {
    @apply w-8 h-8;
  }

  .art-check-card--small .art-check-card__title {
    @apply text-xs;
  }

  .art-check-card--small .art-check-card__description {
    @apply text-xs;
  }

  .art-check-card--large .art-check-card__avatar-img,
  .art-check-card--large .art-check-card__avatar-icon {
    @apply w-12 h-12;
  }

  .art-check-card--large .art-check-card__title {
    @apply text-base;
  }

  .art-check-card--large .art-check-card__description {
    @apply text-sm;
  }

  /* 聚焦和交互状态 */
  .art-check-card:focus-within {
    @apply outline-none ring-2 ring-blue-500 ring-offset-2;
  }
</style>
