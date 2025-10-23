<template>
  <div class="page-content mb-5">
    <div class="flex items-center">
      <ElSelect v-model="iconType" placeholder="Select" style="width: 240px">
        <ElOption
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
      <div
        class="box-border h-[var(--el-component-custom-height)] px-[30px] ml-2.5 border border-[var(--art-border-dashed-color)] rounded-[calc(var(--custom-radius)/3+2px)]"
      >
        <ElCheckbox v-model="isColorsIcon" label="彩色图标" />
      </div>
    </div>
    <div class="mt-5">
      <ul
        class="grid grid-cols-12 w-[calc(100%+16px)] max-lg:grid-cols-8 max-md:grid-cols-5 max-sm:grid-cols-3"
      >
        <li
          v-for="icon in systemIconClasses"
          :key="icon.className"
          @click="copyIcon(icon)"
          class="box-border flex flex-col justify-center aspect-square px-2 mr-4 mb-4 overflow-hidden text-center border border-[rgb(var(--art-gray-300-rgb),0.8)] rounded-xl cursor-pointer hover:bg-[var(--art-gray-100)]"
        >
          <i
            class="iconfont-sys text-[26px] transition-colors duration-300 ease-in-out"
            v-if="iconType === 'unicode'"
            v-html="icon.unicode"
            :style="getIconStyle()"
          ></i>
          <i
            :class="`iconfont-sys ${icon.className} text-[26px] transition-colors duration-300 ease-in-out`"
            v-else
            :style="getIconStyle()"
          ></i>
          <span class="block mt-2.5 text-xs text-[var(--art-text-gray-600)]">{{
            iconType === 'unicode' ? icon.unicode : icon.className
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { extractIconClasses, IconfontType } from '@/utils/constants'

  defineOptions({ name: 'WidgetsIconList' })

  const iconType = ref('unicode')
  const isColorsIcon = ref(false)
  const systemIconClasses = ref<IconfontType[]>([])

  /**
   * 图标类型选项
   */
  const options = [
    { value: 'unicode', label: 'Unicode' },
    { value: 'fontClass', label: 'Font class' }
  ]

  onMounted(() => {
    systemIconClasses.value = extractIconClasses()
  })

  /**
   * 复制图标代码到剪贴板
   * @param text 图标对象
   */
  const copyIcon = (text: IconfontType) => {
    if (!text) return

    const copyInput = document.createElement('input')
    copyInput.setAttribute(
      'value',
      (iconType.value === 'unicode' ? text.unicode : text.className) || ''
    )
    document.body.appendChild(copyInput)
    copyInput.select()
    document.execCommand('copy')
    document.body.removeChild(copyInput)

    ElMessage.success('已复制')
  }

  /**
   * 获取随机颜色
   * @returns 随机颜色值
   */
  const getRandomColor = () => {
    const colors = ['#2d8cf0', '#19be6b', '#ff9900', '#f24965', '#9463f7']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  /**
   * 获取图标样式
   * @returns 图标样式对象
   */
  const getIconStyle = () => {
    return isColorsIcon.value ? { color: getRandomColor() } : { color: 'var(--art-text-gray-700)' }
  }
</script>
