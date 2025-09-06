import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import type { ContainerWidthEnum } from '@/enums/appEnum'

/**
 * 设置项通用处理逻辑
 */
export function useSettingsHandlers() {
  const settingStore = useSettingStore()

  // DOM 操作相关
  const domOperations = {
    // 设置HTML类名
    setHtmlClass: (className: string, add: boolean) => {
      const el = document.getElementsByTagName('html')[0]
      if (add) {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },

    // 设置根元素属性
    setRootAttribute: (attribute: string, value: string) => {
      const el = document.documentElement
      el.setAttribute(attribute, value)
    },

    // 设置body类名
    setBodyClass: (className: string, add: boolean) => {
      const el = document.getElementsByTagName('body')[0]
      if (add) {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    }
  }

  // 通用切换处理器
  const createToggleHandler = (storeMethod: () => void, callback?: () => void) => {
    return () => {
      storeMethod()
      callback?.()
    }
  }

  // 通用值变更处理器
  const createValueHandler = <T>(
    storeMethod: (value: T) => void,
    callback?: (value: T) => void
  ) => {
    return (value: T) => {
      if (value !== undefined && value !== null) {
        storeMethod(value)
        callback?.(value)
      }
    }
  }

  // 基础设置处理器
  const basicHandlers = {
    // 工作台标签页
    workTab: createToggleHandler(() => settingStore.setWorkTab(!settingStore.showWorkTab)),

    // 菜单手风琴
    uniqueOpened: createToggleHandler(() => settingStore.setUniqueOpened()),

    // 显示菜单按钮
    menuButton: createToggleHandler(() => settingStore.setButton()),

    // 显示快速入口
    fastEnter: createToggleHandler(() => settingStore.setFastEnter()),

    // 显示刷新按钮
    refreshButton: createToggleHandler(() => settingStore.setShowRefreshButton()),

    // 显示面包屑
    crumbs: createToggleHandler(() => settingStore.setCrumbs()),

    // 显示语言切换
    language: createToggleHandler(() => settingStore.setLanguage()),

    // 显示进度条
    nprogress: createToggleHandler(() => settingStore.setNprogress()),

    // 色弱模式
    colorWeak: createToggleHandler(
      () => settingStore.setColorWeak(),
      () => {
        domOperations.setHtmlClass('color-weak', settingStore.colorWeak)
      }
    ),

    // 水印显示
    watermark: createToggleHandler(() =>
      settingStore.setWatermarkVisible(!settingStore.watermarkVisible)
    ),

    // 菜单展开宽度
    menuOpenWidth: createValueHandler<number>((width: number) =>
      settingStore.setMenuOpenWidth(width)
    ),

    // 标签页风格
    tabStyle: createValueHandler<string>((style: string) => settingStore.setTabStyle(style)),

    // 页面切换动画
    pageTransition: createValueHandler<string>((transition: string) =>
      settingStore.setPageTransition(transition)
    ),

    // 圆角大小
    customRadius: createValueHandler<string>((radius: string) =>
      settingStore.setCustomRadius(radius)
    )
  }

  // 盒子样式处理器
  const boxStyleHandlers = {
    // 设置盒子模式
    setBoxMode: (type: 'border-mode' | 'shadow-mode') => {
      const { boxBorderMode } = storeToRefs(settingStore)

      // 防止重复设置
      if (
        (type === 'shadow-mode' && boxBorderMode.value === false) ||
        (type === 'border-mode' && boxBorderMode.value === true)
      ) {
        return
      }

      setTimeout(() => {
        domOperations.setRootAttribute('data-box-mode', type)
        settingStore.setBorderMode()
      }, 50)
    }
  }

  // 颜色设置处理器
  const colorHandlers = {
    // 选择主题色
    selectColor: (theme: string) => {
      settingStore.setElementTheme(theme)
      settingStore.reload()
    }
  }

  // 容器设置处理器
  const containerHandlers = {
    // 设置容器宽度
    setWidth: (type: ContainerWidthEnum) => {
      settingStore.setContainerWidth(type)
      settingStore.reload()
    }
  }

  return {
    domOperations,
    basicHandlers,
    boxStyleHandlers,
    colorHandlers,
    containerHandlers,
    createToggleHandler,
    createValueHandler
  }
}
