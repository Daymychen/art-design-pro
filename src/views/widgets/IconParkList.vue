<template>
  <div class="page-content">
    <div class="form">
      <el-select v-model="iconType" placeholder="图标类型" style="width: 240px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="colors-icon">
        <el-checkbox v-model="isColorsIcon" label="彩色图标" />
      </div>
      <div class="search-box">
        <el-input v-model="searchText" placeholder="搜索图标" prefix-icon="Search" clearable />
      </div>
    </div>

    <div class="tips">
      <p
        >提示：点击图标可复制组件名称（共 {{ allIcons.length }} 个图标，当前显示
        {{ filteredIcons.length }} 个）</p
      >
    </div>

    <el-skeleton :rows="10" :loading="loading" animated>
      <template #default>
        <div class="list">
          <ul class="icon-list">
            <li v-for="icon in iconList" :key="icon.name" @click="copyIcon(icon.name)">
              <div class="icon-wrapper">
                <component
                  v-if="IconParkLib[icon.name]"
                  :is="IconParkLib[icon.name]"
                  :theme="iconType"
                  :size="26"
                  :stroke-width="3"
                  :style="getIconStyle()"
                />
                <span v-else class="icon-error">图标加载失败</span>
              </div>
              <span class="icon-name">{{ icon.name }}</span>
            </li>
          </ul>
        </div>

        <div class="pagination-container" v-if="totalPages > 1">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredIcons.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getAllIconParkIcons, type IconType } from '@/utils/iconpark'
  import * as IconPark from '@icon-park/vue-next'

  // 为IconPark添加索引签名
  type IconParkType = typeof IconPark & {
    [key: string]: any
  }
  const IconParkLib = IconPark as IconParkType

  const iconType = ref<IconType>('outline')
  const options = [
    {
      value: 'outline',
      label: '线框风格'
    },
    {
      value: 'filled',
      label: '填充风格'
    },
    {
      value: 'two-tone',
      label: '双色风格'
    },
    {
      value: 'multi-color',
      label: '多色风格'
    }
  ]

  const isColorsIcon = ref(false)
  const searchText = ref('')
  const loading = ref(true)

  // 分页相关
  const currentPage = ref(1)
  const pageSize = ref(120)

  // 获取所有图标
  const allIcons = ref(getAllIconParkIcons())

  // 过滤图标列表
  const filteredIcons = computed(() => {
    if (!searchText.value) return allIcons.value
    return allIcons.value.filter((icon) =>
      icon.name.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })

  // 当前页的图标
  const iconList = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    return filteredIcons.value.slice(startIndex, startIndex + pageSize.value)
  })

  // 总页数
  const totalPages = computed(() => Math.ceil(filteredIcons.value.length / pageSize.value))

  // 重置分页
  watch(searchText, () => {
    currentPage.value = 1
  })

  onMounted(() => {
    loading.value = false
  })

  const copyIcon = (text: string) => {
    if (!text) return

    let copyipt = document.createElement('input')
    copyipt.setAttribute('value', text || '')
    document.body.appendChild(copyipt)
    copyipt.select()
    document.execCommand('copy')
    document.body.removeChild(copyipt)

    ElMessage.success(`已复制: ${text}`)
  }

  const getRandomColor = () => {
    const colors = ['#2d8cf0', '#19be6b', '#ff9900', '#f24965', '#9463f7']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const getIconStyle = () => {
    return isColorsIcon.value ? { color: getRandomColor() } : { color: 'var(--art-text-gray-700)' }
  }

  const handlePageChange = (page: number) => {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;

    $border-color: #eee;

    .form {
      display: flex;
      align-items: center;

      .colors-icon {
        box-sizing: border-box;
        height: var(--el-component-custom-height);
        padding: 0 30px;
        margin-left: 10px;
        border: 1px solid var(--art-border-dashed-color);
        border-radius: calc(var(--custom-radius) / 3 + 2px) !important;
      }
    }

    .search-box {
      margin-left: 10px;
    }

    .tips {
      margin: 10px 0;
      font-size: 12px;
      color: var(--art-text-gray-500);
    }

    .list {
      margin-top: 20px;

      .icon-list {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        width: calc(100% + 16px);

        li {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          aspect-ratio: 1 / 1;
          padding: 0 8px;
          margin: 0 16px 16px 0;
          overflow: hidden;
          color: rgba(#fff, 0.8);
          text-align: center;
          border: 1px solid rgb(var(--art-gray-300-rgb), 0.8);
          border-radius: 12px !important;

          &:hover {
            cursor: pointer;
            background: var(--art-gray-100);
          }

          .icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
          }

          .icon-error {
            font-size: 12px;
            color: #f56c6c;
          }

          .icon-name {
            display: block;
            margin-top: 10px;
            overflow: hidden;
            font-size: 12px;
            color: var(--art-text-gray-600);
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }
  }

  @media screen and (max-width: $device-notebook) {
    .page-content {
      .list {
        .icon-list {
          grid-template-columns: repeat(8, 1fr);
        }
      }
    }
  }

  @media screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .list {
        .icon-list {
          grid-template-columns: repeat(5, 1fr);
        }
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .page-content {
      .list {
        .icon-list {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }
</style>
