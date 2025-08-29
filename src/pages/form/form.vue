<template>
  <view class="form-container">
    <u-navbar
      :title="form.id ? '编辑信息' : '新建信息'"
      :autoBack="true"
      bgColor="white"
    />
    
    <view class="form-content">
      <u-form ref="formRef" :model="form" :rules="rules" labelPosition="left">
        <u-form-item label="标题" prop="title" labelWidth="140">
          <u-input 
            v-model="form.title" 
            placeholder="请输入标题"
            maxlength="50"
            clearable
          />
        </u-form-item>
        
        <u-form-item label="分类" prop="category" labelWidth="140">
          <u-picker
            :show="showCategory"
            :columns="categoryColumns"
            @confirm="handleCategoryConfirm"
            @cancel="showCategory = false"
          ></u-picker>
          <u-input
            v-model="form.category"
            placeholder="请选择分类"
            disabled
            @tap="showCategory = true"
          >
            <template #suffix>
              <u-icon name="arrow-right"></u-icon>
            </template>
          </u-input>
        </u-form-item>
        
        <u-form-item label="优先级" prop="priority" labelWidth="140">
          <u-radio-group v-model="form.priority">
            <u-radio label="1" customStyle="margin-right: 20rpx">
              <text style="color: #fa3534">高</text>
            </u-radio>
            <u-radio label="2" customStyle="margin-right: 20rpx">
              <text style="color: #ff9900">中</text>
            </u-radio>
            <u-radio label="3">
              <text style="color: #19be6b">低</text>
            </u-radio>
          </u-radio-group>
        </u-form-item>
        
        <u-form-item label="描述" prop="description" labelWidth="140">
          <u-textarea
            v-model="form.description"
            placeholder="请输入详细描述"
            maxlength="500"
            height="200"
            count
          ></u-textarea>
        </u-form-item>
        
        <u-form-item label="开始时间" prop="startTime" labelWidth="140">
          <u-datetime-picker
            :show="showStartTime"
            v-model="startTimeValue"
            mode="datetime"
            @confirm="handleStartTimeConfirm"
            @cancel="showStartTime = false"
          ></u-datetime-picker>
          <u-input
            v-model="form.startTime"
            placeholder="请选择开始时间"
            disabled
            @tap="showStartTime = true"
          >
            <template #suffix>
              <u-icon name="calendar"></u-icon>
            </template>
          </u-input>
        </u-form-item>
        
        <u-form-item label="结束时间" prop="endTime" labelWidth="140">
          <u-datetime-picker
            :show="showEndTime"
            v-model="endTimeValue"
            mode="datetime"
            @confirm="handleEndTimeConfirm"
            @cancel="showEndTime = false"
          ></u-datetime-picker>
          <u-input
            v-model="form.endTime"
            placeholder="请选择结束时间"
            disabled
            @tap="showEndTime = true"
          >
            <template #suffix>
              <u-icon name="calendar"></u-icon>
            </template>
          </u-input>
        </u-form-item>
        
        <u-form-item label="图片" prop="images" labelWidth="140">
          <u-upload
            :fileList="form.images"
            @afterRead="afterRead"
            @delete="deletePic"
            name="images"
            :maxCount="9"
            multiple
            width="160"
            height="160"
          ></u-upload>
        </u-form-item>
        
        <u-form-item label="位置" prop="location" labelWidth="140">
          <u-input
            v-model="form.location"
            placeholder="点击选择位置"
            disabled
            @tap="chooseLocation"
          >
            <template #suffix>
              <u-icon name="map"></u-icon>
            </template>
          </u-input>
        </u-form-item>
      </u-form>
    </view>
    
    <view class="form-footer">
      <u-button
        type="primary"
        size="large"
        @click="handleSubmit"
        :loading="loading"
        loadingText="提交中..."
      >
        提交
      </u-button>
      
      <u-button
        v-if="form.id"
        type="error"
        size="large"
        @click="handleDelete"
        :loading="deleteLoading"
        loadingText="删除中..."
        customStyle="margin-top: 20rpx"
      >
        删除
      </u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 响应式数据
const formRef = ref(null)
const form = reactive({
  id: '',
  title: '',
  category: '',
  priority: '2',
  description: '',
  startTime: '',
  endTime: '',
  images: [],
  location: ''
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ]
}

const categoryColumns = [
  ['工作', '学习', '生活', '娱乐', '其他']
]

const showCategory = ref(false)
const showStartTime = ref(false)
const showEndTime = ref(false)
const startTimeValue = ref('')
const endTimeValue = ref('')
const loading = ref(false)
const deleteLoading = ref(false)

// 方法函数
const formatDateTime = (timestamp) => {
  return uni.$u.timeFormat(timestamp, 'yyyy-mm-dd hh:MM')
}

// 获取详情
const getDetail = async () => {
  try {
    uni.showLoading({ title: '加载中...' })
    
    // 模拟获取详情
    setTimeout(() => {
      Object.assign(form, {
        id: form.id,
        title: `示例项目 ${form.id}`,
        category: '工作',
        priority: '2',
        description: `这是第${form.id}个示例项目的详细描述内容。`,
        startTime: '2024-01-15 09:00',
        endTime: '2024-01-20 18:00',
        images: [
          { url: 'https://picsum.photos/300/300?random=1' },
          { url: 'https://picsum.photos/300/300?random=2' }
        ],
        location: '北京市朝阳区'
      })
      uni.hideLoading()
    }, 1000)
    
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '获取详情失败', icon: 'none' })
  }
}

// 分类选择确认
const handleCategoryConfirm = (e) => {
  form.category = e.value[0]
  showCategory.value = false
}

// 开始时间确认
const handleStartTimeConfirm = (e) => {
  form.startTime = formatDateTime(e.value)
  startTimeValue.value = e.value
  showStartTime.value = false
}

// 结束时间确认
const handleEndTimeConfirm = (e) => {
  form.endTime = formatDateTime(e.value)
  endTimeValue.value = e.value
  showEndTime.value = false
}

// 上传图片
const afterRead = async (event) => {
  const { file } = event
  uni.showLoading({ title: '上传中...' })
  
  try {
    // 模拟上传
    setTimeout(() => {
      form.images.push(...file)
      uni.hideLoading()
      uni.showToast({ title: '上传成功', icon: 'success' })
    }, 1000)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '上传失败', icon: 'none' })
  }
}

// 删除图片
const deletePic = (event) => {
  const { index } = event
  form.images.splice(index, 1)
}

// 选择位置
const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      form.location = res.address
    },
    fail: () => {
      uni.showToast({ title: '获取位置失败', icon: 'none' })
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟提交
    setTimeout(() => {
      uni.showToast({
        title: form.id ? '更新成功' : '创建成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }, 1000)
    
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除
const handleDelete = () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除吗？',
    success: (res) => {
      if (res.confirm) {
        deleteLoading.value = true
        
        // 模拟删除
        setTimeout(() => {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }, 1000)
      }
    }
  })
}

// 生命周期
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  
  if (options.id) {
    form.id = options.id
    getDetail()
  }
})
</script>

<style lang="scss" scoped>
.form-container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.form-content {
  flex: 1;
  background: white;
  padding: 40rpx;
  margin: 20rpx;
  border-radius: 20rpx;
}

.form-footer {
  padding: 40rpx;
  background: white;
  border-top: 1rpx solid #eee;
}
</style>