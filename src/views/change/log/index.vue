<template>
  <div class="page-content">
    <h3 class="table-title"><i class="iconfont-sys">&#xe74d;</i>更新日志</h3>

    <!-- 桌面端表格显示 -->
    <div class="desktop-view">
      <ArtTable :data="upgradeLogList">
        <ElTableColumn label="版本号" prop="version" width="100" />
        <ElTableColumn label="内容">
          <template #default="scope">
            <div class="title">{{ scope.row.title }}</div>
            <div v-if="scope.row.detail" style="margin-top: 10px">
              <div class="detail-item" v-for="(item, index) in scope.row.detail" :key="index">
                {{ index + 1 }}. {{ item }}
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="时间" prop="date" width="150" />
        <ElTableColumn label="备注" prop="remark" width="260" />
      </ArtTable>
    </div>

    <!-- 移动端卡片显示 -->
    <div class="mobile-view">
      <div class="changelog-cards">
        <div v-for="item in upgradeLogList" :key="item.version" class="changelog-card">
          <div class="card-header">
            <div class="version-tag">{{ item.version }}</div>
            <div class="date">{{ item.date }}</div>
          </div>

          <div class="card-content">
            <h4 class="title">{{ item.title }}</h4>

            <div v-if="item.detail && item.detail.length > 0" class="details">
              <div class="detail-list">
                <div v-for="(detail, index) in item.detail" :key="index" class="detail-item">
                  <span class="detail-number">{{ index + 1 }}.</span>
                  <span class="detail-text">{{ detail }}</span>
                </div>
              </div>
            </div>

            <div v-if="item.remark" class="remark">
              {{ item.remark }}
            </div>

            <div v-if="item.requireReLogin" class="require-relogin">
              <ElTag type="warning" size="small"> 需要重新登录 </ElTag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { upgradeLogList } from '@/mock/upgrade/changeLog'

  defineOptions({ name: 'ChangeLog' })
</script>

<style lang="scss" scoped>
  .page-content {
    .table-title {
      display: flex;
      align-items: center;
      padding: 10px 0 0;
      font-size: 18px;
      font-weight: 500;

      i {
        margin-right: 10px;
        font-size: 24px;
      }
    }

    .title {
      color: var(--art-gray-800);
    }

    .detail-item {
      color: var(--art-gray-600);
    }

    // 桌面端显示
    .desktop-view {
      display: block;
    }

    // 移动端样式
    .mobile-view {
      display: none;

      .changelog-cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 20px;
      }

      .changelog-card {
        padding: 16px;
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color-light);
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .card-header {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        .version-tag {
          min-width: fit-content;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          background: linear-gradient(
            135deg,
            var(--el-color-primary),
            var(--el-color-primary-light-3)
          );
          border-radius: 20px;
        }

        .date {
          min-width: fit-content;
          font-size: 13px;
          color: var(--art-gray-600);
        }
      }

      .card-content {
        .title {
          margin-bottom: 12px;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
          color: var(--art-gray-800);
        }

        .details {
          margin-bottom: 12px;

          .detail-list {
            padding: 12px;
            background: rgba(var(--art-gray-200-rgb), 0.6);
            border-radius: 6px;
          }

          .detail-item {
            display: flex;
            margin-bottom: 8px;
            font-size: 13px;
            line-height: 1.6;
            color: var(--art-gray-600);

            &:last-child {
              margin-bottom: 0;
            }

            .detail-number {
              min-width: 20px;
            }

            .detail-text {
              flex: 1;
              word-break: break-word;
            }
          }
        }

        .remark {
          padding: 8px;
          margin-bottom: 12px;
          font-size: 12px;
          color: var(--art-gray-600);
          background: rgba(var(--art-gray-200-rgb), 0.6);
          border-radius: 4px;
        }

        .remark,
        .require-relogin {
          margin-top: 12px;

          :deep(.el-tag) {
            font-size: 12px;
            border-radius: 6px;

            i {
              margin-right: 4px;
            }
          }
        }
      }
    }

    // 移动端媒体查询
    @media (width <= 768px) {
      .desktop-view {
        display: none;
      }

      .mobile-view {
        display: block;
      }

      .table-title {
        padding: 8px 0 0;
        font-size: 16px;

        i {
          font-size: 20px;
        }
      }
    }

    // 平板端优化
    @media (width <= 1024px) and (width >= 769px) {
      .changelog-card {
        .card-header {
          .version-tag {
            padding: 6px 14px;
            font-size: 13px;
          }

          .date {
            font-size: 14px;
          }
        }

        .card-content .title {
          font-size: 16px;
        }
      }
    }
  }
</style>
