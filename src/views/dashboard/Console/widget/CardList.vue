<template>
  <ul class="card" :style="{ marginTop: showWorkTab ? '0' : '10px' }">
    <li class="console-box-2" v-for="(item, index) in dataList" :key="index" :style="dataListStyle">
      <span class="des custom-text subtitle">{{ item.des }}</span>
      <div>
        <CountTo
          class="number custom-text box-title"
          :endVal="item.num"
          :duration="1000"
          separator=""
        ></CountTo>
        <span
          class="change"
          :style="{ color: item.change.indexOf('+') === -1 ? 'red' : '#52c41a' }"
        >
          {{ item.change }}
        </span>
      </div>
      <i class="iconfont" :style="{ backgroundImage: `${item.color} !important` }">{{
        item.icon
      }}</i>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { CountTo } from 'vue3-count-to'

  const settingStore = useSettingStore()
  const showWorkTab = computed(() => settingStore.showWorkTab)

  const dataList = [
    {
      des: '总访问次数',
      icon: '\ue765',
      startVal: 0,
      duration: 1000,
      num: 9120,
      change: '+20%',
      color: 'linear-gradient(310deg,#50D0FF,#50A3FF)'
    },
    {
      des: '在线访客数',
      icon: '\ue682',
      startVal: 0,
      duration: 1000,
      num: 182,
      change: '+10%',
      color: 'linear-gradient(310deg,#61E7CC,#61D7E7)'
    },
    {
      des: '点击量',
      icon: '\ue672',
      startVal: 0,
      duration: 1000,
      num: 9520,
      change: '-12%',
      color: 'linear-gradient(310deg,#f5365c,#f56036)'
    },
    {
      des: '新用户',
      icon: '\ue686',
      startVal: 0,
      duration: 1000,
      num: 156,
      change: '+30%',
      color: 'linear-gradient(310deg,#5e72e4,#825ee4)'
    }
  ]
  const dataListStyle = {}

  onMounted(() => {
    computedItemWidth()
  })

  const computedItemWidth = () => {
    // let count = dataList.length
    // let width = 100 / count
    // dataListStyle = {
    //   width: `calc(${width}% - 20px)`
    // }
  }
</script>

<style lang="scss" scoped>
  .card {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + var(--console-margin));
    margin-left: calc(0px - var(--console-margin));
    background-color: transparent !important;

    li {
      position: relative;
      box-sizing: border-box;
      width: calc(25% - var(--console-margin));
      height: 90px;
      padding: 0 18px;
      margin: 0 0 0 var(--console-margin);
      background: var(--art-main-bg-color);
      border-radius: 14px;
      // box-shadow: 0 5px 27px rgb(0 0 0 / 5%);

      $icon-size: 46px;

      .iconfont {
        position: absolute;
        top: 0;
        right: 15px;
        bottom: 0;
        width: $icon-size;
        height: $icon-size;
        margin: auto;
        overflow: hidden;
        font-size: 20px;
        line-height: $icon-size;
        color: #fff !important;
        text-align: center;
        background-color: #2c90ff;
        border-radius: 12px;
      }

      .des {
        display: block;
        height: 14px;
        margin-top: 20px;
        font-size: 13px;
        font-weight: 500;
        line-height: 14px;
      }

      > div {
        display: flex;
        align-items: center;

        .number {
          display: block;
          margin-top: 5px;
          font-size: 28px;
          font-weight: 400;
          // color: var(--art-text-gray-800);
        }

        .change {
          display: block;
          margin: 13px 0 0 10px;
          font-size: 13px;
          font-weight: bold;
        }
      }
    }
  }
</style>
