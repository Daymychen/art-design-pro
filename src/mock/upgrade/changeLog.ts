interface UpgradeLog {
  version: string // 版本号
  title: string // 更新标题
  date: string // 更新日期
  detail?: string[] // 更新内容
  requireReLogin?: boolean // 是否需要重新登录
  remark?: string // 备注
}

export const upgradeLogList = ref<UpgradeLog[]>([
  {
    version: 'v2.5.8',
    title: '依赖升级、bug修复',
    date: '2025-09-29',
    detail: [
      'vue、vite、element-plus 等核心库升级',
      '修复富文本编辑器全屏顶栏层级问题',
      '修复表格列排序组件文字益处问题',
      '修复统计卡片条件判断',
      '优化 el-tag 样式',
      '优化顶部进度条颜色',
      '优化自定义主题配置',
      '优化 ElementPlus 自定义主题问题',
      '修复根路径 / 与 HOME_PAGE_PATH 同为 / 时出现的无限重定向'
    ],
    remark: '由于项目依赖升级，node 版本需要升级到 v20.19.0 或以上'
  },
  {
    version: 'v2.5.7',
    title: '新增表单组件',
    date: '2025-09-14',
    detail: [
      '新增 ArtForm 组件',
      '修复新版本谷歌浏览器切换主题闪烁问题',
      '优化表单 label 高度没有对齐问题',
      '首屏启动性能优化'
    ]
  },
  {
    version: 'v2.5.6',
    title: '优化用户体验、bug修复',
    date: '2025-09-06',
    detail: [
      'useTable 类型推导优化，不需要手动传递类型即可实现类型提示',
      'useTable removeColumn 支持多数据删除',
      'useTable 自动识别响应体支持自定义配置 (src/utils/table/tableConfig.ts)',
      'useTable 空数据浏览器警告优化',
      'api 接口请求代码优化、api.d.ts 类型优化',
      '优化 ArtTable 顶部按钮换行无法自适应问题（示例：功能示例 / 左右布局表格）',
      'ArtTable 分页组件选中样式优化',
      'ArtTable 空状态高度默认撑满',
      'ArtButtonMore 组件新增图标、颜色配置',
      'ArtTableHeader 新增搜索按钮，用于控制顶部搜索栏的显示与隐藏',
      'ArtSearchBar label 为空时不占空间',
      '表格操作栏拖拽禁止固定列拖拽',
      '角色管理页面接口对接、代码优化',
      '菜单管理页面优化',
      '优化设置中心滚动页面跟随滚动问题',
      '一级路由是外链时，component 校验逻辑优化',
      '优化地图右下角拖动问题',
      '优化暗黑模式刷新页面白色背景问题',
      '优化左侧菜单折叠按钮间距问题',
      '移动端显示左侧菜单 logo',
      '网络请求新增 showSuccessMessage，用于配置是否显示成功消息',
      '添加全局错误处理基础框架',
      '修复批量删除整页数据没有返回上一页的bug',
      '修复动态路由参数导致的问题',
      '修复动态路由配置 一级路由是 iframe 页面时，全屏问题',
      '新增权限演示示例',
      '全局组件采用异步加载策略，提升首屏加载性能'
    ]
  },
  {
    version: 'v2.5.5',
    title: 'bug修复、优化用户体验',
    date: '2025-08-17',
    detail: [
      '重构 ArtSearchBar 组件，支持更多组件、表单校验等能力',
      'useTable 列配置：支持动态更新能力',
      '修复多个富文本编辑器图标不统一问题',
      '优化颜色选择器圆角',
      'el-radio、el-checkbox 统一大小',
      'art-stats-card 新增小数位、分隔符配置',
      '路由配置示例优化',
      '高级表格新增自定义获取数据示例（等待其他请求完成后执行 useTable 数据获取）',
      'useTable 新增 excludeParams，用于排除某些参数不参与请求',
      '优化路径别名类型问题',
      '本地开发跨域配置优化',
      '修复 useTable 删除最后一整页数据没有返回上一页的问题',
      '修复 echarts 图表数据初始化、更新数据浏览器报错',
      '删除 art-chart-empty 组件',
      '新增 ArtSearchBar 组件示例',
      '网络请求支持 http 状态码为 401 时退出登录',
      '优化网络请求退出登录多次提示问题',
      'useTable 属性、方法命名优化',
      '登录页UI升级',
      '403、404、500 页面UI升级'
    ]
  },
  {
    version: 'v2.5.4',
    title: 'bug修复、优化用户体验',
    date: '2025-07-27',
    detail: [
      '修复获取用户信息接口时序问题导致路由注册菜单渲染错误bug',
      '修复动态路由校验问题导致的 iframe 不显示bug',
      '修复 reset 文件语法错误',
      '修复 ArtTable 数据类型错误',
      '路由注册新增 component 校验',
      '修复地图滚轮滚动放大问题',
      '网络请求 headers 支持自定义配置',
      '展开行支持 formatter 渲染'
    ]
  },
  {
    version: 'v2.5.3',
    title: 'bug修复、优化用户体验',
    date: '2025-07-20',
    detail: [
      'ArtTable 组件重构',
      'Element Plus 升级到 v2.10.2',
      '优化 useTable 分页参数问题',
      '修复 ArtTable 切换分页大小时执行两次请求bug',
      '优化网络请求示例：初始化参数、分页携带参数问题',
      '优化搜索日期范围参数处理',
      '优化 el-date-picker 组件圆角问题',
      '优化 el-select 组件 hover 样式',
      '新增表格左右布局示例',
      '搜索组件、分页组件高度降低',
      '优化登录页面滑块动画间隔时长',
      '优化菜单没有子菜单显示的问题'
    ]
  },
  {
    version: 'v2.5.2',
    title: 'bug修复、优化用户体验',
    date: '2025-07-13',
    detail: [
      '新增一键精简脚本，快速准备开发环境',
      '优化表格无数据时表头不显示问题',
      'useTable hooks 支持分页字段名自定义映射',
      '修复 v2.5.0 顶部进度条不显示问题',
      '修复左侧菜单遮罩异常显示问题',
      '修复隐藏所有子菜单时仍显示父级菜单的问题',
      '水平菜单、混合菜单、双列菜单支持徽章显示',
      '修复 stylelint 导致的登录页滑块样式异常',
      '修复老旧移动端设备 loading 定位问题',
      '快速入口支持配置文件模式',
      '顶栏功能支持配置文件模式',
      '全局事件总线 mittBus 类型安全优化',
      '支持自定义首页路径',
      '优化移动端设置中容器宽度样式',
      '优化登录页验证滑块文字居中效果',
      '路由支持配置 redirect 等属性'
    ]
  },
  {
    version: 'v2.5.1',
    title: 'bug修复、优化用户体验',
    date: '2025-07-08',
    detail: [
      '修复首次登录系统时 loading 提前关闭bug',
      'el-card、el-table 背景色跟系统保持一致',
      '修复 v2.5.0 版本引起的全屏页样式层级过低bug',
      '修复 v2.5.0 版本引起的表格展开行折叠bug'
    ]
  },
  {
    version: 'v2.5.0',
    title: '新增 useTable hooks 表格封装、组件重构',
    date: '2025-07-06',
    remark: '建议升级，带来更高效、更智能的表格开发体验',
    detail: [
      '重构 ArtTable、ArtTableHeader、ArtNotification 组件',
      '新增 useTable hooks 表格封装，支持数据获取、转换、响应适配、智能缓存（基于 LRU 算法）、错误处理、列配置与插槽、分页控制、刷新策略等核心功能，全面提升开发效率与用户体验',
      '修复菜单管理搜索直接修改 pinia 数据的问题',
      '移除 CountTo 插件，替换为 ArtCountTo 组件',
      'Echarts 版本升级到 5.6.0',
      '修复路由守卫 loading 闪烁问题'
    ]
  },
  {
    version: 'v2.4.2.9',
    title: '代码重构、修复bug、优化用户体验',
    date: '2025-07-02',
    detail: [
      '菜单布局、顶部导航代码重构',
      '修复移动端锁屏页部分浏览器无法解锁bug',
      '优化移动端菜单滚动用户体验',
      '优化顶部菜单样式问题',
      '顶部菜单宽度自适应，可显示更多内容，混合菜单支持鼠标滚动',
      'asyncRoutes 路由配置 auth_mark 字段改为 authMark',
      '去除重复的 components.d.ts 文件，components.d.ts、auto-imports.d.ts 忽略提交',
      '优化国际化语言文件加载方式，异步改成同步模式',
      '优化 el-pagination 大小不一致问题'
    ]
  },
  {
    version: 'v2.4.2.8',
    title: '修复 v2.4.2.7 版本访问 / 路径时显示 404 的问题',
    date: '2025-06-26'
  },
  {
    version: 'v2.4.2.7',
    title: 'bug修复、优化用户体验',
    date: '2025-06-25',
    detail: [
      '路由支持配置全屏模式',
      '路由支持自动跳转到菜单的第一个有效路由',
      '动态路由新增 removeAllDynamicRoutes 方法，可用于彻底清除所有动态路由',
      '权限自定义指令优化、新增角色权限指令 v-roles、可用于控制元素的显示与隐藏',
      '修复登录页面拖拽组件 ArtDragVerify 宽度、颜色异常bug',
      '修复 iframe 页面混合模式、双列模式异常bug',
      '优化锁屏页面被 el-loading 穿透bug',
      '跨域请求携带 cookie 配置从环境变量中获取，默认关闭',
      '针对SEO、可访问性做一些优化',
      '新增标签页操作示例'
    ]
  }
])
