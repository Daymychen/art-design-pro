<template>
  <div class="custom-card art-custom-card target-vs-reality">
    <div class="custom-card-header">
      <span class="title">目标与实际</span>
    </div>
    <div class="custom-card-body">
      <ArtBarChart
        height="10rem"
        :data="revenueData"
        :xAxisData="weekDays"
        :showAxisLine="false"
        barWidth="28%"
      />
    </div>
    <div class="custom-card-footer">
      <div class="total-item">
        <div class="label">
          <i class="iconfont-sys">&#xe77f;</i>
          <div class="label-text">
            <span>实际销售额</span>
            <span>全球</span>
          </div>
        </div>
        <div class="value text-color-green">8,823</div>
      </div>
      <div class="total-item">
        <div class="label">
          <i class="iconfont-sys">&#xe77c;</i>
          <div class="label-text">
            <span>目标销售额</span>
            <span>商业</span>
          </div>
        </div>
        <div class="value text-color-orange">12,122</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const weekDays = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])

  const revenueData = ref([
    {
      name: '线上销售',
      data: [12, 13, 5, 15, 10, 15, 18]
      // color: '#6E93FF'
    }
  ])
</script>

<style lang="scss" scoped>
  .custom-card {
    height: 400px;

    &-body {
      padding: 20px;
    }

    &-footer {
      box-sizing: border-box;
      padding: 0 20px;
      margin-top: 15px;

      .total-item {
        display: flex;
        margin-bottom: 20px;
        text-align: center;

        &:first-of-type .label .iconfont-sys {
          color: #2b8dfa !important;
          background-color: #e6f7ff !important;
        }

        &:last-of-type .label .iconfont-sys {
          color: #1cb8fc !important;
          background-color: #e6f7ff !important;
        }

        .label {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 60%;
          font-size: 14px;
          color: #606266;

          .iconfont-sys {
            width: 40px;
            height: 40px;
            margin-right: 12px;
            font-size: 18px;
            line-height: 40px;
            text-align: center;
            background-color: #f2f2f2;
            border-radius: 6px;
          }

          .label-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            span {
              &:first-of-type {
                font-size: 16px;
                color: var(--art-text-gray-800);
              }

              &:last-of-type {
                margin-top: 4px;
                font-size: 12px;
                color: #737791;
              }
            }
          }
        }

        .value {
          font-size: 18px;
          font-weight: 400;

          &.text-color-green {
            color: #2b8dfa !important;
          }

          &.text-color-orange {
            color: #1cb8fc !important;
          }
        }
      }
    }
  }

  .dark {
    .custom-card {
      &-footer {
        .total-item {
          &:first-of-type .label .iconfont-sys {
            background-color: #222 !important;
          }

          &:last-of-type .label .iconfont-sys {
            background-color: #222 !important;
          }
        }
      }
    }
  }
</style>
