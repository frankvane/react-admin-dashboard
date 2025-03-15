import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Space, Statistic, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { eventBus, EVENT_NAMES } from '../../utils/eventBus';

const { Title, Paragraph, Text } = Typography;

// 全局变量，用于在组件重新挂载时保持状态
let apiRequestCount = 0;
let isRequestLocked = false;

// 模拟 API 请求
const fetchData = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('API 请求成功返回的数据');
    }, 1000);
  });
};

// 防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const Documentation: React.FC = () => {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mountTime, setMountTime] = useState<string>('');
  const location = useLocation();

  // 重置状态函数
  const resetState = () => {
    setData('');
    setLoading(true);
    isRequestLocked = false;
  };

  // 加载数据
  const loadData = async () => {
    // 如果请求已锁定，则不重复请求
    if (isRequestLocked) return;
    
    // 锁定请求
    isRequestLocked = true;
    setLoading(true);
    
    try {
      // 增加请求计数
      apiRequestCount++;
      
      // 发起请求
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 防抖处理的加载数据
  const debouncedLoadData = debounce(loadData, 300);

  // 手动刷新数据
  const handleRefresh = () => {
    resetState();
    debouncedLoadData();
  };

  // 组件挂载时加载数据
  useEffect(() => {
    // 记录挂载时间
    setMountTime(new Date().toLocaleTimeString());
    
    // 加载数据
    debouncedLoadData();
    
    // 监听缓存清除事件
    const handleCacheCleared = (data: any) => {
      if (data?.path === location.pathname) {
        resetState();
      }
    };
    
    eventBus.subscribe(EVENT_NAMES.CACHE_CLEARED, handleCacheCleared);
    
    // 组件卸载时清理
    return () => {
      eventBus.unsubscribe(EVENT_NAMES.CACHE_CLEARED, handleCacheCleared);
    };
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>文档中心</Title>
        <Divider />
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 缓存演示统计信息 */}
          <Card title="缓存功能演示" bordered={false}>
            <Space size="large">
              <Statistic
                title="组件挂载时间"
                value={mountTime}
                valueStyle={{ color: '#3f8600' }}
              />
              <Statistic
                title="API 请求次数"
                value={apiRequestCount}
                valueStyle={{ color: '#cf1322' }}
              />
            </Space>
            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>说明：</Text> 离开此页面再返回时，如果启用了缓存，组件不会重新挂载，API 请求次数不会增加。
              点击顶部导航栏的刷新按钮可以清除缓存，组件将重新挂载并发起新的 API 请求。
            </Paragraph>
            <Button type="primary" onClick={handleRefresh} loading={loading}>
              手动刷新数据（不影响缓存）
            </Button>
          </Card>
          
          {/* 文档内容 */}
          <Card title="项目文档" bordered={false}>
            <Title level={3}>React Admin Dashboard</Title>
            <Paragraph>
              这是一个基于 React 和 Ant Design 的现代化管理后台模板，提供了丰富的组件和功能，
              帮助开发者快速构建企业级管理系统。
            </Paragraph>
            
            <Title level={4}>主要功能</Title>
            <Paragraph>
              <ul>
                <li>响应式设计：适配不同尺寸的屏幕和设备</li>
                <li>精美 UI：基于 Ant Design 组件库，提供美观的用户界面</li>
                <li>模块化结构：代码组织清晰，易于维护和扩展</li>
                <li>路由管理：基于 React Router 的路由系统，支持嵌套路由</li>
                <li>标签式导航：类似浏览器的标签页导航体验，提高工作效率</li>
                <li>页面缓存：自定义 KeepAlive 组件实现页面缓存，提高性能和用户体验</li>
              </ul>
            </Paragraph>
            
            <Title level={4}>页面缓存功能</Title>
            <Paragraph>
              本项目实现了类似 Vue 中 &lt;keep-alive&gt; 的页面缓存功能，可以在用户切换页面时保留页面状态，
              提高用户体验和应用性能。
            </Paragraph>
            <Paragraph>
              <Text strong>使用方法：</Text>
            </Paragraph>
            <Paragraph>
              1. 在路由配置中，通过设置路由的 meta.cache 属性来标记需要缓存的页面：
              <pre>
                {`{
  path: "documentation",
  element: <Documentation />,
  meta: {
    title: "Documentation",
    icon: <FileTextOutlined />,
    cache: true, // 启用缓存
  },
}`}
              </pre>
            </Paragraph>
            <Paragraph>
              2. 可以通过顶部导航栏的刷新按钮强制刷新当前页面的缓存。
            </Paragraph>
          </Card>
          
          {/* API 响应数据 */}
          <Card title="API 响应数据" bordered={false} loading={loading}>
            <pre>{data || '加载中...'}</pre>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default Documentation;