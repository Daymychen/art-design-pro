<template>
  <div class="custom-card art-custom-card target-vs-reality">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.targetVsReality.title') }}</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" style="height: 160px"></div>
    </div>
    <div class="custom-card-footer">
      <div class="total-item">
        <div class="label">
          <i class="iconfont-sys">&#xe77f;</i>
          <div class="label-text">
            <span>{{ t('analysis.targetVsReality.realitySales.label') }}</span>
            <span>{{ t('analysis.targetVsReality.realitySales.sublabel') }}</span>
          </div>
        </div>
        <div class="value text-color-green">8,823</div>
      </div>
      <div class="total-item">
        <div class="label">
          <i class="iconfont-sys">&#xe77c;</i>
          <div class="label-text">
            <span>{{ t('analysis.targetVsReality.targetSales.label') }}</span>
            <span>{{ t('analysis.targetVsReality.targetSales.sublabel') }}</span>
          </div>
        </div>
        <div class="value text-color-orange">12,122</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { useSettingStore } from '@/store/modules/setting'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const chartRef = ref<HTMLDivElement>()

  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)

  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  onMounted(() => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 0,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
        axisLabel: {
          color: '#7B91B0'
        },
        axisLine: {
          show: false // 隐藏 x 轴线
        },
        axisTick: {
          show: false // 隐藏刻度线
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: false // 隐藏 y 轴文字
        },
        splitLine: {
          show: false // 隐藏 y 轴分割线
        },
        axisLine: {
          show: false // 隐藏 y 轴线
        }
      },
      series: [
        {
          name: 'Reality Sales',
          type: 'bar',
          data: [8000, 7000, 6000, 8500, 9000, 10000, 9500],
          barWidth: '15',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: '#2B8DFA'
          }
        },
        {
          name: 'Target Sales',
          type: 'bar',
          data: [10000, 9000, 11000, 10000, 12000, 12500, 11500],
          barWidth: '15',
          itemStyle: {
            borderRadius: [4, 4, 4, 4],
            color: '#95E0FB'
          }
        }
      ]
    }

    setOptions(option)
  })

  onUnmounted(() => {
    removeResize()
  })
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

  @media (max-width: $device-notebook) {
    .custom-card {
      height: 350px;

      &-body {
        padding-top: 10px;

        > div {
          height: 140px !important;
        }
      }

      &-footer {
        margin-top: 0;
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
