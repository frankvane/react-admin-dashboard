import { useEffect, useState } from "react";

import { useLocalStorage } from "./useLocalStorage";

type ThemeMode = "light" | "dark";

/**
 * 自定义 Hook，用于主题切换
 * @returns [当前主题模式, 切换主题的函数]
 */
export function useTheme(): [ThemeMode, () => void] {
  // 从 localStorage 中获取主题设置
  const [storedTheme, setStoredTheme] = useLocalStorage<ThemeMode>(
    "theme",
    "light"
  );

  // 状态初始化
  const [theme, setTheme] = useState<ThemeMode>(storedTheme);

  // 切换主题的函数
  const toggleTheme = (): void => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  // 应用主题到 DOM
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    // 设置 body 的背景色
    if (theme === "dark") {
      document.body.style.backgroundColor = "#141414";
      document.body.classList.add("dark-theme");
    } else {
      document.body.style.backgroundColor = "#f0f2f5";
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  return [theme, toggleTheme];
}
