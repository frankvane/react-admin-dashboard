import { create } from 'zustand';

// 缓存状态接口
interface CacheState {
  // 最近清除的缓存路径
  clearedPath: string | null;
  // 清除指定路径的缓存
  clearCache: (path: string) => void;
  // 重置清除状态
  resetClearedPath: () => void;
}

// 创建缓存状态管理 store
const useCacheStore = create<CacheState>((set) => ({
  clearedPath: null,
  clearCache: (path: string) => {
    console.log(`[CacheStore] 清除路径 ${path} 的缓存`);
    set({ clearedPath: path });
  },
  resetClearedPath: () => set({ clearedPath: null }),
}));

export default useCacheStore;