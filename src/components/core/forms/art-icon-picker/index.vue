<template>
  <!-- 预览显示框 -->
  <div
    class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200"
    :class="
      selectedIcon ? 'hover:shadow-md' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
    "
    :style="
      selectedIcon
        ? {
            borderColor: selectedIcon.color,
            backgroundColor: `${selectedIcon.color}08`
          }
        : {}
    "
    @click="showPickerModal = true"
  >
    <div class="flex-shrink-0">
      <div
        v-if="selectedIcon"
        class="flex items-center justify-center w-10 h-10 rounded border-2"
        :style="{ borderColor: selectedIcon.color }"
      >
        <ArtSvgIcon
          :icon="selectedIcon.id"
          class="text-xl"
          :style="{ color: selectedIcon.color }"
        />
      </div>
      <div
        v-else
        class="flex items-center justify-center w-10 h-10 rounded border border-gray-200 bg-gray-100"
      >
        <Plus class="w-5 h-5 text-gray-400" />
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div v-if="selectedIcon" class="font-medium text-gray-900 truncate">{{
        selectedIcon.name
      }}</div>
      <div v-else class="text-gray-500">点击选择图标</div>
      <div v-if="selectedIcon" class="text-sm text-gray-500 truncate">{{ selectedIcon.id }}</div>
    </div>
    <div class="flex-shrink-0">
      <ArrowRight class="w-4 h-4 text-gray-400" />
    </div>
  </div>

  <!-- 图标选择弹窗 -->
  <ElDialog
    v-model="showPickerModal"
    title="选择图标"
    width="80%"
    :style="{ maxWidth: '900px' }"
    destroy-on-close
    align-center
  >
    <div class="space-y-4">
      <!-- 搜索框 -->
      <div class="flex gap-4">
        <div class="flex-1">
          <ElInput
            v-model="searchQuery"
            placeholder="搜索图标..."
            clearable
            :prefix-icon="Search"
          />
        </div>
        <div class="text-sm text-gray-500 flex items-center">
          共 {{ filteredIcons.length }} 个图标
        </div>
      </div>

      <!-- 图标库选择 -->
      <div class="overflow-x-auto whitespace-nowrap">
        <ElRadioGroup v-model="selectedLibrary" size="small">
          <ElRadioButton label="all">全部</ElRadioButton>
          <ElRadioButton
            v-for="category in iconCategories"
            :key="category.prefix"
            :label="category.prefix"
          >
            {{ category.name }}
          </ElRadioButton>
        </ElRadioGroup>
      </div>

      <!-- 图标网格 -->
      <div
        ref="iconGridRef"
        class="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50"
        style="max-height: 400px; overflow-y: auto"
      >
        <!-- 加载状态 -->
        <div v-if="isLoadingIcons" class="col-span-full text-gray-500 text-center py-8">
          <div class="text-sm">加载中...</div>
        </div>
        <!-- 无数据 -->
        <div
          v-else-if="filteredIcons.length === 0"
          class="col-span-full text-gray-500 text-center py-8"
        >
          <div class="text-sm">未找到匹配的图标</div>
        </div>
        <!-- 图标列表 -->
        <div
          v-for="icon in filteredIcons"
          :key="icon.id"
          :data-icon-id="icon.id"
          class="group relative flex flex-col items-center justify-center h-16 border border-gray-200 rounded-md bg-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          :class="{
            'border-2 ring-2 ring-offset-1': tempSelectedIcon?.id === icon.id
          }"
          :style="{
            borderColor: tempSelectedIcon?.id === icon.id ? icon.color : '',
            backgroundColor: tempSelectedIcon?.id === icon.id ? `${icon.color}10` : '',
            '--hover-color': icon.color
          }"
          @click="selectIcon(icon)"
        >
          <ArtSvgIcon :icon="icon.id" class="text-2xl" :style="{ color: icon.color }" />
          <!-- 提示放在上方 -->
          <div
            class="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10 group-hover:opacity-100"
          >
            {{ icon.name }}
          </div>
        </div>
      </div>

      <!-- 已选中的图标显示 -->
      <div
        v-if="tempSelectedIcon"
        class="p-4 rounded-lg border-2"
        :style="{
          borderColor: tempSelectedIcon.color,
          backgroundColor: `${tempSelectedIcon.color}08`
        }"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-700">已选择的图标：</span>
            <div class="flex items-center gap-2">
              <ArtSvgIcon
                :icon="tempSelectedIcon.id"
                class="text-3xl"
                :style="{ color: tempSelectedIcon.color }"
              />
              <div>
                <div class="font-mono text-sm text-gray-900">{{ tempSelectedIcon.id }}</div>
                <div class="text-xs text-gray-500">{{ tempSelectedIcon.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 图标标签 -->
        <div
          v-if="tempSelectedIcon.tags && tempSelectedIcon.tags.length > 0"
          class="flex items-center gap-2"
        >
          <span class="text-xs text-gray-600">标签：</span>
          <ElTag
            v-for="tag in tempSelectedIcon.tags"
            :key="tag"
            size="small"
            type="info"
            class="mr-1"
          >
            {{ tag }}
          </ElTag>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <ElButton
          v-if="tempSelectedIcon"
          size="small"
          type="danger"
          plain
          @click="clearTempSelection"
        >
          清除选择
        </ElButton>
        <div class="flex gap-2 ml-auto">
          <ElButton @click="showPickerModal = false">取消</ElButton>
          <ElButton type="primary" @click="confirmSelection">确定</ElButton>
        </div>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { ElInput, ElRadioGroup, ElRadioButton, ElTag, ElButton, ElDialog } from 'element-plus'
  import { Search, Plus, ArrowRight } from '@element-plus/icons-vue'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import iconDataRaw from './data.json'

  interface IconItem {
    id: string
    name: string
    prefix: string
    category: string
    color: string
    tags: string[]
  }

  interface IconLibrary {
    prefix: string
    name: string
    count: number
  }

  interface IconData {
    version: string
    total: number
    libraries: IconLibrary[]
    icons: IconItem[]
    categories?: Record<string, { icons: IconItem[] }> // 兼容旧格式
  }

  interface IconPickerProps {
    modelValue?: IconItem | string | null
    height?: number
  }

  interface IconPickerEmits {
    (e: 'update:modelValue', value: IconItem | null): void
    (e: 'change', value: IconItem | null): void
  }

  const props = withDefaults(defineProps<IconPickerProps>(), {
    modelValue: null,
    height: 400
  })

  const emit = defineEmits<IconPickerEmits>()

  /**
   * 将图标 ID 字符串转换为 IconItem 对象
   */
  const iconIdToObject = (iconId: string): IconItem | null => {
    if (!iconId) return null
    const icon = iconData.icons.find((icon) => icon.id === iconId)
    return icon || null
  }

  /**
   * 标准化输入值：支持字符串或对象
   */
  const normalizeValue = (value: IconItem | string | null | undefined): IconItem | null => {
    if (!value) return null
    if (typeof value === 'string') {
      return iconIdToObject(value)
    }
    return value
  }

  // 类型转换
  const iconData = iconDataRaw as IconData

  const searchQuery = ref('')
  const selectedLibrary = ref('ri') // 默认选择 Remix Icon
  const selectedIcon = ref<IconItem | null>(normalizeValue(props.modelValue))
  const showPickerModal = ref(false)
  const tempSelectedIcon = ref<IconItem | null>(null)
  const isLoadingIcons = ref(false)
  const loadedIcons = ref<IconItem[]>([])
  const iconGridRef = ref<HTMLElement | null>(null)

  // 图标分类
  const iconCategories = computed(() => {
    if (iconData.libraries) {
      return iconData.libraries.map((lib) => ({
        prefix: lib.prefix,
        name: lib.name
      }))
    }
    return [
      { prefix: 'ri', name: 'Remix Icon' },
      { prefix: 'ep', name: 'Element Plus' },
      { prefix: 'fa', name: 'Font Awesome' }
      // { prefix: 'mdi', name: 'Material Design' }
    ]
  })

  // 异步加载图标数据
  const loadIcons = async () => {
    if (loadedIcons.value.length > 0) return

    isLoadingIcons.value = true
    // 使用 setTimeout 模拟异步加载，避免阻塞 UI
    await new Promise((resolve) => setTimeout(resolve, 0))

    // 支持新的数据格式 (icons 数组)
    if (iconData.icons && Array.isArray(iconData.icons)) {
      loadedIcons.value = iconData.icons as IconItem[]
    }
    // 兼容旧的数据格式 (categories 结构)
    else if (iconData.categories) {
      const icons: IconItem[] = []
      Object.values(iconData.categories).forEach((category: any) => {
        if (category.icons) {
          icons.push(...category.icons)
        }
      })
      loadedIcons.value = icons
    }

    isLoadingIcons.value = false
  }

  // 从新的数据结构中提取所有图标
  const allIcons = computed(() => loadedIcons.value)

  // 过滤图标
  const filteredIcons = computed(() => {
    let icons = allIcons.value

    // 按图标库过滤
    if (selectedLibrary.value !== 'all') {
      icons = icons.filter((icon) => icon.prefix === selectedLibrary.value)
    }

    // 按搜索关键词过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      icons = icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(query) ||
          icon.id.toLowerCase().includes(query) ||
          icon.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return icons
  })

  // 滚动到选中的图标
  const scrollToSelectedIcon = async () => {
    if (!tempSelectedIcon.value || !iconGridRef.value) return

    await new Promise((resolve) => setTimeout(resolve, 100))

    const selectedElement = iconGridRef.value.querySelector(
      `[data-icon-id="${tempSelectedIcon.value.id}"]`
    )

    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  }

  const selectIcon = (icon: IconItem) => {
    tempSelectedIcon.value = icon
  }

  const confirmSelection = () => {
    if (tempSelectedIcon.value) {
      selectedIcon.value = tempSelectedIcon.value
      emit('update:modelValue', tempSelectedIcon.value)
      emit('change', tempSelectedIcon.value)
    }
    showPickerModal.value = false
    tempSelectedIcon.value = null
  }

  const clearTempSelection = () => {
    tempSelectedIcon.value = null
  }

  // 监听外部modelValue变化
  watch(
    () => props.modelValue,
    (newValue) => {
      selectedIcon.value = normalizeValue(newValue)
    }
  )

  // 监听弹窗打开，设置临时选中状态
  watch(showPickerModal, async (isOpen) => {
    if (isOpen) {
      tempSelectedIcon.value = selectedIcon.value
      searchQuery.value = ''
      // 如果已有选中图标，切换到对应的图标库，否则默认 ri
      selectedLibrary.value = selectedIcon.value?.prefix || 'ri'

      // 异步加载图标数据
      await loadIcons()

      // 滚动到已选中的图标
      if (selectedIcon.value) {
        await scrollToSelectedIcon()
      }
    }
  })

  // 监听图标库切换，清除搜索
  watch(selectedLibrary, () => {
    searchQuery.value = ''
  })
</script>

<style scoped>
  /* 滚动条样式 */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* 图标项 hover 动态配色 */
  .group:hover {
    background-color: color-mix(in srgb, var(--hover-color) 8%, transparent) !important;
    border-color: var(--hover-color) !important;
  }
</style>
