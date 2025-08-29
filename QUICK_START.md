# 快速开始指南

## 1. 环境准备

### 安装Node.js
确保你的系统已安装Node.js (推荐版本 >= 16.0.0)

```bash
node -v
npm -v
```

### 安装HBuilderX (可选)
如果你需要开发微信小程序，建议安装HBuilderX
- 下载地址：https://www.dcloud.io/hbuilderx.html

## 2. 安装依赖

### 安装项目依赖
```bash
npm install
```

### 安装全局工具 (可选)
```bash
npm install -g @dcloudio/uni-cli
```

## 3. 启动项目

### 方式一：使用HBuilderX (推荐)
1. 打开HBuilderX
2. 点击"文件" -> "打开目录"
3. 选择项目根目录
4. 点击工具栏的运行按钮

### 方式二：使用命令行

#### 启动开发服务器 (H5)
```bash
npm run dev:h5
```

#### 启动微信小程序开发
```bash
npm run dev:mp-weixin
```

#### 启动支付宝小程序开发
```bash
npm run dev:mp-alipay
```

#### 启动模拟数据服务器
```bash
npm run mock
# 或者
npm run dev  # 同时启动前端和mock服务器
```

## 4. 构建项目

### 构建H5版本
```bash
npm run build:h5
```

### 构建微信小程序
```bash
npm run build:mp-weixin
```

### 构建支付宝小程序
```bash
npm run build:mp-alipay
```

## 5. 项目结构

```
uni-app-scaffold/
├── pages/                    # 页面目录
│   ├── login/               # 登录页
│   ├── auth/                # 微信授权页
│   ├── list/                # 列表页
│   ├── form/                # 表单页
│   ├── profile/             # 个人中心
│   ├── statistics/          # 统计页
│   └── index/               # 首页
├── components/              # 公共组件
├── api/                     # API接口
├── stores/                  # 状态管理
├── utils/                   # 工具函数
├── mock/                    # 模拟数据
├── static/                  # 静态资源
└── ...
```

## 6. 功能模块

### 用户认证
- ✅ 用户名密码登录
- ✅ 微信授权登录
- ✅ 注册功能
- ✅ Token自动续期

### 列表功能
- ✅ 下拉刷新
- ✅ 上拉加载更多
- ✅ 搜索筛选
- ✅ 增删改查

### 表单功能
- ✅ 多种表单控件
- ✅ 表单验证
- ✅ 图片上传
- ✅ 位置选择

### 统计功能
- ✅ 图表展示
- ✅ 数据筛选
- ✅ 多种图表类型

## 7. 开发规范

### 代码规范
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Vue3 Composition API规范

### 命名规范
- 文件名：使用kebab-case
- 组件名：使用PascalCase
- 变量名：使用camelCase

## 8. 常见问题

### Q: 项目启动失败
A: 检查Node.js版本是否>=16，然后删除node_modules重新安装

### Q: 微信小程序无法预览
A: 确保已配置微信小程序AppID，或选择测试号进行开发

### Q: 图表不显示
A: 检查uCharts组件是否正确引入，数据格式是否正确

### Q: 跨域问题
A: 开发环境已配置代理，生产环境需要配置服务器CORS

## 9. 联系支持

如有问题，请通过以下方式联系：
- 提交Issue到项目仓库
- 查看官方文档：https://uniapp.dcloud.net.cn/
- 查看uView文档：https://uview-plus.jiangruyi.com/