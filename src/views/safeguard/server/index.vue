<template>
  <div class="page-content server">
    <div class="list">
      <div class="middle">
        <div class="item" v-for="item in serverList" :key="item.name">
          <div class="header">
            <span class="name">{{ item.name }}</span>
            <span class="ip">{{ item.ip }}</span>
          </div>
          <div class="box">
            <div class="left">
              <img src="@imgs/safeguard/server.png" alt="服务器" />
              <el-button-group class="ml-4">
                <el-button type="primary" size="default">开机</el-button>
                <el-button type="danger" size="default">关机</el-button>
                <el-button type="warning" size="default">重启</el-button>
              </el-button-group>
            </div>
            <div class="right">
              <div>
                <p>CPU</p>
                <el-progress :percentage="item.cup" :text-inside="true" :stroke-width="17" />
              </div>
              <div>
                <p>RAM</p>
                <el-progress
                  :percentage="item.memory"
                  status="success"
                  :text-inside="true"
                  :stroke-width="17"
                />
              </div>
              <div>
                <p>SWAP</p>
                <el-progress
                  :percentage="item.swap"
                  status="warning"
                  :text-inside="true"
                  :stroke-width="17"
                />
              </div>
              <div>
                <p>DISK</p>
                <el-progress
                  :percentage="item.disk"
                  status="success"
                  :text-inside="true"
                  :stroke-width="17"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, onUnmounted } from 'vue'

  interface ServerInfo {
    name: string
    ip: string
    cup: number
    memory: number
    swap: number
    disk: number
  }

  const serverList = reactive<ServerInfo[]>([
    {
      name: '开发服务器',
      ip: '192.168.1.100',
      cup: 85,
      memory: 65,
      swap: 45,
      disk: 92
    },
    {
      name: '测试服务器',
      ip: '192.168.1.101',
      cup: 32,
      memory: 78,
      swap: 90,
      disk: 45
    },
    {
      name: '预发布服务器',
      ip: '192.168.1.102',
      cup: 95,
      memory: 42,
      swap: 67,
      disk: 88
    },
    {
      name: '线上服务器',
      ip: '192.168.1.103',
      cup: 58,
      memory: 93,
      swap: 25,
      disk: 73
    }
  ])

  // 生成随机数据的函数
  function generateRandomValue(min = 0, max = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // 更新服务器数据
  function updateServerData() {
    serverList.forEach((server) => {
      server.cup = generateRandomValue()
      server.memory = generateRandomValue()
      server.swap = generateRandomValue()
      server.disk = generateRandomValue()
    })
  }

  // 修改 timer 类型为 number | null
  let timer: number | null = null

  onMounted(() => {
    timer = window.setInterval(updateServerData, 3000)
  })

  onUnmounted(() => {
    if (timer !== null) {
      window.clearInterval(timer)
      timer = null
    }
  })
</script>

<style lang="scss" scoped>
  .server {
    .list {
      width: 100%;

      .middle {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 20px);

        .item {
          box-sizing: border-box;
          width: calc(50% - 20px);
          margin: 0 20px 20px 0;
          border: 1px solid var(--el-border-color-light);
          border-radius: 4px;

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            border-bottom: 1px solid var(--el-border-color-light);

            .name {
              font-size: 15px;
              font-weight: 500;
            }

            .ip {
              font-size: 14px;
              color: var(--el-text-color-secondary);
            }
          }

          .box {
            display: flex;
            align-items: center;
            padding: 40px;

            .left {
              margin: 0 40px;

              img {
                display: block;
                width: 190px;
              }

              .el-button-group {
                display: flex;
                justify-content: center;
                margin-top: -10px;
              }
            }

            .right {
              flex: 1;
              margin-top: 5px;

              > div {
                margin: 15px 0;

                p {
                  margin-bottom: 4px;
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: $device-notebook) {
    .server {
      .list {
        .middle {
          .item {
            .header {
              padding: 10px 20px;
            }

            .box {
              padding: 20px;

              .left {
                margin: 0 20px 0 0;
              }

              .right {
                margin-top: 0;
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: $device-ipad-pro) {
    .server {
      .list {
        .middle {
          .item {
            width: 100%;
          }
        }
      }
    }
  }

  @media (max-width: $device-phone) {
    .server {
      .list {
        .middle {
          .item {
            width: 100%;

            .header {
              padding: 10px 20px;
            }

            .box {
              display: block;
              padding: 20px;

              .left {
                margin: 0;

                img {
                  width: 150px;
                  margin: 0 auto;
                }

                .el-button-group {
                  margin-top: 10px;
                }
              }

              .right {
                margin-top: 30px;
              }
            }
          }
        }
      }
    }
  }
</style>
