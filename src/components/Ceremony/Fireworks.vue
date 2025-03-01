<template>
  <canvas ref="canvas" class="fireworks-canvas"></canvas>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useEventListener } from '@vueuse/core'
  import mittBus from '@/utils/mittBus'
  import type { Handler } from 'mitt'

  // 对象池大小
  const POOL_SIZE = 600

  // 烟花配置
  const CONFIG = {
    // 每次爆炸产生的粒子数量
    PARTICLES_PER_BURST: 200,
    // 各种形状的尺寸配置
    SIZES: {
      RECTANGLE: { WIDTH: 24, HEIGHT: 12 }, // 矩形宽高
      SQUARE: { SIZE: 12 }, // 正方形边长
      CIRCLE: { SIZE: 12 }, // 圆形直径
      TRIANGLE: { SIZE: 10 }, // 三角形边长
      OVAL: { WIDTH: 24, HEIGHT: 12 }, // 椭圆宽高
      IMAGE: { WIDTH: 30, HEIGHT: 30 } // 图片尺寸
    },
    // 旋转相关参数
    ROTATION: {
      BASE_SPEED: 2, // 基础旋转速度
      RANDOM_SPEED: 3, // 随机旋转速度增量
      DECAY: 0.85 // 旋转衰减系数
    },
    // 烟花粒子颜色配置(带透明度)
    COLORS: [
      'rgba(255, 68, 68, 1)',
      'rgba(255, 68, 68, 0.9)',
      'rgba(255, 68, 68, 0.8)',
      'rgba(255, 116, 188, 1)',
      'rgba(255, 116, 188, 0.9)',
      'rgba(255, 116, 188, 0.8)',
      'rgba(68, 68, 255, 0.8)',
      'rgba(92, 202, 56, 0.7)',
      'rgba(255, 68, 255, 0.8)',
      'rgba(68, 255, 255, 0.7)',
      'rgba(255, 136, 68, 0.7)',
      'rgba(68, 136, 255, 1)',
      'rgba(250, 198, 122, 0.8)'
    ],
    // 烟花粒子形状配置(矩形出现概率更高)
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
  }

  // 图片缓存
  const imageCache: { [url: string]: HTMLImageElement } = {}

  // 预加载图片函数
  const preloadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imageCache[url]) {
        if (imageCache[url].complete) {
          resolve(imageCache[url])
        } else {
          imageCache[url].onload = () => resolve(imageCache[url])
          imageCache[url].onerror = reject
        }
      } else {
        const img = new Image()
        img.crossOrigin = 'anonymous' // 处理CORS
        img.src = url
        img.onload = () => {
          imageCache[url] = img
          resolve(img)
        }
        img.onerror = reject
      }
    })
  }

  interface Firework {
    x: number
    y: number
    color: string
    velocity: { x: number; y: number }
    rotation: number
    rotationX: number
    rotationY: number
    scale: number
    shape: string
    active: boolean
    rotationSpeed: { x: number; y: number; z: number }
    imageUrl?: string
    opacity: number // 新增透明度属性
  }

  const canvas = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const particlePool = ref<Firework[]>([])
  const fireworks = ref<Firework[]>([])

  // 初始化对象池
  const initParticlePool = () => {
    for (let i = 0; i < POOL_SIZE; i++) {
      particlePool.value.push({
        x: 0,
        y: 0,
        color: '',
        velocity: { x: 0, y: 0 },
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        shape: 'circle',
        active: false,
        rotationSpeed: { x: 0, y: 0, z: 0 },
        opacity: 1 // 初始化透明度为1
      })
    }
  }

  // 从对象池获取粒子
  const getParticleFromPool = (): Firework | null => {
    const particle = particlePool.value.find((p) => !p.active)
    if (particle) {
      particle.active = true
      return particle
    }
    return null
  }

  // 创建烟花
  const createFirework = (imageUrl?: string) => {
    // 异步创建粒子，避免阻塞主线程
    setTimeout(() => {
      const startX = Math.random() * window.innerWidth
      const startY = window.innerHeight

      const availableShapes = imageUrl && imageCache[imageUrl] ? ['image'] : CONFIG.SHAPES

      for (let i = 0; i < CONFIG.PARTICLES_PER_BURST; i++) {
        const particle = getParticleFromPool()
        if (!particle) continue

        const angle = (Math.PI * i) / (CONFIG.PARTICLES_PER_BURST / 2)
        const speed = (12 + Math.random() * 6) * 1.5
        const spread = Math.random() * Math.PI * 2

        Object.assign(particle, {
          x: startX,
          y: startY,
          color: CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)],
          velocity: {
            x: Math.cos(angle) * Math.cos(spread) * speed * (Math.random() * 0.5 + 0.5),
            y: Math.sin(angle) * speed - 15
          },
          rotation: Math.random() * 360,
          rotationX: Math.random() * 360 - 180,
          rotationY: Math.random() * 360 - 180,
          scale: 0.8 + Math.random() * 0.4,
          shape: availableShapes[Math.floor(Math.random() * availableShapes.length)],
          imageUrl: imageUrl && imageCache[imageUrl] ? imageUrl : undefined,
          rotationSpeed: {
            x:
              (Math.random() * CONFIG.ROTATION.RANDOM_SPEED + CONFIG.ROTATION.BASE_SPEED) *
              (Math.random() > 0.5 ? 1 : -1),
            y:
              (Math.random() * CONFIG.ROTATION.RANDOM_SPEED + CONFIG.ROTATION.BASE_SPEED) *
              (Math.random() > 0.5 ? 1 : -1),
            z:
              (Math.random() * CONFIG.ROTATION.RANDOM_SPEED + CONFIG.ROTATION.BASE_SPEED) *
              (Math.random() > 0.5 ? 1 : -1)
          },
          opacity: 1 // 初始化透明度为1
        })

        fireworks.value.push(particle)
      }
    }, 0)
  }

  // 更新烟花状态
  const updateFireworks = () => {
    const velocityThreshold = 10 // 设置下落速度阈值，超过此值开始淡出
    const opacityDecay = 0.02 // 设置透明度减少的速度（增大值加快淡出速度）

    for (let i = fireworks.value.length - 1; i >= 0; i--) {
      const firework = fireworks.value[i]
      firework.x += firework.velocity.x
      firework.y += firework.velocity.y
      firework.velocity.y += 0.525
      firework.rotation += firework.rotationSpeed.z
      firework.rotationX += firework.rotationSpeed.x
      firework.rotationY += firework.rotationSpeed.y

      firework.rotationSpeed.x *= CONFIG.ROTATION.DECAY
      firework.rotationSpeed.y *= CONFIG.ROTATION.DECAY
      firework.rotationSpeed.z *= CONFIG.ROTATION.DECAY

      // 如果粒子的下落速度超过阈值，开始减少透明度
      if (firework.velocity.y > velocityThreshold) {
        firework.opacity -= opacityDecay // 根据需要调整淡出的速度
        if (firework.opacity <= 0) {
          firework.active = false
          fireworks.value.splice(i, 1)
          continue
        }
      }

      // 如果粒子超出屏幕范围，回收粒子
      if (
        firework.x < -100 ||
        firework.x > window.innerWidth + 100 ||
        firework.y < -100 ||
        firework.y > window.innerHeight + 100
      ) {
        firework.active = false
        fireworks.value.splice(i, 1)
      }
    }
  }

  // 绘制单个粒子
  const drawFirework = (firework: Firework) => {
    if (!ctx.value) return

    ctx.value.save()
    ctx.value.globalAlpha = firework.opacity // 设置当前粒子的透明度
    ctx.value.translate(firework.x, firework.y)
    ctx.value.rotate((firework.rotation * Math.PI) / 180)
    ctx.value.scale(firework.scale, firework.scale)

    switch (firework.shape) {
      case 'rectangle':
        ctx.value.fillStyle = firework.color
        ctx.value.fillRect(
          -CONFIG.SIZES.RECTANGLE.WIDTH / 2,
          -CONFIG.SIZES.RECTANGLE.HEIGHT / 2,
          CONFIG.SIZES.RECTANGLE.WIDTH,
          CONFIG.SIZES.RECTANGLE.HEIGHT
        )
        break
      case 'square':
        ctx.value.fillStyle = firework.color
        ctx.value.fillRect(
          -CONFIG.SIZES.SQUARE.SIZE / 2,
          -CONFIG.SIZES.SQUARE.SIZE / 2,
          CONFIG.SIZES.SQUARE.SIZE,
          CONFIG.SIZES.SQUARE.SIZE
        )
        break
      case 'circle':
        ctx.value.fillStyle = firework.color
        ctx.value.beginPath()
        ctx.value.arc(0, 0, CONFIG.SIZES.CIRCLE.SIZE / 2, 0, Math.PI * 2)
        ctx.value.closePath()
        ctx.value.fill()
        break
      case 'triangle':
        ctx.value.fillStyle = firework.color
        ctx.value.beginPath()
        ctx.value.moveTo(0, -CONFIG.SIZES.TRIANGLE.SIZE)
        ctx.value.lineTo(CONFIG.SIZES.TRIANGLE.SIZE, CONFIG.SIZES.TRIANGLE.SIZE)
        ctx.value.lineTo(-CONFIG.SIZES.TRIANGLE.SIZE, CONFIG.SIZES.TRIANGLE.SIZE)
        ctx.value.closePath()
        ctx.value.fill()
        break
      case 'oval':
        ctx.value.fillStyle = firework.color
        ctx.value.beginPath()
        ctx.value.ellipse(
          0,
          0,
          CONFIG.SIZES.OVAL.WIDTH / 2,
          CONFIG.SIZES.OVAL.HEIGHT / 2,
          0,
          0,
          Math.PI * 2
        )
        ctx.value.closePath()
        ctx.value.fill()
        break
      case 'image':
        if (firework.imageUrl) {
          const img = imageCache[firework.imageUrl]
          if (img && img.complete) {
            ctx.value.drawImage(
              img,
              -CONFIG.SIZES.IMAGE.WIDTH / 2,
              -CONFIG.SIZES.IMAGE.HEIGHT / 2,
              CONFIG.SIZES.IMAGE.WIDTH,
              CONFIG.SIZES.IMAGE.HEIGHT
            )
          }
        }
        break
      default:
        break
    }

    ctx.value.restore()
  }

  // 绘制所有烟花
  const draw = () => {
    if (!ctx.value || !canvas.value) return

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.value.globalCompositeOperation = 'lighter'

    fireworks.value.forEach((firework) => {
      drawFirework(firework)
    })
  }

  // 动画循环
  const animate = () => {
    updateFireworks()
    draw()
    animationFrame = requestAnimationFrame(animate)
  }

  let animationFrame: number

  // 处理快捷键
  const handleKeyPress = (event: KeyboardEvent) => {
    // 检查是否同时按下 Ctrl + Shift + F (Windows/Linux) 或 Command + Shift + F (macOS)
    if (
      (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') ||
      (event.metaKey && event.shiftKey && event.key.toLowerCase() === 'p')
    ) {
      event.preventDefault()
      createFirework()
    }
  }

  // 调整Canvas大小
  const resizeCanvas = () => {
    if (canvas.value) {
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
    }
  }

  import bp from '@imgs/ceremony/hb.png'
  import sd from '@imgs/ceremony/sd.png'
  import yd from '@imgs/ceremony/yd.png'

  // 预加载所有需要的图片
  const preloadAllImages = async () => {
    const imageUrls = [bp, sd, yd]

    try {
      await Promise.all(imageUrls.map((url) => preloadImage(url)))
    } catch (error) {
      console.error('Image preloading failed', error)
    }
  }

  onMounted(async () => {
    if (canvas.value) {
      ctx.value = canvas.value.getContext('2d')
      resizeCanvas()
    }
    initParticlePool()

    // 预加载所有图片
    await preloadAllImages()

    animate()
    useEventListener(window, 'keydown', handleKeyPress)
    useEventListener(window, 'resize', resizeCanvas)

    // 监听触发烟花的事件
    mittBus.on('triggerFireworks', ((event: unknown) => {
      const imageUrl = event as string | undefined
      if (imageUrl && imageCache[imageUrl]?.complete) {
        createFirework(imageUrl)
      } else {
        createFirework()
      }
    }) as Handler<unknown>)
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationFrame)
    mittBus.off('triggerFireworks')
  })
</script>

<style scoped>
  .fireworks-canvas {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
