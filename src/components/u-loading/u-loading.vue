<template>
  <view class="u-loading" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <view 
      class="u-loading__spinner"
      :class="[`u-loading__spinner--${mode}`]"
      :style="{ 
        width: size + 'rpx', 
        height: size + 'rpx',
        color: color,
        borderColor: color
      }"
    >
      <view 
        v-if="mode === 'spinner'"
        class="u-loading__dot"
        v-for="(item, index) in 12"
        :key="index"
        :style="{ backgroundColor: color }"
      ></view>
    </view>
    <text v-if="text" class="u-loading__text" :style="{ fontSize: textSize + 'rpx', color: textColor }">
      {{ text }}
    </text>
  </view>
</template>

<script>
export default {
  name: 'ULoading',
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: true
    },
    // 加载图标的大小
    size: {
      type: [String, Number],
      default: 60
    },
    // 颜色
    color: {
      type: String,
      default: '#007aff'
    },
    // 加载模式
    mode: {
      type: String,
      default: 'circular' // circular, spinner, dots
    },
    // 提示文字
    text: {
      type: String,
      default: ''
    },
    // 文字大小
    textSize: {
      type: [String, Number],
      default: 28
    },
    // 文字颜色
    textColor: {
      type: String,
      default: '#606266'
    }
  }
}
</script>

<style lang="scss" scoped>
.u-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.u-loading__spinner {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  
  &--circular {
    border: 4rpx solid transparent;
    border-top: 4rpx solid currentColor;
    border-radius: 50%;
    animation: u-circular 1s linear infinite;
  }
  
  &--spinner {
    animation: u-spinner 1s linear infinite;
  }
}

.u-loading__dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  &::before {
    display: block;
    width: 4rpx;
    height: 25%;
    margin: 0 auto;
    background-color: currentColor;
    border-radius: 40%;
    content: ' ';
  }
}

.u-loading__text {
  margin-top: 20rpx;
  line-height: 1.6;
  text-align: center;
}

@keyframes u-circular {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes u-spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.u-loading__dot:nth-child(1) { transform: rotate(30deg); opacity: 1; }
.u-loading__dot:nth-child(2) { transform: rotate(60deg); opacity: 0.9167; }
.u-loading__dot:nth-child(3) { transform: rotate(90deg); opacity: 0.8333; }
.u-loading__dot:nth-child(4) { transform: rotate(120deg); opacity: 0.75; }
.u-loading__dot:nth-child(5) { transform: rotate(150deg); opacity: 0.6667; }
.u-loading__dot:nth-child(6) { transform: rotate(180deg); opacity: 0.5833; }
.u-loading__dot:nth-child(7) { transform: rotate(210deg); opacity: 0.5; }
.u-loading__dot:nth-child(8) { transform: rotate(240deg); opacity: 0.4167; }
.u-loading__dot:nth-child(9) { transform: rotate(270deg); opacity: 0.3333; }
.u-loading__dot:nth-child(10) { transform: rotate(300deg); opacity: 0.25; }
.u-loading__dot:nth-child(11) { transform: rotate(330deg); opacity: 0.1667; }
.u-loading__dot:nth-child(12) { transform: rotate(360deg); opacity: 0.0833; }
</style>