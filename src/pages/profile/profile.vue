<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <u-avatar
          :src="userInfo.avatar"
          size="120"
          @tap="handleAvatarClick"
        ></u-avatar>
        <view class="user-detail">
          <text class="user-name">{{ userInfo.nickname || '未设置昵称' }}</text>
          <text class="user-phone">{{ userInfo.phone || '未绑定手机号' }}</text>
        </view>
        <u-icon name="arrow-right" color="#999" size="28"></u-icon>
      </view>
      
      <view class="user-stats">
        <view class="stat-item" @tap="handleStatClick('task')">
          <text class="stat-number">{{ stats.taskCount }}</text>
          <text class="stat-label">任务</text>
        </view>
        <view class="stat-item" @tap="handleStatClick('complete')">
          <text class="stat-number">{{ stats.completeCount }}</text>
          <text class="stat-label">完成</text>
        </view>
        <view class="stat-item" @tap="handleStatClick('points')">
          <text class="stat-number">{{ stats.points }}</text>
          <text class="stat-label">积分</text>
        </view>
      </view>
    </view>
    
    <!-- 功能列表 -->
    <view class="menu-list">
      <u-cell-group>
        <u-cell
          title="个人资料"
          icon="account"
          isLink
          @tap="handleProfileEdit"
        ></u-cell>
        <u-cell
          title="消息通知"
          icon="bell"
          isLink
          :value="unreadCount > 0 ? unreadCount : ''"
          :valueStyle="{ color: '#fa3534' }"
          @tap="handleNotifications"
        ></u-cell>
        <u-cell
          title="我的收藏"
          icon="star"
          isLink
          @tap="handleFavorites"
        ></u-cell>
        <u-cell
          title="我的位置"
          icon="setting"
          isLink
          @tap="location"
        ></u-cell>
      </u-cell-group>
    </view>
    
    <!-- 其他功能 -->
    <view class="menu-list">
      <u-cell-group title="其他">
        <u-cell
          title="关于我们"
          icon="info"
          isLink
          @tap="handleAbout"
        ></u-cell>
        <u-cell
          title="意见反馈"
          icon="edit-pen"
          isLink
          @tap="handleFeedback"
        ></u-cell>
        <u-cell
          title="清除缓存"
          icon="trash"
          isLink
          :value="cacheSize"
          @tap="handleClearCache"
        ></u-cell>
      </u-cell-group>
    </view>
    
    <!-- 退出登录 -->
    <view class="logout-section">
      <u-button
        type="error"
        text="退出登录"
        @tap="handleLogout"
      ></u-button>
    </view>
    
    <!-- 版本信息 -->
    <view class="version-info">
      <text>版本 v1.0.0</text>
    </view>
  </view>
</template>

<script setup>
// 关键修复：从 @dcloudio/uni-app 导入生命周期函数
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getUserInfo } from '@/api/auth.js'
import { clearAuth } from '@/utils/auth.js'

// 响应式数据
const userInfo = ref({
  avatar: '/static/images/avatar.png',
  nickname: '张三',
  phone: '138****8888'
})

const stats = ref({
  taskCount: 12,
  completeCount: 8,
  points: 520
})

const unreadCount = ref(3)
const cacheSize = ref('2.5MB')

// 页面生命周期：使用正确导入的 onShow
onShow(() => {
  getUserData()
  getCacheSize()
})

// 方法定义
const getUserData = async () => {
  try {
    const res = await getUserInfo()
    userInfo.value = { ...userInfo.value, ...res }
  } catch (error) {
    console.error('获取用户数据失败:', error)
  }
}

const getCacheSize = () => {
  cacheSize.value = '2.5MB'
}

const handleAvatarClick = () => {
  uni.navigateTo({
    url: '/pages/auth/auth'
  })
}

const handleStatClick = (type) => {
  switch (type) {
    case 'task':
      uni.switchTab({ url: '/pages/list/list' })
      break
    case 'complete':
      uni.switchTab({ url: '/pages/statistics/statistics' })
      break
    case 'points':
      uni.showToast({ title: '积分详情功能开发中', icon: 'none' })
      break
  }
}

const handleProfileEdit = () => {
  uni.navigateTo({
    url: '/pages/auth/auth'
  })
}

const handleNotifications = () => {
  uni.showToast({ title: '消息功能开发中', icon: 'none' })
}

const handleFavorites = () => {
  uni.showToast({ title: '收藏功能开发中', icon: 'none' })
}

const location = () => {
  // 跳转到location页面
  uni.navigateTo({
    url: '/pages/location/index'
  })
}

const handleAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '这是一个基于uni-app的移动端脚手架项目，提供快速开发能力。',
    showCancel: false
  })
}

const handleFeedback = () => {
  uni.navigateTo({
    url: '/pages/form/form'
  })
}

const handleClearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清理中...' })
        setTimeout(() => {
          uni.hideLoading()
          cacheSize.value = '0KB'
          uni.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
        }, 1500)
      }
    }
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        clearAuth()
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx 40rpx;
  border-radius: 0 0 40rpx 40rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 60rpx;
}

.user-detail {
  flex: 1;
  margin-left: 30rpx;
}

.user-name {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 10rpx;
}

.user-phone {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.user-stats {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 40rpx 0;
}

.stat-item {
  text-align: center;
  flex: 1;
  
  &:not(:last-child) {
    border-right: 1rpx solid rgba(255, 255, 255, 0.2);
  }
}

.stat-number {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 10rpx;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.menu-list {
  margin: 20rpx;
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  ::v-deep .u-icon__icon {
    font-size: 16px !important;
  }
}

.logout-section {
  margin: 40rpx 20rpx 20rpx;
}

.version-info {
  text-align: center;
  margin-top: 40rpx;
  color: #999;
  font-size: 24rpx;
}
</style>
