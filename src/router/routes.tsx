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
import { MainLayout } from "../layouts";
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
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        meta: {
          title: "仪表盘",
          icon: <DashboardOutlined />,
          keepAlive: true,
        },
      },
      {
        path: "documentation",
        element: <Documentation />,
        meta: {
          title: "文档",
          icon: <BookOutlined />,
          keepAlive: true,
        },
      },
      {
        path: "components",
        element: <div>组件</div>,
        meta: {
          title: "组件",
          icon: <AppstoreOutlined />,
        },
        children: [
          {
            path: "form",
            element: <div>表单</div>,
            meta: {
              title: "表单",
            },
          },
          {
            path: "table",
            element: <div>表格</div>,
            meta: {
              title: "表格",
            },
          },
          {
            path: "tabs",
            element: <div>选项卡</div>,
            meta: {
              title: "选项卡",
            },
          },
        ],
      },
      {
        path: "charts",
        element: <div>图表</div>,
        meta: {
          title: "图表",
          icon: <AreaChartOutlined />,
        },
        children: [
          {
            path: "line",
            element: <div>折线图</div>,
            meta: {
              title: "折线图",
            },
          },
          {
            path: "bar",
            element: <div>柱状图</div>,
            meta: {
              title: "柱状图",
            },
          },
          {
            path: "pie",
            element: <div>饼图</div>,
            meta: {
              title: "饼图",
            },
          },
        ],
      },
      {
        path: "permission",
        element: <div>权限管理</div>,
        meta: {
          title: "权限管理",
          icon: <LockOutlined />,
        },
        children: [
          {
            path: "user",
            element: <UserManagement />,
            meta: {
              title: "用户管理",
              icon: <UserOutlined />,
              keepAlive: true,
            },
          },
          {
            path: "role",
            element: <RoleManagement />,
            meta: {
              title: "角色管理",
              icon: <TeamOutlined />,
              keepAlive: true,
            },
          },
          {
            path: "auth",
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
    ],
  },
];

// 根据路径查找路由元数据
export const getRouteMetaByPath = (
  path: string
): AppRoute["meta"] | undefined => {
  // 处理根路径
  if (path === "/") {
    const rootRoute = routes[0].children?.find((route) => route.path === "");
    return rootRoute?.meta;
  }

  // 移除开头的斜杠
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  // 递归查找路由
  const findRouteMeta = (
    routes: AppRoute[],
    pathSegments: string[]
  ): AppRoute["meta"] | undefined => {
    if (pathSegments.length === 0) return undefined;

    const currentSegment = pathSegments[0];
    const remainingSegments = pathSegments.slice(1);

    for (const route of routes) {
      if (route.path === currentSegment) {
        if (remainingSegments.length === 0) {
          return route.meta;
        }

        if (route.children) {
          const childMeta = findRouteMeta(route.children, remainingSegments);
          if (childMeta) return childMeta;
        }
      }
    }

    return undefined;
  };

  const pathSegments = normalizedPath.split("/");
  return findRouteMeta(routes[0].children || [], pathSegments);
};

export default routes;

export { routes };
