<template>
  <section class="search-bar">
    <el-form :model="filter" :label-position="props.labelPosition">
      <el-row class="search-form-row" :gutter="props.gutter">
        <el-col
          v-for="item in useFormItemArr"
          :key="item.prop"
          :xs="24"
          :sm="12"
          :md="item.elColSpan || props.elColSpan"
          :lg="item.elColSpan || props.elColSpan"
          :xl="item.elColSpan || props.elColSpan"
        >
          <el-form-item :label="`${item.label}`" :prop="item.prop" :label-width="labelWidth">
            <component
              :is="getComponent(item.type)"
              v-model:value="filter[item.prop]"
              :item="item"
            />
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="props.elColSpan"
          :lg="props.elColSpan"
          :xl="props.elColSpan"
          class="action-column"
        >
          <div
            class="action-buttons-wrapper"
            :style="{
              'justify-content': isMobile
                ? 'flex-end'
                : items.length <= buttonLeftLimit
                  ? 'flex-start'
                  : 'flex-end'
            }"
          >
            <div class="form-buttons">
              <el-button class="reset-button" @click="$emit('reset')" v-ripple>{{
                $t('table.searchBar.reset')
              }}</el-button>
              <el-button type="primary" class="search-button" @click="$emit('search')" v-ripple>{{
                $t('table.searchBar.search')
              }}</el-button>
            </div>
            <div v-if="!isExpand && showExpand" class="filter-toggle" @click="isShow = !isShow">
              <span>{{
                isShow ? $t('table.searchBar.collapse') : $t('table.searchBar.expand')
              }}</span>
              <div class="icon-wrapper">
                <el-icon>
                  <ArrowUpBold v-if="isShow" />
                  <ArrowDownBold v-else />
                </el-icon>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script setup lang="ts">
  import { DefineComponent, computed, ref } from 'vue'
  import ArtSearchInput from './widget/ArtSearchInput.vue'
  import ArtSearchSelect from './widget/ArtSearchSelect.vue'
  import ArtSearchRadio from './widget/ArtSearchRadio.vue'
  import { SearchComponentType, SearchFormItem } from '@/types/search-form'

  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < 500)

  type FilterVo = string | number | undefined | null | unknown[]

  interface PropsVO {
    filter: Record<string, FilterVo> // 查询参数
    items: SearchFormItem[] // 表单数据
    elColSpan?: number // 每列的宽度（基于 24 格布局）
    gutter?: number // 表单控件间隙
    isExpand?: boolean // 展开/收起
    labelPosition?: 'left' | 'right' // 表单域标签的位置
    labelWidth?: string // 文字宽度
    showExpand?: boolean // 是否需要展示，收起
    buttonLeftLimit?: number // 按钮靠左对齐限制（表单项小于等于该值时）
  }

  const props = withDefaults(defineProps<PropsVO>(), {
    elColSpan: 6,
    gutter: 12,
    isExpand: false,
    labelPosition: 'right',
    labelWidth: '70px',
    showExpand: true,
    buttonLeftLimit: 2
  })

  const emit = defineEmits<{
    (e: 'update:filter', filter: Record<string, FilterVo>): void
    (e: 'reset'): void
    (e: 'search'): void
  }>()

  const isShow = ref(false)

  const useFormItemArr = computed(() => {
    const isshowLess = !props.isExpand && !isShow.value
    if (isshowLess) {
      const num = Math.floor(24 / props.elColSpan) - 1
      return props.items.slice(0, num)
    } else {
      return props.items
    }
  })

  const filter = computed({
    get: () => props.filter,
    set: (val) => emit('update:filter', val)
  })

  const componentsMap = new Map([
    ['input', ArtSearchInput],
    ['select', ArtSearchSelect],
    ['radio', ArtSearchRadio]
  ])

  const getComponent = (type: SearchComponentType): DefineComponent => {
    return componentsMap.get(type) as unknown as DefineComponent
  }
</script>

<style lang="scss" scoped>
  .search-bar {
    padding: 20px 20px 0;
    background-color: var(--art-main-bg-color);
    border: 1px solid var(--art-border-color);
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

      .filter-toggle {
        display: flex;
        align-items: center;
        margin-left: 10px;
        line-height: 32px;
        color: var(--main-color);
        cursor: pointer;

        span {
          font-size: 14px;
          user-select: none;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          margin-left: 4px;
          font-size: 14px;
        }
      }
    }
  }
</style>
