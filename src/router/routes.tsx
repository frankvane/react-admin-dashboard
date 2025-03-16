import {
  BookOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LockOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { AppRoute } from "@/types";
import Dashboard from "@/pages/dashboard";
import Documentation from "@/pages/documentation";
import { MainLayout } from "@/layouts";
import NotFound from "@/pages/404";
import { Outlet } from "react-router-dom";
import React from "react";

// 用户管理页面
const UserManagement = React.lazy(() => import("@/pages/acl/permissions/user"));
// 角色管理页面
const RoleManagement = React.lazy(() => import("@/pages/acl/permissions/role"));
// 授权管理页面
const AuthManagement = React.lazy(() => import("@/pages/acl/permissions/auth"));

const routes: AppRoute[] = [
  {
    path: "/",
    element: <MainLayout />,
    meta: {
      title: "首页",
      icon: <DashboardOutlined />,
    },
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
        path: "permissions",
        element: <Outlet />,
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
            },
          },
          {
            path: "auth",
            element: <AuthManagement />,
            meta: {
              title: "授权管理",
              icon: <FileTextOutlined />,
            },
          },
        ],
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
