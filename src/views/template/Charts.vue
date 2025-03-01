<template>
  <div class="charts">
    <h1 class="page-title">图表</h1>

    <el-row :gutter="20">
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>柱状图</span>
          </div>
          <BarChart
            :data="[50, 80, 120, 90, 60, 70, 100]"
            :xAxisData="['一月', '二月', '三月', '四月', '五月', '六月', '七月']"
          />
        </div>
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>折线图</span>
          </div>
          <LineChart
            :data="[58, 15, 82, 35, 90, 82, 85]"
            :xAxisData="['一月', '二月', '三月', '四月', '五月', '六月', '七月']"
          />
        </div>
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>折线图（渐变背景）</span>
          </div>
          <LineChart
            :data="[58, 15, 82, 35, 90, 82, 85]"
            :xAxisData="['一月', '二月', '三月', '四月', '五月', '六月', '七月']"
            :showAreaColor="true"
          />
        </div>
      </el-col>

      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>散点图</span>
          </div>
          <ScatterChart
            :data="[
              { value: [1, 3] },
              { value: [2, 4] },
              { value: [3, 5] },
              { value: [4, 6] },
              { value: [5, 7] },
              { value: [6, 8] },
              { value: [7, 7] },
              { value: [8, 9] },
              { value: [9, 8] },
              { value: [10, 6] },
              { value: [11, 7] },
              { value: [12, 8] }
            ]"
            width="100%"
          />
        </div>
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>环形图</span>
          </div>
          <RingChart
            :data="[
              { value: 30, name: '分类A' },
              { value: 25, name: '分类B' },
              { value: 45, name: '分类C' }
            ]"
            :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
          ></RingChart>
        </div>
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>饼图</span>
          </div>
          <RingChart
            :data="[
              { value: 30, name: '分类A' },
              { value: 25, name: '分类B' },
              { value: 45, name: '分类C' }
            ]"
            :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
            :radius="['0%', '80%']"
          ></RingChart>
        </div>
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>k线图</span>
          </div>
          <KLineChart
            :data="[
              { time: '2024-01-01', open: 20, close: 23, high: 25, low: 18 },
              { time: '2024-01-02', open: 23, close: 21, high: 24, low: 20 },
              { time: '2024-01-03', open: 21, close: 25, high: 26, low: 21 }
            ]"
          />
        </div>
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>雷达图</span>
          </div>
          <RadarChart
            :indicator="[
              { name: '销售', max: 100 },
              { name: '管理', max: 100 },
              { name: '技术', max: 100 },
              { name: '客服', max: 100 },
              { name: '开发', max: 100 }
            ]"
            :data="[
              {
                name: '预算分配',
                value: [80, 70, 90, 85, 75]
              },
              {
                name: '实际开销',
                value: [70, 75, 85, 80, 70]
              }
            ]"
            :colors="['#8BD8FC', '#409EFF']"
          />
        </div>
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>柱状图（水平）</span>
          </div>
          <HBarChart
            :data="[50, 80, 120, 90, 60]"
            :xAxisData="['产品A', '产品B', '产品C', '产品D', '产品E']"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .charts {
    padding-top: 20px;

    .page-title {
      margin: 20px 0 15px;
      font-size: 22px;
      font-weight: 500;

      &:first-child {
        margin-top: 0;
      }
    }

    .card {
      padding: 20px;
      background-color: var(--art-main-bg-color);
      border-radius: var(--custom-radius);

      .card-header {
        padding-bottom: 15px;

        span {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
</style>
