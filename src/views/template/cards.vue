<template>
  <div class="cards">
    <h1 class="page-title">统计卡片（文字）</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
        <StatsCard
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :iconSize="card.iconSize"
          iconColor="#fff"
          :iconBgColor="card.iconBgColor"
          :showArrow="card.showArrow"
        />
      </el-col>
    </el-row>

    <h1 class="page-title">统计卡片（数字滚动）</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
        <StatsCard
          :icon="card.icon"
          :count="card.count"
          :description="card.description"
          :iconSize="card.iconSize"
          iconColor="#fff"
          :iconBgColor="card.iconBgColor"
          :showArrow="card.showArrow"
        />
      </el-col>
    </el-row>

    <h1 class="page-title">统计卡片（自定义样式）</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
        <StatsCard
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :iconColor="card.iconColor"
          :textColor="card.textColor"
          :backgroundColor="card.backgroundColor"
          :showArrow="card.showArrow"
        />
      </el-col>
    </el-row>

    <h1 class="page-title">进度卡片</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id">
        <ProgressCard :percentage="card.percentage" :title="card.title" :color="card.color" />
      </el-col>
    </el-row>

    <h1 class="page-title">进度卡片（icon）</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id">
        <ProgressCard
          :percentage="card.percentage"
          :title="card.title"
          :color="card.color"
          :icon="card.icon"
          :iconColor="card.iconColor"
          :iconBgColor="card.iconBgColor"
          :iconSize="card.iconSize"
        />
      </el-col>
    </el-row>

    <h1 class="page-title">图片卡片</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in imageCards" :key="card.id">
        <ImageCard
          :imageUrl="card.imageUrl"
          :title="card.title"
          :category="card.category"
          :readTime="card.readTime"
          :views="card.views"
          :comments="card.comments"
          :date="card.date"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import cover1 from '@imgs/cover/img1.jpg'
  import cover2 from '@imgs/cover/img2.jpg'
  import cover3 from '@imgs/cover/img3.jpg'
  import cover4 from '@imgs/cover/img4.jpg'

  const statsCards = [
    {
      id: 1,
      title: '销售产品',
      count: 1235,
      description: '鞋子、牛仔裤、派对服装、手表',
      icon: '&#xe812;',
      iconColor: '#5d87ff',
      iconSize: 20,
      iconBgColor: '#35C76C',
      textColor: '#5d87ff',
      backgroundColor: '#ECF2FF',
      showArrow: false
    },
    {
      id: 2,
      title: '活跃用户',
      count: 5000,
      description: '日活跃用户超过5,000+',
      icon: '&#xe724;',
      iconColor: '#ffae1f',
      iconSize: 20,
      iconBgColor: '#46CAEB',
      textColor: '#ffae1f',
      backgroundColor: '#fef5e5',
      showArrow: false
    },
    {
      id: 3,
      title: '总收入',
      count: 35000,
      description: '月收入超过¥350,000+',
      icon: '&#xe70e;',
      iconColor: '#49beff',
      iconSize: 20,
      iconBgColor: '#FF6692',
      textColor: '#49beff',
      backgroundColor: '#e8f7ff',
      showArrow: false
    },
    {
      id: 4,
      title: '客户评价',
      count: 4800,
      description: '平均评分4.8/5',
      icon: '&#xe82d;',
      iconColor: '#fa896b',
      iconSize: 20,
      iconBgColor: '#F8C20B',
      textColor: '#fa896b',
      backgroundColor: '#fdede8',
      showArrow: false
    }
  ]

  const progressCards = [
    {
      id: 1,
      title: '完成进度',
      percentage: 75,
      color: '#67C23A',
      icon: '&#xe812;',
      iconColor: '#36c76c',
      iconBgColor: '#EBFAF0',
      iconSize: 20
    },
    {
      id: 2,
      title: '项目进度',
      percentage: 65,
      color: '#409EFF',
      icon: '&#xe724;',
      iconColor: '#409EFF',
      iconBgColor: '#F0F7FF',
      iconSize: 20
    },
    {
      id: 3,
      title: '学习进度',
      percentage: 45,
      color: '#FF6692',
      icon: '&#xe724;',
      iconColor: '#FF6692',
      iconBgColor: '#fdf5f5',
      iconSize: 20
    },
    {
      id: 4,
      title: '任务进度',
      percentage: 90,
      color: '#46CAEB',
      icon: '&#xe724;',
      iconColor: '#46CAEB',
      iconBgColor: '#EBF9FF',
      iconSize: 20
    }
  ]

  const imageCards = [
    {
      id: 1,
      imageUrl: cover1,
      title: 'AI技术在医疗领域的创新应用与发展前景',
      category: '社交',
      readTime: '2分钟',
      views: 9125,
      comments: 3,
      date: '12月19日 周一'
    },
    {
      id: 2,
      imageUrl: cover2,
      title: '大数据分析助力企业决策的实践案例',
      category: '技术',
      readTime: '3分钟',
      views: 7234,
      comments: 5,
      date: '12月20日 周二'
    },
    {
      id: 3,
      imageUrl: cover3,
      title: '区块链技术在供应链管理中的应用',
      category: '科技',
      readTime: '4分钟',
      views: 5678,
      comments: 8,
      date: '12月21日 周三'
    },
    {
      id: 4,
      imageUrl: cover4,
      title: '云计算技术发展趋势与未来展望',
      category: '云技术',
      readTime: '5分钟',
      views: 4321,
      comments: 6,
      date: '12月22日 周四'
    }
  ]
</script>

<style lang="scss" scoped>
  .cards {
    padding: 20px 0;

    .page-title {
      margin: 20px 0 15px;
      font-size: 22px;
      font-weight: 500;

      &:first-child {
        margin-top: 0;
      }
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
</style>
