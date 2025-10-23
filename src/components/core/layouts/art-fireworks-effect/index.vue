<!-- 烟花效果 | 礼花效果 -->
<template>
  <canvas ref="canvasRef" class="layout-fireworks"></canvas>
</template>

<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { mittBus } from '@/utils/sys'
  import type { Handler } from 'mitt'
  import bp from '@/assets/img/ceremony/hb.png'
  import sd from '@/assets/img/ceremony/sd.png'
  import yd from '@/assets/img/ceremony/yd.png'

  defineOptions({ name: 'ArtFireworksEffect' })

  /**
   * 烟花系统配置接口
   * 定义了烟花效果的所有可配置参数
   */
  interface FireworkConfig {
    /** 对象池大小 - 预先创建的粒子对象数量 */
    readonly POOL_SIZE: number
    /** 每次爆炸产生的粒子数量 */
    readonly PARTICLES_PER_BURST: number
    /** 各种形状的尺寸配置 */
    readonly SIZES: {
      /** 矩形粒子的宽高 */
      readonly RECTANGLE: { readonly WIDTH: number; readonly HEIGHT: number }
      /** 正方形粒子的边长 */
      readonly SQUARE: { readonly SIZE: number }
      /** 圆形粒子的直径 */
      readonly CIRCLE: { readonly SIZE: number }
      /** 三角形粒子的边长 */
      readonly TRIANGLE: { readonly SIZE: number }
      /** 椭圆粒子的宽高 */
      readonly OVAL: { readonly WIDTH: number; readonly HEIGHT: number }
      /** 图片粒子的宽高 */
      readonly IMAGE: { readonly WIDTH: number; readonly HEIGHT: number }
    }
    /** 旋转相关参数 */
    readonly ROTATION: {
      /** 基础旋转速度 */
      readonly BASE_SPEED: number
      /** 随机旋转速度增量 */
      readonly RANDOM_SPEED: number
      /** 旋转衰减系数 - 控制旋转速度递减 */
      readonly DECAY: number
    }
    /** 物理效果参数 */
    readonly PHYSICS: {
      /** 重力加速度 */
      readonly GRAVITY: number
      /** 下落速度阈值 - 超过此值开始淡出 */
      readonly VELOCITY_THRESHOLD: number
      /** 透明度衰减速度 */
      readonly OPACITY_DECAY: number
    }
    /** 烟花粒子颜色配置(带透明度) */
    readonly COLORS: readonly string[]
    /** 烟花粒子形状配置(矩形出现概率更高) */
    readonly SHAPES: readonly string[]
  }

  /**
   * 单个烟花粒子对象
   * 包含粒子的位置、速度、外观等所有属性
   */
  interface Firework {
    /** X坐标位置 */
    x: number
    /** Y坐标位置 */
    y: number
    /** X方向速度 */
    vx: number
    /** Y方向速度 */
    vy: number
    /** 粒子颜色 (RGBA格式) */
    color: string
    /** 当前旋转角度 */
    rotation: number
    /** 旋转速度 */
    rotationSpeed: number
    /** 缩放比例 */
    scale: number
    /** 粒子形状类型 */
    shape: string
    /** 透明度 (0-1) */
    opacity: number
    /** 是否处于活动状态 */
    active: boolean
    /** 图片URL (当shape为image时使用) */
    imageUrl?: string
  }

  /**
   * 图片缓存接口
   * 用于缓存预加载的图片资源
   */
  interface ImageCache {
    [url: string]: HTMLImageElement
  }

  /**
   * 烟花效果的全局配置
   * 使用 as const 确保配置的不可变性
   */
  const CONFIG: FireworkConfig = {
    // 性能相关配置
    POOL_SIZE: 600, // 对象池大小，影响同时存在的最大粒子数
    PARTICLES_PER_BURST: 200, // 每次爆炸的粒子数量，影响视觉效果密度

    // 粒子尺寸配置
    SIZES: {
      RECTANGLE: { WIDTH: 24, HEIGHT: 12 }, // 矩形粒子尺寸
      SQUARE: { SIZE: 12 }, // 正方形粒子尺寸
      CIRCLE: { SIZE: 12 }, // 圆形粒子尺寸
      TRIANGLE: { SIZE: 10 }, // 三角形粒子尺寸
      OVAL: { WIDTH: 24, HEIGHT: 12 }, // 椭圆粒子尺寸
      IMAGE: { WIDTH: 30, HEIGHT: 30 } // 图片粒子尺寸
    },

    // 旋转动画配置
    ROTATION: {
      BASE_SPEED: 2, // 基础旋转速度
      RANDOM_SPEED: 3, // 额外随机旋转速度范围
      DECAY: 0.98 // 旋转速度衰减系数 (越小衰减越快)
    },

    // 物理效果配置
    PHYSICS: {
      GRAVITY: 0.525, // 重力加速度，影响粒子下落速度
      VELOCITY_THRESHOLD: 10, // 速度阈值，超过时开始透明度衰减
      OPACITY_DECAY: 0.02 // 透明度衰减速度，影响粒子消失快慢
    },

    // 粒子颜色配置 - 使用RGBA格式支持透明度
    COLORS: [
      'rgba(255, 68, 68, 1)', // 红色系
      'rgba(255, 68, 68, 0.9)',
      'rgba(255, 68, 68, 0.8)',
      'rgba(255, 116, 188, 1)', // 粉色系
      'rgba(255, 116, 188, 0.9)',
      'rgba(255, 116, 188, 0.8)',
      'rgba(68, 68, 255, 0.8)', // 蓝色系
      'rgba(92, 202, 56, 0.7)', // 绿色系
      'rgba(255, 68, 255, 0.8)', // 紫色系
      'rgba(68, 255, 255, 0.7)', // 青色系
      'rgba(255, 136, 68, 0.7)', // 橙色系
      'rgba(68, 136, 255, 1)', // 蓝色系
      'rgba(250, 198, 122, 0.8)' // 金色系
    ],

    // 粒子形状配置 - 矩形出现概率更高，营造更丰富的视觉效果
    SHAPES: [
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'circle',
      'triangle',
      'oval'
    ]
  } as const

  /** Canvas DOM 元素引用 */
  const canvasRef = ref<HTMLCanvasElement>()
  /** Canvas 2D 绘制上下文 */
  const ctx = ref<CanvasRenderingContext2D | null>(null)

  /**
   * 烟花系统核心类
   * 负责管理粒子生命周期、渲染和动画
   */
  class FireworkSystem {
    /** 粒子对象池 - 预先创建的粒子对象数组 */
    private particlePool: Firework[] = []
    /** 当前活动的粒子数组 */
    private activeParticles: Firework[] = []
    /** 对象池索引指针 - 用于循环分配粒子 */
    private poolIndex = 0
    /** 图片资源缓存 */
    private imageCache: ImageCache = {}
    /** 动画帧ID - 用于取消动画 */
    private animationId = 0
    /** 画布宽度缓存 */
    private canvasWidth = 0
    /** 画布高度缓存 */
    private canvasHeight = 0

    constructor() {
      this.initializePool()
    }

    /**
     * 初始化对象池
     * 预先创建指定数量的粒子对象，避免运行时频繁创建
     */
    private initializePool(): void {
      for (let i = 0; i < CONFIG.POOL_SIZE; i++) {
        this.particlePool.push(this.createParticle())
      }
    }

    /**
     * 创建一个新的粒子对象
     * 返回初始化状态的粒子
     */
    private createParticle(): Firework {
      return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '',
        rotation: 0,
        rotationSpeed: 0,
        scale: 1,
        shape: 'circle',
        opacity: 1,
        active: false
      }
    }

    /**
     * 从对象池获取可用粒子 (性能优化版本)
     * 使用循环索引而非Array.find()，时间复杂度从O(n)降至O(1)
     * @returns 可用的粒子对象或null
     */
    private getAvailableParticle(): Firework | null {
      for (let i = 0; i < CONFIG.POOL_SIZE; i++) {
        const index = (this.poolIndex + i) % CONFIG.POOL_SIZE
        const particle = this.particlePool[index]

        if (!particle.active) {
          this.poolIndex = (index + 1) % CONFIG.POOL_SIZE
          particle.active = true
          return particle
        }
      }
      return null
    }

    /**
     * 预加载单个图片资源
     * @param url 图片URL
     * @returns Promise<HTMLImageElement>
     */
    async preloadImage(url: string): Promise<HTMLImageElement> {
      // 如果已缓存，直接返回
      if (this.imageCache[url]) {
        return this.imageCache[url]
      }

      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous' // 处理跨域问题
        img.onload = () => {
          this.imageCache[url] = img
          resolve(img)
        }
        img.onerror = reject
        img.src = url
      })
    }

    /**
     * 预加载所有需要的图片资源
     * 在组件初始化时调用，确保图片ready
     */
    async preloadAllImages(): Promise<void> {
      const imageUrls = [bp, sd, yd]
      try {
        await Promise.all(imageUrls.map((url) => this.preloadImage(url)))
      } catch (error) {
        console.error('Image preloading failed:', error)
      }
    }

    /**
     * 创建烟花爆炸效果
     * @param imageUrl 可选的图片URL，如果提供则使用图片粒子
     */
    createFirework(imageUrl?: string): void {
      // 随机确定爆炸起始位置
      const startX = Math.random() * this.canvasWidth
      const startY = this.canvasHeight

      // 根据是否有图片确定可用形状
      const availableShapes = imageUrl && this.imageCache[imageUrl] ? ['image'] : CONFIG.SHAPES

      // 批量创建粒子数组，减少频繁的数组操作
      const particles: Firework[] = []

      for (let i = 0; i < CONFIG.PARTICLES_PER_BURST; i++) {
        const particle = this.getAvailableParticle()
        if (!particle) continue

        // 计算粒子发射角度和速度 (恢复原始算法)
        const angle = (Math.PI * i) / (CONFIG.PARTICLES_PER_BURST / 2) // 扇形分布
        const speed = (12 + Math.random() * 6) * 1.5 // 随机速度
        const spread = Math.random() * Math.PI * 2 // 360度随机扩散

        // 直接属性赋值，避免Object.assign的性能开销
        particle.x = startX
        particle.y = startY
        // 复杂的速度计算，模拟真实烟花爆炸轨迹
        particle.vx = Math.cos(angle) * Math.cos(spread) * speed * (Math.random() * 0.5 + 0.5)
        particle.vy = Math.sin(angle) * speed - 15 // 向上初始速度
        particle.color = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)]
        particle.rotation = Math.random() * 360
        particle.rotationSpeed =
          (Math.random() * CONFIG.ROTATION.RANDOM_SPEED + CONFIG.ROTATION.BASE_SPEED) *
          (Math.random() > 0.5 ? 1 : -1) // 随机旋转方向
        particle.scale = 0.8 + Math.random() * 0.4 // 随机缩放
        particle.shape = availableShapes[Math.floor(Math.random() * availableShapes.length)]
        particle.opacity = 1
        particle.imageUrl = imageUrl && this.imageCache[imageUrl] ? imageUrl : undefined

        particles.push(particle)
      }

      // 批量添加到活动粒子数组，减少多次数组操作
      this.activeParticles.push(...particles)
    }

    /**
     * 更新所有粒子的物理状态 (性能优化版本)
     * 包括位置、速度、旋转、透明度等
     */
    private updateParticles(): void {
      const { GRAVITY, VELOCITY_THRESHOLD, OPACITY_DECAY } = CONFIG.PHYSICS
      const { DECAY } = CONFIG.ROTATION

      // 使用倒序遍历，避免删除元素时的索引混乱问题
      for (let i = this.activeParticles.length - 1; i >= 0; i--) {
        const particle = this.activeParticles[i]

        // 更新粒子位置 (匀加速运动)
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += GRAVITY // 重力影响

        // 更新旋转状态
        particle.rotation += particle.rotationSpeed
        particle.rotationSpeed *= DECAY // 旋转速度衰减

        // 透明度衰减逻辑 - 当粒子下落速度超过阈值时开始淡出
        if (particle.vy > VELOCITY_THRESHOLD) {
          particle.opacity -= OPACITY_DECAY
          if (particle.opacity <= 0) {
            this.recycleParticle(i)
            continue
          }
        }

        // 边界检查 - 移除超出屏幕范围的粒子
        if (this.isOutOfBounds(particle)) {
          this.recycleParticle(i)
        }
      }
    }

    /**
     * 回收粒子到对象池
     * @param index 要回收的粒子在活动数组中的索引
     */
    private recycleParticle(index: number): void {
      const particle = this.activeParticles[index]
      particle.active = false // 标记为非活动状态
      this.activeParticles.splice(index, 1) // 从活动数组中移除
    }

    /**
     * 检查粒子是否超出屏幕边界
     * @param particle 要检查的粒子
     * @returns 是否超出边界
     */
    private isOutOfBounds(particle: Firework): boolean {
      const margin = 100 // 边界缓冲区
      return (
        particle.x < -margin ||
        particle.x > this.canvasWidth + margin ||
        particle.y < -margin ||
        particle.y > this.canvasHeight + margin
      )
    }

    /**
     * 绘制单个粒子
     * @param particle 要绘制的粒子对象
     */
    private drawParticle(particle: Firework): void {
      if (!ctx.value) return

      // 保存当前画布状态
      ctx.value.save()
      ctx.value.globalAlpha = particle.opacity // 设置透明度
      ctx.value.translate(particle.x, particle.y) // 移动到粒子位置
      ctx.value.rotate((particle.rotation * Math.PI) / 180) // 应用旋转
      ctx.value.scale(particle.scale, particle.scale) // 应用缩放

      // 渲染粒子形状
      this.renderShape(particle)

      // 恢复画布状态
      ctx.value.restore()
    }

    /**
     * 根据粒子类型渲染对应的形状
     * @param particle 要渲染的粒子
     */
    private renderShape(particle: Firework): void {
      if (!ctx.value) return

      const { SIZES } = CONFIG
      ctx.value.fillStyle = particle.color

      switch (particle.shape) {
        case 'rectangle':
          // 绘制矩形
          ctx.value.fillRect(
            -SIZES.RECTANGLE.WIDTH / 2,
            -SIZES.RECTANGLE.HEIGHT / 2,
            SIZES.RECTANGLE.WIDTH,
            SIZES.RECTANGLE.HEIGHT
          )
          break

        case 'square':
          // 绘制正方形
          ctx.value.fillRect(
            -SIZES.SQUARE.SIZE / 2,
            -SIZES.SQUARE.SIZE / 2,
            SIZES.SQUARE.SIZE,
            SIZES.SQUARE.SIZE
          )
          break

        case 'circle':
          // 绘制圆形
          ctx.value.beginPath()
          ctx.value.arc(0, 0, SIZES.CIRCLE.SIZE / 2, 0, Math.PI * 2)
          ctx.value.fill()
          break

        case 'triangle':
          // 绘制三角形
          ctx.value.beginPath()
          ctx.value.moveTo(0, -SIZES.TRIANGLE.SIZE)
          ctx.value.lineTo(SIZES.TRIANGLE.SIZE, SIZES.TRIANGLE.SIZE)
          ctx.value.lineTo(-SIZES.TRIANGLE.SIZE, SIZES.TRIANGLE.SIZE)
          ctx.value.closePath()
          ctx.value.fill()
          break

        case 'oval':
          // 绘制椭圆
          ctx.value.beginPath()
          ctx.value.ellipse(0, 0, SIZES.OVAL.WIDTH / 2, SIZES.OVAL.HEIGHT / 2, 0, 0, Math.PI * 2)
          ctx.value.fill()
          break

        case 'image':
          // 绘制图片
          this.renderImage(particle)
          break
      }
    }

    /**
     * 渲染图片类型的粒子
     * @param particle 包含图片URL的粒子对象
     */
    private renderImage(particle: Firework): void {
      if (!ctx.value || !particle.imageUrl) return

      const img = this.imageCache[particle.imageUrl]
      if (img?.complete) {
        const { WIDTH, HEIGHT } = CONFIG.SIZES.IMAGE
        ctx.value.drawImage(img, -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT)
      }
    }

    /**
     * 渲染所有活动粒子到画布
     * 清除画布并重新绘制所有粒子
     */
    private render(): void {
      if (!ctx.value || !canvasRef.value) return

      // 清除整个画布
      ctx.value.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      // 设置混合模式为"变亮"，增强视觉效果
      ctx.value.globalCompositeOperation = 'lighter'

      // 渲染所有活动粒子
      for (const particle of this.activeParticles) {
        this.drawParticle(particle)
      }
    }

    /**
     * 动画主循环
     * 使用箭头函数保持this绑定
     */
    private animate = (): void => {
      this.updateParticles() // 更新粒子状态
      this.render() // 渲染粒子
      this.animationId = requestAnimationFrame(this.animate) // 请求下一帧
    }

    /**
     * 更新画布尺寸缓存
     * 在窗口大小改变时调用
     * @param width 新的画布宽度
     * @param height 新的画布高度
     */
    updateCanvasSize(width: number, height: number): void {
      this.canvasWidth = width
      this.canvasHeight = height
    }

    /**
     * 启动动画循环
     */
    start(): void {
      this.animate()
    }

    /**
     * 停止动画循环
     * 在组件卸载时调用，避免内存泄漏
     */
    stop(): void {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = 0
      }
    }

    /**
     * 获取当前活动粒子数量
     * 用于调试和性能监控
     * @returns 活动粒子数量
     */
    getActiveParticleCount(): number {
      return this.activeParticles.length
    }
  }

  /** 烟花系统实例 */
  const fireworkSystem = new FireworkSystem()

  /**
   * 处理键盘快捷键
   * 监听 Ctrl+Shift+P 或 Cmd+Shift+P 组合键触发烟花
   * @param event 键盘事件对象
   */
  const handleKeyPress = (event: KeyboardEvent): void => {
    const isFireworkShortcut =
      (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') ||
      (event.metaKey && event.shiftKey && event.key.toLowerCase() === 'p')

    if (isFireworkShortcut) {
      event.preventDefault()
      fireworkSystem.createFirework()
    }
  }

  /**
   * 调整Canvas画布大小
   * 响应窗口大小变化，确保画布始终覆盖整个视口
   */
  const resizeCanvas = (): void => {
    if (!canvasRef.value) return

    const { innerWidth, innerHeight } = window
    canvasRef.value.width = innerWidth
    canvasRef.value.height = innerHeight
    fireworkSystem.updateCanvasSize(innerWidth, innerHeight)
  }

  /**
   * 处理外部触发的烟花事件
   * 通过 mittBus 事件总线接收触发指令
   * @param event 事件数据，可能包含图片URL
   */
  const handleFireworkTrigger: Handler<unknown> = (event: unknown) => {
    const imageUrl = event as string | undefined
    fireworkSystem.createFirework(imageUrl)
  }

  /**
   * 组件挂载时的初始化逻辑
   */
  onMounted(async () => {
    if (!canvasRef.value) return

    // 获取Canvas 2D绘制上下文
    ctx.value = canvasRef.value.getContext('2d')
    if (!ctx.value) return

    // 设置初始画布大小
    resizeCanvas()

    // 预加载所有图片资源
    await fireworkSystem.preloadAllImages()

    // 启动动画循环
    fireworkSystem.start()

    // 注册事件监听器
    useEventListener(window, 'keydown', handleKeyPress) // 键盘快捷键
    useEventListener(window, 'resize', resizeCanvas) // 窗口大小变化
    mittBus.on('triggerFireworks', handleFireworkTrigger) // 外部触发事件
  })

  /**
   * 组件卸载时的清理逻辑
   * 停止动画循环并移除事件监听器，防止内存泄漏
   */
  onUnmounted(() => {
    fireworkSystem.stop()
    mittBus.off('triggerFireworks', handleFireworkTrigger)
  })
</script>

<style scoped>
  /**
 * 烟花画布样式
 * 固定定位覆盖整个视口，不响应鼠标事件
 */
  .layout-fireworks {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999; /* 最高层级，确保在所有元素之上 */
    width: 100%;
    height: 100%;
    pointer-events: none; /* 不阻挡用户交互 */
  }
</style>
