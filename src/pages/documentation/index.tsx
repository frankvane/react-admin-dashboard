import { Alert, Button, Card, Space, Spin, Table, Typography } from "antd";
import {
  ApiOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useCacheStore from "../../store/cacheStore";

const { Title, Text, Paragraph } = Typography;

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// 使用模块级变量来跟踪全局状态，确保即使组件重新挂载也能保持状态
// 这些变量在整个应用生命周期内保持不变，不受组件重新渲染或路由切换的影响
const globalState = {
  hasLoadedData: false,
  userData: [] as User[],
  apiCallCount: 0,
  initialMountTime: new Date(),
  // 添加请求锁，防止并发请求
  isLoading: false,
  // 添加请求计数器，用于调试
  mountCount: 0,
};

// 重置全局状态的函数
const resetGlobalState = () => {
  console.log("重置全局状态");
  globalState.hasLoadedData = false;
  globalState.initialMountTime = new Date();
  globalState.apiCallCount = 0;
  globalState.userData = [];
  globalState.isLoading = false;
};

// 防抖函数，避免短时间内多次调用
const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timer: number | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
};

const Documentation: React.FC = () => {
  const location = useLocation();
  // 使用全局状态初始化组件状态
  const [mountTime, setMountTime] = useState(globalState.initialMountTime);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshCount, setRefreshCount] = useState(0);
  const [users, setUsers] = useState<User[]>(globalState.userData);
  const [loading, setLoading] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(globalState.apiCallCount);
  const [mountCount, setMountCount] = useState(0);
  const isComponentMounted = useRef(true);
  
  // 使用 Zustand store 监听缓存清除事件
  const clearedPath = useCacheStore((state) => state.clearedPath);
  const resetClearedPath = useCacheStore((state) => state.resetClearedPath);

  // 记录组件挂载次数
  useEffect(() => {
    globalState.mountCount += 1;
    setMountCount(globalState.mountCount);

    // 组件卸载时的清理函数
    return () => {
      isComponentMounted.current = false;
      console.log("Documentation component will unmount");
    };
  }, []);

  // 监听缓存清除事件
  useEffect(() => {
    if (clearedPath === "/documentation" || clearedPath === location.pathname) {
      console.log("收到缓存清除事件，重置组件状态");
      // 重置全局状态
      resetGlobalState();
      // 更新组件状态
      setMountTime(globalState.initialMountTime);
      setApiCallCount(globalState.apiCallCount);
      setUsers(globalState.userData);
      // 增加刷新计数
      setRefreshCount((prev) => prev + 1);
      // 重置清除状态，避免重复处理
      resetClearedPath();
    }
  }, [clearedPath, location.pathname, resetClearedPath]);

  // 加载用户数据 - 使用防抖和锁机制
  const fetchUsers = async () => {
    // 如果已经在加载中或数据已加载且不是手动刷新，则跳过
    if (globalState.isLoading) {
      console.log("已有请求正在进行中，跳过此次请求");
      return;
    }

    // 设置加载锁
    globalState.isLoading = true;
    setLoading(true);

    try {
      console.log("开始请求 API 数据...", new Date().toLocaleString());
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();

      // 确保组件仍然挂载
      if (!isComponentMounted.current) {
        console.log("组件已卸载，取消更新状态");
        return;
      }

      // 更新全局状态和组件状态
      globalState.userData = data;
      globalState.apiCallCount += 1;
      globalState.hasLoadedData = true;

      setUsers(data);
      setApiCallCount(globalState.apiCallCount);
      console.log(
        "API 请求完成，获取到",
        data.length,
        "条用户数据",
        new Date().toLocaleString()
      );
    } catch (error) {
      console.error("获取用户数据失败:", error);
    } finally {
      // 释放加载锁
      globalState.isLoading = false;
      setLoading(false);
    }
  };

  // 使用防抖处理的 fetchUsers
  const debouncedFetchUsers = useRef(debounce(fetchUsers, 300)).current;

  // 组件挂载时记录当前时间并加载数据
  useEffect(() => {
    console.log(
      "Documentation component effect run at:",
      new Date().toLocaleString(),
      "globalHasLoadedData:",
      globalState.hasLoadedData,
      "mountCount:",
      globalState.mountCount
    );

    // 只在全局状态未加载数据时加载数据
    if (!globalState.hasLoadedData) {
      console.log("首次加载数据");
      // 使用防抖处理的请求函数
      debouncedFetchUsers();
    } else {
      console.log("数据已加载，使用缓存数据");
      // 确保组件状态与全局状态同步
      setUsers(globalState.userData);
      setApiCallCount(globalState.apiCallCount);
    }
  }, [debouncedFetchUsers]);

  // 手动刷新时间（不会影响缓存）
  const handleRefreshTime = () => {
    setCurrentTime(new Date());
  };

  // 手动重新加载数据（不会影响缓存）
  const handleRefreshData = () => {
    console.log("手动触发数据刷新");
    // 手动刷新时直接调用 fetchUsers，不使用防抖
    fetchUsers();
  };

  // 强制重置所有状态（模拟缓存被清除）
  const handleResetAll = () => {
    console.log("强制重置所有状态");
    resetGlobalState();

    // 重新加载页面以应用更改
    window.location.reload();
  };

  // 表格列定义
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Documentation</Title>

      <Alert
        message="缓存测试说明"
        description="这个页面启用了缓存功能。当你离开此页面再返回时，组件挂载时间和API请求次数不会更新，证明组件被缓存了。使用顶部导航栏的刷新按钮可以强制刷新缓存。"
        type="info"
        showIcon
        style={{ marginBottom: "24px" }}
      />

      <Card title="缓存测试" style={{ marginBottom: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>组件挂载时间（缓存标识）：</Text>
            <Text style={{ marginLeft: "8px" }}>
              <ClockCircleOutlined style={{ marginRight: "8px" }} />
              {mountTime.toLocaleString()}
            </Text>
          </div>

          <div>
            <Text strong>当前时间：</Text>
            <Text style={{ marginLeft: "8px" }}>
              {currentTime.toLocaleString()}
            </Text>
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={handleRefreshTime}
              style={{ marginLeft: "8px" }}
            >
              刷新时间
            </Button>
          </div>

          <div>
            <Text strong>API 请求次数：</Text>
            <Text style={{ marginLeft: "8px" }}>
              <ApiOutlined style={{ marginRight: "8px" }} />
              {apiCallCount} 次
            </Text>
          </div>

          <div>
            <Text strong>组件挂载次数：</Text>
            <Text style={{ marginLeft: "8px" }}>{mountCount} 次</Text>
          </div>

          <div>
            <Text strong>缓存刷新次数：</Text>
            <Text style={{ marginLeft: "8px" }}>{refreshCount} 次</Text>
          </div>

          <Space>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefreshData}
              loading={loading}
            >
              刷新数据（不影响缓存）
            </Button>
            <Button danger onClick={handleResetAll}>
              强制重置所有状态
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="项目文档" style={{ marginBottom: "24px" }}>
        <Paragraph>
          这是一个基于 React 和 Ant Design 的管理后台模板，提供了丰富的组件和功能，帮助开发者快速构建企业级管理系统。
        </Paragraph>

        <Title level={4}>主要功能</Title>
        <ul>
          <li>响应式设计：适配不同尺寸的屏幕和设备</li>
          <li>精美 UI：基于 Ant Design 组件库，提供美观的用户界面</li>
          <li>模块化结构：代码组织清晰，易于维护和扩展</li>
          <li>路由管理：基于 React Router 的路由系统，支持嵌套路由</li>
          <li>标签式导航：类似浏览器的标签页导航体验，提高工作效率</li>
          <li>数据可视化：集成多种图表组件，展示数据统计和分析</li>
          <li>权限控制：灵活的权限管理系统，控制用户访问权限</li>
          <li>API 集成：内置 Axios 请求工具，轻松对接后端服务</li>
          <li>状态管理：使用 Zustand 进行全局状态管理</li>
          <li>
            页面缓存：自定义 KeepAlive 组件实现页面缓存，提高性能和用户体验
          </li>
        </ul>
      </Card>

      <Card title="API 响应数据">
        <Spin spinning={loading}>
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default Documentation;