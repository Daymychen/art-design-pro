<template>
  <div class="page-content state-page">
    <div class="tips">
      <img src="@imgs/state/no_network.png" />
      <div class="right-wrap">
        <h2>网络连接异常</h2>
        <p>请检查网络，确保您的设备连接到互联网。 </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .state-page {
    display: flex;
    min-height: calc(100vh - 120px);

    .tips {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 5vh;
      margin: auto;

      img {
        width: 300px;
      }

      .right-wrap {
        width: 300px;
        margin-left: 100px;

        h2 {
          font-size: 26px;
          font-weight: 500;
        }

        p {
          margin-top: 20px;
          font-size: 16px;
          color: var(--art-gray-600);
        }

        .el-button {
          margin-top: 20px;
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .state-page {
      .tips {
        display: block;
        text-align: center;

        img {
          width: 200px;
        }

        .right-wrap {
          width: 100%;
          margin: auto;
          text-align: center;

          h2 {
            font-size: 20px;
          }

          p {
            margin-top: 40px;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
