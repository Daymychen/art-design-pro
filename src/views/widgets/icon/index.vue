<template>
  <div class="space-y-5 mb-5">
    <div class="text-2xl font-medium mt-5 max-sm:text-2xl max-sm:mt-3">图标</div>
    <div class="text-g-800">
      v.3.0 版本图标库升级为 iconify，可在
      <a href="https://icones.js.org/" target="_blank" class="text-theme hover:underline"
        >Iconify</a
      >
      中查找，支持多种图标库，如 Remix Icon, Solar, Tabler Icons 等。
    </div>
    <div class="text-g-800">
      为确保系统图标风格统一，项目全部采用 Remix Icon 图标库，可在
      <a
        href="https://icones.js.org/collection/ri"
        target="_blank"
        class="text-theme hover:underline"
        >Iconify</a
      >
      或<a href="https://remixicon.com/" target="_blank" class="text-theme hover:underline">
        Remix Icon 官网 </a
      >搜索使用。
    </div>

    <!-- Iconify 图标 -->
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">Iconify</div>
      <div class="flex items-center gap-6">
        <ArtSvgIcon icon="ri:github-fill" class="text-2xl" />
        <ArtSvgIcon icon="ri:copilot-line" class="text-2xl text-theme" />
        <ArtSvgIcon icon="ri:edge-line" class="text-2xl text-secondary" />
        <ArtSvgIcon icon="ri:planet-line" class="text-2xl text-warning" />
        <ArtSvgIcon icon="ri:windows-line" class="text-2xl text-info" />
        <ArtSvgIcon icon="ri:thumb-up-line" class="text-2xl text-danger" />
        <ArtSvgIcon icon="ri:gift-2-line" class="text-2xl text-success" />
        <ArtSvgIcon icon="ri:apple-line" class="text-2xl text-secondary" />
      </div>
    </div>

    <!-- Svg Icons -->
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">Svg Icons</div>
      <div class="flex items-center gap-6">
        <ArtSvgIcon icon="svg-spinners:3-dots-fade" class="text-2xl text-red-400" />
        <ArtSvgIcon icon="svg-spinners:3-dots-bounce" class="text-2xl text-blue-400" />
        <ArtSvgIcon icon="svg-spinners:3-dots-move" class="text-2xl text-orange-400" />
        <ArtSvgIcon icon="svg-spinners:3-dots-rotate" class="text-2xl text-purple-400" />
        <ArtSvgIcon icon="svg-spinners:blocks-shuffle-2" class="text-2xl text-pink-300" />
        <ArtSvgIcon icon="svg-spinners:clock" class="text-2xl text-yellow-500" />
        <ArtSvgIcon icon="svg-spinners:tadpole" class="text-2xl text-orange-500" />
        <ArtSvgIcon icon="svg-spinners:blocks-wave" class="text-2xl text-blue-500" />
      </div>
    </div>

    <!-- Svg Icons -->
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">Material Line Icons</div>
      <div class="flex items-center gap-6">
        <ArtSvgIcon icon="line-md:phone-call-twotone-loop" class="text-2xl text-blue-500" />

        <ArtSvgIcon icon="line-md:switch-off" class="text-2xl text-green-500" />
        <ArtSvgIcon icon="line-md:sun-rising-filled-loop" class="text-2xl text-yellow-400" />
        <ArtSvgIcon icon="line-md:volume-high-filled" class="text-2xl text-purple-500" />
        <ArtSvgIcon icon="line-md:github-twotone" class="text-2xl text-gray-700" />
        <ArtSvgIcon icon="line-md:telegram" class="text-2xl text-sky-500" />
        <ArtSvgIcon icon="line-md:reddit-loop" class="text-2xl text-orange-400" />
        <ArtSvgIcon
          icon="line-md:coffee-half-empty-filled-loop"
          class="text-2xl text-emerald-500"
        />
      </div>
    </div>

    <!-- 图标选择器 - 预览弹窗模式 -->
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">图标选择器 - 预览弹窗模式</div>

      <!-- 基本用法 -->
      <div class="mb-6">
        <div class="text-sm text-g-600 mb-3">基本用法</div>
        <div class="max-w-md">
          <ArtIconPicker v-model="selectedIcon1" @change="onIconChange1" />
        </div>
        <div class="mt-2 text-sm text-g-600">
          点击选择框打开弹窗，从 4,077 个图标中选择（完全离线）
        </div>
      </div>

      <!-- 多个选择器 -->
      <div class="mb-6">
        <div class="text-sm text-g-600 mb-3">多个选择器示例</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-sm text-g-600 mb-1 block">应用图标</label>
            <ArtIconPicker v-model="selectedIcon2" @change="onIconChange2" />
          </div>
          <div>
            <label class="text-sm text-g-600 mb-1 block">用户图标</label>
            <ArtIconPicker v-model="selectedIcon3" @change="onIconChange3" />
          </div>
          <div>
            <label class="text-sm text-g-600 mb-1 block">设置图标</label>
            <ArtIconPicker v-model="selectedIcon4" @change="onIconChange4" />
          </div>
        </div>
      </div>

      <!-- 选中图标信息展示 -->
      <div v-if="hasSelectedIcons" class="mb-6">
        <div class="text-sm text-g-600 mb-3">已选择的图标信息：</div>
        <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="selectedIcon1">
              <h5 class="font-medium text-g-800 mb-2">主选择器：</h5>
              <div class="flex items-center gap-2 mb-2">
                <ArtSvgIcon
                  :icon="selectedIcon1.id"
                  class="text-xl"
                  :style="{ color: selectedIcon1.color }"
                />
                <span class="text-sm">{{ selectedIcon1.name }}</span>
              </div>
              <div class="text-xs text-g-600 space-y-1">
                <div>ID: {{ selectedIcon1.id }}</div>
                <div>前缀: {{ selectedIcon1.prefix }}</div>
                <div>标签: {{ selectedIcon1.tags?.slice(0, 3).join(', ') || '无' }}</div>
              </div>
            </div>

            <div v-if="selectedIcon2 || selectedIcon3 || selectedIcon4">
              <h5 class="font-medium text-g-800 mb-2">其他选择器：</h5>
              <div class="space-y-2">
                <div v-if="selectedIcon2" class="flex items-center gap-2">
                  <ArtSvgIcon
                    :icon="selectedIcon2.id"
                    class="text-sm"
                    :style="{ color: selectedIcon2.color }"
                  />
                  <span class="text-xs">{{ selectedIcon2.name }}</span>
                </div>
                <div v-if="selectedIcon3" class="flex items-center gap-2">
                  <ArtSvgIcon
                    :icon="selectedIcon3.id"
                    class="text-sm"
                    :style="{ color: selectedIcon3.color }"
                  />
                  <span class="text-xs">{{ selectedIcon3.name }}</span>
                </div>
                <div v-if="selectedIcon4" class="flex items-center gap-2">
                  <ArtSvgIcon
                    :icon="selectedIcon4.id"
                    class="text-sm"
                    :style="{ color: selectedIcon4.color }"
                  />
                  <span class="text-xs">{{ selectedIcon4.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用代码示例 -->
      <div>
        <div class="text-sm text-g-600 mb-3">组件使用代码</div>
        <div class="space-y-2">
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;!-- 基本使用 --&gt;
            <br />
            &lt;ArtIconPicker v-model="selectedIcon" @change="handleIconChange" /&gt;
            <br /><br />
            &lt;!-- 使用选中的图标 --&gt;
            <br />
            &lt;ArtSvgIcon :icon="selectedIcon.id" :style="{ color: selectedIcon.color }" /&gt;
          </div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded text-sm text-g-800">
            <div class="font-mono mb-2">// TypeScript 类型定义</div>
            <div class="font-mono">interface IconItem {</div>
            <div class="font-mono ml-4">id: string</div>
            <div class="font-mono ml-4">name: string</div>
            <div class="font-mono ml-4">prefix: string</div>
            <div class="font-mono ml-4">category: string</div>
            <div class="font-mono ml-4">color: string</div>
            <div class="font-mono ml-4">tags: string[]</div>
            <div class="font-mono">}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 离线使用说明 -->
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">离线图标数据说明</div>
      <div class="space-y-4">
        <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded">
          <h4 class="font-medium text-g-800 mb-2">🔧 图标数据结构</h4>
          <p class="text-sm text-g-700 mb-3">
            图标选择器现在使用本地JSON数据文件，包含以下常用图标集：
          </p>
          <ul class="text-sm text-g-700 space-y-1 mb-3">
            <li>• <strong>Remix Icon (ri:)</strong> - 3,135个图标</li>
            <li>• <strong>Element Plus (ep:)</strong> - 293个UI图标</li>
            <li>• <strong>Font Awesome (fa:)</strong> - 649个经典图标</li>
            <li class="text-g-500 line-through"
              >• <strong>Material Design (mdi:)</strong> - 已注释，未加载</li
            >
          </ul>
          <p class="text-sm text-g-700 mb-3">
            <strong>数据特性：</strong>
          </p>
          <ul class="text-sm text-g-700 space-y-1 mb-3">
            <li>• 每个图标都有随机分配的颜色</li>
            <li>• 支持图标分类和标签搜索</li>
            <li>• 完全离线使用，无需网络请求</li>
            <li>• 数据文件位置：src/components/core/forms/art-icon-picker/data.json</li>
          </ul>
        </div>

        <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded">
          <h4 class="font-medium text-g-800 mb-2">💡 使用和管理</h4>
          <div class="text-sm text-g-700 space-y-2">
            <div>
              <strong>1. 数据更新：</strong>
              <p class="mt-1">运行脚本下载最新图标数据：</p>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                pnpm download
              </div>
              <p class="mt-1 text-xs text-g-600">或者直接运行：</p>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                tsx scripts/download-icons.ts
              </div>
            </div>
            <div>
              <strong>2. 自定义图标：</strong>
              <p class="mt-1">直接编辑 data.json 文件添加新图标或修改颜色</p>
            </div>
            <div>
              <strong>3. 图标格式：</strong>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                { "id": "ri:home-line", "name": "home-line", "prefix": "ri",<br />
                &nbsp;&nbsp;"category": "Remix Icon", "color": "#8B5CF6", "tags": ["home", "主页"] }
              </div>
              <p class="mt-1 text-xs text-g-600">每个图标的颜色是从15种预设颜色中随机分配的</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 完整离线使用指南 -->
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">🌐 完整离线使用指南</div>
      <div class="space-y-4">
        <div
          class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded"
        >
          <h4 class="font-medium text-purple-800 dark:text-purple-300 mb-2">📌 两种离线方案</h4>
          <div class="text-sm text-purple-700 dark:text-purple-400 space-y-2">
            <div>
              <strong>1. 图标选择器离线（已实现）：</strong>
              <p class="mt-1">使用本地 data.json 文件，包含 4,077 个图标数据，用于图标选择器组件</p>
            </div>
            <div>
              <strong>2. 图标渲染离线（需配置）：</strong>
              <p class="mt-1">安装 @iconify-json 包，实现图标 SVG 的完全离线渲染，无需 CDN</p>
            </div>
          </div>
        </div>

        <div
          class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded"
        >
          <h4 class="font-medium text-orange-800 dark:text-orange-300 mb-2"
            >⚙️ 图标渲染离线配置（完整教程）</h4
          >
          <div class="text-sm text-orange-700 dark:text-orange-400 space-y-3">
            <div>
              <strong>步骤 1：安装图标集包</strong>
              <p class="mt-1">根据项目使用的图标库安装对应的 @iconify-json 离线包：</p>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-3 rounded mt-2 space-y-1">
                <div># 安装 Remix Icon（系统必需，推荐）</div>
                <div class="text-green-600 dark:text-green-400">pnpm add -D @iconify-json/ri</div>
                <div class="mt-2"># 安装其他图标集（按需选择）</div>
                <div class="text-blue-600 dark:text-blue-400">pnpm add -D @iconify-json/ep</div>
                <div class="text-blue-600 dark:text-blue-400">pnpm add -D @iconify-json/fa</div>
                <div class="text-blue-600 dark:text-blue-400"
                  >pnpm add -D @iconify-json/svg-spinners</div
                >
                <div class="text-blue-600 dark:text-blue-400"
                  >pnpm add -D @iconify-json/line-md</div
                >
                <div class="mt-2"># 或一次性安装所有图标集（体积大，不推荐）</div>
                <div class="text-red-600 dark:text-red-400">pnpm add -D @iconify/json</div>
              </div>
            </div>

            <div>
              <strong>步骤 2：导入并注册图标集</strong>
              <p class="mt-1">在应用入口文件（如 main.ts）中导入并注册图标集：</p>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-3 rounded mt-2">
                <div>import { addCollection } from '@iconify/vue'</div>
                <div class="mt-2">// 导入图标集数据</div>
                <div>import { icons as riIcons } from '@iconify-json/ri'</div>
                <div>import { icons as epIcons } from '@iconify-json/ep'</div>
                <div>import { icons as svgSpinners } from '@iconify-json/svg-spinners'</div>
                <div class="mt-2">// 注册图标集</div>
                <div>addCollection(riIcons)</div>
                <div>addCollection(epIcons)</div>
                <div>addCollection(svgSpinners)</div>
              </div>
              <p class="mt-2 text-xs">💡 提示：只需在应用启动时注册一次，之后所有组件都可以使用</p>
            </div>

            <div>
              <strong>步骤 3：使用图标</strong>
              <p class="mt-1">注册后，图标会从本地数据加载，无需 CDN：</p>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-3 rounded mt-2">
                <div>&lt;ArtSvgIcon icon="ri:home-line" /&gt;</div>
                <div>&lt;ArtSvgIcon icon="ep:setting" /&gt;</div>
                <div>&lt;ArtSvgIcon icon="svg-spinners:3-dots-fade" /&gt;</div>
              </div>
            </div>

            <div>
              <strong>步骤 4：验证离线（3种方法）</strong>
              <ul class="mt-1 space-y-1 text-xs list-disc list-inside">
                <li
                  ><strong>Network 面板：</strong>打开开发者工具，检查无 api.iconify.design 请求</li
                >
                <li><strong>断网测试：</strong>断开网络，刷新页面，图标仍正常显示</li>
                <li><strong>控制台检查：</strong>无 "Loading icon from API" 警告信息</li>
              </ul>
            </div>

            <div
              class="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded border border-yellow-200 dark:border-yellow-700"
            >
              <p class="text-xs"
                ><strong>⚠️ 重要：</strong>如果使用 unplugin-icons
                插件，可以跳过步骤2，插件会自动处理图标导入。但手动注册方式更灵活，推荐用于生产环境。</p
              >
            </div>
          </div>
        </div>

        <div
          class="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 p-4 rounded"
        >
          <h4 class="font-medium text-cyan-800 dark:text-cyan-300 mb-2">📊 图标集大小对比</h4>
          <div class="text-sm text-cyan-700 dark:text-cyan-400">
            <p class="mb-2">各图标集的安装大小参考：</p>
            <div class="font-mono text-xs bg-white dark:bg-g-800 p-3 rounded space-y-1">
              <div class="flex justify-between">
                <span>@iconify-json/ri</span>
                <span class="text-green-600 dark:text-green-400">~2.5MB（推荐）</span>
              </div>
              <div class="flex justify-between">
                <span>@iconify-json/ep</span>
                <span class="text-green-600 dark:text-green-400">~200KB</span>
              </div>
              <div class="flex justify-between">
                <span>@iconify-json/fa</span>
                <span class="text-green-600 dark:text-green-400">~1.5MB</span>
              </div>
              <div class="flex justify-between">
                <span>@iconify-json/svg-spinners</span>
                <span class="text-green-600 dark:text-green-400">~100KB</span>
              </div>
              <div class="flex justify-between">
                <span>@iconify-json/line-md</span>
                <span class="text-green-600 dark:text-green-400">~300KB</span>
              </div>
              <div
                class="flex justify-between border-t border-cyan-200 dark:border-cyan-700 pt-1 mt-1"
              >
                <span>@iconify/json（全部）</span>
                <span class="text-red-600 dark:text-red-400">~150MB（不推荐）</span>
              </div>
            </div>
            <p class="mt-2 text-xs">💡 建议：只安装项目实际使用的图标集，避免不必要的体积</p>
          </div>
        </div>

        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded"
        >
          <h4 class="font-medium text-blue-800 dark:text-blue-300 mb-2">✅ 完全离线的优势</h4>
          <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• <strong>零网络依赖：</strong>图标数据和 SVG 完全本地化，无需 CDN 或 API</li>
            <li>• <strong>加载速度快：</strong>本地读取，无网络延迟</li>
            <li>• <strong>体积可控：</strong>按需安装图标集，避免不必要的体积</li>
            <li>• <strong>稳定可靠：</strong>不受第三方服务影响，适合内网或离线环境</li>
            <li>• <strong>开发体验好：</strong>离线开发，不依赖网络环境</li>
          </ul>
        </div>

        <div
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded"
        >
          <h4 class="font-medium text-green-800 dark:text-green-300 mb-2">🎯 推荐配置方案</h4>
          <div class="text-sm text-green-700 dark:text-green-400 space-y-2">
            <div>
              <strong>方案一：最小化配置（推荐）</strong>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                pnpm add -D @iconify-json/ri
              </div>
              <p class="mt-1 text-xs">适合：只使用 Remix Icon 的项目，体积最小</p>
            </div>
            <div>
              <strong>方案二：常用配置</strong>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                pnpm add -D @iconify-json/ri @iconify-json/svg-spinners
              </div>
              <p class="mt-1 text-xs">适合：需要基础图标 + 加载动画的项目</p>
            </div>
            <div>
              <strong>方案三：完整配置</strong>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                pnpm add -D @iconify-json/ri @iconify-json/ep @iconify-json/fa
                @iconify-json/svg-spinners @iconify-json/line-md
              </div>
              <p class="mt-1 text-xs">适合：需要多种图标库的大型项目</p>
            </div>
          </div>
        </div>

        <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded">
          <h4 class="font-medium text-g-800 mb-2">🔨 打包配置</h4>
          <div class="text-sm text-g-700 space-y-3">
            <div>
              <strong>1. 确保数据文件被打包：</strong>
              <p class="mt-1">data.json 文件会自动被 Vite 打包，无需额外配置</p>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                // 文件路径<br />
                src/components/core/forms/art-icon-picker/data.json
              </div>
            </div>

            <div>
              <strong>2. 打包命令：</strong>
              <div class="font-mono text-xs bg-white dark:bg-g-800 p-2 rounded mt-1">
                pnpm build
              </div>
              <p class="mt-1 text-xs text-g-600"
                >打包后 data.json 会被编译到 dist 目录的 assets 中</p
              >
            </div>

            <div>
              <strong>3. 优化建议：</strong>
              <ul class="mt-1 space-y-1 text-xs">
                <li>• 如果只需要特定图标库，可以在 scripts/download-icons.ts 中注释不需要的库</li>
                <li>• 服务器启用 gzip/brotli 压缩可大幅减小传输体积</li>
                <li>• 图标选择器使用懒加载，不会影响首屏加载速度</li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded"
        >
          <h4 class="font-medium text-green-800 dark:text-green-300 mb-2">🚀 部署检查清单</h4>
          <ul class="text-sm text-green-700 dark:text-green-400 space-y-1">
            <li>✓ 确认 data.json 文件存在于源码中</li>
            <li>✓ 运行 pnpm build 进行生产环境打包</li>
            <li>✓ 检查 dist/assets 目录中是否包含图标数据</li>
            <li>✓ 测试图标选择器功能是否正常</li>
            <li>✓ 配置服务器压缩以优化传输大小</li>
          </ul>
        </div>

        <div
          class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded"
        >
          <h4 class="font-medium text-yellow-800 dark:text-yellow-300 mb-2">⚠️ 注意事项</h4>
          <ul class="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
            <li>• 图标数据文件约 800KB，首次加载时会有短暂延迟（已优化为异步加载）</li>
            <li>• 如需添加更多图标库，修改 download-icons.ts 并重新运行下载脚本</li>
            <li>• 图标颜色是随机分配的，如需固定颜色可直接修改 data.json</li>
            <li>• 内网环境部署时，确保 data.json 文件可被正常访问</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 使用示例 -->
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">使用示例</div>
      <div class="space-y-4">
        <div>
          <div class="text-sm text-g-600 mb-2">基础使用</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:home-line" /&gt;
          </div>
        </div>
        <div>
          <div class="text-sm text-g-600 mb-2">自定义大小</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:user-line" class="text-2xl" /&gt;
          </div>
        </div>
        <div>
          <div class="text-sm text-g-600 mb-2">自定义颜色</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:heart-fill" class="text-red-500" /&gt;
          </div>
        </div>
        <div>
          <div class="text-sm text-g-600 mb-2">组合使用</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:star-fill" class="text-4xl text-yellow-500" /&gt;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import ArtIconPicker from '@/components/core/forms/art-icon-picker/index.vue'

  interface IconItem {
    id: string
    name: string
    prefix: string
    category: string
    color: string
    tags: string[]
  }

  defineOptions({ name: 'IconPage' })

  // 多个图标选择器的状态
  const selectedIcon1 = ref<IconItem | null>(null)
  const selectedIcon2 = ref<IconItem | null>(null)
  const selectedIcon3 = ref<IconItem | null>(null)
  const selectedIcon4 = ref<IconItem | null>(null)

  // 计算是否有选中的图标
  const hasSelectedIcons = computed(() => {
    return selectedIcon1.value || selectedIcon2.value || selectedIcon3.value || selectedIcon4.value
  })

  // 图标变化处理函数
  const onIconChange1 = (icon: IconItem | null) => {
    console.log('Icon 1 selected:', icon)
  }

  const onIconChange2 = (icon: IconItem | null) => {
    console.log('Icon 2 selected:', icon)
  }

  const onIconChange3 = (icon: IconItem | null) => {
    console.log('Icon 3 selected:', icon)
  }

  const onIconChange4 = (icon: IconItem | null) => {
    console.log('Icon 4 selected:', icon)
  }
</script>
