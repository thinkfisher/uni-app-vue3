<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <u-search 
        placeholder="输入关键词搜索" 
        v-model="searchKeyword" 
        @search="handleSearch" 
        @clear="handleClear" 
        :focus="false" 
      />
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <u-subsection 
        :list="tabs" 
        :current="currentTab" 
        @change="handleFilterChange" 
        :fontSize="32" 
        active-color="#007aff" 
      />
    </view>

    <!-- 列表内容 -->
    <scroll-view 
      class="list-scroll" 
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="refreshData"
    >
      <view class="list-content">
        <!-- 加载状态 -->
        <view v-if="loading && listData.length === 0" class="loading-container">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 空状态 -->
        <view v-else-if="!loading && listData.length === 0" class="empty-container">
          <text class="empty-text">暂无数据</text>
        </view>

        <!-- 列表项 -->
        <view 
          v-else
          v-for="(item, index) in listData" 
          :key="item.id" 
          class="list-item"
          @tap="handleItemClick(item)"
        >
          <view class="item-left">
            <image src="/static/images/avatar.png" mode="aspectFill" class="item-avatar" />
          </view>
          <view class="item-right">
            <text class="item-title">{{ item.name }}</text>
            <text class="item-desc">{{ item.desc }}</text>
            <view class="item-footer">
              <text class="item-time">{{ formatTime(item.createTime) }}</text>
              <text :class="['item-status', getStatusClass(item.status)]">
                {{ getStatusText(item.status) }}
              </text>
            </view>
          </view>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="listData.length > 0" class="load-more">
          <text v-if="loadStatus === 'loading'" class="load-text">努力加载中...</text>
          <text v-else-if="loadStatus === 'nomore'" class="load-text">没有更多了~</text>
          <text v-else class="load-text" @tap="loadMore">点击加载更多</text>
        </view>
      </view>
    </scroll-view>

    <!-- 添加按钮 -->
    <view class="add-button" @tap="handleAdd">
      <text class="add-icon">+</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 1. 定义响应式数据（替代原 data 选项）
const searchKeyword = ref('')
const currentTab = ref(0)
const tabs = ref(['全部', '进行中', '已完成'])
const listData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const isRefreshing = ref(false)
const loadStatus = ref('loadmore') // 状态：loadmore(可加载)/loading(加载中)/nomore(无更多)

// 2. 页面生命周期：替代原 onLoad（组件挂载后执行初始化加载）
onMounted(() => {
  loadData()
})

// 3. 定义核心方法（替代原 methods 选项）
/**
 * 格式化时间：按时间差显示“X分钟前”“X小时前”或日期
 * @param {string} time - 原始时间字符串（ISO格式）
 * @returns {string} 格式化后的时间文本
 */
const formatTime = (time) => {
  if (!time) return '刚刚'
  const date = new Date(time)
  const now = new Date()
  const diff = now - date // 时间差（毫秒）
  
  if (diff < 3600000) { // 1小时内（3600000毫秒）
    const minutes = Math.floor(diff / 60000)
    return minutes + '分钟前'
  } else if (diff < 86400000) { // 1天内（86400000毫秒）
    const hours = Math.floor(diff / 3600000)
    return hours + '小时前'
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * 根据状态值获取状态文本
 * @param {number} status - 状态值（1-进行中，2-已完成，3-已取消）
 * @returns {string} 状态文本
 */
const getStatusText = (status) => {
  const statusMap = {
    1: '进行中',
    2: '已完成',
    3: '已取消'
  }
  return statusMap[status] || '未知'
}

/**
 * 根据状态值获取样式类名
 * @param {number} status - 状态值
 * @returns {string} 样式类名
 */
const getStatusClass = (status) => {
  const classMap = {
    1: 'status-doing',
    2: 'status-done',
    3: 'status-cancel'
  }
  return classMap[status] || ''
}

/**
 * 加载数据（核心请求方法，支持刷新/加载更多）
 * @param {boolean} isRefresh - 是否为下拉刷新（默认false，即加载更多）
 */
const loadData = async (isRefresh = false) => {
  if (loading.value) return // 防止重复请求

  loading.value = true
  if (isRefresh) {
    pageNum.value = 1 // 刷新时重置页码
  }

  try {
    // 模拟API请求：传递分页、搜索、筛选参数
    const mockData = await fetchMockData({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: currentTab.value === 0 ? '' : currentTab.value // 0-全部（无筛选），1-进行中，2-已完成
    })
    
    // 更新列表数据：刷新覆盖，加载更多追加
    if (isRefresh || pageNum.value === 1) {
      listData.value = mockData
    } else {
      listData.value = [...listData.value, ...mockData]
    }
    
    // 判断是否还有更多数据（模拟分页逻辑）
    const hasMore = mockData.length === pageSize.value
    loadStatus.value = hasMore ? 'loadmore' : 'nomore'
    
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false // 结束加载状态
    isRefreshing.value = false // 结束下拉刷新状态
  }
}

/**
 * 模拟后端API请求（返回Promise，模拟800ms延迟）
 * @param {Object} params - 请求参数（分页、搜索、筛选）
 * @returns {Promise<Array>} 模拟的任务列表数据
 */
const fetchMockData = async (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { pageNum, pageSize, keyword, status } = params
      // 生成模拟数据（按分页数量生成）
      const mockData = Array.from({ length: pageSize }, (_, i) => ({
        id: (pageNum - 1) * pageSize + i + 1, // 唯一ID（分页连续）
        name: `${keyword || '任务'} ${i + 1}`, // 名称（支持搜索关键词前缀）
        desc: `这是一个${status ? getStatusText(status) : '普通'}任务的描述内容`, // 描述（关联筛选状态）
        status: status || Math.ceil(Math.random() * 2), // 状态（无筛选时随机1/2）
        createTime: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() // 7天内随机时间
      }))
      resolve(mockData)
    }, 800) // 模拟网络延迟
  })
}

