<template>
  <div class="icon-selector">
    <div class="select" @click="visible = true" :style="{ width: props.width }">
      <div class="icon">
        <i
          :class="`iconfont-sys ${selectValue}`"
          v-show="props.iconType === IconTypeEnum.CLASS_NAME"
        ></i>
        <i
          class="iconfont-sys"
          v-html="selectValue"
          v-show="props.iconType === IconTypeEnum.UNICODE"
        ></i>
      </div>
      <div class="text"> {{ selectValue || props.text }} </div>
      <div class="arrow">
        <i class="iconfont-sys">&#xe709;</i>
      </div>
    </div>

    <el-dialog title="选择图标" width="40%" v-model="visible" align-center>
      <el-scrollbar height="400px">
        <ul v-show="activeName === 'icons'">
          <li v-for="icon in iconsList" :key="icon.className" @click="selectorIcon(icon)">
            <i
              :class="`iconfont-sys ${icon.className}`"
              v-show="iconType === IconTypeEnum.CLASS_NAME"
            ></i>
            <i
              class="iconfont-sys"
              v-html="icon.unicode"
              v-show="iconType === IconTypeEnum.UNICODE"
            ></i>
          </li>
        </ul>
      </el-scrollbar>

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
  import { IconTypeEnum } from '@/enums/appEnum'
  import { extractIconClasses } from '@/utils/iconfont'

  const emits = defineEmits(['getIcon'])

  const iconsList = extractIconClasses()

  const props = defineProps({
    iconType: {
      type: String as PropType<IconTypeEnum>,
      default: IconTypeEnum.CLASS_NAME
    },
    defaultIcon: {
      type: String,
      default: '&#xe7c6;'
    },
    text: {
      type: String,
      default: '图标选择器'
    },
    width: {
      type: String,
      default: '200px'
    }
  })

  watch(
    () => props.defaultIcon,
    (newVal) => {
      selectValue.value = newVal
    }
  )

  const activeName = ref('icons')
  const visible = ref(false)
  const selectValue = ref('')

  const selectorIcon = (icon: any) => {
    if (props.iconType === IconTypeEnum.CLASS_NAME) {
      selectValue.value = icon.className
    } else {
      selectValue.value = icon.unicode
    }
    visible.value = false
    emits('getIcon', selectValue.value)
  }
</script>

<style lang="scss" scoped>
  .icon-selector {
    .select {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 0 15px;
      margin-bottom: 15px;
      line-height: 40px;
      cursor: pointer;
      border: 1px solid var(--art-border-dashed-color);
      border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
      transition: border 0.3s;

      &:hover {
        border-color: var(--art-text-gray-400);
      }

      .icon {
        display: flex;
        align-items: center;
        width: 20px;
        color: var(--art-gray-700);

        i {
          display: block;
          margin: 0 auto;
          font-size: 16px;
        }
      }

      .text {
        display: flex;
        display: inline-block;
        align-items: center;
        width: 50%;
        font-size: 14px;
        line-height: 40px;
        color: var(--art-gray-600);

        @include ellipsis();
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
          font-size: 22px;
          color: #000;
        }
      }
    }
  }
</style>
