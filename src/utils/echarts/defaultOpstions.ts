// 默认配置

const defaultOpstions = {
  grid: {
    left: '0',
    right: '4%',
    bottom: '0%',
    top: '0',
    containLabel: true
  },
  tooltip: {},
  yAxis: {
    axisLabel: {
      show: true,
      color: '#8c8c8c'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#e8e8e8',
        width: 1,
        type: 'solid'
      }
    }
  },
  xAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#e8e8e8',
        width: 1,
        type: 'solid'
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#e8e8e8',
        width: 0,
        type: 'solid'
      }
    },
    axisLabel: {
      show: true,
      color: 'rgba(255,255,255, 0.6)'
    },
    axisTick: {
      show: false
    }
  }
}

export { defaultOpstions }
