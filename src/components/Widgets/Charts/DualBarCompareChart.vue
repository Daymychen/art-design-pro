<template>
  <div class="chart-container">
    <!-- 左侧 Y 轴 -->
    <div class="y-axis">
      <div v-for="(value, index) in yAxisLabels" :key="index" class="y-axis-label">
        {{ value }}
      </div>
    </div>

    <div class="bars-container">
      <!-- 柱状图组 -->
      <div v-for="(item, index) in props.topData" :key="index" class="bar-group">
        <div class="bars-wrapper">
          <!-- 上半部分柱子 -->
          <div
            class="bar bar-top"
            :style="{
              height: `${getBarHeight(item, maxValue)}%`,
              background: props.topColor || defaultTopColor
            }"
          ></div>

          <!-- 下半部分柱子 -->
          <div
            class="bar bar-bottom"
            :style="{
              height: `${getBarHeight(Math.abs(props.bottomData[index]), maxValue)}%`,
              background: props.bottomColor || defaultBottomColor
            }"
          ></div>
        </div>

        <!-- X轴标签 -->
        <div class="x-axis-label">{{ props.xAxisData[index] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    topData: number[]
    bottomData: number[]
    xAxisData: string[]
    topColor?: string
    bottomColor?: string
    height?: string
    barWidth?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    topData: () => [2.5, 3, 2.8, 2.3, 2],
    bottomData: () => [-2, -2.2, -1.8, -3, -2.5],
    xAxisData: () => [],
    height: '300px',
    barWidth: 20
  })

  // 默认渐变色
  const defaultTopColor = 'var(--el-color-primary-light-1)'
  const defaultBottomColor = 'rgb(var(--art-secondary), 1)'

  // 计算最大值用于缩放
  const maxValue = computed(() => {
    const allValues = [...props.topData, ...props.bottomData.map(Math.abs)]
    return Math.max(...allValues)
  })

  // 生成Y轴刻度
  const yAxisLabels = computed(() => {
    const max = Math.ceil(maxValue.value)
    return [max, max / 2, 0, max / 2, max]
  })

  // 计算柱子高度的百分比
  const getBarHeight = (value: number, max: number) => {
    return (value / max) * 40 // 40% 作为最大高度，留出空间给其他元素
  }
</script>

<style scoped lang="scss">
  .chart-container {
    position: relative;
    display: flex;
    width: 100%;
    height: v-bind('props.height');
    padding: 20px 0;

    .y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 40px;
      padding-right: 10px;

      &-label {
        font-size: 12px;
        color: #999;
      }
    }

    .bars-container {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-around;
      padding: 20px 0;
      margin-left: -10px;

      .bar-group {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40px;
        height: 100%;

        .bars-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .bar {
          position: absolute;
          width: v-bind('props.barWidth + "px"');
          border-radius: v-bind('props.barWidth / 2 + "px"');
          transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;

          &-top {
            bottom: calc(50% + 2px);
            transform: scaleY(0);
            animation: growUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          &-bottom {
            top: calc(50% + 2px);
            transform: scaleY(0);
            animation: growDown 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        }

        .x-axis-label {
          position: absolute;
          bottom: -20px;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  @keyframes growUp {
    from {
      transform: scaleY(0);
    }

    to {
      transform: scaleY(1);
    }
  }

  @keyframes growDown {
    from {
      transform: scaleY(0);
    }

    to {
      transform: scaleY(1);
    }
  }
</style>
