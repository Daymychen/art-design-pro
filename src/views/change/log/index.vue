<!-- 更新日志页面 -->
<template>
  <div class="mx-auto pt-5">
    <!-- 标题 -->
    <h3 class="text-2xl font-medium text-g-900 mb-8">更新日志</h3>

    <!-- 日志列表 -->
    <div class="space-y-6">
      <div
        v-for="item in upgradeLogList"
        :key="item.version"
        class="border border-g-300 bg-box rounded-lg p-6 hover:shadow-md transition-shadow max-md:p-4"
      >
        <!-- 版本和日期 -->
        <div class="flex-cb gap-3 mb-4 flex-wrap">
          <span class="px-3 py-1 bg-theme/10 text-theme text-sm font-medium rounded-full">
            {{ item.version }}
          </span>
          <span class="text-sm text-g-500">{{ item.date }}</span>
        </div>

        <!-- 标题 -->
        <h4 class="text-lg font-medium text-g-900 mb-3">{{ item.title }}</h4>

        <!-- 详情列表 -->
        <ul v-if="item.detail?.length" class="space-y-2 mb-4">
          <li
            v-for="(detail, index) in item.detail"
            :key="index"
            class="flex-c gap-2 text-sm text-g-600"
          >
            <span class="mt-0.5">•</span>
            <span class="text-g-700">{{ detail }}</span>
          </li>
        </ul>

        <!-- 备注 -->
        <div v-if="item.remark" class="text-sm text-g-800 bg-g-300/60 rounded p-3 mb-3">
          {{ item.remark }}
        </div>

        <!-- 标签 -->
        <ElTag v-if="item.requireReLogin" type="warning" size="small">需要重新登录</ElTag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { upgradeLogList } from '@/mock/upgrade/changeLog'

  defineOptions({ name: 'ChangeLog' })
</script>
