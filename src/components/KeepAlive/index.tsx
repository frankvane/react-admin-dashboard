import React, { createContext, useEffect, useState } from "react";
import { getRouteMetaByPath } from "../../router/routes";
import { useLocation } from "react-router-dom";
import useCacheStore from "../../store/cacheStore";

// 缓存项接口
interface CacheItem {
  key: string;
  component: React.ReactNode;
  active: boolean;
}

// 缓存上下文接口
interface KeepAliveContextType {
  refresh: (path: string) => void;
}

// 创建缓存上下文
export const KeepAliveContext = createContext<KeepAliveContextType>({
  refresh: () => {},
});

interface KeepAliveProps {
  children: React.ReactNode;
}

const KeepAlive: React.FC<KeepAliveProps> = ({ children }) => {
  const location = useLocation();
  const [cacheList, setCacheList] = useState<CacheItem[]>([]);
  const { clearCache } = useCacheStore();

  // 刷新指定路径的缓存
  const refresh = (path: string) => {
    console.log(`KeepAlive: 刷新路径 ${path} 的缓存`);

    // 从缓存列表中移除该路径
    setCacheList((prevList) => {
      return prevList.filter((item) => item.key !== path);
    });

    // 使用 Zustand store 通知其他组件缓存已清除
    clearCache(path);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const routeMeta = getRouteMetaByPath(currentPath);
    const shouldCache = routeMeta?.cache === true;

    console.log(`Path: ${currentPath}, Should cache: ${shouldCache}`);

    // 检查当前路径是否已缓存
    const existingCache = cacheList.find((item) => item.key === currentPath);

    if (existingCache) {
      // 如果已缓存，则激活当前路径，停用其他路径
      setCacheList((prevList) =>
        prevList.map((item) => ({
          ...item,
          active: item.key === currentPath,
        }))
      );
    } else {
      // 如果未缓存，则添加到缓存列表（如果需要缓存）
      // 或者替换之前的缓存（如果不需要缓存）
      if (shouldCache) {
        setCacheList((prevList) => [
          ...prevList.map((item) => ({
            ...item,
            active: false,
          })),
          {
            key: currentPath,
            component: children,
            active: true,
          },
        ]);
      } else {
        // 如果不需要缓存，则只保留当前组件
        setCacheList([
          {
            key: currentPath,
            component: children,
            active: true,
          },
        ]);
      }
    }
  }, [children, location.pathname]);

  return (
    <KeepAliveContext.Provider value={{ refresh }}>
      {cacheList.map((item) => (
        <div key={item.key} style={{ display: item.active ? "block" : "none" }}>
          {item.component}
        </div>
      ))}
    </KeepAliveContext.Provider>
  );
};

export default KeepAlive;