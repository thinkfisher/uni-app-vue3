// Mock服务器配置
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3001

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 读取mock数据
const dbPath = path.join(__dirname, 'db.json')
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))

// 保存数据到文件
function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

// 登录接口
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  
  const user = db.users.find(u => u.username === username && u.password === password)
  
  if (user) {
    const token = 'mock-token-' + Date.now()
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone
        }
      }
    })
  } else {
    res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    })
  }
})

// 微信登录接口
app.post('/api/auth/wechat-login', (req, res) => {
  const { code } = req.body
  
  if (code) {
    const token = 'mock-wx-token-' + Date.now()
    res.json({
      code: 200,
      message: '微信登录成功',
      data: {
        token,
        user: {
          id: 1,
          username: 'wechat_user',
          nickname: '微信用户',
          avatar: '/static/images/avatar.png',
          phone: '13800138000'
        }
      }
    })
  } else {
    res.status(400).json({
      code: 400,
      message: '无效的code'
    })
  }
})

// 注册接口
app.post('/api/auth/register', (req, res) => {
  const { username, password, nickname } = req.body
  
  const existingUser = db.users.find(u => u.username === username)
  if (existingUser) {
    return res.status(400).json({
      code: 400,
      message: '用户名已存在'
    })
  }
  
  const newUser = {
    id: db.users.length + 1,
    username,
    password,
    nickname: nickname || username,
    avatar: '/static/images/avatar.png',
    phone: '',
    createdAt: new Date().toISOString()
  }
  
  db.users.push(newUser)
  saveDb()
  
  const token = 'mock-token-' + Date.now()
  res.json({
    code: 200,
    message: '注册成功',
    data: {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
        avatar: newUser.avatar,
        phone: newUser.phone
      }
    }
  })
})

// 获取用户信息
app.get('/api/user/info', (req, res) => {
  // const token = req.headers.authorization?.replace('Bearer ', '')
  
  // if (!token) {
  //   return res.status(401).json({
  //     code: 401,
  //     message: '未登录'
  //   })
  // }
  
  res.json({
    code: 200,
    message: '获取用户信息成功',
    data: {
      id: 1,
      username: 'demo_user',
      nickname: '演示用户',
      avatar: '/static/images/avatar.png',
      phone: '13800138000',
      email: 'demo@example.com',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  })
})

// 更新用户信息
app.put('/api/user/info', (req, res) => {
  const { nickname, phone, email } = req.body
  
  res.json({
    code: 200,
    message: '更新用户信息成功',
    data: {
      id: 1,
      username: 'demo_user',
      nickname: nickname || '演示用户',
      avatar: '/static/images/avatar.png',
      phone: phone || '13800138000',
      email: email || 'demo@example.com'
    }
  })
})

// 获取列表数据
app.get('/api/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', status = '' } = req.query
  
  let filteredList = [...db.list]
  
  if (keyword) {
    filteredList = filteredList.filter(item => 
      item.title.includes(keyword) || 
      item.content.includes(keyword)
    )
  }
  
  if (status) {
    filteredList = filteredList.filter(item => item.status === status)
  }
  
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + parseInt(pageSize)
  const paginatedList = filteredList.slice(startIndex, endIndex)
  
  res.json({
    code: 200,
    message: '获取列表成功',
    data: {
      list: paginatedList,
      total: filteredList.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  })
})

// 获取列表详情
app.get('/api/list/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const item = db.list.find(item => item.id === id)
  
  if (item) {
    res.json({
      code: 200,
      message: '获取详情成功',
      data: item
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '数据不存在'
    })
  }
})

// 创建列表项
app.post('/api/list', (req, res) => {
  const newItem = {
    id: db.list.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  db.list.unshift(newItem)
  saveDb()
  
  res.json({
    code: 200,
    message: '创建成功',
    data: newItem
  })
})

// 更新列表项
app.put('/api/list/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = db.list.findIndex(item => item.id === id)
  
  if (index !== -1) {
    db.list[index] = {
      ...db.list[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    saveDb()
    
    res.json({
      code: 200,
      message: '更新成功',
      data: db.list[index]
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '数据不存在'
    })
  }
})

// 删除列表项
app.delete('/api/list/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = db.list.findIndex(item => item.id === id)
  
  if (index !== -1) {
    db.list.splice(index, 1)
    saveDb()
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '数据不存在'
    })
  }
})

// 获取统计数据
app.get('/api/statistics', (req, res) => {
  const { type = 'overview', dateRange = 'week' } = req.query
  
  res.json({
    code: 200,
    message: '获取统计数据成功',
    data: db.statistics
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`)
})