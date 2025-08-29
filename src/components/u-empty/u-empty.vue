<template>
  <view class="u-empty">
    <image
      class="u-empty__image"
      :src="imgSrc"
      :style="{ width: imgWidth + 'rpx', height: imgHeight + 'rpx' }"
    ></image>
    <text class="u-empty__text" :style="{ color: textColor, fontSize: textSize + 'rpx' }">
      {{ text }}
    </text>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'UEmpty',
  props: {
    // 图标路径
    src: {
      type: String,
      default: ''
    },
    // 提示文字
    text: {
      type: String,
      default: '暂无数据'
    },
    // 文字颜色
    textColor: {
      type: String,
      default: '#c0c4cc'
    },
    // 文字大小
    textSize: {
      type: [String, Number],
      default: 28
    },
    // 图标宽度
    imgWidth: {
      type: [String, Number],
      default: 200
    },
    // 图标高度
    imgHeight: {
      type: [String, Number],
      default: 200
    },
    // 图标类型
    mode: {
      type: String,
      default: 'data'
    }
  },
  computed: {
    imgSrc() {
      if (this.src) return this.src
      const images = {
        data: '/static/empty/data.png',
        message: '/static/empty/message.png',
        car: '/static/empty/car.png',
        page: '/static/empty/page.png',
        search: '/static/empty/search.png',
        address: '/static/empty/address.png',
        wifi: '/static/empty/wifi.png',
        order: '/static/empty/order.png',
        coupon: '/static/empty/coupon.png',
        favor: '/static/empty/favor.png',
        permission: '/static/empty/permission.png',
        history: '/static/empty/history.png',
        news: '/static/empty/news.png',
        list: '/static/empty/list.png'
      }
      return images[this.mode] || images.data
    }
  }
}
</script>

<style lang="scss" scoped>
.u-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.u-empty__image {
  margin-bottom: 20rpx;
}

.u-empty__text {
  line-height: 1.6;
  text-align: center;
}
</style>