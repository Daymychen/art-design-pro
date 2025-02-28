<template>
  <div class="map-container" style="height: calc(100vh - 120px)">
    <div id="china-map" ref="chinaMapRef" class="china-map"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
  import * as echarts from 'echarts'
  import { useSettingStore } from '@/store/modules/setting'
  import { SystemThemeEnum } from '@/enums/appEnum'
  import chinaMapJson from '@/mock/json/chinaMap.json'

  // 响应式引用与主题
  const chinaMapRef = ref<HTMLElement | null>(null)
  const chartInstance = ref<echarts.ECharts | null>(null)
  const settingStore = useSettingStore()
  const isDark = computed(() => settingStore.systemThemeType === SystemThemeEnum.DARK)

  // 定义 emit
  const emit = defineEmits<{
    (e: 'onRenderComplete'): void
  }>()

  // 根据 geoJson 数据准备地图数据（这里数据值随机，仅供示例）
  const prepareMapData = (geoJson: any) => {
    return geoJson.features.map((feature: any) => ({
      name: feature.properties.name,
      value: Math.round(Math.random() * 1000),
      adcode: feature.properties.adcode,
      level: feature.properties.level,
      selected: false
    }))
  }

  // 构造 ECharts 配置项
  const createChartOption = (mapData: any[]) => ({
    tooltip: {
      show: true,
      formatter: ({ data }: any) => {
        const { name, adcode, level } = data || {}
        return `
        <div>
          <p>名称: <span>${name || '未知区域'}</span></p>
          <p>代码: <span>${adcode || '暂无'}</span></p>
          <p>级别: <span>${level || '暂无'}</span></p>
        </div>
      `
      }
    },
    geo: {
      map: 'china',
      zoom: 1,
      show: true,
      roam: false,
      layoutSize: '100%',
      emphasis: { label: { show: false } },
      itemStyle: {
        borderColor: isDark.value ? 'rgba(255,255,255,0.6)' : 'rgba(147,235,248,1)',
        borderWidth: 2,
        shadowColor: isDark.value ? 'rgba(0,0,0,0.8)' : 'rgba(128,217,248,1)',
        shadowOffsetX: 2,
        shadowOffsetY: 15,
        shadowBlur: 15
      }
    },
    series: [
      {
        type: 'map',
        map: 'china',
        aspectScale: 0.75,
        zoom: 1,
        label: {
          show: true,
          color: '#fff',
          fontSize: 10
        },
        itemStyle: {
          borderColor: 'rgba(147,235,248,0.8)',
          borderWidth: 2,
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(147,235,248,0.3)' },
              { offset: 1, color: 'rgba(32,120,207,0.9)' }
            ]
          },
          shadowColor: 'rgba(32,120,207,1)',
          shadowOffsetY: 15,
          shadowBlur: 20
        },
        emphasis: {
          label: { show: true, color: '#fff' },
          itemStyle: {
            areaColor: 'rgba(82,180,255,0.9)',
            borderColor: '#fff',
            borderWidth: 3
          }
        },
        // 增强光照与3D效果
        light: {
          main: { intensity: 1.5, shadow: true, alpha: 40, beta: 45 },
          ambient: { intensity: 0.3 }
        },
        viewControl: {
          distance: 120,
          alpha: 30,
          beta: 5,
          center: [104, 36],
          pitch: 10
        },
        // 配置区域选中样式
        select: {
          label: { show: true, color: '#fff' },
          itemStyle: {
            areaColor: '#4FAEFB',
            borderColor: '#fff',
            borderWidth: 2
          }
        },
        data: mapData
      },
      // 散点标记配置（例如：城市标记）
      {
        name: '城市',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize: 15,
        label: { show: false },
        itemStyle: {
          color: '#F99020',
          shadowBlur: 10,
          shadowColor: '#333'
        },
        data: [
          { name: '北京', value: [116.405285, 39.904989, 100] },
          { name: '上海', value: [121.472644, 31.231706, 100] },
          { name: '深圳', value: [114.085947, 22.547, 100] }
        ]
      }
    ]
  })

  // 初始化并渲染地图
  const initMap = async () => {
    if (!chinaMapRef.value) return

    chartInstance.value = echarts.init(chinaMapRef.value)
    chartInstance.value.showLoading()

    try {
      echarts.registerMap('china', chinaMapJson as any)
      const mapData = prepareMapData(chinaMapJson)
      const option = createChartOption(mapData)
      chartInstance.value.setOption(option)
      chartInstance.value.hideLoading()

      // 触发渲染完成事件
      emit('onRenderComplete')

      // 点击事件：选中地图区域
      chartInstance.value.on('click', (params: any) => {
        console.log(`选中区域: ${params.name}`, params)
        chartInstance.value?.dispatchAction({
          type: 'select',
          seriesIndex: 0,
          dataIndex: params.dataIndex
        })
      })
    } catch (error) {
      console.error('加载地图数据失败:', error)
      chartInstance.value?.hideLoading()
    }
  }

  // 窗口 resize 时调整图表大小
  const resizeChart = () => chartInstance.value?.resize()

  onMounted(() => {
    initMap().then(() => setTimeout(resizeChart, 100))
    window.addEventListener('resize', resizeChart)
  })

  onUnmounted(() => {
    chartInstance.value?.dispose()
    chartInstance.value = null
    window.removeEventListener('resize', resizeChart)
  })

  // 监听主题变化，重新初始化地图
  watch(isDark, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      chartInstance.value?.dispose()
      chartInstance.value = null
      nextTick(initMap)
    }
  })
</script>

<style lang="scss" scoped>
  .map-container {
    width: 100%;

    .china-map {
      width: 100%;
      height: 100%;
    }
  }
</style>
