<template>
  <div class="vxe-table-demo-container">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>VXE Table 基础示例</span>
        </div>
      </template>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-space wrap>
          <el-button type="primary" @click="insertEvent">新增</el-button>
          <el-button type="danger" @click="removeSelectEvent">删除选中</el-button>
          <el-button @click="getSelectEvent">获取选中</el-button>
        </el-space>
      </div>

      <!-- VXE Table -->
      <vxe-table
        ref="xTable"
        border
        show-overflow
        keep-source
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'row' }"
        :column-config="{ resizable: true }"
        :row-config="{ isHover: true }"
        :checkbox-config="{ checkField: 'checked', highlight: true }"
        class="my-table"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" width="60" title="序号"></vxe-column>
        <vxe-column field="name" title="姓名" :edit-render="{ name: 'input' }"></vxe-column>
        <vxe-column field="role" title="角色" :edit-render="{ name: 'input' }"></vxe-column>
        <vxe-column field="email" title="邮箱" :edit-render="{ name: 'input' }"></vxe-column>
        <vxe-column
          field="age"
          title="年龄"
          width="100"
          :edit-render="{ name: '$input', props: { type: 'number' } }"
        ></vxe-column>
        <vxe-column field="address" title="地址" :edit-render="{ name: 'input' }"></vxe-column>
        <vxe-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="editEvent(row)"> 编辑 </el-button>
            <el-button link type="danger" size="small" @click="removeEvent(row)"> 删除 </el-button>
          </template>
        </vxe-column>
      </vxe-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <vxe-pager
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          :total="page.total"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange"
        >
        </vxe-pager>
      </div>
    </el-card>

    <!-- 高级功能示例 -->
    <el-card class="box-card mt-4" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>VXE Table 高级功能</span>
        </div>
      </template>

      <div class="toolbar">
        <el-space wrap>
          <el-button @click="exportDataEvent">导出数据</el-button>
          <el-button @click="printEvent">打印</el-button>
        </el-space>
      </div>

      <vxe-table
        ref="xTable2"
        border
        resizable
        show-overflow
        highlight-hover-row
        :data="advancedTableData"
        :print-config="{}"
        :export-config="{}"
        :sort-config="{ trigger: 'cell', multiple: true }"
        :filter-config="{ remote: false }"
      >
        <vxe-column type="seq" width="60" title="序号"></vxe-column>
        <vxe-column field="name" title="名称" sortable></vxe-column>
        <vxe-column
          field="category"
          title="分类"
          :filters="categoryFilters"
          :filter-multiple="false"
        ></vxe-column>
        <vxe-column field="price" title="价格" sortable>
          <template #default="{ row }">
            <span class="price-text">¥{{ row.price }}</span>
          </template>
        </vxe-column>
        <vxe-column field="stock" title="库存" sortable>
          <template #default="{ row }">
            <el-tag :type="row.stock > 50 ? 'success' : row.stock > 20 ? 'warning' : 'danger'">
              {{ row.stock }}
            </el-tag>
          </template>
        </vxe-column>
        <vxe-column field="status" title="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '在售' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" sortable></vxe-column>
      </vxe-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { VxeTableInstance } from 'vxe-table'

  // 表格实例
  const xTable = ref<VxeTableInstance>()
  const xTable2 = ref<VxeTableInstance>()

  // 基础表格数据
  const tableData = ref([
    {
      id: 10001,
      name: '张三',
      role: '开发工程师',
      email: 'zhangsan@example.com',
      age: 28,
      address: '北京市海淀区',
      checked: false
    },
    {
      id: 10002,
      name: '李四',
      role: '产品经理',
      email: 'lisi@example.com',
      age: 30,
      address: '上海市浦东新区',
      checked: false
    },
    {
      id: 10003,
      name: '王五',
      role: 'UI设计师',
      email: 'wangwu@example.com',
      age: 26,
      address: '深圳市南山区',
      checked: false
    },
    {
      id: 10004,
      name: '赵六',
      role: '测试工程师',
      email: 'zhaoliu@example.com',
      age: 27,
      address: '广州市天河区',
      checked: false
    },
    {
      id: 10005,
      name: '孙七',
      role: '运维工程师',
      email: 'sunqi@example.com',
      age: 29,
      address: '杭州市西湖区',
      checked: false
    }
  ])

  // 分页配置
  const page = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 50
  })

  // 高级表格数据
  const advancedTableData = ref([
    {
      id: 1,
      name: '苹果手机',
      category: '电子产品',
      price: 5999,
      stock: 120,
      status: '在售',
      createTime: '2024-01-15'
    },
    {
      id: 2,
      name: '华为笔记本',
      category: '电子产品',
      price: 6999,
      stock: 80,
      status: '在售',
      createTime: '2024-01-16'
    },
    {
      id: 3,
      name: '小米电视',
      category: '家用电器',
      price: 3999,
      stock: 50,
      status: '在售',
      createTime: '2024-01-17'
    },
    {
      id: 4,
      name: '耐克运动鞋',
      category: '服饰',
      price: 899,
      stock: 200,
      status: '在售',
      createTime: '2024-01-18'
    },
    {
      id: 5,
      name: '阿迪达斯外套',
      category: '服饰',
      price: 699,
      stock: 15,
      status: '在售',
      createTime: '2024-01-19'
    },
    {
      id: 6,
      name: '戴尔显示器',
      category: '电子产品',
      price: 1599,
      stock: 35,
      status: '在售',
      createTime: '2024-01-20'
    },
    {
      id: 7,
      name: '罗技鼠标',
      category: '电子产品',
      price: 199,
      stock: 300,
      status: '在售',
      createTime: '2024-01-21'
    },
    {
      id: 8,
      name: '美的空调',
      category: '家用电器',
      price: 2999,
      stock: 45,
      status: '在售',
      createTime: '2024-01-22'
    }
  ])

  // 分类筛选器
  const categoryFilters = [
    { label: '电子产品', value: '电子产品' },
    { label: '家用电器', value: '家用电器' },
    { label: '服饰', value: '服饰' }
  ]

  // 新增
  const insertEvent = async () => {
    const $table = xTable.value
    if ($table) {
      const { row: newRow } = await $table.insertAt(
        {
          name: '',
          role: '',
          email: '',
          age: 0,
          address: ''
        },
        0
      )
      await $table.setEditRow(newRow)
      ElMessage.success('已添加一行，请编辑')
    }
  }

  // 删除选中
  const removeSelectEvent = () => {
    const $table = xTable.value
    if ($table) {
      const selectRecords = $table.getCheckboxRecords()
      if (selectRecords.length) {
        $table.removeCheckboxRow()
        ElMessage.success(`成功删除 ${selectRecords.length} 条数据`)
      } else {
        ElMessage.warning('请至少选择一条数据')
      }
    }
  }

  // 获取选中
  const getSelectEvent = () => {
    const $table = xTable.value
    if ($table) {
      const selectRecords = $table.getCheckboxRecords()
      if (selectRecords.length) {
        ElMessage.info(`已选中 ${selectRecords.length} 条数据，请查看控制台`)
        console.log('选中的数据：', selectRecords)
      } else {
        ElMessage.warning('请至少选择一条数据')
      }
    }
  }

  // 编辑
  const editEvent = (row: any) => {
    const $table = xTable.value
    if ($table) {
      $table.setEditRow(row)
      ElMessage.success('进入编辑状态，点击表格外部完成编辑')
    }
  }

  // 删除
  const removeEvent = (row: any) => {
    const $table = xTable.value
    if ($table) {
      $table.remove(row)
      ElMessage.success('删除成功')
    }
  }

  // 分页切换
  const handlePageChange = ({ currentPage, pageSize }: any) => {
    page.currentPage = currentPage
    page.pageSize = pageSize
    ElMessage.info(`切换到第 ${currentPage} 页，每页 ${pageSize} 条`)
    // 这里可以调用接口获取数据
  }

  // 导出数据
  const exportDataEvent = () => {
    const $table = xTable2.value
    if ($table) {
      $table.exportData({ type: 'csv' })
    }
  }

  // 打印
  const printEvent = () => {
    const $table = xTable2.value
    if ($table) {
      $table.print()
    }
  }
</script>

<style scoped lang="scss">
  .vxe-table-demo-container {
    padding: 20px;

    .box-card {
      margin-bottom: 20px;

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        font-weight: bold;
      }
    }

    .toolbar {
      margin-bottom: 16px;
    }

    .my-table {
      margin-top: 10px;
    }

    .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .price-text {
      font-weight: bold;
      color: #f56c6c;
    }

    .mt-4 {
      margin-top: 20px;
    }
  }
</style>
