<template>
  <view class="login-container">
    <view class="login-header">
      <u-image 
        src="/static/images/logo.png" 
        mode="aspectFit" 
        width="120" 
        height="120"
      ></u-image>
      <u-text text="欢迎登录" size="48" color="white" bold></u-text>
    </view>
    
    <view class="login-form">
      <u-form ref="formRef" :model="form" :rules="rules">
        <u-form-item prop="username">
          <u-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            prefixIcon="account"
            clearable
          />
        </u-form-item>
        
        <u-form-item prop="password">
          <u-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            prefixIcon="lock"
            clearable
            password
          />
        </u-form-item>
        
        <u-button 
          type="primary" 
          size="large" 
          @click="handleLogin"
          :loading="loading"
          loadingText="登录中..."
        >
          登录
        </u-button>
      </u-form>
      
      <view class="other-login">
        <u-divider text="其他登录方式" textSize="28" textColor="#999"></u-divider>
        <view class="login-methods">
          <u-button
            type="success"
            size="large"
            @click="handleWechatLogin"
            plain
            customStyle="margin-top: 40rpx"
          >
            <u-icon name="weixin-fill" color="#07c160" size="48"></u-icon>
            <text style="margin-left: 20rpx">微信登录</text>
          </u-button>
        </view>
      </view>
      
      <view class="register-link">
        <u-text text="还没有账号？" color="#666" size="28"></u-text>
        <u-text text="立即注册" color="#007aff" size="28" @click="handleRegister"></u-text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 响应式数据
const formRef = ref(null)
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const loading = ref(false)

// 方法函数
const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟登录
    setTimeout(() => {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
    }, 1000)
    
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

const handleWechatLogin = () => {
  uni.getProvider({
    service: 'oauth',
    success: (res) => {
      if (~res.provider.indexOf('weixin')) {
        uni.login({
          provider: 'weixin',
          success: (loginRes) => {
            // 模拟微信登录
            setTimeout(() => {
              uni.showToast({
                title: '微信登录成功',
                icon: 'success'
              })
              
              uni.switchTab({
                url: '/pages/index/index'
              })
            }, 1000)
          }
        })
      }
    }
  })
}

const handleRegister = () => {
  uni.navigateTo({
    url: '/pages/auth/auth'
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100rpx 60rpx;
}

.login-header {
  text-align: center;
  margin-bottom: 80rpx;
}

.login-form {
  background: white;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
}

.other-login {
  margin-top: 60rpx;
  text-align: center;
}

.login-methods {
  margin-top: 40rpx;
}

.register-link {
  margin-top: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}
</style>