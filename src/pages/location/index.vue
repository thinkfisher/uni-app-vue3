<template>
  <view class="location-container">
    <!-- 顶部导航栏 -->
    <!-- <view class="nav-bar">
      <u-icon 
        name="arrow-left" 
        size="36" 
        @click="handleBack"
        class="nav-back"
      ></u-icon>
      <text class="nav-title">我的位置</text>
      <view class="nav-empty"></view>
    </view> -->
    
    <!-- 搜索框 -->
    <view class="search-box">
      <u-search 
        v-model="searchKeyword" 
        placeholder="搜索地址" 
        @search="handleSearch"
        @custom="handleSearch"
        clearable
        bgColor="#f5f5f5"
        borderColor="#eee"
        radius="60"
        placeholderStyle="font-size: 28rpx"
      ></u-search>
    </view>
    
    <!-- 百度地图容器 -->
    <view class="map-container">
      <view id="baidu-map" class="baidu-map"></view>
      
      <!-- 定位按钮 -->
      <view class="locate-btn" @click="getCurrentLocation">
        <u-icon name="map-fill" size="36" color="#007aff"></u-icon>
      </view>
    </view>
    
    <!-- 当前位置信息 -->
    <view class="location-info" v-if="currentAddress">
      <text class="info-label">当前位置：</text>
      <text class="info-content">{{ currentAddress }}</text>
    </view>
    
    <!-- 地址列表 -->
    <view class="address-list" v-if="addressList.length > 0">
      <text class="list-title">附近地址</text>
      <u-cell-group>
        <u-cell 
          v-for="(item, index) in addressList" 
          :key="index"
          :title="item.title"
          :label="item.address"
          @click="selectAddress(item)"
          isLink
        >
          <template #icon>
            <u-icon 
              name="map-fill" 
              size="28" 
              color="#007aff"
              v-if="index === 0"
            ></u-icon>
            <u-icon 
              name="map" 
              size="28" 
              color="#666"
              v-else
            ></u-icon>
          </template>
        </u-cell>
      </u-cell-group>
    </view>
    
    <!-- 底部确认按钮 -->
    <view class="confirm-btn" v-if="currentAddress">
      <u-button 
        type="primary" 
        size="large" 
        @click="confirmLocation"
        :loading="loading"
      >
        确认选择此位置
      </u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 百度地图API密钥（请替换为你自己的密钥）
const BAIDU_MAP_AK = 'zljP8IQr4tGYh2K1b7TKcETgPtZgN5LK'

// 响应式数据
const searchKeyword = ref('')
const currentAddress = ref('')
const currentLocation = ref({ latitude: 0, longitude: 0 })
const addressList = ref([])
const loading = ref(false)
const map = ref(null)
const marker = ref(null)
const geocoder = ref(null)

// 页面加载时初始化
onLoad(() => {
  // 动态加载百度地图API
  loadBaiduMapScript()
    .then(() => {
      // 初始化地图
      initMap()
      // 获取当前位置
      getCurrentLocation()
    })
    .catch(err => {
      console.error('百度地图API加载失败:', err)
      uni.showToast({ title: '地图加载失败', icon: 'none' })
    })
})

// 组件挂载时确保地图容器已存在
onMounted(() => {
  // 确保DOM已渲染
  setTimeout(() => {
    if (window.BMap && !map.value) {
      initMap()
    }
  }, 500)
})

// 组件卸载时清理
onUnmounted(() => {
  map.value = null
  marker.value = null
  geocoder.value = null
})

