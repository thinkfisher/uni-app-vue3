// 开发环境配置
const config = {
  // API基础URL
  baseURL: 'http://localhost:3001',
  
  // 超时时间
  timeout: 10000,
  
  // 是否开启调试模式
  debug: true,
  
  // 微信小程序配置
  mpWeixin: {
    appId: 'your-wx-app-id'
  },
  
  // 支付宝小程序配置
  mpAlipay: {
    appId: 'your-alipay-app-id'
  }
}

export default config