/**
 * 下拉刷新：重置页码并重新加载数据
 */
const refreshData = async () => {
  if (isRefreshing.value) return // 防止重复刷新

  isRefreshing.value = true
  pageNum.value = 1 // 重置页码

  try {
    await loadData(true) // 传入true表示刷新模式
  } finally {
    // 延迟关闭刷新动画（优化用户体验）
    setTimeout(() => {
      isRefreshing.value = false
    }, 500)
  }
}

/**
 * 上拉加载更多：页码+1并加载数据
 */
const loadMore = () => {
  // 仅当“可加载”且未在加载中时执行
  if (loadStatus.value !== 'loadmore' || loading.value) return

  pageNum.value++ // 页码自增
  loadData() // 加载更多（默认isRefresh=false）
}

/**
 * 搜索确认：重置页码并按关键词加载数据
 */
const handleSearch = () => {
  pageNum.value = 1
  loadData(true)
}

/**
 * 清空搜索：重置关键词、页码并重新加载数据
 */
const handleClear = () => {
  searchKeyword.value = '' // 清空搜索框
  pageNum.value = 1
  loadData(true)
}

/**
 * 筛选切换：更新当前筛选标签并重新加载数据
 * @param {Object} e - u-subsection 组件的change事件参数
 */
const handleFilterChange = (e) => {
  currentTab.value = e.currentIndex // 更新当前筛选标签
  pageNum.value = 1 // 重置页码
  loadData(true)
}

/**
 * 列表项点击：显示点击提示
 * @param {Object} item - 点击的列表项数据
 */
const handleItemClick = (item) => {
  uni.showToast({
    title: `点击了：${item.name}`,
    icon: 'none'
  })
}

/**
 * 添加按钮点击：显示添加提示
 */
const handleAdd = () => {
  uni.showToast({
    title: '添加新任务',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
/* 样式完全保留原代码，无任何修改 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background: white;
  border-bottom: 1rpx solid #eee;
}

.filter-bar {
  background: white;
  border-bottom: 1rpx solid #eee;
  padding: 0 20rpx;
}

.list-scroll {
  flex: 1;
  overflow: hidden;
}

.list-content {
  padding: 20rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20rpx;
  color: #999;
  font-size: 28rpx;
}

.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.empty-text {
  color: #999;
  font-size: 32rpx;
}

.list-item {
  display: flex;
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.item-left {
  margin-right: 20rpx;
  flex-shrink: 0;
}

.item-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.item-right {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-time {
  font-size: 24rpx;
  color: #999;
}

.item-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-weight: 500;
}

.status-doing {
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
}

.status-done {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status-cancel {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.load-more {
  padding: 40rpx 0;
  text-align: center;
}

.load-text {
  color: #999;
  font-size: 28rpx;
}

.add-button {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  background: #007aff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
  z-index: 100;
}

.add-icon {
  color: white;
  font-size: 48rpx;
  font-weight: bold;
  line-height: 1;
}
</style>