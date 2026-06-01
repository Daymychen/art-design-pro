<template>
  <ElInput
    v-model="inputValue"
    class="art-icon-picker"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    v-bind="$attrs"
    @clear="handleClear"
  >
    <template #prefix>
      <ElPopover
        v-model:visible="popoverVisible"
        placement="bottom-start"
        :width="dynamicPopoverWidth"
        trigger="click"
        :popper-class="popperClass"
        :fallback-placements="['bottom-start', 'top-start']"
      >
        <template #reference>
          <ElButton link class="art-icon-picker__trigger" :disabled="disabled" @click.stop>
            <ArtSvgIcon :icon="selectedIcon" class="art-icon-picker__trigger-icon" />
          </ElButton>
        </template>

        <div class="art-icon-picker__panel">
          <div class="art-icon-picker__header">
            <div>
              <div class="art-icon-picker__title">{{ title }}</div>
              <div class="art-icon-picker__subtitle">{{ subtitle }}</div>
            </div>
            <div class="art-icon-picker__preview">
              <ArtSvgIcon :icon="selectedIcon" class="art-icon-picker__preview-icon" />
            </div>
          </div>

          <div class="art-icon-picker__toolbar">
            <ElInput v-model="keyword" clearable placeholder="输入图标名称筛选">
              <template #prefix>
                <ArtSvgIcon icon="ri:search-line" class="text-base text-g-500" />
              </template>
            </ElInput>
          </div>

          <div class="art-icon-picker__meta">
            <span>共 {{ filteredIcons.length }} 个图标</span>
            <span v-if="inputValue && !isPresetIcon">未匹配到预设图标</span>
          </div>

          <ElScrollbar
            :max-height="windowWidth <= 768 ? 240 : 320"
            class="art-icon-picker__scrollbar"
          >
            <div class="art-icon-picker__grid">
              <button
                v-for="icon in pagedIcons"
                :key="icon"
                type="button"
                class="art-icon-picker__item"
                :class="{ 'is-active': icon === inputValue }"
                @click="handleSelect(icon)"
              >
                <ArtSvgIcon :icon="icon" class="art-icon-picker__item-icon" />
              </button>
            </div>
          </ElScrollbar>

          <div class="art-icon-picker__footer">
            <ElPagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :pager-count="5"
              layout="prev, pager, next"
              :total="filteredIcons.length"
              :hide-on-single-page="filteredIcons.length <= pageSize"
              small
            />
          </div>
        </div>
      </ElPopover>
    </template>
  </ElInput>
</template>

<script setup lang="ts">
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import { REMIX_ICON_OPTIONS } from './icons'
  import { useWindowSize } from '@vueuse/core'

  defineOptions({
    name: 'ArtIconPicker',
    inheritAttrs: false
  })

  interface Props {
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    title?: string
    subtitle?: string
    defaultIcon?: string
    popperClass?: string
    pageSize?: number
    icons?: readonly string[]
  }

  interface Emits {
    (e: 'update:modelValue', value: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '请选择图标',
    disabled: false,
    clearable: true,
    title: '选择图标',
    defaultIcon: 'ri:apps-2-line',
    popperClass: 'art-icon-picker-popover',
    pageSize: 20,
    icons: () => REMIX_ICON_OPTIONS
  })

  const emit = defineEmits<Emits>()
  const { width: windowWidth } = useWindowSize()

  const popoverVisible = ref(false)
  const currentPage = ref(1)
  const keyword = ref('')

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value: string) => emit('update:modelValue', value)
  })

  const selectedIcon = computed(() => {
    if (!inputValue.value) return props.defaultIcon
    return inputValue.value.startsWith('ri:') ? inputValue.value : props.defaultIcon
  })

  const isPresetIcon = computed(() => props.icons.includes(inputValue.value))

  const filteredIcons = computed(() => {
    const currentKeyword = keyword.value.trim().toLowerCase()

    if (!currentKeyword) return props.icons

    return props.icons.filter((icon) => icon.toLowerCase().includes(currentKeyword))
  })

  const pagedIcons = computed(() => {
    const start = (currentPage.value - 1) * props.pageSize
    const end = start + props.pageSize
    return filteredIcons.value.slice(start, end)
  })

  const dynamicPopoverWidth = computed(() => {
    if (windowWidth.value <= 768) {
      return Math.min(windowWidth.value, 240)
    }
    return 340
  })

  const handleSelect = (icon: string) => {
    inputValue.value = icon
    popoverVisible.value = false
  }

  const handleClear = () => {
    inputValue.value = ''
  }

  watch(
    () => popoverVisible.value,
    (visible) => {
      if (!visible) {
        keyword.value = ''
        currentPage.value = 1
      }
    }
  )

  watch(
    () => keyword.value,
    () => {
      currentPage.value = 1
    }
  )
</script>

<style lang="scss" scoped>
  @use './style';
</style>
