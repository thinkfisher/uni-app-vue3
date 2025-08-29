<template>
  <view class="statistics-container">
    <!-- 统计卡片 -->
    <view class="stats-cards">
      <view class="stats-row">
        <view class="stat-card">
          <view class="stat-icon">
            <u-icon name="file-text" color="#007aff" size="48"></u-icon>
          </view>
          <view class="stat-info">
            <text class="stat-number">{{ totalTasks }}</text>
            <text class="stat-label">总任务</text>
          </view>
        </view>
        
        <view class="stat-card">
          <view class="stat-icon">
            <u-icon name="checkmark-circle" color="#19be6b" size="48"></u-icon>
          </view>
          <view class="stat-info">
            <text class="stat-number">{{ completedTasks }}</text>
            <text class="stat-label">已完成</text>
          </view>
        </view>
      </view>
      
      <view class="stats-row">
        <view class="stat-card">
          <view class="stat-icon">
            <u-icon name="clock" color="#ff9900" size="48"></u-icon>
          </view>
          <view class="stat-info">
            <text class="stat-number">{{ pendingTasks }}</text>
            <text class="stat-label">进行中</text>
          </view>
        </view>
        
        <view class="stat-card">
          <view class="stat-icon">
            <u-icon name="close-circle" color="#fa3534" size="48"></u-icon>
          </view>
          <view class="stat-info">
            <text class="stat-number">{{ cancelledTasks }}</text>
            <text class="stat-label">已取消</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 图表区域 -->
    <view class="charts-section">
      <!-- 任务状态分布图 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">任务状态分布</text>
          <view class="chart-actions">
            <u-button 
              size="mini" 
              :type="pieChartType === 'pie' ? 'primary' : 'default'"
              @tap="changePieChart('pie')"
            >
              饼图
            </u-button>
            <u-button 
              size="mini" 
              :type="pieChartType === 'ring' ? 'primary' : 'default'"
              @tap="changePieChart('ring')"
            >
              环形图
            </u-button>
          </view>
        </view>
        <echarts
          :option="pieOption"
          :width="300"
          :height="300"
          canvasId="pieChart"
        />
      </view>
      
      <!-- 任务趋势图 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">任务趋势</text>
          <view class="chart-actions">
            <u-button 
              size="mini" 
              :type="lineChartType === 'line' ? 'primary' : 'default'"
              @tap="changeLineChart('line')"
            >
              折线图
            </u-button>
            <u-button 
              size="mini" 
              :type="lineChartType === 'bar' ? 'primary' : 'default'"
              @tap="changeLineChart('bar')"
            >
              柱状图
            </u-button>
          </view>
        </view>
        <echarts
          :option="lineOption"
          :width="300"
          :height="300"
          canvasId="lineChart"
        />
      </view>
      
      <!-- 分类统计图 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">分类统计</text>
        </view>
        <echarts
          :option="categoryOption"
          :width="300"
          :height="300"
          canvasId="categoryChart"
        />
      </view>
    </view>
    
    <!-- 时间筛选 -->
    <view class="time-filter">
      <u-tabs 
        :list="timeTabs" 
        @change="handleTimeChange"
        lineColor="#007aff"
        :current="currentTimeTab"
      ></u-tabs>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

// 1. 定义基础响应式数据（简单类型用ref，复杂对象用reactive）
const totalTasks = ref(28)
const completedTasks = ref(18)
const pendingTasks = ref(7)
const cancelledTasks = ref(3)
const pieChartType = ref('pie') // 饼图/环形图切换状态
const lineChartType = ref('line') // 折线图/柱状图切换状态
const currentTimeTab = ref(0) // 时间筛选当前选中项
const timeTabs = ref([
  { id: 'week', name: '本周' },
  { id: 'month', name: '本月' },
  { id: 'year', name: '全年' }
])

// 2. 定义图表配置（复杂对象用reactive，确保内部属性响应式）
// 饼图配置
const pieOption = reactive({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    bottom: 10,
    left: 'center',
    data: ['已完成', '进行中', '已取消']
  },
  series: [
    {
      name: '任务状态',
      type: 'pie',
      radius: ['0%', '65%'], // 初始为饼图（无内半径）
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 18, name: '已完成', itemStyle: { color: '#19be6b' } },
        { value: 7, name: '进行中', itemStyle: { color: '#ff9900' } },
        { value: 3, name: '已取消', itemStyle: { color: '#fa3534' } }
      ]
    }
  ]
})

