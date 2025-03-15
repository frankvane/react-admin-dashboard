// 用户类型
export interface User {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
  role: string;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
  path?: string;
}

// 路由类型
export interface AppRoute {
  path: string;
  element: React.ReactNode;
  children?: AppRoute[];
}

// 统计数据类型
export interface StatisticData {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  footer?: string;
  trend?: {
    value: number;
    isUp: boolean;
    text: string;
  };
}

// 图表数据类型
export interface ChartDataItem {
  month: string;
  value?: number;
  [key: string]: string | number | undefined;
}

// 销售比例数据类型
export interface SalesProportionItem {
  type: string;
  value: number;
  percentage: number;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}
