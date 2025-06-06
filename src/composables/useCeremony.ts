import { useTimeoutFn, useIntervalFn } from '@vueuse/core'
import { useDateFormat } from '@vueuse/core'
import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { mittBus } from '@/utils/sys'
import { festivalConfigList } from '@/config/festival'

// 节日庆祝相关配置
export function useCeremony() {
  const settingStore = useSettingStore()
  const { holidayFireworksLoaded, isShowFireworks } = storeToRefs(settingStore)

  // 烟花间隔引用，用于清理
  let fireworksInterval: { pause: () => void } | null = null

  // 判断当前日期是否是节日
  const currentFestivalData = computed(() => {
    const currentDate = useDateFormat(new Date(), 'YYYY-MM-DD').value
    return festivalConfigList.find((item) => item.date === currentDate)
  })

  // 节日庆祝相关配置
  const FESTIVAL_CONFIG = {
    INITIAL_DELAY: 300, // 初始延迟时间，单位毫秒
    FIREWORK_INTERVAL: 1000, // 烟花效果触发间隔，单位毫秒
    TEXT_DELAY: 2000, // 文本显示延迟时间，单位毫秒
    MAX_TRIGGERS: 6 // 最大触发次数
  } as const

  // 根据节日列表显示节日祝福
  const openFestival = () => {
    // 没有节日数据，不显示
    if (!currentFestivalData.value) return
    // 礼花效果结束，不显示
    if (!isShowFireworks.value) return

    let triggers = 0

    const { start: startFireworks } = useTimeoutFn(() => {
      const { pause } = useIntervalFn(() => {
        // console.log(currentFestivalData.value?.image)
        mittBus.emit('triggerFireworks', currentFestivalData.value?.image)
        triggers++

        if (triggers >= FESTIVAL_CONFIG.MAX_TRIGGERS) {
          pause()
          settingStore.setholidayFireworksLoaded(true)

          // 主页显示节日文本
          useTimeoutFn(() => {
            settingStore.setShowFestivalText(true)
            setFestivalDate()
          }, FESTIVAL_CONFIG.TEXT_DELAY)
        }
      }, FESTIVAL_CONFIG.FIREWORK_INTERVAL)

      fireworksInterval = { pause }
    }, FESTIVAL_CONFIG.INITIAL_DELAY)

    startFireworks()
  }

  // 清理函数
  const cleanup = () => {
    if (fireworksInterval) {
      fireworksInterval.pause()
      settingStore.setShowFestivalText(false)
      setFestivalDate()
    }
  }

  // 设置节日日期
  const setFestivalDate = () => {
    settingStore.setFestivalDate(currentFestivalData.value?.date || '')
  }

  return {
    openFestival,
    cleanup,
    holidayFireworksLoaded,
    currentFestivalData,
    isShowFireworks
  }
}
