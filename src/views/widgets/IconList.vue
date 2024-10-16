<template>
  <div class="page-content">
    <div class="el-tabs-content">
      <ul class="icon-list" v-show="activeName === 'icons'">
        <li v-for="icon in iconsList" :key="icon" @click="copyIcon(icon)">
          <i class="iconfont" v-html="icon"></i>
          <span>{{ icon }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { iconsList } from '@/assets/icons/icons'
  import { ElMessage } from 'element-plus'

  let activeName = 'icons'

  const copyIcon = (text: string) => {
    let copyipt = document.createElement('input')
    copyipt.setAttribute('value', text)
    document.body.appendChild(copyipt)
    copyipt.select()
    document.execCommand('copy')
    document.body.removeChild(copyipt)

    ElMessage.success(`已复制`)
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;

    $border-color: #eee;

    .el-tabs-content {
      .icon-list {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        border-top: 1px solid var(--art-border-color);
        border-left: 1px solid var(--art-border-color);

        li {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          aspect-ratio: 1 / 1;
          color: rgba(#fff, 0.8);
          text-align: center;
          border-right: 1px solid var(--art-border-color);
          border-bottom: 1px solid var(--art-border-color);

          &:hover {
            cursor: pointer;
            background: rgba($color: #2d8cf0, $alpha: 5%);
          }

          i {
            font-size: 26px;
            color: #333;
          }

          span {
            display: block;
            margin-top: 10px;
            font-size: 12px;
            color: #777;
          }
        }
      }
    }
  }

  @media screen and (max-width: $device-notebook) {
    .page-content {
      .el-tabs-content {
        .icon-list {
          grid-template-columns: repeat(8, 1fr);
        }
      }
    }
  }

  @media screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .el-tabs-content {
        .icon-list {
          grid-template-columns: repeat(5, 1fr);
        }
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .page-content {
      .el-tabs-content {
        .icon-list {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }
</style>
