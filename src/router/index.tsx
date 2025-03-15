import { RouteConfig, routes } from "./routes";
import { RouteObject, useRoutes } from "react-router-dom";

import React from "react";

// 将自定义路由配置转换为 React Router 的 RouteObject
export const convertToRouteObjects = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((route) => {
    const routeObject: RouteObject = {
      path: route.path,
      element: route.element,
    };

    if (route.children) {
      routeObject.children = convertToRouteObjects(route.children);
    }

    return routeObject;
  });
};

// 路由组件
export const AppRoutes: React.FC = () => {
  const routeObjects = convertToRouteObjects(routes);
  const element = useRoutes(routeObjects);
  return element;
};

// 导出路由相关内容
export * from "./routes";
