<template>
  <div class="page-content">
    <div class="header">
      <h2>权限</h2>
      <p>本项目实现了菜单权限、路由权限和按钮权限</p>
    </div>

    <div class="row">
      <h3>菜单权限</h3>
      <p
        >菜单权限通过 src/router/modules/asyncRoutes.ts
        配置，如果数据结构存在菜单就会显示并动态注册路由</p
      >
      <p>注意：正式项目需要后端返回菜单数据结构</p>

      <b>代码示例：</b>
      <pre>
        <code>
          {
            id: 3,
            path: '/menu',
            name: 'Menu',
            component: RoutesAlias.Home,
            meta: {
              title: 'menus.menu.title',
              icon: '&#xe8a4;',
              keepAlive: false
            },
            children: [
              {
                id: 401,
                path: 'menu',
                name: 'Menus',
                component: RoutesAlias.Menu,
                meta: {
                  title: 'menus.menu.menu',
                  icon: '&#xe8a4;',
                  keepAlive: true,
                  authList: [
                    {
                      id: 4011,
                      title: '新增',
                      auth_mark: 'add'
                    },
                    {
                      id: 4012,
                      title: '编辑',
                      auth_mark: 'edit'
                    },
                    {
                      id: 4013,
                      title: '删除',
                      auth_mark: 'delete'
                    }
                  ]
                }
              },
            ]
          },
        </code>
      </pre>
    </div>

    <div class="row">
      <h3>路由权限</h3>
      <p>通过菜单数据动态组成路由数据，动态注册路由，菜单中没有的路由不会注册</p>
      <pre>
        <code>
          // 静态路由（不需要权限）
          // src/router/index.ts
          const staticRoutes = [];

          // 动态路由（需要权限）
          // src/router/modules/asyncRoutes.ts
          const asyncRoutes = []; 
        </code>
      </pre>
    </div>

    <div class="row">
      <h3>按钮权限</h3>
      <p
        >通过配置菜单列表的 authList 配置按钮权限，如果 authList 的 auth_mark 与页面上的自定义指令
        v-auth="'add'" 相匹配，则显示该按钮</p
      >
      <el-row>
        <el-button v-auth="'add'" type="primary" size="default">新增</el-button>
        <el-button v-auth="'edit'" type="default" size="default">编辑</el-button>
        <el-button v-auth="'delete'" type="danger" size="default">删除</el-button>
      </el-row>

      <b>代码示例：</b>
      <pre>
        <code>
          {
            id: 3,
            path: '/menu',
            name: 'Menu',
            component: RoutesAlias.Home,
            meta: {
              title: 'menus.menu.title',
              icon: '&#xe8a4;',
              keepAlive: false
            },
            children: [
              {
                id: 401,
                path: 'menu',
                name: 'Menus',
                component: RoutesAlias.Menu,
                meta: {
                  title: 'menus.menu.menu',
                  icon: '&#xe8a4;',
                  keepAlive: true,
                  authList: [
                    {
                      id: 4011,
                      title: '新增',
                      auth_mark: 'add'
                    },
                    {
                      id: 4012,
                      title: '编辑',
                      auth_mark: 'edit'
                    },
                    {
                      id: 4013,
                      title: '删除',
                      auth_mark: 'delete'
                    }
                  ]
                }
              },
            ]
          },
        </code>
      </pre>
    </div>

    <div class="row">
      <h3>按钮权限指令</h3>
      <p
        >v-auth 指令，如果 authList 的 auth_mark 内容与页面上的自定义指令 v-auth="'add'"
        相匹配，则显示该按钮</p
      >
      <b>代码示例：</b>
      <pre>
        <code>
          &lt;el-button v-auth="'add'"&gt;新增&lt;/el-button&gt;
          &lt;el-button v-auth="'edit'"&gt;编辑&lt;/el-button&gt;
          &lt;el-button v-auth="'delete'"&gt;删除&lt;/el-button&gt;
        </code>
      </pre>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .page-content {
    .header {
      h2 {
        font-size: 28px;
        font-weight: 500;
        color: var(--art-text-gray-900) !important;
      }

      p {
        margin-top: 5px;
        font-size: 16px;
        color: var(--art-text-gray-700);
      }
    }

    .row {
      margin-top: 50px;

      h3 {
        font-size: 24px;
        font-weight: 500;
        color: var(--art-text-gray-900) !important;
      }

      p {
        margin: 5px 0 20px;
        font-size: 16px;
        color: var(--art-text-gray-700);
      }

      b {
        display: block;
        margin-top: 20px;
        color: var(--art-text-gray-900);
      }

      pre {
        padding: 10px 0 0;
        margin-top: 20px;
        background-color: var(--art-bg-color);
        border: 1px solid var(--art-border-dashed-color);
        border-radius: 5px;

        code {
          position: relative;
          left: -60px;
          color: var(--art-text-gray-800) !important;
        }
      }
    }
  }
</style>
