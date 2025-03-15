import React, { useState } from 'react';
import { Avatar, Button, Dropdown, Layout, Menu, message, Space, Switch, Tooltip } from 'antd';
import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useKeepAlive } from '../../components/KeepAlive';
import { useRoutes } from '../../hooks/useRoutes';
import { eventBus, EVENT_NAMES } from '../../utils/eventBus';

const { Header } = Layout;

interface HeaderComponentProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  collapsed,
  toggleCollapsed,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();
  const { refresh } = useKeepAlive();
  const { getRouteMetaByPath } = useRoutes();

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // 这里可以添加更改全局主题的逻辑
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 处理退出登录逻辑
      console.log('用户退出登录');
    }
  };

  // 处理刷新按钮点击
  const handleRefresh = () => {
    const currentPath = location.pathname;
    const currentMeta = getRouteMetaByPath(currentPath);
    
    // 如果当前页面配置了缓存，则刷新缓存
    if (currentMeta?.cache) {
      refresh(currentPath);
      message.success('页面已刷新');
      
      // 通过事件总线通知其他组件缓存已清除
      eventBus.emit(EVENT_NAMES.CACHE_CLEARED, { path: currentPath });
    } else {
      message.info('当前页面未启用缓存');
    }
  };

  return (
    <Header
      style={{
        padding: 0,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ marginLeft: 16 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
        />
      </div>
      <div style={{ marginRight: 16 }}>
        <Space size="middle">
          {/* 刷新按钮 */}
          <Tooltip title="刷新当前页面">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            />
          </Tooltip>
          
          {/* 主题切换 */}
          <Tooltip title={`切换到${theme === 'light' ? '暗色' : '亮色'}主题`}>
            <Switch
              checkedChildren="🌙"
              unCheckedChildren="☀️"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
          </Tooltip>
          
          {/* 通知按钮 */}
          <Tooltip title="通知">
            <Button type="text" icon={<BellOutlined />} />
          </Tooltip>
          
          {/* 用户菜单 */}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
          >
            <Space>
              <Avatar icon={<UserOutlined />} />
              <span>管理员</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default HeaderComponent;