module.exports = {
  // 继承推荐规范配置
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order'
  ],
  // 指定不同文件对应的解析器
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.{css,scss}'],
      customSyntax: 'postcss-scss'
    }
  ],
  // 自定义规则
  rules: {
    'import-notation': 'string', // 指定导入CSS文件的方式("string"|"url")
    'selector-class-pattern': null, // 选择器类名命名规则
    'custom-property-pattern': null, // 自定义属性命名规则
    'keyframes-name-pattern': null, // 动画帧节点样式命名规则
    'no-descending-specificity': null, // 允许无降序特异性
    'no-empty-source': null, // 允许空样式
    // 允许 global 、export 、deep伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'deep']
      }
    ],
    // 允许未知属性
    'property-no-unknown': [
      true,
      {
        ignoreProperties: []
      }
    ],
    // 允许未知规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['apply', 'use', 'mixin', 'include', 'extend']
      }
    ]
  }
}
