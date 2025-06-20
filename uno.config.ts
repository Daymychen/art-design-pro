import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // example:
    ['card', 'bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg p-4']
  ],
  theme: {
    colors: {
      // example:
      primary: '#0070f3',
      'primary-focus': '#0366d6',
      'primary-content': '#ffffff',
      secondary: '#6e5494',
      'secondary-focus': '#5c4671',
      'secondary-content': '#ffffff'
    },
    breakPoints: {
      // example: 较为通用的尺寸设置
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
