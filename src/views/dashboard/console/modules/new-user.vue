<template>
  <div class="art-card p-5 h-128 overflow-hidden mb-5">
    <div class="art-card-header">
      <div class="title">
        <h4>新用户</h4>
        <p>这个月增长<span class="text-success">+20%</span></p>
      </div>
      <ElRadioGroup v-model="radio2">
        <ElRadioButton value="本月" label="本月"></ElRadioButton>
        <ElRadioButton value="上月" label="上月"></ElRadioButton>
        <ElRadioButton value="今年" label="今年"></ElRadioButton>
      </ElRadioGroup>
    </div>
    <ArtTable
      class="w-full"
      :data="tableData"
      style="width: 100%"
      size="large"
      :border="false"
      :stripe="false"
      :header-cell-style="{ background: 'transparent' }"
    >
      <template #default>
        <ElTableColumn label="头像" prop="avatar" width="150px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <img class="size-9 rounded-lg" :src="scope.row.avatar" alt="avatar" />
              <span class="ml-2">{{ scope.row.username }}</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="地区" prop="province" />
        <ElTableColumn label="性别" prop="avatar">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.sex === 1 ? '男' : '女' }}</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="进度" width="240">
          <template #default="scope">
            <ElProgress
              :percentage="scope.row.pro"
              :color="scope.row.color"
              :stroke-width="4"
              :aria-label="`${scope.row.username}的完成进度: ${scope.row.pro}%`"
            />
          </template>
        </ElTableColumn>
      </template>
    </ArtTable>
  </div>
</template>

<script setup lang="ts">
  import avatar1 from '@/assets/img/avatar/avatar1.webp'
  import avatar2 from '@/assets/img/avatar/avatar2.webp'
  import avatar3 from '@/assets/img/avatar/avatar3.webp'
  import avatar4 from '@/assets/img/avatar/avatar4.webp'
  import avatar5 from '@/assets/img/avatar/avatar5.webp'
  import avatar6 from '@/assets/img/avatar/avatar6.webp'

  interface UserTableItem {
    username: string
    province: string
    sex: 0 | 1
    age: number
    percentage: number
    pro: number
    color: string
    avatar: string
  }

  const ANIMATION_DELAY = 100

  const radio2 = ref('本月')

  /**
   * 新用户表格数据
   * 包含用户基本信息和完成进度
   */
  const tableData = reactive<UserTableItem[]>([
    {
      username: '中小鱼',
      province: '北京',
      sex: 0,
      age: 22,
      percentage: 60,
      pro: 0,
      color: 'var(--a-primary)',
      avatar: avatar1
    },
    {
      username: '何小荷',
      province: '深圳',
      sex: 1,
      age: 21,
      percentage: 20,
      pro: 0,
      color: 'var(--a-secondary)',
      avatar: avatar2
    },
    {
      username: '誶誶淰',
      province: '上海',
      sex: 1,
      age: 23,
      percentage: 60,
      pro: 0,
      color: 'var(--a-warning)',
      avatar: avatar3
    },
    {
      username: '发呆草',
      province: '长沙',
      sex: 0,
      age: 28,
      percentage: 50,
      pro: 0,
      color: 'var(--a-info)',
      avatar: avatar4
    },
    {
      username: '甜筒',
      province: '浙江',
      sex: 1,
      age: 26,
      percentage: 70,
      pro: 0,
      color: 'var(--a-error)',
      avatar: avatar5
    },
    {
      username: '冷月呆呆',
      province: '湖北',
      sex: 1,
      age: 25,
      percentage: 90,
      pro: 0,
      color: 'var(--a-success)',
      avatar: avatar6
    }
  ])

  /**
   * 添加进度条动画效果
   * 延迟后将进度值从 0 更新到目标百分比，触发动画
   */
  const addAnimation = (): void => {
    setTimeout(() => {
      tableData.forEach((item) => {
        item.pro = item.percentage
      })
    }, ANIMATION_DELAY)
  }

  onMounted(() => {
    addAnimation()
  })
</script>

<style lang="scss" scoped>
  .art-card {
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: var(--el-color-primary) !important;
      background: transparent !important;
    }
  }
</style>