// 折线图/柱状图配置
const lineOption = reactive({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    // 1. 明确 legend.data 与 series.name 对应，不依赖其他字段
    data: ['新增任务', '完成任务'], 
    top: 10,
    // 2. 显式指定图例的“数据键”为 series.name（核心！）
    dataKey: 'name', 
    // 3. 可选：加选中状态，避免切换时图例选中状态混乱
    selected: {
      '新增任务': true,
      '完成任务': true
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    // 确保 series.name 与 legend.data 完全一致
    {
      name: '新增任务', // 必须和 legend.data[0] 一样
      type: 'line',
      data: [2, 4, 3, 5, 4, 6, 3],
      itemStyle: { color: '#007aff' },
      // 可选：加 emphasis 提升交互体验
      emphasis: {
        focus: 'series'
      }
    },
    {
      name: '完成任务', // 必须和 legend.data[1] 一样
      type: 'line',
      data: [1, 3, 2, 4, 3, 5, 2],
      itemStyle: { color: '#19be6b' },
      emphasis: {
        focus: 'series'
      }
    }
  ]
})

// 分类统计图配置
const categoryOption = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['工作', '学习', '生活', '娱乐', '其他'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '任务数量',
      type: 'bar',
      barWidth: '60%',
      data: [12, 8, 5, 2, 1],
      itemStyle: { color: '#007aff' }
    }
  ]
})

// 3. 页面生命周期：替代原 onLoad（组件挂载后加载统计数据）
onMounted(() => {
  getStatistics()
})

// 4. 定义核心方法（替代原 methods 选项）
/**
 * 获取统计数据（模拟接口请求）
 */
const getStatistics = async () => {
  try {
    // 模拟后端请求延迟，500ms后更新图表数据
    setTimeout(() => {
      updateChartData()
    }, 500)
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

/**
 * 根据时间筛选条件更新图表数据（核心数据切换逻辑）
 */
const updateChartData = () => {
  // 时间范围映射：0-本周，1-本月，2-全年
  const timeRanges = ['week', 'month', 'year']
  const currentRange = timeRanges[currentTimeTab.value]
  
  // 不同时间范围的趋势图数据切换
  switch (currentRange) {
    case 'week':
      lineOption.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      lineOption.series[0].data = [2, 4, 3, 5, 4, 6, 3]
      lineOption.series[1].data = [1, 3, 2, 4, 3, 5, 2]
      break
    case 'month':
      lineOption.xAxis.data = ['第1周', '第2周', '第3周', '第4周']
      lineOption.series[0].data = [15, 20, 18, 25]
      lineOption.series[1].data = [12, 18, 15, 22]
      break
    case 'year':
      lineOption.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      lineOption.series[0].data = [45, 52, 48, 60, 55, 65, 70, 68, 75, 80, 85, 90]
      lineOption.series[1].data = [40, 45, 42, 55, 50, 60, 65, 62, 70, 75, 80, 85]
      break
  }
}

/**
 * 切换饼图/环形图类型
 * @param {string} type - 图表类型（pie-饼图，ring-环形图）
 */
const changePieChart = (type) => {
  pieChartType.value = type
  // 通过修改 radius 实现饼图/环形图切换（环形图有内半径）
  pieOption.series[0].radius = type === 'pie' ? ['0%', '65%'] : ['40%', '65%']
}

/**
 * 切换折线图/柱状图类型
 * @param {string} type - 图表类型（line-折线图，column-柱状图）
 */
const changeLineChart = (type) => {
  lineChartType.value = type
  // 修改 series 的 type 实现图表类型切换
  lineOption.series[0].type = type
  lineOption.series[1].type = type
}

/**
 * 时间筛选标签切换
 * @param {object} tab - tab.index选中的时间标签索引（0-本周，1-本月，2-全年）
 */
const handleTimeChange = (tab) => {
  currentTimeTab.value = tab.index
  updateChartData() // 切换后更新图表数据
}
</script>

<style lang="scss" scoped>
/* 样式完全保留原代码，无任何修改 */
.statistics-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.stats-cards {
  margin-bottom: 20rpx;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  &:last-child {
    margin-right: 0;
  }
}

.stat-icon {
  margin-right: 20rpx;
}

.stat-info {
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.charts-section {
  margin-bottom: 20rpx;
}

.chart-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.chart-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.chart-actions {
  display: flex;
  gap: 10rpx;
}

.time-filter {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
}
</style>