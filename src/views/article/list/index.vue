<!-- 文章列表页面 -->
<template>
  <div class="page-content !mb-5">
    <ElRow justify="space-between" :gutter="10">
      <ElCol :lg="6" :md="6" :sm="14" :xs="16">
        <ElInput
          v-model="searchVal"
          :prefix-icon="Search"
          clearable
          placeholder="输入文章标题查询"
          @keyup.enter="searchArticle"
        />
      </ElCol>
      <ElCol :lg="12" :md="12" :sm="0" :xs="0">
        <div class="custom-segmented">
          <ElSegmented v-model="yearVal" :options="YEAR_OPTIONS" @change="searchArticleByYear" />
        </div>
      </ElCol>
      <ElCol :lg="6" :md="6" :sm="10" :xs="6" style="display: flex; justify-content: end">
        <ElButton @click="toAddArticle" v-auth="'add'">新增文章</ElButton>
      </ElCol>
    </ElRow>

    <div class="mt-5">
      <div
        class="grid grid-cols-5 gap-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1"
      >
        <div
          class="group c-p overflow-hidden border border-g-300/60 rounded-custom-sm"
          v-for="item in articleList"
          :key="item.id"
          @click="toDetail(item)"
        >
          <div class="relative aspect-[16/9.5]">
            <ElImage
              class="flex align-center justify-center w-full h-full object-cover bg-gray-200"
              :src="item.home_img"
              lazy
              fit="cover"
            >
            </ElImage>

            <span
              class="absolute top-1 right-1 bg-black/50 rounded text-xs px-1 py-0.5 text-white"
              >{{ item.type_name }}</span
            >
          </div>
          <div class="px-2 py-1">
            <h2 class="text-base text-g-800 font-medium">{{ item.title }}</h2>
            <div class="flex-b w-full h-6 mt-1">
              <div class="flex-c text-g-500">
                <ArtSvgIcon icon="ri:time-line" class="mr-1 text-sm" />
                <span class="text-sm">{{ useDateFormat(item.create_time, 'YYYY-MM-DD') }}</span>
                <div class="w-px h-3 bg-g-400 mx-3.5"></div>
                <ArtSvgIcon icon="ri:eye-line" class="mr-1 text-sm" />
                <span class="text-sm">{{ item.count }}</span>
              </div>
              <ElButton
                class="opacity-0 group-hover:opacity-100"
                v-auth="'edit'"
                size="small"
                @click.stop="toEdit(item)"
                >编辑</ElButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 16vh" v-if="showEmpty">
      <ElEmpty :description="`未找到相关数据 ${EmojiText[0]}`" />
    </div>

    <div style="display: flex; justify-content: center; margin-top: 20px">
      <ElPagination
        size="default"
        background
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :pager-count="9"
        layout="prev, pager, next, total,jumper"
        :total="total"
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { router } from '@/router'
  import { useDateFormat } from '@vueuse/core'
  import EmojiText from '@/utils/ui/emojo'
  import { ArticleList } from '@/mock/temp/articleList'
  import { useCommon } from '@/composables/useCommon'

  defineOptions({ name: 'ArticleList' })

  interface Article {
    id: number
    home_img: string
    type_name: string
    title: string
    create_time: string
    count: number
  }

  interface GetArticleListOptions {
    backTop?: boolean
  }

  const YEAR_OPTIONS = ['All', '2024', '2023', '2022', '2021', '2020', '2019']
  const PAGE_SIZE = 40

  const yearVal = ref('All')
  const searchVal = ref('')
  const articleList = ref<Article[]>([])
  const currentPage = ref(1)
  const pageSize = ref(PAGE_SIZE)
  const total = ref(0)
  const isLoading = ref(true)

  const showEmpty = computed(() => articleList.value.length === 0 && !isLoading.value)

  const getArticleList = async ({ backTop = false }: GetArticleListOptions = {}) => {
    isLoading.value = true

    try {
      if (searchVal.value) {
        yearVal.value = 'All'
      }

      // TODO: 替换为真实 API 调用
      // const params = {
      //   page: currentPage.value,
      //   size: pageSize.value,
      //   searchVal: searchVal.value,
      //   year: yearVal.value === 'All' ? '' : yearVal.value
      // }
      // const res = await ArticleService.getArticleList(params)

      articleList.value = ArticleList as Article[]

      if (backTop) {
        useCommon().scrollToTop()
      }
    } catch (error) {
      console.error('获取文章列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const searchArticle = () => {
    currentPage.value = 1
    getArticleList({ backTop: true })
  }

  const searchArticleByYear = () => {
    currentPage.value = 1
    getArticleList({ backTop: true })
  }

  const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getArticleList({ backTop: true })
  }

  const toDetail = (item: Article) => {
    router.push({ name: 'ArticleDetail', params: { id: item.id } })
  }

  const toEdit = (item: Article) => {
    router.push({ name: 'ArticlePublish', query: { id: item.id } })
  }

  const toAddArticle = () => {
    router.push({ name: 'ArticlePublish' })
  }

  onMounted(() => {
    getArticleList()
  })
</script>

<style lang="scss">
  .custom-segmented .el-segmented {
    height: 40px;
    padding: 6px;

    --el-border-radius-base: 8px;
  }
</style>
