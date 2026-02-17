# Echologue 前端项目

Echologue 博客系统的前端部分，基于 React + TypeScript + Vite 构建，采用 Notion 风格的极简设计。

## 技术栈

- **核心框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: React Router v6
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **样式方案**: Tailwind CSS
- **Markdown**: react-markdown + remark-gfm + rehype-highlight

## 项目结构

```
src/
├── api/              # API 请求封装
│   ├── user.ts      # 用户相关接口
│   └── article.ts   # 文章相关接口
├── components/       # 公共组件
│   ├── Header.tsx          # 顶部导航栏
│   ├── ArticleCard.tsx     # 文章卡片
│   ├── MarkdownEditor.tsx  # Markdown 编辑器
│   └── MarkdownViewer.tsx  # Markdown 渲染器
├── pages/            # 页面组件
│   ├── Home.tsx            # 首页（文章列表）
│   ├── Login.tsx           # 登录页
│   ├── Register.tsx        # 注册页
│   ├── ArticleDetail.tsx   # 文章详情
│   └── Editor.tsx          # 文章编辑器
├── store/            # 状态管理
│   ├── userStore.ts        # 用户状态
│   └── themeStore.ts       # 主题状态
├── utils/            # 工具函数
│   └── request.ts          # Axios 封装
├── App.tsx           # 根组件（路由配置）
├── main.tsx          # 入口文件
└── index.css         # 全局样式
```

## 功能特性

### 用户功能
- ✅ 用户注册/登录
- ✅ 用户信息展示
- ✅ Token 自动管理

### 文章功能
- ✅ 文章列表展示（分页）
- ✅ 文章详情查看
- ✅ 文章创建/编辑
- ✅ Markdown 实时预览
- ✅ 文章发布/草稿保存
- ✅ 分类和标签管理
- ✅ 自动保存（防抖）

### UI 特性
- ✅ Notion 风格极简设计
- ✅ 深色/浅色主题切换
- ✅ 响应式布局
- ✅ 代码语法高亮
- ✅ Markdown 渲染
- ✅ 流畅的动画过渡

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## API 配置

前端项目默认通过 Vite 代理连接后端 API：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 后端地址
      changeOrigin: true,
    },
  },
}
```

如需修改后端地址，请编辑 `vite.config.ts` 文件。

## 主题切换

项目支持深色/浅色主题切换，主题偏好会保存在 localStorage 中。

点击顶部导航栏的主题切换按钮即可切换主题。

## 路由说明

| 路径 | 说明 | 权限 |
|------|------|------|
| `/` | 首页（文章列表） | 公开 |
| `/login` | 登录页 | 公开 |
| `/register` | 注册页 | 公开 |
| `/article/:id` | 文章详情 | 公开 |
| `/editor` | 创建文章 | 需要登录 |
| `/editor/:id` | 编辑文章 | 需要登录 |

## 状态管理

项目使用 Zustand 进行状态管理：

### userStore
- 用户信息
- 登录状态
- 登录/登出操作

### themeStore
- 主题模式（light/dark）
- 主题切换操作

## 样式说明

项目使用 Tailwind CSS，并在 `src/index.css` 中定义了自定义样式类：

- `.btn` - 按钮基础样式
- `.btn-primary` - 主色按钮
- `.btn-secondary` - 次要按钮
- `.card` - 卡片样式
- `.input` - 输入框样式
- `.container-content` - 内容容器（最大宽度 720px）

## 开发注意事项

1. **Token 管理**: Token 存储在 localStorage 中，key 为 `satoken`
2. **路由守卫**: 需要登录的页面使用 `RequireAuth` 组件包裹
3. **自动保存**: 编辑器每 3 秒自动保存一次草稿
4. **Markdown 支持**: 支持 GFM（GitHub Flavored Markdown）语法
5. **代码高亮**: 使用 highlight.js 进行语法高亮

## 常见问题

### 1. 跨域问题
开发环境下通过 Vite 代理解决，生产环境需要配置 Nginx 反向代理。

### 2. Token 过期
Token 过期后会自动跳转到登录页，需要重新登录。

### 3. 图片上传
MVP 版本暂未实现图片上传功能，后续迭代会添加。

## License

MIT
