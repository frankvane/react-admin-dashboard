import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { getRouteMetaByPath } from '../../router';

interface CacheItem {
  key: string;
  component: React.ReactNode;
  active: boolean;
}

interface KeepAliveContextType {
  refresh: (path?: string) => void;
}

export const KeepAliveContext = React.createContext<KeepAliveContextType>({
  refresh: () => {},
});

const KeepAlive: React.FC = () => {
  const outlet = useOutlet();
  const location = useLocation();
  const [cacheItems, setCacheItems] = useState<CacheItem[]>([]);
  const cacheItemsRef = useRef<CacheItem[]>([]);

  // 刷新指定路径的缓存
  const refresh = (path?: string) => {
    const targetPath = path || location.pathname;
    
    // 从缓存中移除指定路径的组件
    const newCacheItems = cacheItemsRef.current.filter(item => item.key !== targetPath);
    cacheItemsRef.current = newCacheItems;
    setCacheItems(newCacheItems);
  };

  useEffect(() => {
    const { pathname } = location;
    const meta = getRouteMetaByPath(pathname);
    
    // 检查路由是否需要缓存
    const shouldCache = meta?.cache === true;
    
    // 检查缓存中是否已存在该路径
    const existingItemIndex = cacheItemsRef.current.findIndex(item => item.key === pathname);
    
    // 更新所有缓存项的活动状态
    const updatedCacheItems = cacheItemsRef.current.map(item => ({
      ...item,
      active: item.key === pathname,
    }));
    
    // 如果路径不在缓存中且需要缓存，则添加到缓存
    if (existingItemIndex === -1 && shouldCache) {
      updatedCacheItems.push({
        key: pathname,
        component: outlet,
        active: true,
      });
    } 
    // 如果路径在缓存中，更新组件
    else if (existingItemIndex !== -1) {
      if (shouldCache) {
        updatedCacheItems[existingItemIndex] = {
          ...updatedCacheItems[existingItemIndex],
          active: true,
        };
      } else {
        // 如果不需要缓存，从缓存中移除
        updatedCacheItems.splice(existingItemIndex, 1);
      }
    }
    
    cacheItemsRef.current = updatedCacheItems;
    setCacheItems(updatedCacheItems);
  }, [location, outlet]);

  return (
    <KeepAliveContext.Provider value={{ refresh }}>
      {/* 渲染所有缓存的组件，但只显示当前活动的组件 */}
      {cacheItems.map(item => (
        <div key={item.key} style={{ display: item.active ? 'block' : 'none' }}>
          {item.component}
        </div>
      ))}
      
      {/* 如果当前路径没有缓存，则直接渲染 outlet */}
      {cacheItems.length === 0 && outlet}
    </KeepAliveContext.Provider>
  );
};

export default KeepAlive;