// 动态加载百度地图脚本
const loadBaiduMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.BMap) {
      resolve(window.BMap)
      return
    }
    
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_MAP_AK}&callback=initBaiduMap`
    script.onerror = reject
    document.head.appendChild(script)
    
    // 定义全局回调函数
    window.initBaiduMap = () => {
      resolve(window.BMap)
    }
  })
}

// 初始化地图
const initMap = () => {
  // 创建地图实例
  map.value = new window.BMap.Map('baidu-map')
  // 启用滚轮缩放
  map.value.enableScrollWheelZoom(true)
  // 创建地理编码器实例（用于地址解析）
  geocoder.value = new window.BMap.Geocoder()
  
  // 初始中心点设为北京
  const point = new window.BMap.Point(116.404, 39.915)
  map.value.centerAndZoom(point, 15)
}

// 获取当前位置
const getCurrentLocation = () => {
  loading.value  = true;
  uni.getLocation({ 
    type: 'wgs84', // 直接使用WGS84坐标（标准GPS坐标）
    success: (res) => {
      loading.value  = false;
      const { longitude, latitude } = res;
      currentLocation.value  = { longitude, latitude };
      
      // 移动地图到当前位置（假设地图库支持WGS84坐标）
      const mapPoint = new window.BMap.Point(longitude, latitude);
      map.value.centerAndZoom(mapPoint,  17);
      
      // 添加标记 
      addMarker(mapPoint);
      
      // 解析地址 
      getAddressFromLocation(mapPoint);
      
      // 搜索附近地址
      searchNearbyPlaces(mapPoint);
    },
    fail: (err) => {
      loading.value  = false;
      console.error(' 获取位置失败:', err);
      uni.showToast({  
        title: '获取位置失败，请检查权限或网络', 
        icon: 'none' 
      });
    }
  });
};

// 添加地图标记
const addMarker = (point) => {
  // 移除现有标记
  if (marker.value) {
    map.value.removeOverlay(marker.value)
  }
  
  // 创建新标记
  marker.value = new window.BMap.Marker(point)
  map.value.addOverlay(marker.value)
  
  // 标记可拖拽
  marker.value.enableDragging()
  
  // 拖拽结束后更新地址
  marker.value.addEventListener('dragend', (e) => {
    const newPoint = e.point
    currentLocation.value = { longitude: newPoint.lng, latitude: newPoint.lat }
    getAddressFromLocation(newPoint)
  })
}

// 从经纬度获取地址
const getAddressFromLocation = (point) => {
  geocoder.value.getLocation(point, (rs) => {
    const address = rs.address
    currentAddress.value = address
  })
}

// 搜索附近地址
const searchNearbyPlaces = (point) => {
  const local = new window.BMap.LocalSearch(map.value, {
    renderOptions: { map: map.value },
    pageCapacity: 5,
    onSearchComplete: (results) => {
      if (local.getStatus() === window.BMAP_STATUS_SUCCESS) {
        const list = []
        // 添加当前位置到列表首位
        list.push({
          title: '当前位置',
          address: currentAddress.value,
          location: currentLocation.value
        })
        
        // 添加搜索结果
        for (let i = 0; i < results.getCurrentNumPois(); i++) {
          const poi = results.getPoi(i)
          list.push({
            title: poi.title,
            address: poi.address,
            location: {
              longitude: poi.point.lng,
              latitude: poi.point.lat
            }
          })
        }
        
        addressList.value = list
      }
    }
  })
  
  // 搜索周边
  local.searchNearby('生活服务', point, 1000)
}

// 搜索地址
const handleSearch = (keyword) => {
  if (!keyword) return
  const local = new window.BMap.LocalSearch(map.value, {
    renderOptions: { map: map.value },
    pageCapacity: 5,
    onSearchComplete: (results) => {
      if (local.getStatus() === window.BMAP_STATUS_SUCCESS) {
        const list = []
        for (let i = 0; i < results.getCurrentNumPois(); i++) {
          const poi = results.getPoi(i)
          list.push({
            title: poi.title,
            address: poi.address,
            location: {
              longitude: poi.point.lng,
              latitude: poi.point.lat
            }
          })
        }
        
        addressList.value = list
        
        // 如果有结果，移动地图到第一个结果位置
        if (list.length > 0) {
          const firstLoc = list[0].location
          const point = new window.BMap.Point(firstLoc.longitude, firstLoc.latitude)
          map.value.centerAndZoom(point, 17)
          addMarker(point)
          currentLocation.value = firstLoc
          currentAddress.value = `${list[0].title} ${list[0].address}`
        }
      }
    }
  })
  
  local.search(keyword)
}

// 选择地址
const selectAddress = (item) => {
  currentAddress.value = `${item.title} ${item.address}`
  currentLocation.value = item.location
  
  // 移动地图到选中位置
  const point = new window.BMap.Point(item.location.longitude, item.location.latitude)
  map.value.centerAndZoom(point, 17)
  addMarker(point)
}

// 确认选择位置
const confirmLocation = () => {
  if (!currentAddress.value) {
    uni.showToast({ title: '请先获取位置', icon: 'none' })
    return
  }
  
  loading.value = true
  
  // 模拟提交位置信息
  setTimeout(() => {
    loading.value = false
    // 返回上一页并携带位置信息
    uni.navigateBack({
      delta: 1,
      success: () => {
        // 通知上一页位置已选择
        uni.$emit('locationSelected', {
          address: currentAddress.value,
          location: currentLocation.value
        })
      }
    })
  }, 800)
}

// 返回上一页
const handleBack = () => {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.location-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  padding: 0 30rpx;
  background-color: white;
  border-bottom: 1rpx solid #eee;
  
  .nav-back {
    color: #333;
  }
  
  .nav-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .nav-empty {
    width: 36rpx;
  }
}

.search-box {
  padding: 20rpx;
  background-color: white;
}

.map-container {
  flex: 1;
  position: relative;
  
  .baidu-map {
    width: 100%;
    height: 200px;
  }
  
  .locate-btn {
    position: absolute;
    right: 30rpx;
    bottom: 180rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
    z-index: 10;
  }
}

.location-info {
  padding: 20rpx 30rpx;
  background-color: white;
  border-top: 1rpx solid #eee;
  border-bottom: 1rpx solid #eee;
  
  .info-label {
    font-size: 28rpx;
    color: #666;
    margin-right: 10rpx;
  }
  
  .info-content {
    font-size: 28rpx;
    color: #333;
    word-break: break-all;
  }
}

.address-list {
  background-color: white;
  padding-bottom: 20rpx;
  
  .list-title {
    display: block;
    padding: 20rpx 30rpx;
    font-size: 26rpx;
    color: #999;
    background-color: #f9f9f9;
  }
}

.confirm-btn {
  padding: 30rpx;
  background-color: white;
}
</style>
