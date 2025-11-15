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
    version: 'v3.0.1',
    title: 'bug修复、新增功能',
    date: '2025-11-15',
    detail: [
      '修复：路由注册时不存在接口的重复请求问题',
      '修复：一键精简脚本打包失败的问题',
      '优化：完善路由配置验证机制，自动检测并提示非一级菜单的路径配置错误',
      '优化：顶部进度条残影',
      '优化：vite 预构建优化',
      '优化：圆角、边框统一',
      '优化：锁屏页面重新设计',
      '优化：退出登录菜单提前消失造成的视觉体验不好问题',
      '新增：ArtForm 和 ArtSearchBar 组件的 label 支持自定义渲染函数，可实现带 tooltip 等复杂标签',
      '新增：菜单管理表单关键字段新增 Tooltip 提示，降低用户配置门槛',
      '新增：iconify 新增离线图标加载模式',
      '新增：退出登录新增 redirect 属性，用于重新登录后跳转到对应页面',
      '新增：退出登录重新进入系统保留用户标签页，根据 userId 进行身份识别',
      '新增：双列菜单新增折叠按钮',
      '新增：菜单图标完善',
      '新增：多标签页增加图标',
      '新增：WebSocket 连接'
    ]
  },
  {
    version: 'v3.0.0',
    title: 'Sass 重构为 Tailwind CSS，Iconfont 替换为 Iconify，性能，目录结构，文件注释全方位优化',
    date: '2025-11-9',
    requireReLogin: true,
    detail: [
      '样式系统重构：Sass 全面迁移至 Tailwind CSS，提升开发效率与样式一致性',
      '图标方案升级：Iconfont 替换为 Iconify，支持更丰富的图标库与按需加载',
      '构建优化：完整包体积减少 1.3 MB，显著提升加载性能',
      '路由注册重构：全面重构路由注册系统，引入面向对象设计，提高代码的可维护性、可测试性和扩展能力',
      '架构优化：优化目录结构，职责划分更清晰，降低用户学习成本与上手难度',
      '注释优化：统一模块注释规范，完善每一个组件介绍、功能说明与使用示例，降低用户理解成本与上手难度',
      '性能提升：优化核心代码逻辑，提升系统运行效率',
      '设计系统：重构颜色体系，统一 UI 视觉规范，提升界面一致性',
      '菜单优化：细化菜单样式，优化交互体验与视觉呈现',
      '组件重构：重构 ArtTextScroll 组件，提升性能与可维护性',
      '问题修复：修复 ArtForm、ArtSearchBar 自定义组件渲染异常',
      '功能增强：ArtForm、ArtSearchBar 新增 render 属性，支持自定义组件渲染',
      '功能增强：useTable hooks 新增 visible 属性，用于控制列默认是否显示',
      '响应式优化：优化 ArtForm、ArtSearchBar 栅格布局，适配多种屏幕尺寸',
      '节日功能增强：礼花配置支持跨日期范围设置与自定义播放次数',
      '依赖更新：升级核心依赖至最新稳定版本',
      '配置管理优化：新增 setting.ts 配置文件，支持一键复制与重置系统默认设置'
    ],
    remark:
      '重要提示：本次升级涉及样式系统（Sass → Tailwind CSS）与图标库（Iconfont → Iconify）的底层重构，属于破坏性更新。建议新项目直接使用 v3.0，旧版本项目不建议升级。'
  },
  {
    version: 'v2.6.1',
    title: 'bug修复、授权页增加主题色切换功能',
    date: '2025-10-19',
    detail: [
      '修复获取用户信息、获取菜单接口访问无效地址重复调用问题',
      '升级部分依赖兼容 tailwindcss',
      '修复 ElButton circle 模式样式',
      '修复 ElSlect 无法通过键盘选择问题',
      '修复带参数静态路由跳转登录页面问题',
      '优化外部链接菜单点击选中状态',
      '授权页增加主题色切换功能'
    ]
  },
  {
    version: 'v2.6.0',
    title: '代码优化、bug修复',
    date: '2025-10-16',
    detail: [
      '优化精简版本菜单数据结构，提升数据一致性',
      '优化本地开发环境网络请求代理配置',
      '优化 ElTree 组件默认样式',
      '新增 VsCode 推荐插件相关配置',
      '优化 ElDropdown 组件点击触发模式下的交互样式',
      '扩展注册、密码重置页面顶部组件支持',
      '优化菜单过滤逻辑',
      '优化页面切换动画，提升加载速度',
      '优化暗黑模式文字颜色',
      '修复静态路由自定义首页路径首次访问跳转登录页问题',
      '修复退出登录时短暂跳转至 500 页的问题',
      '修复 v2.5.9 版本首页路由跳转配置失效问题',
      '修复 v2.5.9 自动导包机制导致的构建异常'
    ],
    requireReLogin: true
  },
  {
    version: 'v2.5.9',
    title: '代码优化',
    date: '2025-10-12',
    detail: [
      'views 文件目录、文件名、代码优化',
      'useTable 分页请求字段增加全局配置 tableConfig.ts',
      '优化路由配置为模块化结构',
      '获取菜单接口使用 apifox mock 数据（需在 .env 中 将 VITE_ACCESS_MODE 设为 backend 模式）'
    ]
  },
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
  },
  {
    version: 'v2.4.2.6',
    title: '组件重构与性能优化',
    date: '2025-06-23',
    detail: [
      '重构 components/core/forms 文件夹下的表单相关组件，提升可维护性与一致性',
      '重构 ArtBreadcrumb 面包屑导航组件，优化逻辑结构与样式',
      '优化 ArtChatWindow 与 ArtFastEnter 组件代码，提升可读性与性能',
      '重构 ArtFireworksEffect 烟花效果组件，显著提升渲染性能与动画流畅度',
      'README 文档新增官方网站链接，便于用户查看项目文档'
    ]
  },
  {
    version: 'v2.4.2.5',
    title: '图表组件重构',
    date: '2025-06-22',
    detail: [
      '重构图表组件，优化代码结构与可维护性',
      '精细调整图表动画与主题配色方案，提升视觉一致性'
    ]
  },
  {
    version: 'v2.4.2.4',
    title: '组件重构、代码优化',
    date: '2025-06-18',
    detail: [
      'ArtMenuRight 组件重构',
      'ArtWatermark 增加类型注释',
      'components/core/cards 下面的组件重构，代码优化'
    ]
  },
  {
    version: 'v2.4.2.3',
    title: '组件重构、代码优化',
    date: '2025-06-18',
    detail: [
      'ArtResultPage 组件重构',
      'ArtTextScroll 组件代码优化',
      'ArtException 组件增加类型提示',
      'ArtCutterImg 组件样式优化、增加类型定义',
      'ArtVideoPlayer 组件增加类型定义'
    ]
  },
  {
    version: 'v2.4.2.2',
    title: '组件重构',
    date: '2025-06-16',
    detail: ['返回顶部组件重构', '图标选择器组件重构', '系统Logo组件属性变更']
  },
  {
    version: 'v2.4.2.1',
    title: '横幅组件重构、Bug修复',
    date: '2025-06-16',
    detail: ['横幅组件重构以及优化', '修复混合菜单下第一个菜单是嵌套菜单跳转bug']
  },
  {
    version: 'v2.4.2',
    title: 'Bug修复与体验优化',
    date: '2025-06-14',
    detail: [
      '重构网络请求模块，增强错误处理、类型安全与多语言支持',
      '修复移动端搜索栏无法滚动、iPad端页面滚动异常问题',
      '修复 el-dialog 启用 draggable 属性后，自定义动画失效的问题',
      '修复 2.3.0 版本本地存储重构后，导致登录、注册等页面多语言设置无法持久化的问题',
      '引导、列设置多语言完善',
      '修复表格固定列不起作用bug',
      '路由配置新增 activePath 激活菜单路径属性',
      '去除用户列表、菜单管理页面无效代码',
      '更新技术支持链接'
    ],
    requireReLogin: true
  },
  {
    version: 'v2.4.1.1',
    title: 'Bug修复与体验优化',
    date: '2025-06-07',
    detail: [
      '修复菜单管理折叠 bug',
      '优化角色管理页面代码',
      '修复表格数据为空高度无限变大bug',
      'el-dialog视觉效果优化，支持配置线条',
      '系统主题模式从Light改成跟随系统模式'
    ]
  },
  {
    version: 'v2.4.1',
    title: '优化菜单交互体验、Echarts 图表性能优化',
    date: '2025-06-07',
    detail: [
      '提升菜单操作跟手感',
      '页面入场动画时间减少0.04s',
      '修复 Echarts 图表组件在弹窗中不显示的 bug',
      'Echarts 图表性能优化，新增可视区域初始化、内存泄漏防护、防抖处理',
      '锁屏状下禁止使用开发者工具破解锁屏'
    ]
  },
  {
    version: 'v2.4.0',
    title: '代码重构与资源优化',
    date: '2025-06-06',
    detail: [
      '全局 TypeScript 类型体系重构，提升类型准确性与可维护性',
      '重构 utils 工具包，统一工具方法结构，增强可读性与复用性',
      'utils 新增表单验证与 Cookie 操作相关工具函数',
      '删除未使用的工具模块与无效资源，精简项目体积',
      '优化 views 页面结构，移除冗余页面文件',
      '页面组件增加 defineOptions，明确组件命名',
      '异常页面多语言支持, 提升国际化体验',
      '图片资源统一转换为 webp 格式，整体资源体积减少约 50%',
      '打包产物减少约 1MB，提高加载效率',
      'HTTP 请求增加 token 过期自动处理逻辑，提升安全性与用户体验'
    ],
    requireReLogin: true
  }
])
