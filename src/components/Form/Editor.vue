<!-- 富文本编辑器 插件地址：https://www.wangeditor.com/ -->
<template>
  <div class="editor-wrapper">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :mode="mode"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 700px; overflow-y: hidden"
      v-model="modelValue"
      :mode="mode"
      :defaultConfig="editorConfig"
      @onCreated="onCreateEditor"
    />
  </div>
</template>

<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css'
  import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage } from 'element-plus'
  import EmojiText from '@/utils/emojo'
  import { IDomEditor } from '@wangeditor/editor'

  const modelValue = defineModel<string>({ required: true })

  // 编辑器实例
  const editorRef = shallowRef()
  let mode = ref('defualt')
  const userStore = useUserStore()
  // token
  let { token } = userStore.info
  // 图片上传地址
  let server = `${import.meta.env.VITE_API_URL}/api/common/upload/wangeditor`

  const toolbarConfig = {
    // 重新配置工具栏，显示哪些菜单，以及菜单的排序、分组。
    // toolbarKeys: [],
    // 可以在当前 toolbarKeys 的基础上继续插入新菜单，如自定义扩展的菜单。
    // insertKeys: {
    //   index: 5, // 插入的位置，基于当前的 toolbarKeys
    //   keys: ['menu-key1', 'menu-key2']
    // }
    // 排除某些菜单
    excludeKeys: ['fontFamily', 'group-video', 'fontSize', 'lineHeight']
  }

  const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      // 上传图片
      uploadImage: {
        fieldName: 'file',
        maxFileSize: 3 * 1024 * 1024, // 大小限制
        maxNumberOfFiles: 10, // 最多可上传几个文件，默认为 100
        allowedFileTypes: ['image/*'], // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        // 注意 ${import.meta.env.VITE_BASE_URL} 写你自己的后端服务地址
        server,
        // 传递token
        headers: { Authorization: token },
        // 单个文件上传成功之后
        onSuccess() {
          ElMessage.success(`图片上传成功 ${EmojiText[200]}`)
        },
        // 上传错误，或者触发 timeout 超时
        onError(file: File, err: any, res: any) {
          console.log(`上传出错`, err, res)
          ElMessage.error(`图片上传失败 ${EmojiText[500]}`)
        }
        // 注意：返回格式需要按照指定格式返回，才能显示图片
        // 上传成功的返回格式：
        //   "errno": 0, // 注意：值是数字，不能是字符串
        //   "data": {
        //       "url": "xxx", // 图片 src ，必须
        //       "alt": "yyy", // 图片描述文字，非必须
        //       "href": "zzz" // 图片的链接，非必须
        //   }
        // }
        // 上传失败的返回格式：
        // {
        //   "errno": 1, // 只要不等于 0 就行
        //   "message": "失败信息"
        // }
      }
      // 代码语言
      // codeLangs: [
      //   { text: 'CSS', value: 'css' },
      //   { text: 'HTML', value: 'html' },
      //   { text: 'XML', value: 'xml' },
      // ]
    }
  }

  const onCreateEditor = (editor: IDomEditor) => {
    editorRef.value = editor // 记录 editor 实例
    // editorRef.value.setHtml('内容')
    // getToolbar(editor)

    editor.on('fullScreen', () => {
      console.log('fullScreen')
    })
  }

  onMounted(() => {
    overrideIcon()
  })

  //  替换默认图标
  const overrideIcon = () => {
    setTimeout(() => {
      const icon0 = document.querySelector(`button[data-menu-key="bold"]`)
      if (icon0) icon0.innerHTML = "<i class='iconfont-sys'>&#xe630;</i>"

      const icon1 = document.querySelector(`button[data-menu-key="blockquote"]`)
      if (icon1) icon1.innerHTML = "<i class='iconfont-sys'>&#xe61c;</i>"

      const icon2 = document.querySelector(`button[data-menu-key="underline"]`)
      if (icon2) icon2.innerHTML = "<i class='iconfont-sys'>&#xe65a;</i>"

      const icon3 = document.querySelector(`button[data-menu-key="italic"]`)
      if (icon3) icon3.innerHTML = "<i class='iconfont-sys'>&#xe638;</i>"

      const icon4 = document.querySelector(`button[data-menu-key="group-more-style"]`)
      if (icon4) icon4.innerHTML = "<i class='iconfont-sys'>&#xe648;</i>"

      const icon5 = document.querySelector(`button[data-menu-key="color"]`)
      if (icon5) icon5.innerHTML = "<i class='iconfont-sys'>&#xe68c;</i>"

      const icon6 = document.querySelector(`button[data-menu-key="bgColor"]`)
      if (icon6) icon6.innerHTML = "<i class='iconfont-sys'>&#xe691;</i>"

      const icon7 = document.querySelector(`button[data-menu-key="bulletedList"]`)
      if (icon7) icon7.innerHTML = "<i class='iconfont-sys'>&#xe64e;</i>"

      const icon8 = document.querySelector(`button[data-menu-key="numberedList"]`)
      if (icon8) icon8.innerHTML = "<i class='iconfont-sys'>&#xe66c;</i>"

      const icon9 = document.querySelector(`button[data-menu-key="todo"]`)
      if (icon9) icon9.innerHTML = "<i class='iconfont-sys'>&#xe641;</i>"

      const icon10 = document.querySelector(`button[data-menu-key="group-justify"]`)
      if (icon10) icon10.innerHTML = "<i class='iconfont-sys'>&#xe67e;</i>"

      const icon11 = document.querySelector(`button[data-menu-key="group-indent"]`)
      if (icon11) icon11.innerHTML = "<i class='iconfont-sys'>&#xe63e;</i>"

      const icon12 = document.querySelector(`button[data-menu-key="emotion"]`)
      if (icon12) icon12.innerHTML = "<i class='iconfont-sys'>&#xe690;</i>"

      const icon13 = document.querySelector(`button[data-menu-key="insertLink"]`)
      if (icon13) icon13.innerHTML = "<i class='iconfont-sys'>&#xe63a;</i>"

      const icon14 = document.querySelector(`button[data-menu-key="group-image"]`)
      if (icon14) icon14.innerHTML = "<i class='iconfont-sys'>&#xe634;</i>"

      const icon15 = document.querySelector(`button[data-menu-key="insertTable"]`)
      if (icon15) icon15.innerHTML = "<i class='iconfont-sys'>&#xe67b;</i>"

      const icon16 = document.querySelector(`button[data-menu-key="codeBlock"]`)
      if (icon16) icon16.innerHTML = "<i class='iconfont-sys'>&#xe68b;</i>"

      const icon17 = document.querySelector(`button[data-menu-key="divider"]`)
      if (icon17) icon17.innerHTML = "<i class='iconfont-sys'>&#xe66d;</i>"

      const icon18 = document.querySelector(`button[data-menu-key="undo"]`)
      if (icon18) icon18.innerHTML = "<i class='iconfont-sys'>&#xe65e;</i>"

      const icon19 = document.querySelector(`button[data-menu-key="redo"]`)
      if (icon19) icon19.innerHTML = "<i class='iconfont-sys'>&#xe659;</i>"

      const icon20 = document.querySelector(`button[data-menu-key="fullScreen"]`)
      if (icon20) icon20.innerHTML = "<i class='iconfont-sys'>&#xe633;</i>"

      const icon21 = document.querySelector(`button[data-menu-key="tableFullWidth"]`)
      if (icon21) icon21.innerHTML = "<i class='iconfont-sys'>&#xe67b;</i>"
    }, 10)
  }

  // 获取工具栏
  // const getToolbar = (editor: IDomEditor) => {
  //   setTimeout(() => {
  //     const toolbar = DomEditor.getToolbar(editor)
  //     console.log(toolbar?.getConfig().toolbarKeys) // 当前菜单排序和分组
  //   }, 300)
  // }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
