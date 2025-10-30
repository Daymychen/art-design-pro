<template>
  <div class="pt-24 px-20 max-notebook:!pt-20 max-notebook:!px-8 bg-transparent !border-none">
    <div class="mb-10 text-center">
      <h1 class="mb-2 text-4xl font-medium max-phone:text-3xl">超过 53,476 位信赖的开发者</h1>
      <h2 class="mb-2.5 text-2xl font-normal text-g-600 max-phone:text-2xl">
        以及众多科技巨头的选择
      </h2>
      <div class="gap-2 flex-cc mt-2.5 max-phone:mt-3.5">
        <p class="text-sm italic text-g-600 max-phone:text-sm">
          本项目基于 MIT 协议开源免费，当前页面为定价模板，仅作演示用途
        </p>
        <ElTag type="success" size="large" round>免费商用</ElTag>
      </div>
    </div>

    <div class="mt-20 max-notebook:mt-0">
      <ElRow :gutter="20" justify="center">
        <ElCol v-for="plan in pricingPlans" :key="plan.type" :xs="24" :sm="12" :md="6" class="mb-5">
          <ElCard class="flex flex-col h-full rounded-xl" shadow="never">
            <div class="mb-5">
              <h3 class="mb-2.5 text-xl font-medium">{{ plan.title }}</h3>
              <p
                class="h-10 pb-5 mb-5 overflow-hidden text-sm text-g-600 text-ellipsis border-b border-g-300/80 line-clamp-2"
              >
                {{ plan.description }}
              </p>
              <div class="mt-7.5">
                <span class="text-3xl font-medium">¥{{ plan.price }}</span>
                <span class="ml-2.5 text-sm text-g-600">/一次性付款</span>
              </div>
            </div>

            <div class="flex-grow mb-5">
              <div
                v-for="(feature, index) in plan.features"
                :key="index"
                class="flex-c mb-2.5 text-sm"
              >
                <ElIcon class="mr-2.5" :class="feature.available ? '!text-theme' : '!text-danger'">
                  <Check v-if="feature.available" />
                  <Close v-else />
                </ElIcon>
                <span>{{ feature.text }}</span>
              </div>
            </div>

            <div class="mt-auto text-center">
              <ElButton type="primary" class="w-full h-10" v-ripple>立即购买</ElButton>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Check, Close } from '@element-plus/icons-vue'

  defineOptions({ name: 'Pricing' })

  interface Feature {
    text: string
    available: boolean
  }

  interface PricingPlan {
    type: string
    title: string
    description: string
    price: number
    features: Feature[]
  }

  const pricingPlans = ref<PricingPlan[]>([
    {
      type: 'single',
      title: '单次使用版',
      description: '适用于单个最终产品，最终用户无需付费。',
      price: 349,
      features: [
        { text: '完整源代码', available: true },
        { text: '技术文档', available: true },
        { text: 'SaaS应用授权', available: false },
        { text: '单个项目使用', available: true },
        { text: '一年技术支持', available: true },
        { text: '一年免费更新', available: true }
      ]
    },
    {
      type: 'multiple',
      title: '多次使用版',
      description: '适用于无限个最终产品，最终用户无需付费。',
      price: 629,
      features: [
        { text: '完整源代码', available: true },
        { text: '技术文档', available: true },
        { text: 'SaaS应用授权', available: false },
        { text: '无限项目使用', available: true },
        { text: '一年技术支持', available: true },
        { text: '一年免费更新', available: true }
      ]
    },
    {
      type: 'extended',
      title: '扩展授权版',
      description: '适用于单个最终产品，最终用户需要付费。',
      price: 2099,
      features: [
        { text: '完整源代码', available: true },
        { text: '技术文档', available: true },
        { text: 'SaaS应用授权', available: true },
        { text: '单个项目使用', available: true },
        { text: '一年技术支持', available: true },
        { text: '一年免费更新', available: true }
      ]
    },
    {
      type: 'unlimited',
      title: '无限授权版',
      description: '适用于无限个最终产品，最终用户需要付费。',
      price: 3499,
      features: [
        { text: '完整源代码', available: true },
        { text: '技术文档', available: true },
        { text: 'SaaS应用授权', available: true },
        { text: '无限项目使用', available: true },
        { text: '一年技术支持', available: true },
        { text: '一年免费更新', available: true }
      ]
    }
  ])
</script>
