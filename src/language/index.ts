// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'
import { LanguageEnum } from '@/enums/appEnum'

const lang = createI18n({
  locale: LanguageEnum.ZH, // 设置语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  fallbackLocale: LanguageEnum.ZH, // 设置备用语言
  messages: {
    en,
    zh
  }
})

export default lang
