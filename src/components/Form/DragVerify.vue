<template>
  <div
    ref="dragVerify"
    class="drag_verify"
    :style="dragVerifyStyle"
    @mousemove="dragMoving"
    @mouseup="dragFinish"
    @mouseleave="dragFinish"
    @touchmove="dragMoving"
    @touchend="dragFinish"
  >
    <div
      class="dv_progress_bar"
      :class="{ goFirst2: isOk }"
      ref="progressBar"
      :style="progressBarStyle"
    >
    </div>
    <div class="dv_text" :style="textStyle" ref="messageRef">
      <slot name="textBefore" v-if="$slots.textBefore"></slot>
      {{ message }}
      <slot name="textAfter" v-if="$slots.textAfter"></slot>
    </div>

    <div
      class="dv_handler dv_handler_bg"
      :class="{ goFirst: isOk }"
      @mousedown="dragStart"
      @touchstart="dragStart"
      ref="handler"
      :style="handlerStyle"
    >
      <i class="iconfont-sys" v-html="value ? successIcon : handlerIcon"></i>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, toRefs, onMounted, computed } from 'vue'
  const emit = defineEmits(['handlerMove', 'update:value', 'passCallback'])
  interface PropsType {
    value: boolean
    width?: number
    height?: number
    text?: string
    successText?: string
    background?: string
    progressBarBg?: string
    completedBg?: string
    circle?: boolean
    radius?: string
    handlerIcon?: string
    successIcon?: string
    handlerBg?: string
    textSize?: string
    textColor?: string
  }
  const props = withDefaults(defineProps<PropsType>(), {
    value: false,
    width: 260,
    height: 44,
    text: '按住滑块拖动',
    successText: 'success',
    background: '#eee',
    progressBarBg: '#1385FF',
    completedBg: '#57D187',
    circle: false,
    radius: '6px',
    handlerIcon: '&#xea50;',
    successIcon: '&#xe621;',
    handlerBg: '#fff',
    textSize: '13px',
    textColor: '#333'
  })
  interface stateType {
    isMoving: boolean
    x: number
    isOk: boolean
  }
  const state = reactive(<stateType>{
    isMoving: false,
    x: 0,
    isOk: false
  })
  const { isOk } = toRefs(state)
  const dragVerify = ref()
  const messageRef = ref()
  const handler = ref()
  const progressBar = ref()
  onMounted(() => {
    dragVerify.value?.style.setProperty('--textColor', props.textColor)
    dragVerify.value?.style.setProperty('--width', Math.floor(props.width / 2) + 'px')
    dragVerify.value?.style.setProperty('--pwidth', -Math.floor(props.width / 2) + 'px')
  })
  const handlerStyle = {
    left: '0',
    width: props.height + 'px',
    height: props.height + 'px',
    background: props.handlerBg
  }
  const dragVerifyStyle = {
    width: props.width + 'px',
    height: props.height + 'px',
    lineHeight: props.height + 'px',
    background: props.background,
    borderRadius: props.circle ? props.height / 2 + 'px' : props.radius
  }
  const progressBarStyle = {
    background: props.progressBarBg,
    height: props.height + 'px',
    borderRadius: props.circle
      ? props.height / 2 + 'px 0 0 ' + props.height / 2 + 'px'
      : props.radius
  }
  const textStyle = {
    height: props.height + 'px',
    width: props.width + 'px',
    fontSize: props.textSize
  }
  const message = computed(() => {
    return props.value ? props.successText : props.text
  })

  const dragStart = (e: any) => {
    if (!props.value) {
      state.isMoving = true
      handler.value.style.transition = 'none'
      state.x =
        (e.pageX || e.touches[0].pageX) - parseInt(handler.value.style.left.replace('px', ''), 10)
    }
    emit('handlerMove')
  }
  const dragMoving = (e: any) => {
    if (state.isMoving && !props.value) {
      let _x = (e.pageX || e.touches[0].pageX) - state.x
      if (_x > 0 && _x <= props.width - props.height) {
        handler.value.style.left = _x + 'px'
        progressBar.value.style.width = _x + props.height / 2 + 'px'
      } else if (_x > props.width - props.height) {
        handler.value.style.left = props.width - props.height + 'px'
        progressBar.value.style.width = props.width - props.height / 2 + 'px'
        passVerify()
      }
    }
  }
  const dragFinish = (e: any) => {
    if (state.isMoving && !props.value) {
      let _x = (e.pageX || e.changedTouches[0].pageX) - state.x
      if (_x < props.width - props.height) {
        state.isOk = true
        handler.value.style.left = '0'
        handler.value.style.transition = 'all 0.2s'
        progressBar.value.style.width = '0'
        state.isOk = false
      } else {
        handler.value.style.transition = 'none'
        handler.value.style.left = props.width - props.height + 'px'
        progressBar.value.style.width = props.width - props.height / 2 + 'px'
        passVerify()
      }
      state.isMoving = false
    }
  }
  const passVerify = () => {
    emit('update:value', true)
    state.isMoving = false
    progressBar.value.style.background = props.completedBg
    messageRef.value.style['-webkit-text-fill-color'] = 'unset'
    messageRef.value.style.animation = 'slidetounlock2 3s infinite'
    messageRef.value.style.color = '#fff'
    emit('passCallback')
  }
  const reset = () => {
    handler.value.style.left = '0'
    progressBar.value.valueFormat.style.width = '0'
    handler.value.children[0].type = props.handlerIcon
    messageRef.value.style['-webkit-text-fill-color'] = 'transparent'
    messageRef.value.style.animation = 'slidetounlock 3s infinite'
    messageRef.value.style.color = props.background
  }
  defineExpose({
    reset
  })
</script>
<style lang="scss" scoped>
  .drag_verify {
    position: relative;
    overflow: hidden;
    text-align: center;
    background-color: #e8e8e8;

    .dv_handler {
      position: absolute;
      top: 0;
      left: 0;
      cursor: move;

      i {
        padding-left: 0;
        font-size: 14px;
        color: #999;
      }

      .el-icon-circle-check {
        margin-top: 9px;
        color: #6c6;
      }
    }

    .dv_progress_bar {
      position: absolute;
      width: 0;
      height: 34px;
    }

    .dv_text {
      position: absolute;
      top: 0;
      color: transparent;
      user-select: none;
      background: linear-gradient(
        to right,
        var(--textColor) 0%,
        var(--textColor) 40%,
        #fff 50%,
        var(--textColor) 60%,
        var(--textColor) 100%
      );
      background-clip: text;
      animation: slidetounlock 3s infinite;
      -webkit-text-fill-color: transparent;
      text-size-adjust: none;

      * {
        -webkit-text-fill-color: var(--textColor);
      }
    }
  }

  .goFirst {
    left: 0 !important;
    transition: left 0.5s;
  }

  .goFirst2 {
    width: 0 !important;
    transition: width 0.5s;
  }
</style>

<style lang="scss">
  @keyframes slidetounlock {
    0% {
      background-position: var(--pwidth) 0;
    }

    100% {
      background-position: var(--width) 0;
    }
  }

  @keyframes slidetounlock2 {
    0% {
      background-position: var(--pwidth) 0;
    }

    100% {
      background-position: var(--pwidth) 0;
    }
  }
</style>
