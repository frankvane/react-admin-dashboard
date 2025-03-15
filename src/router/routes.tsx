import {
  AppstoreOutlined,
  DashboardOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dashboard, NotFound } from "../pages";

import { MainLayout } from "../layouts";
import { Navigate } from "react-router-dom";
import React from "react";

// 路由配置类型
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  meta?: {
    title: string;
    icon?: React.ReactNode;
    hidden?: boolean;
  };
}

// 路由配置
export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        meta: {
          title: "Dashboard",
          icon: <DashboardOutlined />,
        },
      },
      {
        path: "documentation",
        element: <div>Documentation Page</div>,
        meta: {
          title: "Documentation",
          icon: <FileTextOutlined />,
        },
      },
      {
        path: "guide",
        element: <div>Guide Page</div>,
        meta: {
          title: "Guide",
          icon: <QuestionCircleOutlined />,
        },
      },
      {
        path: "permission",
        element: <div>Permission Page</div>,
        meta: {
          title: "Permission",
          icon: <UserOutlined />,
        },
      },
      {
        path: "route-permission",
        element: <div>Route Permission Page</div>,
        meta: {
          title: "Route Permission",
          icon: <UserOutlined />,
        },
      },
      {
        path: "component",
        element: <div>Component Page</div>,
        meta: {
          title: "Component",
          icon: <AppstoreOutlined />,
        },
      },
      {
        path: "business",
        element: <div>Business Page</div>,
        meta: {
          title: "Business",
          icon: <ShoppingOutlined />,
        },
      },
      {
        path: "404",
        element: <NotFound />,
        meta: {
          title: "404",
          hidden: true,
        },
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
        meta: {
          title: "Not Found",
          hidden: true,
        },
      },
    ],
  },
];

// 扁平化路由配置，用于快速查找
export const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  return routes.reduce<RouteConfig[]>((acc, route) => {
    if (route.children) {
      return [...acc, route, ...flattenRoutes(route.children)];
    }
    return [...acc, route];
  }, []);
};

// 获取扁平化的路由配置
export const flatRoutes = flattenRoutes(routes);

// 根据路径获取路由元数据
export const getRouteMetaByPath = (
  path: string
): RouteConfig["meta"] | undefined => {
  const route = flatRoutes.find((r) => {
    // 处理根路径
    if (path === "/" && r.path === "") {
      return true;
    }
    return r.path === path || `/${r.path}` === path;
  });
  return route?.meta;
};
