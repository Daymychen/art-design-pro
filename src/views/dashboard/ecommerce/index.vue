<template>
  <div class="banners">
    <el-row :gutter="20">
      <el-col :sm="24" :md="16" :lg="16">
        <BasicBanner
          class="banner"
          :title="`欢迎回来 ${userInfo.username}`"
          :showButton="false"
          backgroundColor="var(--el-color-primary-light-9)"
          titleColor="var(--art-gray-900)"
          subtitleColor="#666"
          style="height: 13.3rem"
          :backgroundImage="bannerCover"
          @click="handleBannerClick"
        >
          <div class="banner-slot">
            <div class="item">
              <p class="title">¥2,340<span class="text-success">+12%</span></p>
              <p class="subtitle">今日销售额</p>
            </div>
            <div class="item">
              <p class="title">¥18,200<span class="text-success">+20%</span></p>
              <p class="subtitle">昨日销售额</p>
            </div>
          </div>
        </BasicBanner>
      </el-col>
      <el-col :sm="12" :md="4" :lg="4">
        <div class="card art-custom-card" style="height: 13.3rem">
          <div class="card-header">
            <p class="title" style="font-size: 24px">205,216</p>
            <p class="subtitle">总订单量</p>
          </div>
          <RingChart
            :data="[
              { value: 30, name: '已完成' },
              { value: 25, name: '处理中' },
              { value: 45, name: '待发货' }
            ]"
            :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
            :radius="['56%', '76%']"
            height="7rem"
            :showLabel="false"
            :borderRadius="0"
          ></RingChart>
        </div>
      </el-col>
      <el-col :sm="12" :md="4" :lg="4">
        <div class="card art-custom-card" style="height: 13.3rem">
          <div class="card-header">
            <p class="title" style="font-size: 24px">55,231</p>
            <p class="subtitle">商品总数</p>
          </div>
          <BarChart
            :showAxisLabel="false"
            :showAxisLine="false"
            :showSplitLine="false"
            :data="[50, 80, 40, 90, 60, 70]"
            height="7rem"
            barWidth="18px"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 第二行 -->
    <el-row :gutter="20">
      <el-col :sm="12" :md="12" :lg="8">
        <div class="card art-custom-card" style="height: 26rem">
          <div class="card-header">
            <p class="title">销售趋势</p>
            <p class="subtitle">月度销售对比</p>
          </div>
          <RoundedBarChart
            :topData="[50, 80, 120, 90, 60]"
            :bottomData="[30, 60, 90, 70, 40]"
            :xAxisData="['一月', '二月', '三月', '四月', '五月']"
            height="18rem"
            :barWidth="16"
          />
        </div>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <div class="card art-custom-card sales-card" style="height: 26rem">
          <div class="card-header">
            <p class="title">销售分类</p>
            <p class="subtitle">按产品类别</p>
          </div>
          <RingChart
            :data="[
              { value: 30, name: '电子产品' },
              { value: 55, name: '服装鞋包' },
              { value: 36, name: '家居用品' }
            ]"
            :color="['#4C87F3', '#EDF2FF', '#8BD8FC']"
            :radius="['70%', '80%']"
            height="16.5rem"
            :showLabel="false"
            :borderRadius="0"
            centerText="¥300,458"
          ></RingChart>
          <div class="double-icon-widget">
            <div class="item">
              <div class="icon">
                <i class="iconfont-sys">&#xe718;</i>
              </div>
              <div class="content">
                <p>¥500,458</p>
                <span>总收入</span>
              </div>
            </div>
            <div class="item">
              <div class="icon">
                <i class="iconfont-sys">&#xe70c;</i>
              </div>
              <div class="content">
                <p>¥130,580</p>
                <span>净利润</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="24" :lg="8">
        <el-row :gutter="20">
          <el-col :span="12">
            <BarChartCard
              :isMiniChart="true"
              :value="15480"
              label="商品浏览量"
              date="过去 14 天"
              :percentage="-4.15"
              :height="11"
              barWidth="10px"
              :chartData="[120, 100, 150, 140, 90, 120]"
            />
          </el-col>
          <el-col :span="12">
            <LineChartCard
              :isMiniChart="true"
              :value="2545"
              label="新增客户"
              date="过去7天"
              :percentage="1.2"
              :height="11"
              :chartData="[120, 132, 101, 134, 90, 230, 210]"
            />
          </el-col>
          <el-col :span="24">
            <LineChartCard
              :value="2545"
              label="购物车转化率"
              :percentage="1.2"
              :height="13.5"
              :chartData="[120, 132, 101, 134, 90, 230, 210]"
              :showAreaColor="true"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 第三行 -->
    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="8">
        <div class="card art-custom-card weekly-card" style="height: 28.2rem">
          <div class="card-header">
            <p class="title">热销商品</p>
            <p class="subtitle">本周销售排行</p>
          </div>
          <LineChart
            :showAxisLabel="false"
            :showAxisLine="false"
            :showSplitLine="false"
            :showAreaColor="true"
            :data="[8, 40, 82, 35, 90, 52, 35]"
            :xAxisData="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
            height="9rem"
          />
          <div class="content">
            <div class="item" v-for="item in weeklyList" :key="item.title">
              <div class="icon" :class="item.color">
                <i class="iconfont-sys">&#xe718;</i>
              </div>
              <div class="text">
                <p class="title">{{ item.title }}</p>
                <span class="subtitle">{{ item.subtitle }}</span>
              </div>
              <div class="value" :class="item.color">
                <span>+{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :lg="8">
        <div class="card art-custom-card yearly-card" style="height: 28.2rem">
          <div class="card-header">
            <p class="title">年度销售额</p>
            <p class="subtitle">按季度统计</p>
          </div>

          <BarChart
            :showAxisLabel="false"
            :showAxisLine="false"
            :showSplitLine="false"
            :data="[50, 80, 50, 90, 60, 70, 50]"
            height="16rem"
          />
          <div class="double-icon-widget" style="margin-top: 50px">
            <div class="item">
              <div class="icon">
                <i class="iconfont-sys">&#xe718;</i>
              </div>
              <div class="content">
                <p>¥200,858</p>
                <span>线上销售</span>
              </div>
            </div>
            <div class="item">
              <div class="icon">
                <i class="iconfont-sys">&#xe70c;</i>
              </div>
              <div class="content">
                <p>¥102,927</p>
                <span>线下销售</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="24" :lg="8">
        <DataListCard
          :maxCount="4"
          :list="dataList"
          title="最近活动"
          subtitle="订单处理状态"
          :showMoreButton="true"
          @more="handleMore"
        />
      </el-col>
    </el-row>

    <!-- 第四行 -->
    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="8">
        <TimelineListCard :list="timelineData" title="最近交易" subtitle="今日订单动态" />
      </el-col>
      <el-col :sm="24" :md="12" :lg="16">
        <div class="card art-custom-card">
          <div class="card-header">
            <p class="title">热销产品</p>
            <p class="subtitle">本月销售情况</p>
          </div>
          <ProductTable />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import bannerCover from '@imgs/login/lf_icon2.png'
  import ProductTable from './widget/ProductTable.vue'
  import { useUserStore } from '@/store/modules/user'
  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)

  const dataList = [
    {
      title: '新订单 #38291',
      status: '待处理',
      time: '5分钟',
      class: 'bg-primary',
      icon: '&#xe6f2;'
    },
    {
      title: '退款申请 #12845',
      status: '处理中',
      time: '10分钟',
      class: 'bg-secondary',
      icon: '&#xe806;'
    },
    {
      title: '客户投诉处理',
      status: '待处理',
      time: '15分钟',
      class: 'bg-warning',
      icon: '&#xe6fb;'
    },
    {
      title: '库存不足提醒',
      status: '紧急',
      time: '20分钟',
      class: 'bg-danger',
      icon: '&#xe813;'
    },
    {
      title: '订单 #29384 已发货',
      status: '已完成',
      time: '20分钟',
      class: 'bg-success',
      icon: '&#xe70c;'
    }
  ]

  const timelineData = [
    {
      time: '上午 09:30',
      status: 'rgb(73, 190, 255)',
      content: '收到订单 #38291 支付 ¥385.90'
    },
    {
      time: '上午 10:00',
      status: 'rgb(54, 158, 255)',
      content: '新商品上架',
      code: 'SKU-3467'
    },
    {
      time: '上午 12:00',
      status: 'rgb(103, 232, 207)',
      content: '向供应商支付了 ¥6495.00'
    },
    {
      time: '下午 14:30',
      status: 'rgb(255, 193, 7)',
      content: '促销活动开始',
      code: 'PROMO-2023'
    },
    {
      time: '下午 15:45',
      status: 'rgb(255, 105, 105)',
      content: '订单取消提醒',
      code: 'ORD-9876'
    },
    {
      time: '下午 17:00',
      status: 'rgb(103, 232, 207)',
      content: '完成日销售报表'
    }
  ]

  const weeklyList = [
    {
      icon: '&#xe718;',
      title: '智能手表Pro',
      subtitle: '电子产品',
      value: '1,286件',
      color: 'bg-primary'
    },
    {
      icon: '&#xe70c;',
      title: '时尚连衣裙',
      subtitle: '女装服饰',
      value: '892件',
      color: 'bg-success'
    },
    {
      icon: '&#xe813;',
      title: '厨房小家电',
      subtitle: '家居用品',
      value: '756件',
      color: 'bg-error'
    }
  ]

  const handleBannerClick = () => {}

  const handleMore = () => {}
