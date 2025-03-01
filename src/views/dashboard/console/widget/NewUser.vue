<template>
  <div class="region new-user art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">新用户</h4>
        <p class="subtitle">这个月增长<span class="text-success">+20%</span></p>
      </div>
      <el-radio-group v-model="radio2">
        <el-radio-button value="本月" label="本月"></el-radio-button>
        <el-radio-button value="上月" label="上月"></el-radio-button>
        <el-radio-button value="今年" label="今年"></el-radio-button>
      </el-radio-group>
    </div>
    <art-table :data="tableData" :pagination="false">
      <template #default>
        <el-table-column label="头像" prop="avatar" width="150px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <img class="avatar" :src="scope.row.avatar" />
              <span class="user-name">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="province" />
        <el-table-column label="性别" prop="avatar">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.sex === 1 ? '男' : '女' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="240">
          <template #default="scope">
            <el-progress :percentage="scope.row.pro" :color="scope.row.color" :stroke-width="4" />
          </template>
        </el-table-column>
      </template>
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive } from 'vue-demi'
  import avatar1 from '@/assets/img/avatar/avatar1.jpg'
  import avatar2 from '@/assets/img/avatar/avatar2.jpg'
  import avatar3 from '@/assets/img/avatar/avatar3.jpg'
  import avatar4 from '@/assets/img/avatar/avatar4.jpg'
  import avatar5 from '@/assets/img/avatar/avatar5.jpg'
  import avatar6 from '@/assets/img/avatar/avatar6.jpg'

  const radio2 = ref('本月')

  const tableData = reactive([
    {
      username: '中小鱼',
      province: '北京',
      sex: 0,
      age: 22,
      percentage: 60,
      pro: 0,
      color: 'rgb(var(--art-primary)) !important',
      avatar: avatar1
    },
    {
      username: '何小荷',
      province: '深圳',
      sex: 1,
      age: 21,
      percentage: 20,
      pro: 0,
      color: 'rgb(var(--art-secondary)) !important',
      avatar: avatar2
    },
    {
      username: '誶誶淰',
      province: '上海',
      sex: 1,
      age: 23,
      percentage: 60,
      pro: 0,
      color: 'rgb(var(--art-warning)) !important',
      avatar: avatar3
    },
    {
      username: '发呆草',
      province: '长沙',
      sex: 0,
      age: 28,
      percentage: 50,
      pro: 0,
      color: 'rgb(var(--art-info)) !important',
      avatar: avatar4
    },
    {
      username: '甜筒',
      province: '浙江',
      sex: 1,
      age: 26,
      percentage: 70,
      pro: 0,
      color: 'rgb(var(--art-error)) !important',
      avatar: avatar5
    },
    {
      username: '冷月呆呆',
      province: '湖北',
      sex: 1,
      age: 25,
      percentage: 90,
      pro: 0,
      color: 'rgb(var(--art-success)) !important',
      avatar: avatar6
    }
  ])

  onMounted(() => {
    addAnimation()
  })

  const addAnimation = () => {
    setTimeout(() => {
      for (let i = 0; i < tableData.length; i++) {
        let item = tableData[i]
        tableData[i].pro = item.percentage
      }
    }, 100)
  }
</script>

<style lang="scss">
  .region {
    // 进度动画
    .el-progress-bar__inner {
      transition: all 1s !important;
    }

    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      color: var(--el-color-primary) !important;
      background: transparent !important;
    }

    .any-table {
      .el-table {
        thead {
          tr {
            height: 55px !important;
          }
        }

        tr {
          height: 55px !important;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .region {
    width: 50%;

    .any-table {
      box-shadow: none;
    }

    .card-header {
      padding-left: 25px !important;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 6px;
    }

    .user-name {
      margin-left: 10px;
    }
  }

  @media screen and (max-width: $device-notebook) {
    .region {
      width: 46%;
    }
  }
</style>
