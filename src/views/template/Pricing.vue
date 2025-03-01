<template>
  <div class="pricing-container">
    <div class="pricing-header">
      <h1 class="title">超过 53,476 位信赖的开发者</h1>
      <h2 class="subtitle">以及众多科技巨头的选择</h2>
    </div>

    <div class="pricing-cards">
      <el-row :gutter="20" justify="center">
        <el-col v-for="plan in pricingPlans" :key="plan.type" :xs="24" :sm="12" :md="6">
          <el-card class="pricing-card" :class="{ popular: plan.isPopular }" shadow="never">
            <div class="card-header">
              <h3>{{ plan.title }}</h3>
              <p class="description">{{ plan.description }}</p>
              <div class="price">
                <span class="amount">¥{{ plan.price }}</span>
                <span class="period">/一次性付款</span>
              </div>
            </div>

            <div class="features">
              <div v-for="(feature, index) in plan.features" :key="index" class="feature-item">
                <el-icon :class="feature.available ? 'available' : 'unavailable'">
                  <Check v-if="feature.available" />
                  <Close v-else />
                </el-icon>
                <span>{{ feature.text }}</span>
              </div>
            </div>

            <div class="card-footer">
              <el-button type="primary" class="purchase-btn" v-ripple>立即购买</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Check, Close } from '@element-plus/icons-vue'

  interface Feature {
    text: string
    available: boolean
  }

  interface PricingPlan {
    type: string
    title: string
    description: string
    price: number
    isPopular: boolean
    features: Feature[]
  }

  const pricingPlans = ref<PricingPlan[]>([
    {
      type: 'single',
      title: '单次使用版',
      description: '适用于单个最终产品，最终用户无需付费。',
      price: 349,
      isPopular: false,
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
      isPopular: false,
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
      isPopular: false,
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
      isPopular: false,
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

<style lang="scss" scoped>
  .pricing-container {
    padding: 5rem 1rem !important;
    background-color: transparent !important;
    border: none !important;

    .pricing-header {
      margin-bottom: 40px;
      text-align: center;

      .title {
        margin-bottom: 0.5rem;
        font-size: 2.5rem;
        font-weight: 500;
      }

      .subtitle {
        font-size: 1.4rem;
        font-weight: 400;
        color: #666;
      }
    }

    .pricing-cards {
      margin-top: 80px;

      .el-col {
        margin-bottom: 20px;
      }

      .pricing-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-radius: 10px;

        &.popular {
          position: relative;
          border: 2px solid var(--el-color-primary);

          &::after {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 2px 8px;
            font-size: 12px;
            color: var(--el-color-primary);
            content: '热门';
            background-color: var(--el-color-primary-light-9);
            border-radius: 12px;
          }
        }

        .card-header {
          margin-bottom: 20px;

          h3 {
            margin-bottom: 10px;
            font-size: 1.3rem;
            color: var(--art-text-gray-900) !important;
          }

          .description {
            display: -webkit-box;
            height: 40px;
            padding-bottom: 20px;
            margin-bottom: 20px;
            overflow: hidden;
            font-size: 14px;
            color: var(--art-text-gray-600);
            text-overflow: ellipsis;
            border-bottom: 1px solid var(--art-border-color);
            -webkit-box-orient: vertical;
          }

          .price {
            margin-top: 30px;

            .amount {
              font-size: 1.8rem;
              font-weight: 600;
            }

            .period {
              margin-left: 10px;
              font-size: 14px;
              color: var(--art-text-gray-600);
            }
          }
        }

        .features {
          flex-grow: 1;
          margin-bottom: 20px;

          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;

            .el-icon {
              margin-right: 10px;

              &.available {
                color: var(--el-color-primary);
              }

              &.unavailable {
                color: var(--el-color-danger);
              }
            }
          }
        }

        .card-footer {
          margin-top: auto;
          text-align: center;

          .purchase-btn {
            width: 100%;
            height: 40px;
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-notebook) {
    .pricing-container {
      padding: 2rem 0 !important;

      .pricing-cards {
        margin-top: 0;
      }
    }
  }

  @media only screen and (max-width: $device-phone) {
    .pricing-container {
      .pricing-header {
        .title {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1.5rem;
        }
      }

      .el-col {
        margin-bottom: 20px;
      }
    }
  }
</style>