</script>

<style lang="scss" scoped>
  .banners {
    .page-title {
      margin: 20px 0 15px;
      font-size: 22px;
      font-weight: 500;

      &:first-child {
        margin-top: 0;
      }
    }

    .card {
      box-sizing: border-box;
      padding: 20px;
      background-color: var(--art-main-bg-color);
      border-radius: var(--custom-radius);

      .card-header {
        padding-bottom: 15px;

        .title {
          font-size: 18px;
          font-weight: 500;
          color: var(--art-gray-900);
        }

        .subtitle {
          font-size: 14px;
          color: var(--art-gray-500);
        }
      }
    }

    .banner {
      .banner-slot {
        display: flex;

        .item {
          margin-right: 30px;

          .title {
            font-size: 30px;
            color: var(--art-gray-900) !important;

            span {
              margin-left: 10px;
              font-size: 14px;
            }
          }

          .subtitle {
            margin-top: 4px;
            font-size: 14px;
            color: var(--art-gray-700) !important;
          }
        }
      }
    }

    .weekly-card {
      .content {
        margin-top: 40px;

        .item {
          display: flex;
          align-items: center;
          margin-top: 20px;

          .icon {
            width: 42px;
            height: 42px;
            line-height: 42px;
            text-align: center;
            background-color: var(--el-color-primary-light-9);
            border-radius: 8px;

            i {
              font-size: 20px;
            }
          }

          .text {
            margin-left: 10px;

            .title {
              font-size: 14px;
              font-weight: 500;
              color: var(--art-gray-800);
            }

            .subtitle {
              font-size: 14px;
              color: var(--art-gray-600);
            }
          }

          .value {
            padding: 6px 12px;
            margin-left: auto;
            font-size: 14px;
            text-align: center;
            background-color: var(--el-color-primary-light-9);
            border-radius: 4px;
          }
        }
      }
    }

    .double-icon-widget {
      display: flex;
      justify-content: space-around;

      .item {
        display: flex;
        align-items: center;

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          margin-right: 10px;
          line-height: 42px;
          color: var(--main-color);
          background-color: var(--el-color-primary-light-9);
          border-radius: 8px;

          i {
            font-size: 20px;
          }
        }

        .content {
          p {
            font-size: 18px;
          }

          span {
            font-size: 14px;
          }
        }
      }
    }

    .el-col {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
