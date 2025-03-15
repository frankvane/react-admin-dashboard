// 此文件已被 Zustand 状态管理替代，保留此文件仅作为历史记录
// 请使用 src/store/cacheStore.ts 中的 useCacheStore 替代

// 如需使用事件总线功能，请参考以下代码：
/*
import { create } from 'zustand';

interface EventBusState {
  events: Record<string, Array<(data: unknown) => void>>;
  on: <T>(event: string, callback: (data: T) => void) => void;
  off: <T>(event: string, callback: (data: T) => void) => void;
  emit: <T>(event: string, data: T) => void;
}

const useEventBusStore = create<EventBusState>((set, get) => ({
  events: {},
  
  on: <T>(event: string, callback: (data: T) => void) => {
    set((state) => {
      const events = { ...state.events };
      if (!events[event]) {
        events[event] = [];
      }
      events[event].push(callback as (data: unknown) => void);
      return { events };
    });
  },
  
  off: <T>(event: string, callback: (data: T) => void) => {
    set((state) => {
      const events = { ...state.events };
      if (!events[event]) return { events };
      events[event] = events[event].filter((cb) => cb !== callback);
      return { events };
    });
  },
  
  emit: <T>(event: string, data: T) => {
    const { events } = get();
    if (!events[event]) return;
    events[event].forEach((callback) => callback(data));
  },
}));

export default useEventBusStore;
*/