import {
  AppstoreOutlined,
  AreaChartOutlined,
  BookOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LockOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AppRoute } from "../types";
import Dashboard from "../pages/dashboard";
import Documentation from "../pages/documentation";
import NotFound from "../pages/404";
import React from "react";

// 用户管理页面
const UserManagement = React.lazy(() => import("../pages/permission/user"));
// 角色管理页面
const RoleManagement = React.lazy(() => import("../pages/permission/role"));
// 授权管理页面
const AuthManagement = React.lazy(() => import("../pages/permission/auth"));

const routes: AppRoute[] = [
  {
    path: "/",
    element: <Dashboard />,
    meta: {
      title: "仪表盘",
      icon: <DashboardOutlined />,
      keepAlive: true,
    },
  },
  {
    path: "/documentation",
    element: <Documentation />,
    meta: {
      title: "文档",
      icon: <BookOutlined />,
      keepAlive: true,
    },
  },
  {
    path: "/components",
    element: <div>组件</div>,
    meta: {
      title: "组件",
      icon: <AppstoreOutlined />,
    },
    children: [
      {
        path: "/components/form",
        element: <div>表单</div>,
        meta: {
          title: "表单",
        },
      },
      {
        path: "/components/table",
        element: <div>表格</div>,
        meta: {
          title: "表格",
        },
      },
      {
        path: "/components/tabs",
        element: <div>选项卡</div>,
        meta: {
          title: "选项卡",
        },
      },
    ],
  },
  {
    path: "/charts",
    element: <div>图表</div>,
    meta: {
      title: "图表",
      icon: <AreaChartOutlined />,
    },
    children: [
      {
        path: "/charts/line",
        element: <div>折线图</div>,
        meta: {
          title: "折线图",
        },
      },
      {
        path: "/charts/bar",
        element: <div>柱状图</div>,
        meta: {
          title: "柱状图",
        },
      },
      {
        path: "/charts/pie",
        element: <div>饼图</div>,
        meta: {
          title: "饼图",
        },
      },
    ],
  },
  {
    path: "/permission",
    element: <div>权限管理</div>,
    meta: {
      title: "权限管理",
      icon: <LockOutlined />,
    },
    children: [
      {
        path: "/permission/user",
        element: <UserManagement />,
        meta: {
          title: "用户管理",
          icon: <UserOutlined />,
          keepAlive: true,
        },
      },
      {
        path: "/permission/role",
        element: <RoleManagement />,
        meta: {
          title: "角色管理",
          icon: <TeamOutlined />,
          keepAlive: true,
        },
      },
      {
        path: "/permission/auth",
        element: <AuthManagement />,
        meta: {
          title: "授权管理",
          icon: <FileTextOutlined />,
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
    meta: {
      title: "404",
      hidden: true,
    },
  },
];

export default routes;