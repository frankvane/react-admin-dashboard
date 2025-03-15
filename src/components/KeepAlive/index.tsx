import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useRoutes } from '../../hooks/useRoutes';
import { eventBus, EVENT_NAMES } from '../../utils/eventBus';

// 缓存项接口
interface CacheItem {
  component: React.ReactNode;
  active: boolean;
}

// 缓存上下文接口
interface KeepAliveContextType {
  refresh: (path: string) => void;
}

// 创建上下文
const KeepAliveContext = createContext<KeepAliveContextType>({
  refresh: () => {},
});

// 导出上下文 Hook
export const useKeepAlive = () => useContext(KeepAliveContext);

// 缓存组件
const KeepAlive: React.FC = () => {
  // 获取当前路由信息
  const location = useLocation();
  const outlet = useOutlet();
  const { getRouteMetaByPath } = useRoutes();
  
  // 缓存状态
  const [cacheMap, setCacheMap] = useState<Record<string, CacheItem>>({});
  
  // 当前路径
  const currentPath = location.pathname;
  
  // 获取当前路由元数据
  const currentMeta = getRouteMetaByPath(currentPath);
  
  // 是否需要缓存当前页面
  const shouldCache = currentMeta?.cache === true;
  
  // 刷新缓存方法
  const refresh = (path: string) => {
    setCacheMap((prev) => {
      const newCache = { ...prev };
      delete newCache[path];
      
      // 通过事件总线通知其他组件缓存已清除
      eventBus.emit(EVENT_NAMES.CACHE_CLEARED, { path });
      
      return newCache;
    });
  };
  
  // 路由变化时更新缓存
  useEffect(() => {
    if (!outlet) return;
    
    setCacheMap((prev) => {
      const newCache = { ...prev };
      
      // 将所有缓存项设为非活动状态
      Object.keys(newCache).forEach((key) => {
        newCache[key].active = false;
      });
      
      // 如果当前页面需要缓存，则添加或更新缓存
      if (shouldCache) {
        newCache[currentPath] = {
          component: outlet,
          active: true,
        };
      }
      
      return newCache;
    });
  }, [outlet, currentPath, shouldCache]);
  
  return (
    <KeepAliveContext.Provider value={{ refresh }}>
      {/* 渲染当前活动的缓存组件 */}
      {Object.entries(cacheMap).map(([path, { component, active }]) => (
        <div
          key={path}
          style={{ display: active ? 'block' : 'none' }}
          data-keepalive-path={path}
        >
          {component}
        </div>
      ))}
      
      {/* 如果当前页面不需要缓存，直接渲染 */}
      {!shouldCache && outlet}
    </KeepAliveContext.Provider>
  );
};

export default KeepAlive;