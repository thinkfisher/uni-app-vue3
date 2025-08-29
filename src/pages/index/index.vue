<template>
  <view class="index-container">
    <!-- 轮播图 -->
    <view class="banner-section">
      <u-swiper
        :list="bannerList"
        :height="320"
        radius="0"
        indicator
        indicatorMode="line"
        circular
        autoplay
      ></u-swiper>
    </view>
    
    <!-- 快捷入口 -->
    <view class="quick-entry">
      <view class="entry-title">
        <text class="title">快捷入口</text>
        <text class="subtitle">快速访问常用功能</text>
      </view>
      
      <view class="entry-grid">
        <view 
          class="entry-item" 
          v-for="item in quickEntries" 
          :key="item.id"
          @tap="handleQuickEntry(item)"
        >
          <view class="entry-icon" :style="{ background: item.color }">
            <u-icon :name="item.icon" color="white" size="48"></u-icon>
          </view>
          <text class="entry-name">{{ item.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 数据统计 -->
    <view class="stats-section">
      <view class="section-title">
        <text class="title">今日概览</text>
        <text class="date">{{ today }}</text>
      </view>
      
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-number">{{ todayTasks }}</text>
          <text class="stat-label">今日任务</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ completedTasks }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ pendingTasks }}</text>
          <text class="stat-label">待处理</text>
        </view>
      </view>
    </view>
    
    <!-- 最近任务 -->
    <view class="recent-tasks">
      <view class="section-title">
        <text class="title">最近任务</text>
        <text class="more" @tap="handleMoreTasks">查看更多</text>
      </view>
      
      <view class="task-list">
        <view 
          class="task-item" 
          v-for="task in recentTasks" 
          :key="task.id"
          @tap="handleTaskDetail(task)"
        >
          <view class="task-left">
            <up-checkbox
              v-model="task.completed"
              :size="30"
              @change="(val) => handleTaskComplete(task, val)"
              @tap.native.stop
            ></up-checkbox>
          </view>
          <view class="task-content">
            <text class="task-title" :class="{ completed: task.completed }">
              {{ task.title }}
            </text>
            <text class="task-time">{{ task.time }}</text>
          </view>
          <view class="task-right">
            <u-tag :text="task.priorityText" :type="task.priorityType" size="mini"></u-tag>
          </view>
        </view>
        
        <u-empty
          v-if="recentTasks.length === 0"
          mode="data"
          icon="http://cdn.uviewui.com/uview/empty/data.png"
          text="暂无任务"
        ></u-empty>
      </view>
    </view>
    
    <!-- 底部提示 -->
    <view class="bottom-tip">
      <text>下拉刷新获取更多内容</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 1. 定义响应式数据（与原逻辑一致）
const bannerList = ref([
  'https://picsum.photos/id/33/750/320',
  'https://picsum.photos/id/59/750/320',
  'https://picsum.photos/id/32/750/320',
  'https://picsum.photos/id/36/750/320'
])

const quickEntries = ref([
  { id: 1, name: '新建任务', icon: 'plus', color: '#007aff', path: '/pages/form/form' },
  { id: 2, name: '任务列表', icon: 'list', color: '#19be6b', path: '/pages/list/list', type: 'tab' },
  { id: 3, name: '数据统计', icon: 'chart', color: '#ff9900', path: '/pages/statistics/statistics', type: 'tab' },
  { id: 4, name: '个人中心', icon: 'account', color: '#fa3534', path: '/pages/profile/profile', type: 'tab' }
])

const todayTasks = ref(8)
const completedTasks = ref(5)
const pendingTasks = ref(3)
const recentTasks = ref([
  {
    id: 1,
    title: '完成项目文档编写',
    time: '09:30',
    priorityText: '高',
    priorityType: 'error',
    completed: false
  },
  {
    id: 2,
    title: '参加团队会议',
    time: '14:00',
    priorityText: '中',
    priorityType: 'warning',
    completed: true
  },
  {
    id: 3,
    title: '代码review',
    time: '16:30',
    priorityText: '低',
    priorityType: 'success',
    completed: false
  }
])

// 2. 计算属性（与原逻辑一致）
const today = computed(() => {
  const date = new Date()
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

// 3. 页面生命周期：下拉刷新（UniApp Vue3 标准写法）
// 直接定义 onPullDownRefresh 函数，无需通过 uni 调用，框架会自动识别
const onPullDownRefresh = () => {
  refreshData() // 执行数据刷新逻辑
  // 1秒后停止下拉刷新动画（与原逻辑一致）
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
}

// 4. 核心业务方法（与原逻辑完全一致）
const refreshData = () => {
  // 模拟任务数量刷新
  todayTasks.value = Math.floor(Math.random() * 10) + 5
  completedTasks.value = Math.floor(Math.random() * todayTasks.value)
  pendingTasks.value = todayTasks.value - completedTasks.value
  
  // 更新最近任务列表
  recentTasks.value = generateMockTasks()
}

const generateMockTasks = () => {
  const tasks = []
  const priorities = [
    { text: '高', type: 'error' },
    { text: '中', type: 'warning' },
    { text: '低', type: 'success' }
  ]
  
  for (let i = 0; i < 3; i++) {
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    tasks.push({
      id: i + 1,
      title: `示例任务 ${i + 1}`,
      time: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      priorityText: priority.text,
      priorityType: priority.type,
      completed: Math.random() > 0.5
    })
  }
  
  return tasks
}

const handleQuickEntry = (item) => {
  if (item.path) {
    if (item.type === 'tab') {
      uni.switchTab({ url: item.path })
    } else {
      uni.navigateTo({ url: item.path })
    }
  }
}

const handleMoreTasks = () => {
  uni.switchTab({ url: '/pages/list/list' })
}

const handleTaskDetail = (task) => {
  uni.navigateTo({ url: `/pages/form/form?id=${task.id}` })
}

const handleTaskComplete = (task, val) => {
  task.completed = val
  if (val) {
    completedTasks.value++
    pendingTasks.value--
    uni.showToast({ title: '任务完成', icon: 'success' })
  } else {
    completedTasks.value--
    pendingTasks.value++
  }
}
</script>

<style lang="scss" scoped>
/* 样式完全保留，与原代码一致 */
.index-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.banner-section {
  margin-bottom: 20rpx;
}

.quick-entry {
  background: white;
  padding: 40rpx 20rpx;
  margin-bottom: 20rpx;
}

.entry-title {
  margin-bottom: 40rpx;
  text-align: center;
}

.title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 20rpx;
  transition: transform 0.3s;
  
  &:active {
    transform: scale(0.95);
  }
}

.entry-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
}

.entry-name {
  font-size: 24rpx;
  color: #666;
}

.stats-section {
  background: white;
  padding: 40rpx 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.date {
  font-size: 28rpx;
  color: #999;
}

.more {
  font-size: 28rpx;
  color: #007aff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30rpx;
}

.stat-item {
  text-align: center;
  padding: 30rpx;
  background: #f8f8f8;
  border-radius: 20rpx;
}

.stat-number {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 28rpx;
  color: #666;
}

.recent-tasks {
  background: white;
  padding: 40rpx 20rpx;
  margin-bottom: 20rpx;
}

.task-list {
  min-height: 300rpx;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
}

.task-left {
  margin-right: 20rpx;
}

.task-content {
  flex: 1;
}

.task-title {
  display: block;
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
  
  &.completed {
    text-decoration: line-through;
    color: #999;
  }
}

.task-time {
  font-size: 28rpx;
  color: #999;
}

.task-right {
  margin-left: 20rpx;
}

.bottom-tip {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 28rpx;
}
</style>