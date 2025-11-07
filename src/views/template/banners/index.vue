<template>
  <div class="pt-5">
    <h1 class="page-title">基础 & 自定义按钮+背景色</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          title="数据中心运行状态"
          subtitle="系统访问量同比增长 23%，所有服务运行稳定，数据监控正常。"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          title="欢迎使用 Art Design Pro"
          subtitle="基于 Vue 3 + TypeScript + Element Plus 构建的现代化管理系统。"
          titleColor="#333"
          subtitleColor="#666"
          boxStyle="!bg-[#D4F1F7]"
          :buttonConfig="{
            show: true,
            text: '开始探索',
            color: 'var(--art-success)',
            textColor: '#fff',
            radius: '6px'
          }"
          @buttonClick="handleBannerClick"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">自定义图片 & 使用 slot 自定义内容</h1>

    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          title="探索星空计划"
          subtitle="加入我们的天文观测活动，发现宇宙的奥秘"
          boxStyle="!bg-[#FF8AAB]"
          :buttonConfig="{
            show: true,
            text: '立即参与',
            color: '#FF5A89',
            textColor: '#fff'
          }"
          :imageConfig="{
            src: icon3
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          boxStyle="!bg-[#70B1FF]"
          :imageConfig="{
            src: icon5
          }"
        >
          <template #title>
            <h2 style="margin: 0; font-size: 1.6rem; color: #fff !important">智能组件系统</h2>
          </template>

          <template #subtitle>
            <div style="margin-top: 12px">
              <p style="position: relative; z-index: 10; font-style: italic"
                >灵活配置，强大扩展，支持自定义插槽内容</p
              >
            </div>
          </template>

          <template #button>
            <div style="margin-top: 12px">
              <ElButton type="primary" color="#04A1FF"> 查看文档 </ElButton>
            </div>
          </template>
        </ArtBasicBanner>
      </ElCol>
    </ElRow>

    <h1 class="page-title">抽象配置方案（Preset 模式）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner v-bind="PresetBanners.marketing" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner v-bind="PresetBanners.info" />
      </ElCol>
    </ElRow>

    <h1 class="page-title">卡片横幅</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          title="系统运行正常"
          description="所有核心服务运行稳定，响应时间在正常范围内。"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          :image="icon2"
          title="重要消息通知"
          description="您有 3 条待处理的重要消息，请及时查看。"
          :button="{
            show: true,
            text: '查看详情',
            color: 'var(--art-warning)',
            textColor: '#fff'
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          :image="icon3"
          title="数据分析报告"
          description="本周业务数据分析报告已完成，请查看关键指标。"
          :button="{
            show: true,
            text: '下载报告',
            color: 'var(--art-error)',
            textColor: '#fff'
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          :image="icon4"
          title="版本更新提醒"
          description="Art Design Pro v2.1.0 已发布，包含性能优化和新功能。"
          :button="{
            show: true,
            text: '立即更新',
            color: 'var(--theme-color)',
            textColor: '#fff'
          }"
          :cancelButton="{
            show: true,
            text: '稍后提醒',
            color: '#eee',
            textColor: '#333'
          }"
          @click="handleConfirm"
          @cancel="handleCancel"
        />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import icon2 from '@imgs/3d/icon2.webp'
  import icon3 from '@imgs/3d/icon3.webp'
  import icon4 from '@imgs/3d/icon4.webp'
  import icon5 from '@imgs/3d/icon7.webp'

  defineOptions({ name: 'TemplateBanners' })

  /**
   * 处理横幅点击事件
   */
  const handleBannerClick = () => {
    console.log('banner clicked')
  }

  /**
   * 处理确认按钮点击事件
   */
  const handleConfirm = () => {
    console.log('confirm clicked')
  }

  /**
   * 处理取消按钮点击事件
   */
  const handleCancel = () => {
    console.log('cancel clicked')
  }

  /**
   * 预设横幅配置
   * 提供常用的横幅样式配置，可直接通过 v-bind 使用
   */
  const PresetBanners = {
    marketing: {
      title: '限时优惠活动',
      subtitle: '精选商品 48 小时闪购，最高享受 7 折优惠，数量有限！',
      titleColor: 'var(--art-gray-900)',
      subtitleColor: 'var(--art-gray-900)',
      boxStyle: '!bg-success/15',
      meteorConfig: { enabled: true, count: 15 },
      buttonConfig: {
        show: true,
        text: '立即抢购',
        color: 'var(--art-success)',
        textColor: '#fff'
      }
    },
    info: {
      title: '服务到期提醒',
      subtitle: '您的高级服务将在 7 天后到期，请及时续费以继续享受完整功能。',
      titleColor: 'var(--art-gray-900)',
      subtitleColor: 'var(--art-gray-900)',
      boxStyle: '!bg-theme/15',
      meteorConfig: { enabled: true, count: 15 },
      buttonConfig: {
        show: true,
        text: '立即续费',
        color: 'var(--art-secondary)',
        textColor: '#fff'
      }
    }
  } as const
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .page-title {
    @apply my-5 text-xl font-medium first:mt-0;
  }
</style>
