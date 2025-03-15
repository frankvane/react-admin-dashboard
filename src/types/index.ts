import { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface MenuItem {
  key: string;
  icon?: ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

export interface AppRoute {
  path: string;
  element: ReactNode;
  children?: AppRoute[];
  meta?: {
    title?: string;
    icon?: ReactNode;
    hidden?: boolean;
    keepAlive?: boolean;
  };
}

export interface StatisticData {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  footer?: string;
  trend?: {
    value: number;
    isUp: boolean;
    text: string;
  };
}

export interface ChartDataItem {
  month: string;
  [key: string]: string | number;
}

export interface SalesProportionItem {
  type: string;
  value: number;
  percentage: number;
}

export interface DashboardStatistics {
  sales: number;
  dailySales: number;
  visits: number;
  dailyVisits: number;
  payments: number;
  conversionRate: number;
  operations: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}