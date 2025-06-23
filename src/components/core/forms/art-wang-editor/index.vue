<!-- WangEditor 富文本编辑器 插件地址：https://www.wangeditor.com/ -->
<template>
  <div class="editor-wrapper">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :mode="mode"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      :style="{ height: height, overflowY: 'hidden' }"
      v-model="modelValue"
      :mode="mode"
      :defaultConfig="editorConfig"
      @onCreated="onCreateEditor"
    />
  </div>
</template>

<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css'
  import { onBeforeUnmount, onMounted, shallowRef, computed } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage } from 'element-plus'
  import EmojiText from '@/utils/ui/emojo'
  import { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor'

  defineOptions({ name: 'ArtWangEditor' })

  // Props 定义
  interface Props {
    /** 编辑器高度 */
    height?: string
    /** 自定义工具栏配置 */
    toolbarKeys?: string[]
    /** 插入新工具到指定位置 */
    insertKeys?: { index: number; keys: string[] }
    /** 排除的工具栏项 */
    excludeKeys?: string[]
    /** 编辑器模式 */
    mode?: 'default' | 'simple'
    /** 占位符文本 */
    placeholder?: string
    /** 上传配置 */
    uploadConfig?: {
      maxFileSize?: number
      maxNumberOfFiles?: number
      server?: string
    }
  }

  const props = withDefaults(defineProps<Props>(), {
    height: '500px',
    mode: 'default',
    placeholder: '请输入内容...',
    excludeKeys: () => ['fontFamily']
  })

  const modelValue = defineModel<string>({ required: true })

  // 编辑器实例
  const editorRef = shallowRef<IDomEditor>()
  const userStore = useUserStore()

  // 常量配置
  const DEFAULT_UPLOAD_CONFIG = {
    maxFileSize: 3 * 1024 * 1024, // 3MB
    maxNumberOfFiles: 10,
    fieldName: 'file',
    allowedFileTypes: ['image/*']
  } as const

  // 图标映射配置
  const ICON_MAP = {
    bold: '&#xe630;',
    blockquote: '&#xe61c;',
    underline: '&#xe65a;',
    italic: '&#xe638;',
    'group-more-style': '&#xe648;',
    color: '&#xe68c;',
    bgColor: '&#xe691;',
    bulletedList: '&#xe64e;',
    numberedList: '&#xe66c;',
    todo: '&#xe641;',
    'group-justify': '&#xe67e;',
    'group-indent': '&#xe63e;',
    emotion: '&#xe690;',
    insertLink: '&#xe63a;',
    'group-image': '&#xe634;',
    insertTable: '&#xe67b;',
    codeBlock: '&#xe68b;',
    divider: '&#xe66d;',
    undo: '&#xe65e;',
    redo: '&#xe659;',
    fullScreen: '&#xe633;',
    tableFullWidth: '&#xe67b;'
  } as const

  // 计算属性：上传服务器地址
  const uploadServer = computed(
    () =>
      props.uploadConfig?.server || `${import.meta.env.VITE_API_URL}/api/common/upload/wangeditor`
  )

  // 合并上传配置
  const mergedUploadConfig = computed(() => ({
    ...DEFAULT_UPLOAD_CONFIG,
    ...props.uploadConfig
  }))

  // 工具栏配置
  const toolbarConfig = computed((): Partial<IToolbarConfig> => {
    const config: Partial<IToolbarConfig> = {}

    // 完全自定义工具栏
    if (props.toolbarKeys && props.toolbarKeys.length > 0) {
      config.toolbarKeys = props.toolbarKeys
    }

    // 插入新工具
    if (props.insertKeys) {
      config.insertKeys = props.insertKeys
    }

    // 排除工具
    if (props.excludeKeys && props.excludeKeys.length > 0) {
      config.excludeKeys = props.excludeKeys
    }

    return config
  })

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    MENU_CONF: {
      uploadImage: {
        fieldName: mergedUploadConfig.value.fieldName,
        maxFileSize: mergedUploadConfig.value.maxFileSize,
        maxNumberOfFiles: mergedUploadConfig.value.maxNumberOfFiles,
        allowedFileTypes: mergedUploadConfig.value.allowedFileTypes,
        server: uploadServer.value,
        headers: {
          Authorization: userStore.accessToken
        },
        onSuccess() {
          ElMessage.success(`图片上传成功 ${EmojiText[200]}`)
        },
        onError(file: File, err: any, res: any) {
          console.error('图片上传失败:', err, res)
          ElMessage.error(`图片上传失败 ${EmojiText[500]}`)
        }
      }
    }
  }

  // 编辑器创建回调
  const onCreateEditor = (editor: IDomEditor) => {
    editorRef.value = editor

    // 监听全屏事件
    editor.on('fullScreen', () => {
      console.log('编辑器进入全屏模式')
    })
  }

  // 优化的图标替换函数
  const overrideIcons = () => {
    requestAnimationFrame(() => {
      Object.entries(ICON_MAP).forEach(([menuKey, iconCode]) => {
        const button = document.querySelector(`button[data-menu-key="${menuKey}"]`)
        if (button) {
          button.innerHTML = `<i class='iconfont-sys'>${iconCode}</i>`
        }
      })
    })
  }

  // 暴露编辑器实例和方法
  defineExpose({
    /** 获取编辑器实例 */
    getEditor: () => editorRef.value,
    /** 设置编辑器内容 */
    setHtml: (html: string) => editorRef.value?.setHtml(html),
    /** 获取编辑器内容 */
    getHtml: () => editorRef.value?.getHtml(),
    /** 清空编辑器 */
    clear: () => editorRef.value?.clear(),
    /** 聚焦编辑器 */
    focus: () => editorRef.value?.focus()
  })

  // 生命周期
  onMounted(() => {
    overrideIcons()
  })

  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor) {
      editor.destroy()
    }
  })
</script>

<style lang="scss">
  @use './style';
</style>
