<!-- 顶部快速入口面板 -->
<template>
  <ElPopover
    ref="popoverRef"
    :width="700"
    trigger="hover"
    popper-class="fast-enter-popover"
    :show-arrow="false"
    placement="bottom-start"
    :offset="0"
    :popper-style="{
      border: '1px solid var(--art-border-dashed-color)',
      borderRadius: 'calc(var(--custom-radius) / 2 + 4px)'
    }"
  >
    <template #reference>
      <div class="fast-enter-trigger">
        <div class="btn">
          <i class="iconfont-sys">&#xe81a;</i>
          <span class="red-dot"></span>
        </div>
      </div>
    </template>

    <div class="fast-enter">
      <div class="apps-section">
        <div class="apps-grid">
          <!-- 应用列表 -->
          <div
            v-for="application in enabledApplications"
            :key="application.name"
            class="app-item"
            @click="handleNavigate(application.path)"
          >
            <div class="app-icon">
              <i
                class="iconfont-sys"
                v-html="application.icon"
                :style="{ color: application.iconColor }"
              />
            </div>
            <div class="app-info">
              <h3>{{ application.name }}</h3>
              <p>{{ application.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-links">
        <h3>快速链接</h3>
        <ul>
          <li
            v-for="quickLink in enabledQuickLinks"
            :key="quickLink.name"
            @click="handleNavigate(quickLink.path)"
          >
            <span>{{ quickLink.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </ElPopover>
</template>

<script setup lang="ts">
  import { useFastEnter } from '@/composables/useFastEnter'

  defineOptions({ name: 'ArtFastEnter' })

  const router = useRouter()
  const popoverRef = ref()

  // 使用快速入口配置
  const { enabledApplications, enabledQuickLinks } = useFastEnter()

  const isExternalLink = (path: string): boolean => path.startsWith('http')

  const handleNavigate = (path: string): void => {
    if (isExternalLink(path)) {
      window.open(path, '_blank')
    } else {
      router.push(path)
    }
    popoverRef.value?.hide()
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>
