import { createI18n } from 'vue-i18n'
import type { I18n, I18nOptions } from 'vue-i18n'
import { LanguageEnum } from '@/enums/appEnum'
import { getSysStorage } from '@/utils/storage'

// 动态导入语言文件
const messages = {
  [LanguageEnum.EN]: () => import('./en'),
  [LanguageEnum.ZH]: () => import('./zh')
}

// 获取初始语言
const getDefaultLanguage = (): LanguageEnum => {
  const sys = getSysStorage()
  if (!sys) return LanguageEnum.ZH

  try {
    const { user } = JSON.parse(sys)
    return user?.language || LanguageEnum.ZH
  } catch (error) {
    console.error('获取初始语言失败', error)
    return LanguageEnum.ZH
  }
}

const i18nOptions: I18nOptions = {
  locale: getDefaultLanguage(),
  legacy: false,
  globalInjection: true,
  fallbackLocale: LanguageEnum.ZH,
  messages: {}
}

const i18n: I18n = createI18n(i18nOptions)

// 异步加载语言文件
Object.keys(messages).forEach((locale) => {
  ;(messages as Record<string, () => Promise<any>>)[locale]().then((msg) => {
    i18n.global.setLocaleMessage(locale, msg.default)
  })
})

export default i18n
