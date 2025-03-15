import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FormOutlined,
  TableOutlined,
} from '@ant-design/icons';

import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/dashboard';
import Documentation from '../pages/documentation';
import NotFound from '../pages/404';

// 路由配置接口
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  meta?: {
    title?: string;
    icon?: React.ReactNode;
    hidden?: boolean;
    cache?: boolean; // 是否缓存页面
  };
}

const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
    meta: {
      hidden: true,
    },
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        meta: {
          title: 'Dashboard',
          icon: <DashboardOutlined />,
          cache: true, // 启用缓存
        },
      },
      {
        path: 'documentation',
        element: <Documentation />,
        meta: {
          title: 'Documentation',
          icon: <FileTextOutlined />,
          cache: true, // 启用缓存
        },
      },
      {
        path: 'components',
        element: <div>Components Page</div>,
        meta: {
          title: 'Components',
          icon: <AppstoreOutlined />,
        },
        children: [
          {
            path: 'table',
            element: <div>Table Component</div>,
            meta: {
              title: 'Table',
              icon: <TableOutlined />,
            },
          },
          {
            path: 'form',
            element: <div>Form Component</div>,
            meta: {
              title: 'Form',
              icon: <FormOutlined />,
            },
          },
        ],
      },
      {
        path: 'charts',
        element: <div>Charts Page</div>,
        meta: {
          title: 'Charts',
          icon: <BarChartOutlined />,
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
    meta: {
      hidden: true,
    },
  },
];

export default routes;