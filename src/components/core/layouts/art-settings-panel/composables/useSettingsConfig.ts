import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ContainerWidthEnum } from '@/enums/appEnum'
import AppConfig from '@/config'
import { headerBarConfig } from '@/config/modules/headerBar'

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
      icon: 'icon-park-outline:auto-width'
    },
    {
      value: ContainerWidthEnum.BOXED,
      label: t('setting.container.list[1]'),
      icon: 'ix:width'
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
  const basicSettingsConfig = computed(() => {
    // 定义所有基础设置项
    const allSettings = [
      {
        key: 'showWorkTab',
        label: t('setting.basics.list.multiTab'),
        type: 'switch' as const,
        handler: 'workTab',
        headerBarKey: null // 不依赖headerBar配置
      },
      {
        key: 'uniqueOpened',
        label: t('setting.basics.list.accordion'),
        type: 'switch' as const,
        handler: 'uniqueOpened',
        headerBarKey: null // 不依赖headerBar配置
      },
      {
        key: 'showMenuButton',
        label: t('setting.basics.list.collapseSidebar'),
        type: 'switch' as const,
        handler: 'menuButton',
        headerBarKey: 'menuButton' as const
      },
      {
        key: 'showFastEnter',
        label: t('setting.basics.list.fastEnter'),
        type: 'switch' as const,
        handler: 'fastEnter',
        headerBarKey: 'fastEnter' as const
      },
      {
        key: 'showRefreshButton',
        label: t('setting.basics.list.reloadPage'),
        type: 'switch' as const,
        handler: 'refreshButton',
        headerBarKey: 'refreshButton' as const
      },
      {
        key: 'showCrumbs',
        label: t('setting.basics.list.breadcrumb'),
        type: 'switch' as const,
        handler: 'crumbs',
        mobileHide: true,
        headerBarKey: 'breadcrumb' as const
      },
      {
        key: 'showLanguage',
        label: t('setting.basics.list.language'),
        type: 'switch' as const,
        handler: 'language',
        headerBarKey: 'language' as const
      },
      {
        key: 'showNprogress',
        label: t('setting.basics.list.progressBar'),
        type: 'switch' as const,
        handler: 'nprogress',
        headerBarKey: null // 不依赖headerBar配置
      },
      {
        key: 'colorWeak',
        label: t('setting.basics.list.weakMode'),
        type: 'switch' as const,
        handler: 'colorWeak',
        headerBarKey: null // 不依赖headerBar配置
      },
      {
        key: 'watermarkVisible',
        label: t('setting.basics.list.watermark'),
        type: 'switch' as const,
        handler: 'watermark',
        headerBarKey: null // 不依赖headerBar配置
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
        controlsPosition: 'right' as const,
        headerBarKey: null // 不依赖headerBar配置
      },
      {
        key: 'tabStyle',
        label: t('setting.basics.list.tabStyle'),
        type: 'select' as const,
        handler: 'tabStyle',
        options: tabStyleOptions.value,
        style: { width: '120px' },
        headerBarKey: null // 不依赖headerBar配置
      },
      {
        key: 'pageTransition',
        label: t('setting.basics.list.pageTransition'),
        type: 'select' as const,
        handler: 'pageTransition',
        options: pageTransitionOptions.value,
        style: { width: '120px' },
        headerBarKey: null // 不依赖headerBar配置
      },
      {
        key: 'customRadius',
        label: t('setting.basics.list.borderRadius'),
        type: 'select' as const,
        handler: 'customRadius',
        options: customRadiusOptions,
        style: { width: '120px' },
        headerBarKey: null // 不依赖headerBar配置
      }
    ]

    // 根据 headerBarConfig 过滤设置项
    return (
      allSettings
        .filter((setting) => {
          // 如果设置项不依赖headerBar配置，则始终显示
          if (setting.headerBarKey === null) {
            return true
          }

          // 如果依赖headerBar配置，检查对应的功能是否启用
          const headerBarFeature = headerBarConfig[setting.headerBarKey]
          return headerBarFeature?.enabled !== false
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ headerBarKey: _headerBarKey, ...setting }) => setting)
    )
  })

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
