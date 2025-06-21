<template>
  <div class="custom-card art-custom-card today-sales">
    <div class="custom-card-header">
      <span class="title">今日销售</span>
      <span class="subtitle">销售总结</span>
      <div class="export-btn">
        <i class="iconfont-sys">&#xe6d1;</i>
        <span>导出</span>
      </div>
    </div>
    <div class="sales-summary">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24" v-for="(item, index) in salesData" :key="index">
          <div :class="['sales-card']">
            <i class="iconfont-sys" v-html="item.iconfont"></i>
            <h2>
              <CountTo
                class="number box-title"
                :endVal="item.value"
                :duration="1000"
                separator=""
              ></CountTo>
            </h2>
            <p>{{ item.label }}</p>
            <small>
              较昨天
              <span :class="[item.change.indexOf('+') === -1 ? 'text-danger' : 'text-success']">{{
                item.change
              }}</span>
            </small>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CountTo } from 'vue3-count-to'

  const salesData = ref([
    {
      label: '总销售额',
      value: 999,
      change: '+10%',
      iconfont: '&#xe7d9',
      class: 'bg-primary'
    },
    {
      label: '总订单量',
      value: 300,
      change: '+15%',
      iconfont: '&#xe70f',
      class: 'bg-warning'
    },
    {
      label: '产品销售量',
      value: 56,
      change: '-5%',
      iconfont: '&#xe712',
      class: 'bg-error'
    },
    {
      label: '新客户数',
      value: 68,
      change: '+8%',
      iconfont: '&#xe77f',
      class: 'bg-success'
    }
  ])
</script>

<style lang="scss" scoped>
  .today-sales {
    height: 330px;

    .export-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 66px;
      padding: 6px 0;
      color: var(--art-gray-600);
      cursor: pointer;
      border: 1px solid var(--art-border-dashed-color);
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        color: var(--main-color);
        border-color: var(--main-color);
      }

      .iconfont-sys {
        margin-right: 5px;
        font-size: 10px;
      }

      span {
        font-size: 12px;
      }
    }

    .sales-summary {
      padding: 20px;

      .sales-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 220px;
        padding: 0 20px;
        overflow: hidden;
        border: 1px solid var(--art-border-color) !important;
        border-radius: calc(var(--custom-radius) / 2 + 4px) !important;

        .iconfont-sys {
          width: 48px;
          height: 48px;
          font-size: 20px;
          line-height: 48px;
          color: var(--el-color-primary);
          text-align: center;
          background-color: var(--el-color-primary-light-9);
          border-radius: 10px;
        }

        h2 {
          margin-top: 26px;
          font-size: 26px;
          font-weight: 400;
          color: var(--art-text-gray-900) !important;
        }

        p {
          margin-top: 6px;
          font-size: 16px;
          color: var(--art-text-gray-700) !important;

          @include ellipsis;
        }

        small {
          display: block;
          margin-top: 5px;
          font-size: 12px;
          color: var(--art-text-gray-600) !important;

          @include ellipsis;
        }
      }
    }
  }

  // 暗黑模式降低颜色强度
  .dark {
    .today-sales {
      .sales-summary {
        .sales-card {
          .iconfont-sys {
            &.red,
            &.yellow,
            &.green,
            &.purple {
              background-color: #222 !important;
            }
          }
        }
      }
    }
  }

  @media (width <= 768px) {
    .today-sales {
      height: auto;

      .sales-summary {
        padding-bottom: 0;

        .sales-card {
          height: auto;
          padding: 16px;
          margin-bottom: 20px;

          h2 {
            margin-top: 10px;
            font-size: 24px;
          }
        }
      }
    }
  }
</style>
