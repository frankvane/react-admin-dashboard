import { ApiResponse } from "@/types";

const BASE_URL = "/api";

/**
 * 通用请求方法
 * @param url 请求地址
 * @param options 请求选项
 * @returns Promise
 */
async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request error:", error);
    return {
      code: 500,
      data: null as unknown as T,
      message: error instanceof Error ? error.message : "Unknown error",
      success: false,
    };
  }
}

/**
 * 用户相关 API
 */
export const userApi = {
  login: (username: string, password: string) =>
    request("/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request("/user/logout"),

  getProfile: () => request("/user/profile"),

  updateProfile: (data: Record<string, unknown>) =>
    request("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/**
 * 仪表盘相关 API
 */
export const dashboardApi = {
  getStatistics: () => request("/dashboard/statistics"),

  getSalesData: (period: string) =>
    request(`/dashboard/sales?period=${period}`),

  getVisitData: (period: string) =>
    request(`/dashboard/visits?period=${period}`),

  getProportionData: () => request("/dashboard/proportion"),
};

/**
 * 模拟 API 响应（开发阶段使用）
 */
export const mockApi = {
  getStatistics: (): Promise<ApiResponse<any>> => {
    return Promise.resolve({
      code: 200,
      data: {
        sales: 126560,
        visits: 8846,
        payments: 6560,
        operations: 8846,
        dailySales: 12423,
        dailyVisits: 1234,
        conversionRate: 60,
      },
      message: "success",
      success: true,
    });
  },

  getSalesProportionData: (): Promise<ApiResponse<any>> => {
    return Promise.resolve({
      code: 200,
      data: [
        { type: "appliances", value: 4544, percentage: 30.95 },
        { type: "drinks", value: 3321, percentage: 22.62 },
        { type: "health", value: 3113, percentage: 21.2 },
        { type: "clothing", value: 2341, percentage: 15.94 },
        { type: "baby", value: 1231, percentage: 8.38 },
        { type: "others", value: 132, percentage: 0.9 },
      ],
      message: "success",
      success: true,
    });
  },
};
