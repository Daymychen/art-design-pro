export const upgradeLogList = ref([
  {
    version: 'v2.2.55',
    title: '全局搜索支持多层嵌套搜索',
    date: '2025-03-31',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.54',
    title: '配置文件重构',
    date: '2025-03-30',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.53',
    title: '标签页样式支持多种模式',
    date: '2025-03-29',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.52',
    title: '修复系统升级后刷新页面退出登录bug',
    date: '2025-03-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.51',
    title: '设置中心主题盒子改成图片模式',
    date: '2025-03-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.5',
    title: '主题切换增加动画效果（只支持部分浏览器）',
    date: '2025-03-22',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.4',
    title: '通用函数整合、外部链接整合、utils工具包优化',
    date: '2025-03-21',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.3',
    title: '样式优化',
    date: '2025-03-19',
    status: 'complete',
    statusText: '完成',
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
    status: 'complete',
    statusText: '完成',
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
    date: '2025-03-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.10',
    title: '修复多标签无法携带参数BUG、本地存储修复无法手动删除BUG',
    date: '2025-03-08',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.9',
    title: '新增电子商务仪表盘',
    date: '2025-03-07',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.81',
    title: 'ButtonTable 增加自定义图标模式、顶栏聊天图标添加 hover 动画',
    date: '2025-03-01',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.8',
    title: '修复浏览器刷新页面警告、静态路由标题多语言',
    date: '2025-03-01',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.7',
    title: '新增地图模版',
    date: '2025-02-28',
    status: 'complete',
    statusText: '完成',
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
    status: 'complete',
    statusText: '完成',
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
    status: 'complete',
    statusText: '完成',
    requireReLogin: true // 需要重新登录
  },
  {
    version: 'v2.2.4',
    title: '新增按钮水波纹效果、混合模式菜单选中BUG修复',
    date: '2025-02-25',
    status: 'complete',
    statusText: '完成',
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
    date: '2025-02-20',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.2.1',
    title: '菜单多语言配置重构',
    date: '2025-02-17',
    status: 'complete',
    statusText: '完成',
    requireReLogin: true // 需要重新登录
  },
  {
    version: 'v2.2.0',
    title: '路由重构，只需要配置一份路由数据，即可生成菜单和路由',
    date: '2025-02-17',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.1.2',
    title: '固定列表格文字穿透BUG修复、富文本复制代码按钮定位BUG修复、去除mockjs',
    date: '2025-02-16',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.1.1',
    title: '多标签页关闭页面后，页面清空缓存',
    date: '2025-02-15',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.1.0',
    title: '暗黑主题样式优化，折叠菜单选中样式优化',
    date: '2025-02-15',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.8',
    title: '新增容器宽度设置',
    date: '2025-02-14',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.7',
    title: '修复多标签页关闭后空白BUG、优化登录注册页面样式',
    date: '2025-02-13',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.6',
    title: '新增数据卡片组件',
    date: '2025-02-13',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.5',
    title: '聊天页面样式优化',
    date: '2025-02-13',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.4',
    title: '登录页面 rules 优化、多语言优化',
    date: '2025-02-12',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.3',
    title: 'Element UI 组件箭头样式修复',
    date: '2025-02-12',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.2',
    title: 'Element UI select、dialog、message-box、dropdown 组件样式优化',
    date: '2025-02-11',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.1',
    title: '封面图片替换',
    date: '2025-02-10',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v2.0.0',
    title: '系统主题色升级',
    date: '2025-02-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.9.0',
    title: '新增日历组件',
    date: '2025-02-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.8.0',
    title: '新增图表组件',
    date: '2025-02-08',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.7.1',
    title: '新增图表卡片',
    date: '2025-02-07',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.7.0',
    title: '新增卡片、横幅组件',
    date: '2025-01-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.6.0',
    title: '新增定价页面',
    date: '2025-01-24',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.5.1',
    title: '修复笔记本顶部菜单宽度问题',
    date: '2025-01-23',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.5.0',
    title: '新增双列菜单',
    date: '2025-01-22',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.4.1',
    title: '增加表格分页示例',
    date: '2025-01-20',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.4.0',
    title: '新增快速入口',
    date: '2025-01-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.3.2',
    title: '修复多标签页关闭后仍然添加的bug',
    date: '2025-01-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.3.1',
    title: '修复窗口大小变化自动匹配合适的菜单模式',
    date: '2025-01-17',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.3.0',
    title: '新增聊天组件',
    date: '2025-01-16',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.2.1',
    title: '图标选择器优化',
    date: '2024-12-31',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.2.0',
    title: '新增礼花组件以及BUG修复',
    date: '2024-12-26',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.97',
    title: '更新README',
    date: '2024-12-21',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.96',
    title: '仪表盘页面样式优化',
    date: '2024-12-21',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.95',
    title: '卡片阴影效果优化',
    date: '2024-12-21',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.94',
    title: '修复按钮点击文字颜色消失BUG（建议所有用户更新）',
    date: '2024-12-20',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.93',
    title: '一些用户体验上的优化',
    date: '2024-12-20',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.92',
    title: '多语言增加选中状态',
    date: '2024-12-19',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.91',
    title: '多标签关闭逻辑优化',
    date: '2024-12-19',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.9',
    title: '分析页多语言',
    date: '2024-12-19',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.8',
    title: '仪表盘风格调整',
    date: '2024-12-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.73',
    title: '去除 package.json 中重复配置',
    date: '2024-12-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.72',
    title: '修复自定义菜单宽度引起的顶部菜单过长BUG',
    date: '2024-12-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.71',
    title: '切换主题时禁用过渡效果',
    date: '2024-12-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.7',
    title: '图标默认使用unicode，顶部菜单增加主题切换按钮',
    date: '2024-12-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.6',
    title: '删除未使用的图片文件',
    date: '2024-12-17',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.5',
    title: '修复首次进入系统数据未初始化BUG',
    date: '2024-12-17',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.4',
    title: '重新封装表格组件',
    date: '2024-12-17',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.31',
    title: '修复顶栏菜单刷新按钮间隙',
    date: '2024-12-17',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.3',
    title: '新增自定义圆角',
    date: '2024-12-15',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.2',
    title: '登录注册等页面样式升级',
    date: '2024-12-15',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.1',
    title: '新增文字滚动组件',
    date: '2024-12-10',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.1.0',
    title: '表格自定义按钮样式优化',
    date: '2024-12-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.99',
    title: '自定义表格按钮组件',
    date: '2024-12-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.98',
    title: '菜单宽度支持自定义',
    date: '2024-12-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.97',
    title: '修复暗黑模式水印不显示问题',
    date: '2024-12-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.96',
    title: '多标签支持左右滑动',
    date: '2024-12-09',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.95',
    title: '新增二维码、拖拽组件',
    date: '2024-12-08',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.94',
    title: '新增水印、右键菜单示例',
    date: '2024-12-07',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.93',
    title: '新增数字滚动、富文本编辑器示例',
    date: '2024-12-06',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.92',
    title: '重构：增强iframe处理和菜单交互',
    date: '2024-12-06',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.91',
    title: 'iframe页面跳转优化',
    date: '2024-12-05',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.90',
    title: '面包屑支持路由跳转',
    date: '2024-12-05',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.89',
    title: '新增右键菜单',
    date: '2024-12-04',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.88',
    title: '新增视频播放器',
    date: '2024-12-03',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.87',
    title: '新增Excel导入导出组件',
    date: '2024-12-01',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.86',
    title: '新增图像裁剪组件',
    date: '2024-12-01',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.85',
    title: '页面代码完善',
    date: '2024-12-01',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.84',
    title: '提升菜单权限代码可读性',
    date: '2024-11-30',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.83',
    title: '修复移端样式问题',
    date: '2024-11-29',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.82',
    title: '多语言支持完善',
    date: '2024-11-29',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.81',
    title: '新增屏幕锁定',
    date: '2024-11-29',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.80',
    title: '菜单数据结构重构',
    date: '2024-11-27',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.70',
    title: 'vue、typescript、sass 版本升级',
    date: '2024-11-27',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.69',
    title: '图标库重构',
    date: '2024-11-26',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.68',
    title: '增加混合菜单模式',
    date: '2024-11-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.67',
    title: '修复表格固定列透明问题、修复el-drawer背景问题',
    date: '2024-10-30',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.66',
    title: '菜单增加水平布局模式',
    date: '2024-10-20',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.65',
    title: '用户管理弹窗补全、权限增加说明',
    date: '2024-10-19',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.64',
    title: '性能优化',
    date: '2024-10-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.63',
    title: '新增注册、忘记密码页面',
    date: '2024-10-16',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.62',
    title: '登录页面UI升级、增加滑动验证',
    date: '2024-10-16',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.61',
    title: '新增顶部进度条',
    date: '2024-10-15',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.6',
    title: '修复菜单点击刷新BUG【建议所有用户更新】',
    date: '2024-10-15',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.51',
    title: '多标签滑动增加提示',
    date: '2024-10-15',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.50',
    title: '修复暗黑主题模式下系统主题切换按钮颜色异常问题',
    date: '2024-10-14',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.49',
    title: '修复菜单按钮不显示问题',
    date: '2024-10-14',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.48',
    title: '新增仪表台',
    date: '2024-10-14',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.47',
    title: '首页切换主题视觉效果优化',
    date: '2024-10-12',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.46',
    title: '顶部菜单栏图标动画效果升级',
    date: '2024-9-27',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.45',
    title: '通知中心样式优化',
    date: '2024-9-27',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.44',
    title: '视觉效果优化',
    date: '2024-9-26',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.43',
    title: '修复<script setup>多语言刷新后丢失BUG',
    date: '2024-9-26',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.42',
    title: '修复 sass 控制台报错',
    date: '2024-9-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.41',
    title: '修复页面多次刷新',
    date: '2024-9-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.4',
    title: '新增嵌套路由',
    date: '2024-9-24',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.34',
    title: '获取路由菜单列表优化',
    date: '2024-9-23',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.33',
    title: '新增项目文档',
    date: '2024-9-21',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.32',
    title: '菜单折叠持久化存储',
    date: '2024-9-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.31',
    title: '去除点击菜单按钮页面刷新问题',
    date: '2024-9-18',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.3',
    title: '新增页面切换动画',
    date: '2024-9-17',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.27',
    title: '菜单标题多语言封装',
    date: '2024-9-13',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.26',
    title: 'windows下全局搜索图标优化',
    date: '2024-9-13',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.25',
    title: '新增网络异常提示组件',
    date: '2024-9-12',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.24',
    title: 'CSS主题变量重构',
    date: '2024-9-11',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.23',
    title: '全局搜索新增历史记录',
    date: '2024-9-9',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.22',
    title: '头像菜单升级',
    date: '2024-9-9',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.21',
    title: '搜索升级为全局弹窗',
    date: '2024-9-7',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.2',
    title: '搜索支持键盘上下选择、回车搜索',
    date: '2024-9-5',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.1',
    title: '留言板块开发',
    date: '2024-9-4',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0（正式版）',
    title: '基础功能开发完成',
    date: '2024-9-3',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: 'cz-git 实现 git 可视化提交',
    date: '2024-8-27',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: 'Husky + CommitLint 代码提交自动格式化',
    date: '2024-8-26',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: 'Perttier、StyleLint 代码格式化&验证',
    date: '2024-8-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: 'Eslint 代码校验',
    date: '2024-8-25',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: 'LocalStorage 系统数据校验',
    date: '2024-8-24',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: '多语言支持',
    date: '2024-8-23',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: '主题跟随系统切换',
    date: '2024-8-22',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: '多标签支持左右滚动',
    date: '2024-8-21',
    status: 'complete',
    statusText: '完成'
  },
  {
    version: 'v1.0.0',
    title: '项目依赖版本升级',
    date: '2024-8-20',
    status: 'complete',
    statusText: '完成'
  }
])
