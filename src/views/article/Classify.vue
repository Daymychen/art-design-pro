<template>
  <div class="page-content article-list">
    <el-row>
      <el-col :span="10">
        <el-button v-auth="'add'" style="width: 100px" plain @click="openAdd">新增</el-button>
      </el-col>
    </el-row>

    <div class="list">
      <el-table :data="dataList" style="width: 100%" :table-layout="tableLayout">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="count" label="数量" />
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button
              v-auth="'edit'"
              size="small"
              type="primary"
              plain
              @click="openEdit(scope.$index)"
            >
              编辑
            </el-button>
            <el-button v-auth="'delete'" size="small" type="danger" plain @click="openConfirm()">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="editFormVisible" align-center :title="dialogName" width="500">
      <el-form :model="form">
        <el-form-item label="分类名称：">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editFormVisible = false"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  // import { ArticleService } from '@/api/articleApi'
  import { ArticleCategoryType } from '@/api/model/articleModel'
  import { ApiStatus } from '@/utils/http/status'
  import { ElMessage, ElMessageBox, TableInstance } from 'element-plus'

  const tableLayout = ref<TableInstance['tableLayout']>('fixed')

  const dataList = ref<ArticleCategoryType[]>([])
  import axios from 'axios'

  onMounted(() => {
    getList()
  })

  const getList = async () => {
    try {
      const response = await axios.get('https://www.qiniu.lingchen.kim/classify.json')
      if (response.data.code === ApiStatus.success) {
        dataList.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching JSON data:', error)
    }

    // try {
    //   const res = await ArticleService.getArticleTypes({})
    //   if (res.code === ApiStatus.success) {
    //     dataList.value = res.data
    //   }
    // } catch (err) { }
  }

  const editFormVisible = ref(false)
  const dialogName = ref('')

  const form = reactive({
    name: ''
  })

  const openAdd = () => {
    dialogName.value = '新增'
    editFormVisible.value = true
  }
  const openEdit = (index: number) => {
    dialogName.value = '编辑'
    editFormVisible.value = true
    console.log(index)
  }

  const openConfirm = () => {
    ElMessageBox.confirm('确定要删除吗?', '提示').then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
  }
</script>

<style lang="scss" scoped>
  .article-list {
    .list {
      margin-top: 10px;

      .el-table {
        :deep(tr) {
          height: 70px !important;
        }
      }
    }
  }
</style>
