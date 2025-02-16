<template>
  <div class="page-content">
    <div class="form">
      <el-select v-model="iconType" placeholder="Select" size="large" style="width: 240px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="colors-icon">
        <el-checkbox v-model="isColorsIcon" label="彩色图标" size="large" />
      </div>
    </div>
    <div class="list">
      <ul class="icon-list">
        <li v-for="icon in systemIconClasses" :key="icon.className" @click="copyIcon(icon)">
          <i
            class="iconfont-sys"
            v-if="iconType === 'unicode'"
            v-html="icon.unicode"
            :style="getIconStyle()"
          ></i>
          <i :class="`iconfont-sys ${icon.className}`" v-else :style="getIconStyle()"></i>
          <span>{{ iconType === 'unicode' ? icon.unicode : icon.className }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { extractIconClasses, IconfontType } from '@/utils/iconfont'
  import { ElMessage } from 'element-plus'

  const iconType = ref('unicode')
  const options = [
    {
      value: 'unicode',
      label: 'Unicode'
    },
    {
      value: 'fontClass',
      label: 'Font class'
    }
  ]
  const systemIconClasses = ref<IconfontType[]>([])

  const isColorsIcon = ref(false)

  onMounted(() => {
    systemIconClasses.value = extractIconClasses()
  })

  const copyIcon = (text: IconfontType) => {
    if (!text) return

    let copyipt = document.createElement('input')
    copyipt.setAttribute(
      'value',
      (iconType.value === 'unicode' ? text.unicode : text.className) || ''
    )
    document.body.appendChild(copyipt)
    copyipt.select()
    document.execCommand('copy')
    document.body.removeChild(copyipt)

    ElMessage.success(`已复制`)
  }

  const getRandomColor = () => {
    const colors = ['#2d8cf0', '#19be6b', '#ff9900', '#f24965', '#9463f7']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const getIconStyle = () => {
    return isColorsIcon.value ? { color: getRandomColor() } : { color: 'var(--art-text-gray-700)' }
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;

    $border-color: #eee;

    .form {
      display: flex;
      align-items: center;

      .colors-icon {
        box-sizing: border-box;
        height: 40px;
        padding: 0 30px;
        margin-left: 10px;
        border: 1px solid var(--art-border-dashed-color);
        border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
      }
    }

    .list {
      margin-top: 20px;

      .icon-list {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        width: calc(100% + 16px);

        li {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          aspect-ratio: 1 / 1;
          padding: 0 8px;
          margin: 0 16px 16px 0;
          overflow: hidden;
          color: rgba(#fff, 0.8);
          text-align: center;
          border: 1px solid rgb(var(--art-gray-300-rgb), 0.8);
          border-radius: 12px !important;

          &:hover {
            cursor: pointer;
            background: var(--art-gray-100);
          }

          i {
            font-size: 26px;
            transition: color 0.3s ease;
          }

          span {
            display: block;
            margin-top: 10px;
            font-size: 12px;
            color: var(--art-text-gray-600);
          }
        }
      }
    }
  }

  @media screen and (max-width: $device-notebook) {
    .page-content {
      .list {
        .icon-list {
          grid-template-columns: repeat(8, 1fr);
        }
      }
    }
  }

  @media screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .list {
        .icon-list {
          grid-template-columns: repeat(5, 1fr);
        }
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .page-content {
      .list {
        .icon-list {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }
</style>
