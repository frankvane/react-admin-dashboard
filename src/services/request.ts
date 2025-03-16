import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import PQueue from "p-queue";
import { message as antdMessage } from "antd";
import axios from "axios";
import axiosRetry from "axios-retry";

// 扩展 InternalAxiosRequestConfig，添加 metadata 属性
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
  _retry?: boolean; // 用于标记是否已重试
}

// 定义请求配置类型，headers 和 timeout 可选
interface RequestConfig extends Omit<CustomAxiosRequestConfig, "headers"> {
  url: string;
  method?: "get" | "post" | "put" | "delete";
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
  headers?: CustomAxiosRequestConfig["headers"];
  timeout?: number;
}

// 全局 Loading 状态管理
let loadingCount = 0;
const setLoading = (isLoading: boolean) => {
  loadingCount += isLoading ? 1 : -1;
  console.log("Global Loading:", loadingCount > 0);
};

// 请求缓存
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟缓存

// 请求队列
const queue = new PQueue({ concurrency: 3 });

// 请求去重和取消管理
const pendingRequests = new Map<string, Promise<unknown>>();
const controllers = new Map<string, AbortController>();

// Token 刷新状态
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: any) => void;
}> = [];

const createApiInstance = () => {
  const instance = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
  });

  // 重试机制
  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount: number) => retryCount * 1000,
    retryCondition: (error: any) =>
      axios.isAxiosError(error) &&
      (error.code === "ECONNABORTED" || (error.response?.status ?? 0) >= 500),
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      setLoading(true);
      config.metadata = { startTime: Date.now() };
      console.log(`Request: ${config.method} ${config.url}`);

      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      setLoading(false);
      // 修复 metadata 属性错误
      const duration =
        Date.now() -
        ((response.config as CustomAxiosRequestConfig).metadata?.startTime ??
          0);
      console.log(
        `Response: ${response.config.method} ${response.config.url} - ${response.status} (${duration}ms)`
      );
      return response;
    },
    async (error: any) => {
      setLoading(false);

      if (!error.config) {
        return Promise.reject(error);
      }

      const config = error.config;
      const duration = config
        ? Date.now() -
          ((config as CustomAxiosRequestConfig).metadata?.startTime ?? 0)
        : 0;
      console.log(
        `Error: ${config?.method} ${config?.url} - ${error.response?.status} (${duration}ms)`
      );

      if (axios.isCancel(error)) {
        throw new Error("请求已取消");
      }

      // 修复 response 属性错误
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        config
      ) {
        const originalRequest = config as CustomAxiosRequestConfig;

        if (!originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshToken();
            localStorage.setItem("token", newToken);
            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, undefined);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
      }

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const messageText = getErrorMessage(error);

        if (status === 403) {
          showErrorMessage("无权限访问");
        } else if (status && status !== 401) {
          showErrorMessage(messageText);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiInstance();

let lastMessageTime = 0;
const MESSAGE_DEBOUNCE_TIME = 2000;

const showErrorMessage = (content: string) => {
  const now = Date.now();
  if (now - lastMessageTime > MESSAGE_DEBOUNCE_TIME) {
    antdMessage.error(content);
    lastMessageTime = now;
  }
};

const getErrorMessage = (error: any): string => {
  let msg = "未知错误";
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    switch (status) {
      case 400:
        msg = "请求错误";
        break;
      case 401:
        msg = "未授权，请登录";
        break;
      case 403:
        msg = "拒绝访问";
        break;
      case 404:
        msg = `请求地址出错: ${error.response?.config?.url || "未知URL"}`;
        break;
      case 408:
        msg = "请求超时";
        break;
      case 500:
        msg = "服务器内部错误";
        break;
      case 502:
        msg = "网关错误";
        break;
      case 503:
        msg = "服务不可用";
        break;
      case 504:
        msg = "网关超时";
        break;
      default:
        msg = "网络请求失败";
    }
  }
  return msg;
};

// 处理 Token 刷新队列
const processQueue = (error: any, token?: string) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token!)
  );
  failedQueue = [];
};

// 模拟刷新 Token 函数
const refreshToken = async (): Promise<string> => {
  return "new-token"; // 替换为实际刷新逻辑
};

// 取消所有请求
export const cancelAllRequests = () => {
  controllers.forEach((controller, key) => {
    controller.abort();
    pendingRequests.delete(key);
    controllers.delete(key);
  });
};

export const request = async <T>(config: RequestConfig): Promise<T> => {
  const requestKey = `${config.method || "get"}-${config.url}-${JSON.stringify(
    config.params || {}
  )}-${JSON.stringify(config.data || {})}`;

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey) as Promise<T>;
  }

  const controller = new AbortController();
  config.signal = controller.signal;
  controllers.set(requestKey, controller);

  const requestPromise = queue.add(() =>
    api({
      ...config,
      timeout: config.timeout,
    })
      .then((response: AxiosResponse<T>) => response.data)
      .finally(() => {
        pendingRequests.delete(requestKey);
        controllers.delete(requestKey);
      })
  ) as Promise<T>;

  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
};

export const get = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> => {
  const cacheKey = `get-${url}-${JSON.stringify(params || {})}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const result = await request<T>({ method: "get", url, params });
  cache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
};

export const post = <T>(url: string, data?: Record<string, unknown>) =>
  request<T>({ method: "post", url, data });

export const put = <T>(url: string, data?: Record<string, unknown>) =>
  request<T>({ method: "put", url, data });

export const del = <T>(url: string, params?: Record<string, unknown>) =>
  request<T>({ method: "delete", url, params });
