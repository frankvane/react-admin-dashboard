# React Admin Dashboard

一个基于 React 和 Ant Design 的现代化管理后台模板，提供了丰富的组件和功能，帮助开发者快速构建企业级管理系统。

## 特性

- 🚀 基于 React 18、TypeScript、Vite 构建
- 📦 使用 Ant Design 5.x 组件库
- 🔐 内置权限管理系统
- 📊 集成多种数据可视化图表
- 📱 响应式设计，支持多种设备
- 🌓 支持明暗主题切换
- 🧩 模块化设计，易于扩展
- 🔄 页面缓存功能，提升用户体验
- 🔍 全局搜索功能
- 🌐 国际化支持

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design 5.x
- React Router 6
- Zustand (状态管理)
- Axios (网络请求)
- @ant-design/plots (数据可视化)
- ESLint & Prettier (代码规范)

## 权限管理模块

本项目实现了完整的权限管理模块，包含以下功能：

1. **用户管理**：用户的增删改查、状态管理
2. **角色管理**：角色的增删改查、权限分配
3. **授权管理**：基于角色的权限分配，支持树形结构展示权限

权限管理模块采用了嵌套路由结构，通过 Sidebar 组件的多级菜单进行导航。

## 页面缓存实现

本项目使用 Zustand 实现了页面缓存功能，主要包含以下组件：

1. `KeepAlive` 组件：负责缓存和恢复页面状态
2. 路由配置：通过 `meta.keepAlive` 属性控制页面是否需要缓存
3. 缓存刷新：通过 Header 组件中的刷新按钮实现页面缓存刷新

### Zustand 状态管理

使用 Zustand 替代了传统的 eventBus 方案，提供了更加类型安全和可预测的状态管理方式：

```typescript
// 缓存状态管理
const useCacheStore = create<CacheStore>((set) => ({
  cachedPages: {},
  addCache: (key, component) => 
    set((state) => ({
      cachedPages: { ...state.cachedPages, [key]: component }
    })),
  removeCache: (key) => 
    set((state) => {
      const { [key]: _, ...rest } = state.cachedPages;
      return { cachedPages: rest };
    }),
  clearCache: () => set({ cachedPages: {} }),
}));
```

## 组件更新说明

### Ant Design 5.x 兼容性更新

1. Dropdown 组件
   - 将废弃的 `overlay` 属性替换为 `menu` 属性
   - 示例: `<Dropdown menu={{ items }} />`

2. Card 组件
   - 将废弃的 `bordered={false}` 属性替换为 `variant="borderless"`
   - 示例: `<Card variant="borderless" />`

3. 图表组件配置更新
   - 柱状图: 将 `position: "middle"` 更改为 `position: "top"`
   - 销售比例图表: 将饼图替换为柱状图，避免 Ant Design Charts 5.x 中的饼图标签渲染问题

## 开发

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

## 构建

```bash
# 构建生产环境
npm run build

# 预览生产构建
npm run preview
```

## 目录结构

```
├── public/               # 静态资源
├── src/
│   ├── assets/           # 项目资源文件
│   ├── components/       # 公共组件
│   ├── hooks/            # 自定义 Hooks
│   ├── layouts/          # 布局组件
│   ├── pages/            # 页面组件
│   │   ├── dashboard/    # 仪表盘页面
│   │   ├── documentation/# 文档页面
│   │   └── permission/   # 权限管理模块
│   │       ├── user/     # 用户管理
│   │       ├── role/     # 角色管理
│   │       └── auth/     # 授权管理
│   ├── router/           # 路由配置
│   ├── services/         # API 服务
│   ├── store/            # 状态管理
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 应用入口组件
│   └── main.tsx          # 应用入口文件
├── .eslintrc.js          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── package.json          # 项目依赖和脚本
```

## 更新日志

### 2025-03-15 (最新更新)
- 优化 Sidebar 组件，支持嵌套菜单
- 添加权限管理模块及嵌套子路由
- 添加用户管理页面
- 添加角色管理页面
- 添加授权管理页面
- 修复柱状图配置中的 TypeScript 类型错误
- 恢复完整的更新日志记录

### 2025-03-15 (图表优化)
- 修复饼图标签配置中的 type 属性错误
- 完全重构饼图配置，解决标签渲染错误
- 替换饼图为柱状图，解决渲染错误
- 修复 Card 组件的 bordered 属性和图表配置
- 添加 DashboardStatistics 类型定义

### 2025-03-15 (Zustand 重构)
- 添加 Zustand 缓存状态管理 store
- 使用 Zustand 替代 eventBus 实现 KeepAlive 组件
- 使用 Zustand 替代 eventBus 实现 Header 组件
- 使用 Zustand 替代 eventBus 实现 Documentation 组件
- 标记 eventBus.ts 为已弃用，保留代码作为参考
- 修复 TagsView 组件中的 Dropdown 警告

### 2025-03-15 (页面缓存功能)
- 添加事件总线实现组件间通信
- 添加 KeepAlive 组件实现页面缓存
- 添加刷新按钮实现页面缓存刷新
- 优化 Documentation 组件，支持缓存刷新
- 集成 KeepAlive 组件实现页面缓存
- 添加路由缓存配置
- 导出 KeepAlive 组件

### 2025-03-12
- 项目初始化，基于 React 18 和 TypeScript
- 集成 Ant Design 5.x 组件库
- 添加基础布局组件
- 实现主题切换功能
- 集成 @ant-design/plots 图表库
- 添加响应式设计，支持移动端访问

### 2025-03-11
- 需求分析与技术选型
- 项目架构设计
- 创建项目仓库
- 配置开发环境
- 编写项目文档

## 许可证

[MIT](LICENSE)