<template>
  <div>
    <el-tooltip
      effect="dark"
      :content="`按下 ^ 键也能回到顶部哦 ${EmojiText[200]}`"
      placement="left-start"
    >
      <div class="back-to-top" v-show="showButton" @click="scrollToTop">
        <div class="back-to-top-btn">
          <i class="iconfont-sys">&#xe864;</i>
          <p>顶部</p>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { useCommon } from '@/composables/useCommon'
  import EmojiText from '@/utils/emojo'
  import { ref, watch } from 'vue'
  const { scrollToTop } = useCommon()

  const { y } = useWindowScroll()
  const showButton = ref(false)
  const scrollThreshold = 2000 // 设置阈值

  // 监听滚动位置
  watch(y, (newY: number) => {
    showButton.value = newY > scrollThreshold
  })

  // 监听键盘 ^ 键，回到顶部
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      scrollToTop()
    }
  }

  useEventListener('keydown', handleKeyDown)
</script>

<style lang="scss" scoped>
  .back-to-top {
    position: fixed;
    right: 40px;
    bottom: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    color: var(--art-gray-700);
    text-align: center;
    cursor: pointer;
    border: 1px solid var(--art-border-color);
    border-radius: 6px;

    i {
      display: block;
      line-height: 1;
    }

    p {
      margin-top: 2px;
      font-size: 10px;
      line-height: 1;
    }
  }
</style>
