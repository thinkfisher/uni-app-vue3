import { createSSRApp } from 'vue'
import App from './App.vue'
// import { createPinia } from 'pinia'
import uviewPlus from 'uview-plus'
// import uviewConfig from './uview.config.js'

export function createApp() {
  const app = createSSRApp(App)
  
  // 使用uview-plus
  app.use(uviewPlus, () => {
		return {
			// options: {
			// 	// 修改$u.config对象的属性
			// 	config: {
			// 		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
			// 		unit: 'rpx'
			// 	}
			// }
		}
  })

  // 关键：uView Plus rem 适配配置（750rpx 设计稿为例）
const initRem = () => {
  // 获取屏幕宽度（单位：px）
  const screenWidth = uni.getSystemInfoSync().screenWidth
  // 设计稿宽度（默认 750rpx，根据你的设计稿调整）
  const designWidth = 750
  // 计算 rem 基准值：1rem = (屏幕宽度 / 设计稿宽度) * 100px（经典适配方案）
  // 例：750px 屏幕下，1rem = 100px；375px 屏幕下，1rem = 50px
  const remBase = (screenWidth / designWidth) * 100

  // 设置 html 根元素字体大小（rem 基准）
  document.documentElement.style.fontSize = `${remBase}px`
}

// 初始化 rem 适配
// initRem()
// 监听屏幕旋转，重新计算 rem（可选，适配横屏场景）
// uni.onWindowResize(initRem)

  // 配置uview-plus
  // uni.$u.config.unit = uviewConfig.unit
  // uni.$u.config.color = uviewConfig.color

  const fontSize = uni.getStorageSync("fontSize") || 24; // 设置的字体大小 全局可用
  // 需要在Vue.use(uView)之后执行
  // uni.$u.setConfig({
  //   // 修改$u.config对象的属性
  //   config: {
  //     // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
  //     unit: "rpx",
  //   },
  //   // 修改$u.props对象的属性
  //   props: {
  //     // 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
  //     text: {
  //       size: fontSize,
  //     },
  //     avatar: {
  //       size: 80,
  //       fontSize: 30,
  //     },
  //     icon: {
  //       size: 40,
  //     },
  //     checkbox: {
  //       size: fontSize + 6,
  //       labelSize: fontSize,
  //     },
  //     radio: {
  //       size: fontSize + 2,
  //       labelSize: fontSize,
  //     },
  //     input: {
  //       size: fontSize,
  //       fontSize: fontSize - 2,
  //     },
  //     textarea: {
  //       size: fontSize,
  //       fontSize: fontSize,
  //     },
  //     tabbar: {
  //       size: fontSize,
  //       labelSize: fontSize,
  //     },
  //     empty: {
  //       textSize: fontSize,
  //     },
  //   },
  // });
  
  // 使用Pinia状态管理 - 暂时注释掉以解决兼容性问题
  // app.use(createPinia())
  
  return {
    app
  }
}