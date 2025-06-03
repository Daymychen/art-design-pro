<template>
  <div class="page-content">
    <div class="header">
      <h3>网站设置</h3>
    </div>

    <el-form label-width="95px" style="margin-top: 20px">
      <el-form-item label="网站名称：">
        <el-input v-model="sys.name" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="网站域名：">
        <el-input v-model="sys.website" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="缓存时间：">
        <el-input v-model="sys.keepAliveTime" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="图片大小：">
        <el-input v-model="sys.pictureSize" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="图片格式：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox value=".jpg" :disabled="!isEdit" />
          <el-checkbox value=".png" :disabled="!isEdit" />
          <el-checkbox value=".jpeg" :disabled="!isEdit" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="视频格式：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox value=".mp4" :disabled="!isEdit" />
          <el-checkbox value=".rm" :disabled="!isEdit" />
          <el-checkbox value=".rmvb" :disabled="!isEdit" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="附件格式：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox value=".doc" :disabled="!isEdit" />
          <el-checkbox value=".docx" :disabled="!isEdit" />
          <el-checkbox value=".xls" :disabled="!isEdit" />
          <el-checkbox value=".xlsx" :disabled="!isEdit" />
          <el-checkbox value=".pdf" :disabled="!isEdit" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 90px" v-ripple @click="edit">
          {{ isEdit ? '保存' : '编辑' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { WEB_LINKS } from '@/utils/links'

  const sys = reactive({
    name: AppConfig.systemInfo.name,
    website: WEB_LINKS.BLOG,
    keepAliveTime: '10',
    pictureSize: '10'
  })
  const checkList = reactive(['.jpg', '.png', '.mp4', '.rm', '.doc', '.docx', '.xls'])
  const isEdit = ref(false)

  const edit = () => {
    isEdit.value = !isEdit.value
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;

    .header {
      padding-bottom: 15px;
      border-bottom: 1px solid var(--art-border-color);

      h3 {
        font-size: 18px;
        font-weight: 500;
      }
    }

    :deep(.el-form) {
      .el-form-item {
        max-width: 700px;
      }
    }
  }
</style>
