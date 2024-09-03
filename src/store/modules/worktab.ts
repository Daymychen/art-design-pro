import { defineStore } from 'pinia'
import { WorkTabType } from '@/types/store'
import { HOME_PAGE } from '@/router/index'
import { Router } from 'vue-router'
import { getSysStorage } from '@/utils/storage'

interface WorktabState {
  opened: WorkTabType[]
  current: Partial<WorkTabType>
}

export const useWorktabStore = defineStore({
  id: 'worktabStore',
  state: (): WorktabState => ({
    current: {},
    opened: []
  }),
  getters: {},
  actions: {
    // 初始化State
    initState() {
      let sys = getSysStorage()

      if (sys) {
        sys = JSON.parse(sys)

        const { worktab } = sys.user
        this.current = worktab.current || {}
        this.opened = worktab.opened || []
      }
    },
    // 选项卡路由
    router(to: WorkTabType) {
      const index: number = this.opened.findIndex((i) => i.path === to.path)

      // 新增 tab
      if (index <= -1) {
        this.opened.push(to)
        this.current = to
      } else {
        this.current = this.opened[index]
      }
    },
    // 关闭选项卡
    remove(path: string, router: Router) {
      const opened = this.opened
      let index = opened.findIndex((i) => i.path === path)

      if (index > -1) {
        opened.splice(index, 1)
      }

      // 当页面全部关闭回到首页
      if (!opened.length && path != HOME_PAGE) {
        router.push(HOME_PAGE)
      }

      // 当前页
      if (opened.length && path === this.current.path) {
        if (opened.length === index) {
          index--
        }
        router.push(opened[index].path as string)
      }
    },
    // 关闭左侧页面
    removeLeft(path: string) {
      const currentPath = path
      const list = this.opened

      for (let i = 0; i < list.length; i++) {
        if (list[i].path === currentPath) {
          this.opened.splice(1, i - 1)
          break
        }
      }
    },
    // 关闭右侧页面
    removeRight(path: string) {
      const currentPath = path
      const list = this.opened

      console.log(path)

      for (let i = 0; i < list.length; i++) {
        if (list[i].path === currentPath) {
          this.opened.splice(i + 1)
          break
        }
      }
    },
    // 关闭其他页面
    removeOther(path: string) {
      this.opened = this.opened.filter((item) => {
        return item.path === path || item.path === HOME_PAGE
      })
    },
    // 关闭全部页面
    removeAll(path: string, router: Router) {
      if (path !== HOME_PAGE) {
        this.current = {}
        this.opened = []
        router.push(HOME_PAGE)
      } else {
        this.opened = this.opened.filter((item) => {
          return item.path === path
        })
      }
    }
  }
})
