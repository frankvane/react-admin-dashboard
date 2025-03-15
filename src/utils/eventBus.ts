/**
 * 事件总线 - 用于组件间通信
 * 特别适用于不相关组件之间的通信，如缓存刷新事件
 */

// 定义事件回调函数类型
type EventCallback = (data?: any) => void;

// 事件映射类型
interface EventMap {
  [eventName: string]: EventCallback[];
}

class EventBus {
  private events: EventMap = {};

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  subscribe(eventName: string, callback: EventCallback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  unsubscribe(eventName: string, callback: EventCallback): void {
    if (!this.events[eventName]) return;
    
    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== callback
    );
  }

  /**
   * 发布事件
   * @param eventName 事件名称
   * @param data 事件数据
   */
  emit(eventName: string, data?: any): void {
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach((callback) => {
      callback(data);
    });
  }

  /**
   * 清除所有事件监听
   */
  clear(): void {
    this.events = {};
  }
}

// 导出单例实例
export const eventBus = new EventBus();

// 定义常用事件名称常量
export const EVENT_NAMES = {
  CACHE_CLEARED: 'cache-cleared',
};