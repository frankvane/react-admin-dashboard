import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { cancelAllRequests, get } from "@/services/request";

const Role: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 测试 GET 请求
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersResult = await get<any[]>("/users");
      setUsers(usersResult);
      message.success("GET 请求成功");
    } catch (error) {
      console.error("GET 请求错误:", error);
      message.error("GET 请求失败");
    } finally {
      setLoading(false);
    }
  };

  // 测试请求缓存
  const testCache = async () => {
    try {
      const usersResult1 = await get<any[]>("/users");
      message.success("第一次 GET 请求成功");

      const usersResult2 = await get<any[]>("/users");
      message.success("第二次 GET 请求成功（可能来自缓存）");
    } catch (error) {
      console.error("缓存测试错误:", error);
      message.error("缓存测试失败");
    }
  };

  // 测试请求队列
  const testQueue = async () => {
    try {
      const promises = Array.from({ length: 5 }, (_, i) =>
        get<any[]>(`/users?delay=${i}`)
      );
      await Promise.all(promises);
      message.success("请求队列测试成功");
    } catch (error) {
      console.error("请求队列测试错误:", error);
      message.error("请求队列测试失败");
    }
  };

  // 测试取消请求
  const testCancel = async () => {
    try {
      const promise = get<any[]>("/users?delay=2");
      setTimeout(() => cancelAllRequests(), 1000);
      await promise;
    } catch (error) {
      console.error("请求取消测试错误:", error);
      message.error("请求取消测试成功");
    }
  };

  // 测试 Token 刷新
  const testTokenRefresh = async () => {
    try {
      // 模拟 Token 过期
      localStorage.setItem("token", "expired-token");
      const result = await get<any[]>("/users");
      setUsers(result);
      message.success("Token 刷新测试成功");
    } catch (error) {
      console.error("Token 刷新测试错误:", error);
      message.error("Token 刷新测试失败");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Request 功能测试</h1>

      <h2>用户列表</h2>
      <p>{loading ? "加载中..." : ""}</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>

      <h2>测试请求缓存</h2>
      <Button type="primary" onClick={testCache}>
        测试缓存
      </Button>

      <h2>测试请求队列</h2>
      <Button type="primary" onClick={testQueue}>
        测试请求队列
      </Button>

      <h2>测试请求取消</h2>
      <Button type="primary" onClick={testCancel}>
        测试请求取消
      </Button>

      <h2>测试 Token 刷新</h2>
      <Button type="primary" onClick={testTokenRefresh}>
        测试 Token 刷新
      </Button>
    </div>
  );
};

export default Role;
