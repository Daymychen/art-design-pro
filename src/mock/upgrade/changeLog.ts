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
  },
  {
    version: 'v2.3.6',
    title: 'config 文件夹结构简化',
    date: '2025-06-03'
  },
  {
    version: 'v2.3.5',
    title: 'prettier、stylelint、lint-staged、cz-git 版本升级',
    date: '2025-06-03'
  },
  {
    version: 'v2.3.4',
    title: 'views 目录结构调整',
    date: '2025-06-03',
    requireReLogin: true
  },
  {
    version: 'v2.3.3',
    title: '用户列表使用 Apifox Mock 数据',
    date: '2025-06-03'
  },
  {
    version: 'v2.3.2',
    title: '设置中心代码重构',
    date: '2025-05-30'
  },
  {
    version: 'v2.3.1',
    title: '修复 2.3.0 版本主题样式初始化bug',
    date: '2025-05-30'
  },
  {
    version: 'v2.3.0',
    title: '本地数据存储重构',
    date: '2025-05-29',
    detail: ['本地数据存储代码全部重新设计', '本地数据存储可靠性大幅提升', '修复水平菜单溢出BUG'],
    requireReLogin: true
  },
  {
    version: 'v2.2.91',
    title: '首页图表设计高级动画效果、分析页样式优化',
    date: '2025-05-28'
  },
  {
    version: 'v2.2.90',
    title: '表格搜索新增日期选择器',
    date: '2025-05-28'
  },
  {
    version: 'v2.2.89',
    title: '选项卡新增固定属性',
    date: '2025-05-28',
    detail: ['选项卡代码优化', '右键菜单重构'],
    requireReLogin: true
  },
  {
    version: 'v2.2.88',
    title: 'bug修复、优化用户体验',
    date: '2025-05-26',
    detail: [
      '优化一级菜单配置，去除 isRootMenu 属性',
      '优化登录页面角色选择器高度问题',
      '修复刷新页面参数丢失问题',
      '修复关闭标签页导致浏览器参数丢失问题',
      '修复高亮代码块自定义指令问题'
    ]
  },
  {
    version: 'v2.2.87',
    title: '横幅组件增加流星动画',
    date: '2025-05-26'
  },
  {
    version: 'v2.2.86',
    title: '优化用户体验',
    date: '2025-05-22',
    detail: [
      '修复全局搜索失去焦点后快捷键失效问题',
      '去除网络检测组件',
      '表格设置本地存储增加默认值',
      '优化版本升级退出登录逻辑'
    ],
    requireReLogin: true
  },
  {
    version: 'v2.2.85',
    title: '新增系统Logo组件',
    date: '2025-05-21'
  },
  {
    version: 'v2.2.84',
    title: '修复环形图表组件 label 样式问题',
    date: '2025-05-21'
  },
  {
    version: 'v2.2.83',
    title: '优化 Checkbox 组件样式',
    date: '2025-05-21'
  },
  {
    version: 'v2.2.82',
    title: '优化视觉体验',
    date: '2025-05-18'
  },
  {
    version: 'v2.2.81',
    title: '修复一级菜单布局bug',
    date: '2025-05-18'
  },
  {
    version: 'v2.2.80',
    title: '权限新增前端控制模式',
    date: '2025-05-17',
    requireReLogin: true,
    detail: ['权限新增前端角色控制模式', '网络请求部分接口使用 apifox 代理', '系统管理列表优化']
  },
  {
    version: 'v2.2.78',
    title: '优化左侧菜单样式',
    date: '2025-05-14'
  },
  {
    version: 'v2.2.77',
    title: '修复菜单布局变化时图表组件不自适应问题',
    date: '2025-05-14'
  },
  {
    version: 'v2.2.76',
    title: '修复新版本表格按钮权限不生效bug',
    date: '2025-05-11'
  },
  {
    version: 'v2.2.75',
    title: '优化路由配置逻辑，提升开发体验',
    date: '2025-05-11',
    detail: ['路由文件结构、流程、代码优化', '增加路由名称以及路径重复检测', '静态路由配置优化']
  },
  {
    version: 'v2.2.74',
    title: '修复 el-select 组件 bug',
    date: '2025-05-09',
    detail: [
      '修复 el-dialog 动画后 el-select tag 宽度不自适应 bug',
      '修复 el-select 高度不自适应 bug'
    ]
  },
  {
    version: 'v2.2.73',
    title: '修复首页表格溢出bug',
    date: '2025-05-08'
  },
  {
    version: 'v2.2.72',
    title: '移动端表格样式优化',
    date: '2025-05-08'
  },
  {
    version: 'v2.2.71',
    title: '菜单管理页面优化',
    date: '2025-05-08',
    detail: [
      '表格全屏支持ESC退出',
      '搜索栏按钮靠左对齐限制',
      'ArtTableHeader 按钮移动端样式优化',
      'ArtTableHeader 表格设置可配置'
    ],
    requireReLogin: true
  },
  {
    version: 'v2.2.70',
    title: '菜单结构调整、删除部分页面',
    date: '2025-05-07',
    requireReLogin: true
  },
  {
    version: 'v2.2.69',
    title: '优化表格参数默认值',
    date: '2025-05-06'
  },
  {
    version: 'v2.2.68',
    title: '表格增加斑马纹、边框、表头背景、多语言支持',
    date: '2025-05-06'
  },
  {
    version: 'v2.2.67',
    title: '页面切换动画样式重构、多语言支持',
    date: '2025-05-05'
  },
  {
    version: 'v2.2.66',
    title: '表格增加大小控制',
    date: '2025-04-30',
    requireReLogin: true
  },
  {
    version: 'v2.2.65',
    title: '优化 Element UI 组件高度',
    date: '2025-04-30'
  },
  {
    version: 'v2.2.64',
    title: '表格搜索模块重构、表格增加列设置、拖拽、刷新、全屏功能',
    date: '2025-04-29'
  },
  {
    version: 'v2.2.63',
    title: 'el-tree-select 样式优化',
    date: '2025-04-27'
  },
  {
    version: 'v2.2.62',
    title: '优化聊天窗口滚动体验',
    date: '2025-04-27'
  },
  {
    version: 'v2.2.61',
    title: '修复拖拽验证重置bug',
    date: '2025-04-27'
  },
  {
    version: 'v2.2.60',
    title: '修复移动端图标选择器显示问题',
    date: '2025-04-27'
  },
  {
    version: 'v2.2.59',
    title: '修复富文本编辑器样式问题、修复顶部菜单 isHide 未生效 bug',
    date: '2025-04-24'
  },
  {
    version: 'v2.2.58',
    title: '系统组件库文件分类优化和文件名称优化',
    date: '2025-04-15'
  },
  {
    version: 'v2.2.57',
    title: '修复双列菜单下 isHide 属性不生效 bug',
    date: '2025-04-13'
  },
  {
    version: 'v2.2.56',
    title: 'pinia 升级到 3.0.2，并采用 setup 语法',
    date: '2025-04-12',
    requireReLogin: true
  },
  {
    version: 'v2.2.55',
    title: '全局搜索支持多层嵌套搜索',
    date: '2025-03-31'
  },
  {
    version: 'v2.2.54',
    title: '配置文件重构',
    date: '2025-03-30'
  },
  {
    version: 'v2.2.53',
    title: '标签页样式支持多种模式',
    date: '2025-03-29'
  },
  {
    version: 'v2.2.52',
    title: '修复系统升级后刷新页面退出登录bug',
    date: '2025-03-25'
  },
  {
    version: 'v2.2.51',
    title: '设置中心主题盒子改成图片模式',
    date: '2025-03-25'
  },
  {
    version: 'v2.2.5',
    title: '主题切换增加动画效果（只支持部分浏览器）',
    date: '2025-03-22'
  },
  {
    version: 'v2.2.4',
    title: '通用函数整合、外部链接整合、utils工具包优化',
    date: '2025-03-21'
  },
  {
    version: 'v2.2.3',
    title: '样式优化',
    date: '2025-03-19',
    detail: [
      '修复表头文字穿透',
      '修复 el-image 和 el-table 冲突层级问题',
      '优化登录页面滑块验证部分浏览器兼容问题'
    ]
  },
  {
    version: 'v2.2.2',
    title: '优化Axios响应数据转换逻辑等问题',
    date: '2025-03-16',
    detail: [
      '优化 Axios 响应数据转换逻辑',
      '修复重复点击滚动数字的 bug',
      '修复图像裁剪移动端层级问题',
      '修复 ipad mini 菜单折叠 bug'
    ]
  },
  {
    version: 'v2.2.11',
    title: '优化容器高度不够显示滚动条问题',
    date: '2025-03-09'
  },
  {
    version: 'v2.2.10',
    title: '修复多标签无法携带参数BUG、本地存储修复无法手动删除BUG',
    date: '2025-03-08'
  },
  {
    version: 'v2.2.9',
    title: '新增电子商务仪表盘',
    date: '2025-03-07'
  },
  {
    version: 'v2.2.81',
    title: 'ButtonTable 增加自定义图标模式、顶栏聊天图标添加 hover 动画',
    date: '2025-03-01'
  },
  {
    version: 'v2.2.8',
    title: '修复浏览器刷新页面警告、静态路由标题多语言',
    date: '2025-03-01'
  },
  {
    version: 'v2.2.7',
    title: '新增地图模版',
    date: '2025-02-28',
    detail: [
      '新增地图模版',
      '页面文件命名统一',
      '国际化文件从.ts改为.json',
      '左侧菜单一级图标颜色BUG修复'
    ]
  },
  {
    version: 'v2.2.6',
    title: '图表卡片新增小图表模式，优化token过期，菜单数据为空问题',
    date: '2025-02-27',
    detail: [
      '图表卡片新增小图表模式',
      '优化token过期，菜单数据为空问题',
      '聊天模版增加电话、视频、更多按钮',
      '去除 vite.config.ts 无效的test模块'
    ]
  },
  {
    version: 'v2.2.5',
    title: '获取token，用户信息逻辑优化、http请求参数传递优化',
    date: '2025-02-26',
    requireReLogin: true
  },
  {
    version: 'v2.2.4',
    title: '新增按钮水波纹效果、混合模式菜单选中BUG修复',
    date: '2025-02-25',
    detail: [
      '按钮增加水波纹指令',
      '通知中心新增查看全部按钮',
      '登录按钮 loading 效果',
      '修复多层嵌套菜单混合模式下顶部菜单无法选中BUG'
    ]
  },
  {
    version: 'v2.2.2',
    title: '将VITE升级到6.1，优化某些组件的UI',
    date: '2025-02-20'
  },
  {
    version: 'v2.2.1',
    title: '菜单多语言配置重构',
    date: '2025-02-17',
    requireReLogin: true
  },
  {
    version: 'v2.2.0',
    title: '路由重构，只需要配置一份路由数据，即可生成菜单和路由',
    date: '2025-02-17'
  },
  {
    version: 'v2.1.2',
    title: '固定列表格文字穿透BUG修复、富文本复制代码按钮定位BUG修复、去除mockjs',
    date: '2025-02-16'
  },
  {
    version: 'v2.1.1',
    title: '多标签页关闭页面后，页面清空缓存',
    date: '2025-02-15'
  },
  {
    version: 'v2.1.0',
    title: '暗黑主题样式优化，折叠菜单选中样式优化',
    date: '2025-02-15'
  },
  {
    version: 'v2.0.8',
    title: '新增容器宽度设置',
    date: '2025-02-14'
  },
  {
    version: 'v2.0.7',
    title: '修复多标签页关闭后空白BUG、优化登录注册页面样式',
    date: '2025-02-13'
  },
  {
    version: 'v2.0.6',
    title: '新增数据卡片组件',
    date: '2025-02-13'
  },
  {
    version: 'v2.0.5',
    title: '聊天页面样式优化',
    date: '2025-02-13'
  },
  {
    version: 'v2.0.4',
    title: '登录页面 rules 优化、多语言优化',
    date: '2025-02-12'
  },
  {
    version: 'v2.0.3',
    title: 'Element UI 组件箭头样式修复',
    date: '2025-02-12'
  },
  {
    version: 'v2.0.2',
    title: 'Element UI select、dialog、message-box、dropdown 组件样式优化',
    date: '2025-02-11'
  },
  {
    version: 'v2.0.1',
    title: '封面图片替换',
    date: '2025-02-10'
  },
  {
    version: 'v2.0.0',
    title: '系统主题色升级',
    date: '2025-02-09'
  },
  {
    version: 'v1.9.0',
    title: '新增日历组件',
    date: '2025-02-09'
  },
  {
    version: 'v1.8.0',
    title: '新增图表组件',
    date: '2025-02-08'
  },
  {
    version: 'v1.7.1',
    title: '新增图表卡片',
    date: '2025-02-07'
  },
  {
    version: 'v1.7.0',
    title: '新增卡片、横幅组件',
    date: '2025-01-25'
  },
  {
    version: 'v1.6.0',
    title: '新增定价页面',
    date: '2025-01-24'
  },
  {
    version: 'v1.5.1',
    title: '修复笔记本顶部菜单宽度问题',
    date: '2025-01-23'
  },
  {
    version: 'v1.5.0',
    title: '新增双列菜单',
    date: '2025-01-22'
  },
  {
    version: 'v1.4.1',
    title: '增加表格分页示例',
    date: '2025-01-20'
  },
  {
    version: 'v1.4.0',
    title: '新增快速入口',
    date: '2025-01-18'
  },
  {
    version: 'v1.3.2',
    title: '修复多标签页关闭后仍然添加的bug',
    date: '2025-01-18'
  },
  {
    version: 'v1.3.1',
    title: '修复窗口大小变化自动匹配合适的菜单模式',
    date: '2025-01-17'
  },
  {
    version: 'v1.3.0',
    title: '新增聊天组件',
    date: '2025-01-16'
  },
  {
    version: 'v1.2.1',
    title: '图标选择器优化',
    date: '2024-12-31'
  },
  {
    version: 'v1.2.0',
    title: '新增礼花组件以及BUG修复',
    date: '2024-12-26'
  },
  {
    version: 'v1.1.97',
    title: '更新README',
    date: '2024-12-21'
  },
  {
    version: 'v1.1.96',
    title: '仪表盘页面样式优化',
    date: '2024-12-21'
  },
  {
    version: 'v1.1.95',
    title: '卡片阴影效果优化',
    date: '2024-12-21'
  },
  {
    version: 'v1.1.94',
    title: '修复按钮点击文字颜色消失BUG（建议所有用户更新）',
    date: '2024-12-20'
  },
  {
    version: 'v1.1.93',
    title: '一些用户体验上的优化',
    date: '2024-12-20'
  },
  {
    version: 'v1.1.92',
    title: '多语言增加选中状态',
    date: '2024-12-19'
  },
  {
    version: 'v1.1.91',
    title: '多标签关闭逻辑优化',
    date: '2024-12-19'
  },
  {
    version: 'v1.1.9',
    title: '分析页多语言',
    date: '2024-12-19'
  },
  {
    version: 'v1.1.8',
    title: '仪表盘风格调整',
    date: '2024-12-18'
  },
  {
    version: 'v1.1.73',
    title: '去除 package.json 中重复配置',
    date: '2024-12-18'
  },
  {
    version: 'v1.1.72',
    title: '修复自定义菜单宽度引起的顶部菜单过长BUG',
    date: '2024-12-18'
  },
  {
    version: 'v1.1.71',
    title: '切换主题时禁用过渡效果',
    date: '2024-12-18'
  },
  {
    version: 'v1.1.7',
    title: '图标默认使用unicode，顶部菜单增加主题切换按钮',
    date: '2024-12-18'
  },
  {
    version: 'v1.1.6',
    title: '删除未使用的图片文件',
    date: '2024-12-17'
  },
  {
    version: 'v1.1.5',
    title: '修复首次进入系统数据未初始化BUG',
    date: '2024-12-17'
  },
  {
    version: 'v1.1.4',
    title: '重新封装表格组件',
    date: '2024-12-17'
  },
  {
    version: 'v1.1.31',
    title: '修复顶栏菜单刷新按钮间隙',
    date: '2024-12-17'
  },
  {
    version: 'v1.1.3',
    title: '新增自定义圆角',
    date: '2024-12-15'
  },
  {
    version: 'v1.1.2',
    title: '登录注册等页面样式升级',
    date: '2024-12-15'
  },
  {
    version: 'v1.1.1',
    title: '新增文字滚动组件',
    date: '2024-12-10'
  },
  {
    version: 'v1.1.0',
    title: '表格自定义按钮样式优化',
    date: '2024-12-09'
  },
  {
    version: 'v1.0.99',
    title: '自定义表格按钮组件',
    date: '2024-12-09'
  },
  {
    version: 'v1.0.98',
    title: '菜单宽度支持自定义',
    date: '2024-12-09'
  },
  {
    version: 'v1.0.97',
    title: '修复暗黑模式水印不显示问题',
    date: '2024-12-09'
  },
  {
    version: 'v1.0.96',
    title: '多标签支持左右滑动',
    date: '2024-12-09'
  },
  {
    version: 'v1.0.95',
    title: '新增二维码、拖拽组件',
    date: '2024-12-08'
  },
  {
    version: 'v1.0.94',
    title: '新增水印、右键菜单示例',
    date: '2024-12-07'
  },
  {
    version: 'v1.0.93',
    title: '新增数字滚动、富文本编辑器示例',
    date: '2024-12-06'
  },
  {
    version: 'v1.0.92',
    title: '重构：增强iframe处理和菜单交互',
    date: '2024-12-06'
  },
  {
    version: 'v1.0.91',
    title: 'iframe页面跳转优化',
    date: '2024-12-05'
  },
  {
    version: 'v1.0.90',
    title: '面包屑支持路由跳转',
    date: '2024-12-05'
  },
  {
    version: 'v1.0.89',
    title: '新增右键菜单',
    date: '2024-12-04'
  },
  {
    version: 'v1.0.88',
    title: '新增视频播放器',
    date: '2024-12-03'
  },
  {
    version: 'v1.0.87',
    title: '新增Excel导入导出组件',
    date: '2024-12-01'
  },
  {
    version: 'v1.0.86',
    title: '新增图像裁剪组件',
    date: '2024-12-01'
  },
  {
    version: 'v1.0.85',
    title: '页面代码完善',
    date: '2024-12-01'
  },
  {
    version: 'v1.0.84',
    title: '提升菜单权限代码可读性',
    date: '2024-11-30'
  },
  {
    version: 'v1.0.83',
    title: '修复移端样式问题',
    date: '2024-11-29'
  },
  {
    version: 'v1.0.82',
    title: '多语言支持完善',
    date: '2024-11-29'
  },
  {
    version: 'v1.0.81',
    title: '新增屏幕锁定',
    date: '2024-11-29'
  },
  {
    version: 'v1.0.80',
    title: '菜单数据结构重构',
    date: '2024-11-27'
  },
  {
    version: 'v1.0.70',
    title: 'vue、typescript、sass 版本升级',
    date: '2024-11-27'
  },
  {
    version: 'v1.0.69',
    title: '图标库重构',
    date: '2024-11-26'
  },
  {
    version: 'v1.0.68',
    title: '增加混合菜单模式',
    date: '2024-11-25'
  },
  {
    version: 'v1.0.67',
    title: '修复表格固定列透明问题、修复el-drawer背景问题',
    date: '2024-10-30'
  },
  {
    version: 'v1.0.66',
    title: '菜单增加水平布局模式',
    date: '2024-10-20'
  },
  {
    version: 'v1.0.65',
    title: '用户管理弹窗补全、权限增加说明',
    date: '2024-10-19'
  },
  {
    version: 'v1.0.64',
    title: '性能优化',
    date: '2024-10-18'
  },
  {
    version: 'v1.0.63',
    title: '新增注册、忘记密码页面',
    date: '2024-10-16'
  },
  {
    version: 'v1.0.62',
    title: '登录页面UI升级、增加滑动验证',
    date: '2024-10-16'
  },
  {
    version: 'v1.0.61',
    title: '新增顶部进度条',
    date: '2024-10-15'
  },
  {
    version: 'v1.0.6',
    title: '修复菜单点击刷新BUG【建议所有用户更新】',
    date: '2024-10-15'
  },
  {
    version: 'v1.0.51',
    title: '多标签滑动增加提示',
    date: '2024-10-15'
  },
  {
    version: 'v1.0.50',
    title: '修复暗黑主题模式下系统主题切换按钮颜色异常问题',
    date: '2024-10-14'
  },
  {
    version: 'v1.0.49',
    title: '修复菜单按钮不显示问题',
    date: '2024-10-14'
  },
  {
    version: 'v1.0.48',
    title: '新增仪表台',
    date: '2024-10-14'
  },
  {
    version: 'v1.0.47',
    title: '首页切换主题视觉效果优化',
    date: '2024-10-12'
  },
  {
    version: 'v1.0.46',
    title: '顶部菜单栏图标动画效果升级',
    date: '2024-9-27'
  },
  {
    version: 'v1.0.45',
    title: '通知中心样式优化',
    date: '2024-9-27'
  },
  {
    version: 'v1.0.44',
    title: '视觉效果优化',
    date: '2024-9-26'
  },
  {
    version: 'v1.0.43',
    title: '修复<script setup>多语言刷新后丢失BUG',
    date: '2024-9-26'
  },
  {
    version: 'v1.0.42',
    title: '修复 sass 控制台报错',
    date: '2024-9-25'
  },
  {
    version: 'v1.0.41',
    title: '修复页面多次刷新',
    date: '2024-9-25'
  },
  {
    version: 'v1.0.4',
    title: '新增嵌套路由',
    date: '2024-9-24'
  },
  {
    version: 'v1.0.34',
    title: '获取路由菜单列表优化',
    date: '2024-9-23'
  },
  {
    version: 'v1.0.33',
    title: '新增项目文档',
    date: '2024-9-21'
  },
  {
    version: 'v1.0.32',
    title: '菜单折叠持久化存储',
    date: '2024-9-18'
  },
  {
    version: 'v1.0.31',
    title: '去除点击菜单按钮页面刷新问题',
    date: '2024-9-18'
  },
  {
    version: 'v1.0.3',
    title: '新增页面切换动画',
    date: '2024-9-17'
  },
  {
    version: 'v1.0.27',
    title: '菜单标题多语言封装',
    date: '2024-9-13'
  },
  {
    version: 'v1.0.26',
    title: 'windows下全局搜索图标优化',
    date: '2024-9-13'
  },
  {
    version: 'v1.0.25',
    title: '新增网络异常提示组件',
    date: '2024-9-12'
  },
  {
    version: 'v1.0.24',
    title: 'CSS主题变量重构',
    date: '2024-9-11'
  },
  {
    version: 'v1.0.23',
    title: '全局搜索新增历史记录',
    date: '2024-9-9'
  },
  {
    version: 'v1.0.22',
    title: '头像菜单升级',
    date: '2024-9-9'
  },
  {
    version: 'v1.0.21',
    title: '搜索升级为全局弹窗',
    date: '2024-9-7'
  },
  {
    version: 'v1.0.2',
    title: '搜索支持键盘上下选择、回车搜索',
    date: '2024-9-5'
  },
  {
    version: 'v1.0.1',
    title: '留言板块开发',
    date: '2024-9-4'
  },
  {
    version: 'v1.0.0（正式版）',
    title: '基础功能开发完成',
    date: '2024-9-3'
  },
  {
    version: 'v1.0.0',
    title: 'cz-git 实现 git 可视化提交',
    date: '2024-8-27'
  },
  {
    version: 'v1.0.0',
    title: 'Husky + CommitLint 代码提交自动格式化',
    date: '2024-8-26'
  },
  {
    version: 'v1.0.0',
    title: 'Perttier、StyleLint 代码格式化&验证',
    date: '2024-8-25'
  },
  {
    version: 'v1.0.0',
    title: 'Eslint 代码校验',
    date: '2024-8-25'
  },
  {
    version: 'v1.0.0',
    title: 'LocalStorage 系统数据校验',
    date: '2024-8-24'
  },
  {
    version: 'v1.0.0',
    title: '多语言支持',
    date: '2024-8-23'
  },
  {
    version: 'v1.0.0',
    title: '主题跟随系统切换',
    date: '2024-8-22'
  },
  {
    version: 'v1.0.0',
    title: '多标签支持左右滚动',
    date: '2024-8-21'
  },
  {
    version: 'v1.0.0',
    title: '项目依赖版本升级',
    date: '2024-8-20'
  }
])
