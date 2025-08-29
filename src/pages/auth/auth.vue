<template>
  <view class="auth-container">
    <view class="auth-header">
      <image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
      <text class="title">完善个人信息</text>
      <text class="subtitle">为了提供更好的服务，请完善您的个人信息</text>
    </view>
    
    <view class="auth-form">
      <u-form ref="formRef" :model="form" :rules="rules">
        <u-form-item label="头像" prop="avatar">
          <u-upload
            :fileList="avatarList"
            @afterRead="afterRead"
            @delete="deletePic"
            name="avatar"
            :maxCount="1"
            width="120"
            height="120"
          >
            <view class="upload-avatar">
              <u-icon name="camera-fill" size="48" color="#999"></u-icon>
              <text>上传头像</text>
            </view>
          </u-upload>
        </u-form-item>
        
        <u-form-item label="昵称" prop="nickname">
          <u-input 
            v-model="form.nickname" 
            placeholder="请输入昵称"
            clearable
          />
        </u-form-item>
        
        <u-form-item label="性别" prop="gender">
          <u-radio-group v-model="form.gender">
            <u-radio label="1">男</u-radio>
            <u-radio label="2">女</u-radio>
            <u-radio label="0">保密</u-radio>
          </u-radio-group>
        </u-form-item>
        
        <u-form-item label="手机号" prop="phone">
          <u-input 
            v-model="form.phone" 
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
            clearable
          />
        </u-form-item>
        
        <u-form-item label="验证码" prop="code">
          <u-input 
            v-model="form.code" 
            type="number"
            placeholder="请输入验证码"
            maxlength="6"
            clearable
          >
            <template #suffix>
              <u-code 
                ref="uCodeRef" 
                @change="codeChange" 
                seconds="60"
                changeText="X秒重新获取"
              ></u-code>
              <u-button 
                @tap="getCode" 
                :text="tips" 
                type="primary" 
                size="mini"
                :disabled="disabled"
              ></u-button>
            </template>
          </u-input>
        </u-form-item>
      </u-form>
      
      <u-button 
        type="primary" 
        size="large" 
        @click="handleSubmit"
        :loading="loading"
        loadingText="提交中..."
      >
        提交
      </u-button>
    </view>
    
    <view class="skip-section">
      <text class="skip-text" @click="handleSkip">跳过，稍后完善</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
// 关键：UniApp 组件实例获取需导入 getCurrentInstance
import { getCurrentInstance } from 'vue'

// 1. 定义响应式数据（表单数据、状态管理）
// 表单数据（复杂对象用 reactive 更简洁）
const form = reactive({
  avatar: '',
  nickname: '',
  gender: '0', // 默认保密
  phone: '',
  code: ''
})

// 表单验证规则（静态规则用普通对象，无需响应式）
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为2-20位', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ]
}

// 其他响应式状态
const avatarList = ref([]) // 头像上传文件列表
const tips = ref('获取验证码') // 验证码按钮文本
const disabled = ref(false) // 验证码按钮禁用状态
const loading = ref(false) // 提交按钮加载状态

// 2. 获取组件实例（替代原 this.$refs）
// u-form 实例：用于表单验证
const formRef = ref(null)
// u-code 实例：用于控制验证码倒计时
const uCodeRef = ref(null)

// 3. 定义核心方法（表单交互、上传、提交逻辑）
/**
 * 头像上传回调：读取文件后处理
 * @param {Object} event - u-upload 组件的 afterRead 事件参数
 */
const afterRead = async (event) => {
  const { file } = event
  uni.showLoading({ title: '上传中...' })

  try {
    // 模拟头像上传接口请求（1秒延迟）
    setTimeout(() => {
      form.avatar = file[0].url // 更新表单中的头像地址
      avatarList.value = [{ url: file[0].url }] // 更新上传文件列表
      uni.hideLoading()
      uni.showToast({ title: '上传成功', icon: 'success' })
    }, 1000)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '上传失败', icon: 'none' })
    console.error('头像上传失败:', error)
  }
}

/**
 * 删除头像：清空文件列表和表单头像地址
 */
const deletePic = () => {
  avatarList.value = []
  form.avatar = ''
}

/**
 * 验证码倒计时文本变化：更新按钮文本
 * @param {string} text - u-code 组件的倒计时文本（如“60秒重新获取”）
 */
const codeChange = (text) => {
  tips.value = text
}

/**
 * 获取验证码：验证手机号格式后启动倒计时
 */
const getCode = async () => {
  // 手机号为空校验
  if (!form.phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }

  // 手机号格式校验（正则复用表单规则）
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(form.phone)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return
  }

  // 禁用按钮并启动倒计时
  disabled.value = true
  uCodeRef.value.start() // 调用 u-code 实例的 start 方法

  // 模拟发送验证码接口请求（1秒延迟）
  setTimeout(() => {
    uni.showToast({ title: '验证码已发送', icon: 'success' })
  }, 1000)
}

/**
 * 提交表单：先验证表单，通过后模拟提交
 */
const handleSubmit = async () => {
  try {
    // 调用 u-form 实例的 validate 方法进行表单验证
    await formRef.value.validate()
    loading.value = true // 显示提交加载状态

    // 模拟表单提交接口请求（1秒延迟）
    setTimeout(() => {
      uni.showToast({ title: '提交成功', icon: 'success' })
      // 1.5秒后跳转至首页（Tab页）
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }, 1000)
  } catch (error) {
    // 表单验证失败时，u-form 会自动提示错误，此处仅捕获异常
    console.error('表单提交失败:', error)
  } finally {
    loading.value = false // 无论成功失败，都关闭加载状态
  }
}

/**
 * 跳过完善：直接跳转至首页
 */
const handleSkip = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
/* 样式完全保留原代码，无任何修改 */
.auth-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 40rpx;
}

.auth-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
}

.auth-form {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
}

.upload-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  height: 120rpx;
  border: 2rpx dashed #ddd;
  border-radius: 50%;
  
  text {
    font-size: 20rpx;
    color: #999;
    margin-top: 10rpx;
  }
}

.skip-section {
  margin-top: 40rpx;
  text-align: center;
}

.skip-text {
  font-size: 28rpx;
  color: #007aff;
}
</style>