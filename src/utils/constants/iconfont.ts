// 提取 iconfont 图标

export interface IconfontType {
  className: string
  unicode?: string
}

interface StyleSheetError {
  sheet: CSSStyleSheet
  error: unknown
}

function extractIconFromRule(rule: CSSRule): IconfontType | null {
  if (!(rule instanceof CSSStyleRule)) return null

  const { selectorText, style } = rule
  if (!selectorText?.startsWith('.iconsys-') || !selectorText.includes('::before')) return null

  const className = selectorText.substring(1).replace('::before', '')
  const content = style.getPropertyValue('content')
  if (!content) return null

  const unicode = content.replace(/['"\\]/g, '')
  return {
    className,
    unicode: unicode ? `&#x${getUnicode(unicode)};` : undefined
  }
}

const processedErrors = new Set<StyleSheetError>()

export function extractIconClasses(): IconfontType[] {
  const iconInfos: IconfontType[] = []

  try {
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules)
        rules.forEach((rule) => {
          const iconInfo = extractIconFromRule(rule)
          if (iconInfo) {
            iconInfos.push(iconInfo)
          }
        })
      } catch (error) {
        const styleSheetError: StyleSheetError = { sheet, error }
        if (!processedErrors.has(styleSheetError)) {
          console.warn('Cannot read cssRules from stylesheet:', {
            error,
            sheetHref: sheet.href
          })
          processedErrors.add(styleSheetError)
        }
      }
    })
  } catch (error) {
    console.error('Failed to process stylesheets:', error)
  }

  return iconInfos
}

export function getUnicode(charCode: string): string {
  if (!charCode) return ''
  return charCode.charCodeAt(0).toString(16).padStart(4, '0')
}
