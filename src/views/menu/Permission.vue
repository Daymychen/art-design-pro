<template>
  <div class="page-content">
    <div class="header">
      <h2 class="custom-text">权限</h2>
      <p>本项目实现了菜单权限、路由权限和按钮权限</p>
    </div>

    <div class="row">
      <h3>菜单权限</h3>
      <p>菜单权限通过 src/mock/menuData.ts 配置，如果数据结构存在菜单就会显示</p>
      <p>注意：正式项目需要后端返回菜单数据结构</p>

      <b>代码示例：</b>
      <pre>
        <code>
          {
            id: 3,
            title: '菜单管理',
            title_en: 'Menu manguage',
            icon: '\ue8a4',
            path: '/menu',
            name: 'Menu',
            children: [
              {
                id: 401,
                title: '菜单权限',
                title_en: 'Menu permissions',
                path: '/menu/menu',
                icon: '\ue8a4',
              },
              {
                id: 411,
                title: '权限控制',
                title_en: 'Permission control',
                path: '/menu/permission',
                icon: '\ue80a',
              },
            ]
          }
        </code>
      </pre>
    </div>

    <div class="row">
      <h3>路由权限</h3>
      <p>路由权限通过菜单数据动态添加路由，如果两边的数据匹配成功则可以访问路由，否则无法访问</p>
      <pre>
        <code>
          // src/router/index.ts
          const routes = []; // 不需要权限的路由
          const roleRoutes = []; // 需要权限的路由
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
            id: 411,
            title: '权限控制',
            title_en: 'Permission control',
            path: '/menu/permission',
            icon: '\ue80a',
            authList: [
              {
                id: 4111,
                title: '新增',
                auth_mark: 'add'
              },
              {
                id: 4112,
                title: '编辑',
                auth_mark: 'edit'
              },
              {
                id: 4113,
                title: '删除',
                auth_mark: 'delete'
              }
            ]
          }
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
