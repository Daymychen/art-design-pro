<template>
  <div class="region active-user console-box">
    <div class="chart" ref="chartRef"></div>
    <div class="text">
      <h3 class="custom-text box-title">用户概述</h3>
      <p class="custom-text subtitle">比上周 <span>+23%</span></p>
      <p class="custom-text subtitle"
        >我们为您创建了多个选项，可将它们组合在一起并定制为像素完美的页面</p
      >
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index">
        <p>{{ item.num }}</p>
        <p class="custom-text subtitle">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { useSettingStore } from '@/store/modules/setting'

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)
  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)
  import { getCssVariable } from '@/utils/utils'

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  const store = useSettingStore()
  const isDark = computed(() => store.isDark)

  const list = [
    { name: '总用户量', num: '32k' },
    { name: '总访问量', num: '128k' },
    { name: '日访问量', num: '1.2k' },
    { name: '周同比', num: '+5%' }
  ]

  const createChart = () => {
    setOptions({
      grid: {
        left: '0',
        right: '4%',
        bottom: '0%',
        top: '5px',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          color: isDark.value ? '#999' : '#fff',
          fontSize: 13,
          fontWeight: 'bold'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: !isDark.value ? 'rgba(255, 255, 255, 0.2)' : '#444',
            width: 1,
            type: 'dashed'
          }
        },
        axisLine: {
          show: false
        }
      },
      xAxis: {
        type: 'category',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        boundaryGap: [0, 0.01],
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          color: isDark.value ? '#999' : '#fff',
          fontSize: 13,
          fontWeight: 'bold'
        }
      },
      series: [
        {
          data: [160, 100, 150, 80, 190, 100, 175, 120, 160],
          type: 'bar',
          barMaxWidth: 20,
          color: isDark.value ? getCssVariable('--main-color') : '#fff',
          itemStyle: {
            borderRadius: [6, 6, 6, 6]
          }
        }
      ]
    })
  }

  onMounted(() => {
    createChart()
  })

  onUnmounted(() => {
    removeResize()
  })
</script>

<style lang="scss" scoped>
  .dark {
    .region {
      .chart {
        background: none;
      }
    }
  }

  .region {
    box-sizing: border-box;
    width: 42%;
    height: 420px;
    padding: 16px;

    .chart {
      box-sizing: border-box;
      width: 100%;
      height: 220px;
      padding: 20px 0 20px 20px;
      // 跟随系统主色
      background-image: linear-gradient(
        90deg,
        var(--el-color-primary-light-1),
        var(--el-color-primary-light-3),
        var(--el-color-primary-light-1)
      );
      border-radius: 8px;
    }

    .text {
      margin-left: 3px;

      h3 {
        margin-top: 20px;
        font-size: 18px;
        font-weight: 500;
      }

      p {
        margin-top: 5px;
        font-size: 14px;

        span {
          color: rgb(82 196 26) !important;
        }

        &:last-of-type {
          height: 42px;
          margin-top: 5px;
        }
      }
    }

    .list {
      display: flex;
      justify-content: space-between;
      margin-left: 3px;

      > div {
        flex: 1;

        p {
          font-weight: 400;

          &:first-of-type {
            font-size: 24px;
            color: var(--art-gray-900);
          }

          &:last-of-type {
            font-size: 13px;
          }
        }
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .dark {
      .active-user {
        .chart {
          padding: 15px 0 0 !important;
        }
      }
    }
  }
</style>
