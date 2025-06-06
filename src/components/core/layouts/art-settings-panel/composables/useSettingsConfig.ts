import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ContainerWidthEnum } from '@/enums/appEnum'
import AppConfig from '@/config'

/**
 * 设置项配置选项管理
 */
export function useSettingsConfig() {
  const { t } = useI18n()

  // 标签页风格选项
  const tabStyleOptions = computed(() => [
    {
      value: 'tab-default',
      label: t('setting.tabStyle.default')
    },
    {
      value: 'tab-card',
      label: t('setting.tabStyle.card')
    },
    {
      value: 'tab-google',
      label: t('setting.tabStyle.google')
    }
  ])

  // 页面切换动画选项
  const pageTransitionOptions = computed(() => [
    {
      value: '',
      label: t('setting.transition.list.none')
    },
    {
      value: 'fade',
      label: t('setting.transition.list.fade')
    },
    {
      value: 'slide-left',
      label: t('setting.transition.list.slideLeft')
    },
    {
      value: 'slide-bottom',
      label: t('setting.transition.list.slideBottom')
    },
    {
      value: 'slide-top',
      label: t('setting.transition.list.slideTop')
    }
  ])

  // 圆角大小选项
  const customRadiusOptions = [
    { value: '0', label: '0' },
    { value: '0.25', label: '0.25' },
    { value: '0.5', label: '0.5' },
    { value: '0.75', label: '0.75' },
    { value: '1', label: '1' }
  ]

  // 容器宽度选项
  const containerWidthOptions = computed(() => [
    {
      value: ContainerWidthEnum.FULL,
      label: t('setting.container.list[0]'),
      icon: '&#xe694;'
    },
    {
      value: ContainerWidthEnum.BOXED,
      label: t('setting.container.list[1]'),
      icon: '&#xe6de;'
    }
  ])

  // 盒子样式选项
  const boxStyleOptions = computed(() => [
    {
      value: 'border-mode',
      label: t('setting.box.list[0]'),
      type: 'border-mode' as const
    },
    {
      value: 'shadow-mode',
      label: t('setting.box.list[1]'),
      type: 'shadow-mode' as const
    }
  ])

  // 从配置文件获取的选项
  const configOptions = {
    // 主题色彩选项
    mainColors: AppConfig.systemMainColor,

    // 主题风格选项
    themeList: AppConfig.settingThemeList,

    // 菜单布局选项
    menuLayoutList: AppConfig.menuLayoutList
  }

  // 基础设置项配置
  const basicSettingsConfig = computed(() => [
    {
      key: 'showWorkTab',
      label: t('setting.basics.list.multiTab'),
      type: 'switch' as const,
      handler: 'workTab'
    },
    {
      key: 'uniqueOpened',
      label: t('setting.basics.list.accordion'),
      type: 'switch' as const,
      handler: 'uniqueOpened'
    },
    {
      key: 'showMenuButton',
      label: t('setting.basics.list.collapseSidebar'),
      type: 'switch' as const,
      handler: 'menuButton'
    },
    {
      key: 'showRefreshButton',
      label: t('setting.basics.list.reloadPage'),
      type: 'switch' as const,
      handler: 'refreshButton'
    },
    {
      key: 'showCrumbs',
      label: t('setting.basics.list.breadcrumb'),
      type: 'switch' as const,
      handler: 'crumbs',
      mobileHide: true
    },
    {
      key: 'showLanguage',
      label: t('setting.basics.list.language'),
      type: 'switch' as const,
      handler: 'language'
    },
    {
      key: 'showNprogress',
      label: t('setting.basics.list.progressBar'),
      type: 'switch' as const,
      handler: 'nprogress'
    },
    {
      key: 'colorWeak',
      label: t('setting.basics.list.weakMode'),
      type: 'switch' as const,
      handler: 'colorWeak'
    },
    {
      key: 'watermarkVisible',
      label: t('setting.basics.list.watermark'),
      type: 'switch' as const,
      handler: 'watermark'
    },
    {
      key: 'menuOpenWidth',
      label: t('setting.basics.list.menuWidth'),
      type: 'input-number' as const,
      handler: 'menuOpenWidth',
      min: 180,
      max: 320,
      step: 10,
      style: { width: '120px' },
      controlsPosition: 'right' as const
    },
    {
      key: 'tabStyle',
      label: t('setting.basics.list.tabStyle'),
      type: 'select' as const,
      handler: 'tabStyle',
      options: tabStyleOptions.value,
      style: { width: '120px' }
    },
    {
      key: 'pageTransition',
      label: t('setting.basics.list.pageTransition'),
      type: 'select' as const,
      handler: 'pageTransition',
      options: pageTransitionOptions.value,
      style: { width: '120px' }
    },
    {
      key: 'customRadius',
      label: t('setting.basics.list.borderRadius'),
      type: 'select' as const,
      handler: 'customRadius',
      options: customRadiusOptions,
      style: { width: '120px' }
    }
  ])

  return {
    // 选项配置
    tabStyleOptions,
    pageTransitionOptions,
    customRadiusOptions,
    containerWidthOptions,
    boxStyleOptions,
    configOptions,

    // 设置项配置
    basicSettingsConfig
  }
}
