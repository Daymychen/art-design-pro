<template>
  <div class="custom-card today-sales">
    <div class="custom-card-header">
      <span class="title custom-text">Today's Sales</span>
      <span class="subtitle">Sales Summery</span>
      <div class="export-btn">
        <i class="iconfont-sys">&#xe6d1;</i>
        <span>Export</span>
      </div>
    </div>
    <div class="sales-summary">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24" v-for="(item, index) in salesData" :key="index">
          <div :class="['sales-card', item.class]">
            <i class="iconfont-sys" :class="item.class">{{ item.iconfont }}</i>
            <h2>{{ item.value }}</h2>
            <p>{{ item.label }}</p>
            <small>{{ item.change }} from yesterday</small>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const salesData = ref([
    {
      label: 'Total Sales',
      value: '$1k',
      change: '+15%',
      iconfont: '\ue7d9',
      class: 'red'
    },
    {
      label: 'Total Order',
      value: '300',
      change: '+5%',
      iconfont: '\ue70f',
      class: 'yellow'
    },
    {
      label: 'Product Sold',
      value: '5',
      change: '+2%',
      iconfont: '\ue712',
      class: 'green'
    },
    {
      label: 'New Customers',
      value: '8',
      change: '+8%',
      iconfont: '\ue77f',
      class: 'purple'
    }
  ])
</script>

<style lang="scss" scoped>
  .today-sales {
    height: 330px;

    .export-btn {
      padding: 6px 5px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      color: var(--art-text-gray-600);
      cursor: pointer;
      border: 1px solid var(--art-border-dashed-color);
      transition: all 0.3s;

      &:hover {
        color: var(--main-color);
        border-color: var(--main-color);
      }

      .iconfont-sys {
        font-size: 10px;
        margin-right: 5px;
      }

      span {
        font-size: 12px;
      }
    }

    .sales-summary {
      padding: 20px;
      .sales-card {
        height: 220px;
        padding: 0 20px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .iconfont-sys {
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 18px;
          color: #fff;
          border-radius: 50%;

          &.red {
            background-color: #fa5a7d;
          }
          &.yellow {
            background-color: #ff947a;
          }
          &.green {
            background-color: #3cd856;
          }
          &.purple {
            background-color: #bf83ff;
          }
        }

        &.red {
          background-color: #ffe2e5;
        }
        &.yellow {
          background-color: #fff4de;
        }
        &.green {
          background-color: #dcfce7;
        }
        &.purple {
          background-color: #f3e8ff;
        }

        h2 {
          margin-top: 10px;
          font-size: 22px;
          font-weight: 500;
          color: #151d48 !important;
        }

        p {
          margin-top: 10px;
          font-size: 16px;
          color: #425166 !important;
          @include ellipsis;
        }

        small {
          color: #4079ed;
          display: block;
          margin-top: 10px;
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
            &.red {
              background-color: rgba(250, 90, 125, 0.9);
            }
            &.yellow {
              background-color: rgba(255, 148, 122, 0.9);
            }
            &.green {
              background-color: rgba(60, 216, 86, 0.9);
            }
            &.purple {
              background-color: rgba(191, 131, 255, 0.9);
            }
          }

          &.red {
            background-color: rgba(255, 226, 229, 0.9);
          }
          &.yellow {
            background-color: rgba(255, 244, 222, 0.9);
          }
          &.green {
            background-color: rgba(220, 252, 231, 0.9);
          }
          &.purple {
            background-color: rgba(243, 232, 255, 0.9);
          }
        }
      }
    }
  }

  @media (max-width: $device-notebook) {
    .today-sales {
      height: 280px;

      .sales-summary {
        .sales-card {
          height: 170px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .today-sales {
      height: auto;

      .sales-summary {
        padding-bottom: 0;

        .sales-card {
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