</script>

<style lang="scss">
  /* 编辑器容器 */
  .editor-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--art-border-color);
    border-radius: 8px;

    .iconfont-sys {
      font-size: 20px !important;
    }

    .menu-item {
      display: flex;
      flex-direction: row;
      align-items: center;

      i {
        margin-right: 5px;
      }
    }

    /* 工具栏 */
    .editor-toolbar {
      border-bottom: 1px solid var(--art-border-color);
    }

    /* 下拉选择框配置 */
    .w-e-select-list {
      min-width: 140px;
      padding: 5px 10px 10px;
      border: none;
      border-radius: 12px;
    }

    /* 下拉选择框元素配置 */
    .w-e-select-list ul li {
      margin-top: 5px;
      font-size: 15px !important;
      border-radius: 10px;
    }

    /* 下拉选择框 正文文字大小调整 */
    .w-e-select-list ul li:last-of-type {
      font-size: 16px !important;
    }

    /* 下拉选择框 hover 样式调整 */
    .w-e-select-list ul li:hover {
      background-color: var(--art-gray-200);
    }

    :root {
      /* 激活颜色 */
      --w-e-toolbar-active-bg-color: var(--art-gray-200);

      /* toolbar 图标和文字颜色 */
      --w-e-toolbar-color: #000;

      /* 表格选中时候的边框颜色 */
      --w-e-textarea-selected-border-color: #ddd;

      /* 表格头背景颜色 */
      --w-e-textarea-slight-bg-color: var(--art-gray-200);
    }

    /* 工具栏按钮样式 */
    .w-e-bar-item button {
      border-radius: 8px;
    }

    /* 工具栏 hover 按钮背景颜色 */
    .w-e-bar-item button:hover {
      background-color: var(--art-gray-200);
    }

    /* 工具栏分割线 */
    .w-e-bar-divider {
      height: 20px;
      margin-top: 10px;
      background-color: #ccc;
    }

    /* 工具栏菜单 */
    .w-e-bar-item-group .w-e-bar-item-menus-container {
      min-width: 120px;
      padding: 10px 0;
      border: none;
      border-radius: 12px;
    }

    /* 代码块 */
    .w-e-text-container [data-slate-editor] pre > code {
      padding: 0.6rem 1rem;
      background-color: var(--art-gray-100);
      border-radius: 6px;
    }

    /* 弹出框 */
    .w-e-drop-panel {
      border: 0;
      border-radius: 12px;
    }

    /* 表格样式优化 */
    .w-e-text-container [data-slate-editor] .table-container th {
      border-right: none;
    }

    .w-e-text-container [data-slate-editor] .table-container th:last-of-type {
      border-right: 1px solid #ccc !important;
    }

    /* 引用 */
    .w-e-text-container [data-slate-editor] blockquote {
      border-left: 4px solid #ddd;
    }

    /* 输入区域弹出 bar  */
    .w-e-hover-bar {
      border-radius: 10px;
    }

    /* 超链接弹窗 */
    .w-e-modal {
      border: none;
      border-radius: 12px;
    }

    /* 图片样式调整 */
    .w-e-text-container [data-slate-editor] .w-e-selected-image-container {
      overflow: inherit;

      &:hover {
        border: 0;
      }

      img {
        border: 1px solid transparent;
        transition: border 0.3s;

        &:hover {
          border: 1px solid #318ef4 !important;
        }
      }

      .w-e-image-dragger {
        width: 12px;
        height: 12px;
        background-color: #318ef4;
        border: 2px solid #fff;
        border-radius: 12px;
      }

      .left-top {
        top: -6px;
        left: -6px;
      }

      .right-top {
        top: -6px;
        right: -6px;
      }

      .left-bottom {
        bottom: -6px;
        left: -6px;
      }

      .right-bottom {
        right: -6px;
        bottom: -6px;
      }
    }
  }
</style>
