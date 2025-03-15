import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Space,
  Typography,
  message,
} from "antd";
import {
  BellOutlined,
  FullscreenOutlined,
  GithubOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";

import { KeepAliveContext } from "../../components/KeepAlive";
import type { MenuProps } from "antd";
import { getRouteMetaByPath } from "../../router/routes";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../hooks";
import useCacheStore from "../../store/cacheStore";

const { Header } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const [theme, toggleTheme] = useTheme();
  const location = useLocation();
  const { refresh } = useContext(KeepAliveContext);
  const { clearCache } = useCacheStore();
  const [messageApi, contextHolder] = message.useMessage();

  const handleRefresh = () => {
    const currentPath = location.pathname;
    const routeMeta = getRouteMetaByPath(currentPath);
    const isCached = routeMeta?.cache === true;

    // 使用 KeepAlive 上下文提供的刷新方法
    refresh(currentPath);
    
    // 使用 Zustand store 通知其他组件缓存已清除
    clearCache(currentPath);

    if (isCached) {
      messageApi.success("已刷新缓存页面");
    } else {
      messageApi.info("页面已刷新");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
      key: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 9,
        width: "100%",
        height: 64,
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        marginBottom: 16,
      }}
    >
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          paddingRight: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div
            style={{ marginLeft: 16, display: "flex", alignItems: "center" }}
          >
            <Button
              type="text"
              icon={<SearchOutlined />}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 14 }}>Dashboard</Text>
          </div>
        </div>
        <Space size={16}>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            title="刷新当前页面"
          />
          <Button
            type="text"
            icon={<GlobalOutlined />}
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          />
          <Button type="text" icon={<FullscreenOutlined />} />
          <Button type="text" icon={<GithubOutlined />} />
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: 16 }} />}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>Admin</span>
            </Space>
          </Dropdown>
          <Button type="primary" size="small">
            Login
          </Button>
        </Space>
      </div>
    </Header>
  );
};

export default HeaderComponent;