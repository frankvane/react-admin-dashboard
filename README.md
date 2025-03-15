# React Admin Dashboard

![React](https://img.shields.io/badge/React-19.0.0-blue)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.24.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.0-blue)

一个基于 React 和 Ant Design 的现代化管理后台模板，提供了丰富的组件和功能，帮助开发者快速构建企业级管理系统。

## 🌟 功能特点

- 📱 **响应式设计**：适配不同尺寸的屏幕和设备
- 🎨 **精美 UI**：基于 Ant Design 组件库，提供美观的用户界面
- 🧩 **模块化结构**：代码组织清晰，易于维护和扩展
- 🚦 **路由管理**：基于 React Router 的路由系统，支持嵌套路由
- 🔖 **标签式导航**：类似浏览器的标签页导航体验，提高工作效率
- 📊 **数据可视化**：集成多种图表组件，展示数据统计和分析
- 🔐 **权限控制**：灵活的权限管理系统，控制用户访问权限
- 🌐 **API 集成**：内置 Axios 请求工具，轻松对接后端服务
- 🗄️ **状态管理**：使用 Zustand 进行全局状态管理
- 🔄 **页面缓存**：自定义 KeepAlive 组件实现页面缓存，提高性能和用户体验

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/frankvane/react-admin-dashboard.git

# 进入项目目录
cd react-admin-dashboard

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🚀 使用方法

启动开发服务器后，访问 http://localhost:5173 即可查看项目。

项目结构说明：

```
src/
├── assets/        # 静态资源文件
├── components/    # 公共组件
│   ├── KeepAlive/ # 页面缓存组件
│   └── TagsView/  # 标签导航组件
├── hooks/         # 自定义 Hooks
├── layouts/       # 布局组件
├── pages/         # 页面组件
├── router/        # 路由配置
├── services/      # API 服务
├── store/         # 状态管理
│   └── cacheStore.ts # 缓存状态管理
├── styles/        # 全局样式
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
├── App.tsx        # 应用入口组件
└── main.tsx       # 应用入口文件
```

## 🔧 配置

项目使用 Vite 作为构建工具，可以通过修改 `vite.config.ts` 文件进行配置。

## 📋 更新日志

### v0.1.1 (2025-03-15)

- **最新** - refactor: 使用 Zustand 替代 eventBus 实现页面缓存

  - 添加 cacheStore.ts 实现缓存状态管理
  - 重构 KeepAlive 组件，使用 Zustand 管理缓存状态
  - 重构 Header 组件，使用 Zustand 通知缓存刷新
  - 重构 Documentation 组件，使用 Zustand 监听缓存变化
  - 标记 eventBus.ts 为已弃用，保留代码作为参考

### v0.1.0 (2025-03-15)

- feat: 实现页面缓存功能

  - 添加自定义 KeepAlive 组件实现页面缓存
  - 在路由配置中通过 meta.cache 属性标记需要缓存的页面
  - 添加刷新按钮，支持强制刷新缓存页面
  - 实现事件总线机制，优化组件间通信
  - 添加 Documentation 页面作为缓存功能演示

- **4c87326** - fix: 修复 TagsView 组件中的关闭功能

  - 使用 useRef 解决依赖循环问题
  - 修复标签操作逻辑
  - 优化回调函数依赖
  - 本地化菜单文本

- **e622b4f** - refactor: 抽离路由配置到 router 目录并优化 TagsView 组件

  - 将路由配置从 App.tsx 抽离到专门的 router 目录
  - 实现路由配置集中管理
  - 优化 TagsView 组件，使用路由元数据动态生成标签
  - 优化 Sidebar 组件，使用路由配置生成菜单项

- **760979e** - feat: 添加 TagsView 组件实现标签式导航

  - 实现标签式导航功能
  - 支持关闭当前、关闭其它、关闭所有等操作
  - 添加 404 页面组件

- **0d4c8ca** - feat: 完成 React Admin Dashboard 基础框架搭建

  - 创建主布局组件
  - 实现侧边栏、头部和页脚组件
  - 添加仪表盘页面
  - 配置基本路由

- **e3e347e** - Add admin dashboard with Ant Design, React Router, Zustand, and Axios

  - 集成 Ant Design 组件库
  - 添加 React Router 路由管理
  - 集成 Zustand 状态管理
  - 添加 Axios 请求工具

- **edfd244** - Initial commit: React project created with Vite
  - 使用 Vite 创建 React 项目
  - 配置 TypeScript 支持
  - 设置基本项目结构

## 🔄 页面缓存功能说明

本项目实现了类似 Vue 中 `<keep-alive>` 的页面缓存功能，可以在用户切换页面时保留页面状态，提高用户体验和应用性能。

### 使用方法

1. **配置需要缓存的路由**

   在 `src/router/routes.tsx` 中，通过设置路由的 `meta.cache` 属性来标记需要缓存的页面：

   ```tsx
   {
     path: "documentation",
     element: <Documentation />,
     meta: {
       title: "Documentation",
       icon: <FileTextOutlined />,
       cache: true, // 启用缓存
     },
   }
   ```

2. **刷新缓存**

   可以通过顶部导航栏的刷新按钮强制刷新当前页面的缓存。

### 实现原理

- **KeepAlive 组件**：自定义组件，维护一个缓存列表，保存已访问过的页面组件。
- **路由元数据**：通过路由配置的 `meta.cache` 属性决定页面是否需要缓存。
- **Zustand 状态管理**：使用 Zustand 实现组件间通信，特别是在缓存被清除时通知相关组件。
- **全局状态**：使用模块级变量保持状态，确保即使组件重新挂载也能保持之前的状态。

### 演示页面

项目中的 Documentation 页面提供了缓存功能的完整演示，包括：

- 显示组件挂载时间和 API 请求次数，证明缓存效果
- 提供手动刷新数据的按钮，不影响缓存
- 在 Network 面板中可观察到，离开页面再返回时不会重新发起 API 请求

## 📄 许可证

[MIT](LICENSE)

## 👨‍💻 贡献

欢迎提交 Issue 或 Pull Request 来帮助改进这个项目！