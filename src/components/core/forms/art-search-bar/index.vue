<!-- 表格搜索栏 -->
<template>
  <section class="search-bar art-custom-card">
    <ElForm :model="filter" :label-position="labelPosition">
      <ElRow class="search-form-row" :gutter="gutter">
        <ElCol
          v-for="item in visibleFormItems"
          :key="item.prop"
          :xs="24"
          :sm="12"
          :md="item.elColSpan || elColSpan"
          :lg="item.elColSpan || elColSpan"
          :xl="item.elColSpan || elColSpan"
        >
          <ElFormItem :label="item.label" :prop="item.prop" :label-width="labelWidth">
            <component
              :is="getComponent(item.type)"
              v-model:value="filter[item.prop]"
              :item="item"
            />
          </ElFormItem>
        </ElCol>
        <ElCol
          :xs="24"
          :sm="24"
          :md="elColSpan"
          :lg="elColSpan"
          :xl="elColSpan"
          class="action-column"
        >
          <div class="action-buttons-wrapper" :style="actionButtonsStyle">
            <div class="form-buttons">
              <ElButton class="reset-button" @click="handleReset" v-ripple>
                {{ t('table.searchBar.reset') }}
              </ElButton>
              <ElButton type="primary" class="search-button" @click="handleSearch" v-ripple>
                {{ t('table.searchBar.search') }}
              </ElButton>
            </div>
            <div v-if="shouldShowExpandToggle" class="filter-toggle" @click="toggleExpand">
              <span>{{ expandToggleText }}</span>
              <div class="icon-wrapper">
                <ElIcon>
                  <ArrowUpBold v-if="isExpanded" />
                  <ArrowDownBold v-else />
                </ElIcon>
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
  import { useWindowSize } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { markRaw } from 'vue'
  import ArtSearchInput from './widget/art-search-input/index.vue'
  import ArtSearchSelect from './widget/art-search-select/index.vue'
  import ArtSearchRadio from './widget/art-search-radio/index.vue'
  import ArtSearchDate from './widget/art-search-date/index.vue'
  import type { SearchComponentType, SearchFormItem } from '@/types'
  import type { Component } from 'vue'

  defineOptions({ name: 'ArtSearchBar' })

  const { width } = useWindowSize()
  const { t } = useI18n()
  const isMobile = computed(() => width.value < 500)

  type FilterValue = string | number | undefined | null | unknown[]
  type FilterData = Record<string, FilterValue>

  interface SearchBarProps {
    /** 查询参数 */
    filter: FilterData
    /** 表单数据 */
    items: SearchFormItem[]
    /** 每列的宽度（基于 24 格布局） */
    elColSpan?: number
    /** 表单控件间隙 */
    gutter?: number
    /** 展开/收起 */
    isExpand?: boolean
    /** 表单域标签的位置 */
    labelPosition?: 'left' | 'right'
    /** 文字宽度 */
    labelWidth?: string
    /** 是否需要展示，收起 */
    showExpand?: boolean
    /** 按钮靠左对齐限制（表单项小于等于该值时） */
    buttonLeftLimit?: number
  }

  const props = withDefaults(defineProps<SearchBarProps>(), {
    elColSpan: 6,
    gutter: 12,
    isExpand: false,
    labelPosition: 'right',
    labelWidth: '70px',
    showExpand: true,
    buttonLeftLimit: 2
  })

  interface SearchBarEmits {
    'update:filter': [filter: FilterData]
    reset: []
    search: []
  }

  const emit = defineEmits<SearchBarEmits>()

  /**
   * 是否展开状态
   */
  const isExpanded = ref(false)

  /**
   * 组件映射表（使用 markRaw 优化性能）
   */
  const componentsMap = markRaw({
    input: ArtSearchInput,
    select: ArtSearchSelect,
    radio: ArtSearchRadio,
    checkbox: ArtSearchSelect, // 复用 select 组件
    datetime: ArtSearchDate,
    date: ArtSearchDate,
    daterange: ArtSearchDate,
    datetimerange: ArtSearchDate,
    month: ArtSearchDate,
    monthrange: ArtSearchDate,
    year: ArtSearchDate,
    yearrange: ArtSearchDate,
    week: ArtSearchDate,
    time: ArtSearchDate,
    timerange: ArtSearchDate
  } as const satisfies Record<SearchComponentType, Component>)

  /**
   * 可见的表单项
   */
  const visibleFormItems = computed(() => {
    const shouldShowLess = !props.isExpand && !isExpanded.value
    if (shouldShowLess) {
      const maxItemsPerRow = Math.floor(24 / props.elColSpan) - 1
      return props.items.slice(0, maxItemsPerRow)
    }
    return props.items
  })

  /**
   * 查询参数的双向绑定
   */
  const filter = computed({
    get: () => props.filter,
    set: (value) => emit('update:filter', value)
  })

  /**
   * 是否应该显示展开/收起按钮
   */
  const shouldShowExpandToggle = computed(() => {
    return (
      !props.isExpand &&
      props.showExpand &&
      props.items.length > Math.floor(24 / props.elColSpan) - 1
    )
  })

  /**
   * 展开/收起按钮文本
   */
  const expandToggleText = computed(() => {
    return isExpanded.value ? t('table.searchBar.collapse') : t('table.searchBar.expand')
  })

  /**
   * 操作按钮样式
   */
  const actionButtonsStyle = computed(() => ({
    'justify-content': isMobile.value
      ? 'flex-end'
      : props.items.length <= props.buttonLeftLimit
        ? 'flex-start'
        : 'flex-end'
  }))

  /**
   * 获取对应的组件
   */
  function getComponent(type: SearchComponentType): Component {
    return componentsMap[type]
  }

  /**
   * 切换展开/收起状态
   */
  function toggleExpand() {
    isExpanded.value = !isExpanded.value
  }

  /**
   * 处理重置事件
   */
  function handleReset() {
    emit('reset')
  }

  /**
   * 处理搜索事件
   */
  function handleSearch() {
    emit('search')
  }

  // 解构 props 以便在模板中直接使用
  const { elColSpan, gutter, labelPosition, labelWidth } = toRefs(props)
</script>

<style lang="scss" scoped>
  .search-bar {
    padding: 20px 20px 0;
    background-color: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) / 2 + 2px);

    :deep(.el-form-item__label) {
      display: flex;
      align-items: center;
      line-height: 20px;
    }

    .search-form-row {
      display: flex;
      flex-wrap: wrap;
    }

    .action-column {
      flex: 1;
      max-width: 100%;

      .action-buttons-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 12px;
      }

      .form-buttons {
        display: flex;
        gap: 8px;
      }

      .filter-toggle {
        display: flex;
        align-items: center;
        margin-left: 10px;
        line-height: 32px;
        color: var(--main-color);
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: var(--el-color-primary);
        }

        span {
          font-size: 14px;
          user-select: none;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          margin-left: 4px;
          font-size: 14px;
          transition: transform 0.2s ease;
        }
      }
    }
  }

  // 响应式优化
  @media (width <= 768px) {
    .search-bar {
      padding: 16px 16px 0;

      .action-column {
        .action-buttons-wrapper {
          flex-direction: column;
          gap: 8px;
          align-items: stretch;

          .form-buttons {
            justify-content: center;
          }

          .filter-toggle {
            justify-content: center;
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
