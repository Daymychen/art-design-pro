<template>
  <div class="banners">
    <h1 class="page-title">基础横幅</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12">
        <BasicBanner
          title="欢迎回来，管理员！"
          subtitle="今日系统访问量增长了23%，运行状态良好。"
          buttonText="查看详情"
          buttonColor="rgb(var(--art-secondary))"
          buttonTextColor="#fff"
          @click="handleBannerClick"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <BasicBanner
          title="欢迎使用本系统!"
          subtitle="这是一个基于Vue3和Element Plus的后台管理系统模板。"
          buttonText="开始使用"
          buttonColor="rgb(var(--art-success))"
          buttonTextColor="#fff"
          backgroundColor="#D4F1F7"
          titleColor="#333"
          subtitleColor="#666"
          @click="handleBannerClick"
        />
      </el-col>
    </el-row>

    <h1 class="page-title">基础横幅（图片）</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12">
        <BasicBanner
          title="欢迎回来，管理员！"
          subtitle="今日系统访问量增长了23%，运行状态良好。"
          buttonText="查看详情"
          buttonColor="#FF3E76"
          backgroundColor="#FF80A4"
          buttonTextColor="#fff"
          :backgroundImage="icon3"
          @click="handleBannerClick"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <BasicBanner
          title="欢迎使用本系统!"
          subtitle="这是一个基于Vue3和Element Plus的后台管理系统模板。"
          buttonText="开始使用"
          buttonColor="#1385FF"
          buttonTextColor="#fff"
          backgroundColor="#88A7FF"
          :backgroundImage="icon5"
          @click="handleBannerClick"
        />
      </el-col>
    </el-row>

    <h1 class="page-title">卡片横幅</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <CardBanner
          title="系统状态良好"
          description="所有服务运行正常，无异常情况。"
          buttonText="查看详情"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <CardBanner
          :icon="icon2"
          title="新消息提醒"
          description="您有3条未读消息需要处理。"
          buttonText="立即查看"
          buttonColor="rgb(var(--art-warning))"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <CardBanner
          :icon="icon3"
          title="数据分析报告"
          description="本周数据分析报告已生成完毕。"
          buttonText="下载报告"
          buttonColor="rgb(var(--art-error))"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <CardBanner
          :icon="icon4"
          title="系统更新提示"
          description="新版本V2.1.0已发布，建议及时更新。"
          buttonText="更新"
          buttonColor="rgb(var(--art-primary))"
          :showCancel="true"
          cancelButtonText="取消"
          cancelButtonColor="#eee"
          cancelButtonTextColor="#333"
          @click="handleConfirm"
          @cancel="handleCancel"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import icon2 from '@imgs/3d/icon2.png'
  import icon3 from '@imgs/3d/icon3.png'
  import icon4 from '@imgs/3d/icon4.png'
  import icon5 from '@imgs/3d/icon7.png'

  const handleBannerClick = () => {
    console.log('banner clicked')
  }

  const handleConfirm = () => {
    console.log('confirm clicked')
  }

  const handleCancel = () => {
    console.log('cancel clicked')
  }
</script>

<style lang="scss" scoped>
  .banners {
    padding-top: 20px;

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
