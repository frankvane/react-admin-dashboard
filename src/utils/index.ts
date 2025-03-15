/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: Date | number | string,
  format = "YYYY-MM-DD HH:mm:ss"
): string => {
  const d = new Date(date);

  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");

  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

/**
 * 格式化金额
 * @param amount 金额数值
 * @param decimals 小数位数，默认 2
 * @param separator 千位分隔符，默认 ','
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (
  amount: number,
  decimals = 2,
  separator = ","
): string => {
  return amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

/**
 * 生成随机 ID
 * @param length ID 长度，默认 8
 * @returns 随机 ID 字符串
 */
export const generateId = (length = 8): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的新对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Object) {
    const copy = {} as Record<string, unknown>;

    Object.keys(obj).forEach((key) => {
      copy[key] = deepClone((obj as Record<string, unknown>)[key]);
    });

    return copy as T;
  }

  return obj;
};

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间，默认 300ms
 * @returns 防抖处理后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
};

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param delay 延迟时间，默认 300ms
 * @returns 节流处理后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
};
