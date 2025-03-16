import React, { useEffect, useState } from "react";
import { useActivate, useUnactivate } from "react-activation";

import { Button } from "antd";

// 简化的 User 组件
const User = () => {
  console.log("User component rendering...");

  const [count, setCount] = useState(0);
  const [renderTime] = useState(new Date().toLocaleTimeString());

  // 普通的useEffect，用于记录组件的挂载和卸载
  useEffect(() => {
    console.log("User component mounted (normal useEffect)");
    console.log(`Initial render time: ${renderTime}`);

    // 添加一个定时器，每秒更新一次控制台输出，确认组件是否正常运行
    const timer = setInterval(() => {
      console.log(
        `User component is still mounted, time: ${new Date().toLocaleTimeString()}`
      );
    }, 5000);

    return () => {
      console.log("User component unmounted (normal useEffect)");
      clearInterval(timer);
    };
  }, [renderTime]);

  // 使用react-activation提供的useActivate钩子
  useActivate(() => {
    console.log("User component activated (useActivate)");
    console.log(`Component was rendered at: ${renderTime}`);
  });

  // 使用react-activation提供的useUnactivate钩子
  useUnactivate(() => {
    console.log("User component deactivated (useUnactivate)");
  });

  // 简化的渲染函数
  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 4 }}>
      <h1>用户管理组件</h1>
      <p>这是一个简化的用户管理组件，用于测试缓存功能。</p>
      <p>组件渲染时间: {renderTime}</p>
      <p>计数器: {count}</p>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        增加计数
      </Button>
    </div>
  );
};

// 导出组件
export default User;
