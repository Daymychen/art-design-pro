<template>
  <div class="icon-selector">
    <div class="select" @click="visible = true">
      <div class="icon">
        <i class="iconfont icons" v-html="selectValue"></i>
      </div>
      <div class="text"> 图标选择器 </div>
      <div class="arrow">
        <i class="iconfont">&#xe7e9;</i>
      </div>
    </div>

    <el-dialog title="选择图标" width="50%" v-model="visible">
      <div>
        <ul v-show="activeName === 'icons'">
          <li v-for="icon in iconsList" :key="icon" @click="selectorIcon(icon)">
            <i class="iconfont" v-html="icon"></i>
          </li>
        </ul>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="visible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { iconsList } from '@/assets/icons/icons'

  const props = defineProps({
    defaultIcon: {
      type: String,
      default: '&#xe7c6;'
    }
  })

  const emits = defineEmits(['getIcon'])

  const activeName = ref('icons')
  const visible = ref(false)
  const selectValue = ref('')

  onMounted(() => {
    initIcon()
  })

  const initIcon = () => {
    selectValue.value = props.defaultIcon
  }

  const selectorIcon = (icon: string) => {
    visible.value = false
    selectValue.value = icon
    emits('getIcon', icon)
  }
</script>

<style lang="scss" scoped>
  .icon-selector {
    .select {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 130px;
      height: 34px;
      padding: 0 8px;
      margin-bottom: 15px;
      line-height: 34px;
      cursor: pointer;
      border: 1px solid var(--art-border-dashed-color);
      border-radius: 6px;
      transition: border 0.3s;

      &:hover {
        border-color: var(--art-text-gray-400);
      }

      .icon {
        display: flex;
        align-items: center;
        color: var(--art-gray-900);

        i {
          font-size: 14px;
        }
      }

      .text {
        display: flex;
        align-items: center;
        height: calc(100% - 2px);
        font-size: 13px;
        color: var(--art-gray-700);
      }

      .arrow {
        display: flex;
        align-items: center;
        height: calc(100% - 2px);

        i {
          font-size: 13px;
          color: var(--art-gray-600);
        }
      }
    }

    ul {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      border-top: 1px solid var(--art-border-color);
      border-left: 1px solid var(--art-border-color);

      li {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        aspect-ratio: 1 / 1;
        color: var(--art-gray-600);
        text-align: center;
        border-right: 1px solid var(--art-border-color);
        border-bottom: 1px solid var(--art-border-color);

        &:hover {
          cursor: pointer;
          background: var(--art-gray-100);
        }

        i {
          font-size: 26px;
          color: #000;
        }
      }
    }
  }
</style>
