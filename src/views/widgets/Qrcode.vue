<template>
  <div class="page-content">
    <el-row :gutter="20">
      <el-col :span="6" v-for="preset in qrcodePresets" :key="preset.title">
        <el-card class="qrcode-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>{{ preset.title }}</span>
            </div>
          </template>

          <div class="qrcode-preview">
            <qrcode-vue :value="qrValue" v-bind="preset.config" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue'
  import { ref, reactive, watch } from 'vue'
  import type { Level, RenderAs, ImageSettings } from 'qrcode.vue'

  // 二维码内容
  const qrValue = ref('https://www.lingchen.kim')
  const isShowLogo = ref(false)

  // 预设二维码样式配置
  const qrcodePresets = [
    {
      title: '渲染成 img 标签',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'canvas' as RenderAs,
        margin: 0,
        background: '#ffffff',
        foreground: '#000000'
      }
    },
    {
      title: '渲染成 canvas 标签',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'canvas' as RenderAs,
        margin: 0,
        background: '#ffffff',
        foreground: '#000000'
      }
    },
    {
      title: '自定义颜色',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'canvas' as RenderAs,
        margin: 0,
        background: '#f0f0f0',
        foreground: '#4080ff'
      }
    },
    {
      title: '带有Logo',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'canvas' as RenderAs,
        margin: 0,
        background: '#ffffff',
        foreground: '#000000',
        imageSettings: {
          src: 'https://www.lingchen.kim/art-design-pro/assets/avatar-DJIoI-3F.png',
          width: 40,
          height: 40,
          excavate: true
        }
      }
    }
  ]

  // 二维码配置
  const qrcodeConfig = reactive({
    size: 160,
    level: 'H' as Level,
    renderAs: 'canvas' as RenderAs,
    margin: 0,
    background: '#ffffff',
    foreground: '#000000',
    imageSettings: {
      src: 'https://www.lingchen.kim/art-design-pro/assets/avatar-DJIoI-3F.png',
      width: 40,
      height: 40,
      excavate: true
    } as ImageSettings
  })

  // 监听是否显示 logo
  watch(isShowLogo, (val) => {
    if (!val) {
      qrcodeConfig.imageSettings = {} as ImageSettings
    } else {
      qrcodeConfig.imageSettings = {
        src: 'https://www.lingchen.kim/art-design-pro/assets/avatar-DJIoI-3F.png',
        width: 40,
        height: 40,
        excavate: true
      }
    }
  })
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;

    .qrcode-card {
      margin-bottom: 20px;

      .card-header {
        font-size: 16px;
        font-weight: bold;
      }

      .qrcode-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-radius: 4px;
      }
    }
  }
</style>
