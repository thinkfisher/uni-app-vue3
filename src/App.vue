<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 初始化uview-plus
    uni.$u.config.unit = 'rpx'
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-plus/index.scss';
/* 导入uni.scss变量 */
@import './uni.scss';
@import './styles/override.scss';

/* 覆盖uni-segmented-control组件样式 */
.segmented-control__item--button {
  border-color: #dcdfe6 !important;
}

/*每个页面公共css */
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

.container {
  padding: 20rpx;
}

/* 通用按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  color: white;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  font-size: 32rpx;
  border: none;
}

.btn-primary:active {
  opacity: 0.8;
}

/* 通用卡片样式 */
.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

/* 通用列表样式 */
.list-item {
  background: white;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-item:last-child {
  border-bottom: none;
}
</style>