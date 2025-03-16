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

import type { MenuProps } from "antd";
import React from "react";
import { getRouteMetaByPath } from "@/router/routes";
import { useAliveController } from "react-activation";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/hooks";

const { Header } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  collapsed,
  toggleCollapsed,
}) => {
  const [theme, toggleTheme] = useTheme();
  const location = useLocation();
  const { refresh } = useAliveController();
  const [messageApi, contextHolder] = message.useMessage();

  const handleRefresh = () => {
    const currentPath = location.pathname;
    const routeMeta = getRouteMetaByPath(currentPath);
    const isCached = routeMeta?.keepAlive === true;
    const pathKey = currentPath.split("/").pop() || "Default";

    try {
      // 使用react-activation提供的refresh API刷新缓存
      if (isCached) {
        // 对于缓存页面，使用refresh方法刷新缓存
        console.log("刷新缓存页面:", pathKey);
        refresh(pathKey);
        messageApi.success(`已刷新缓存页面: ${pathKey}`);
      } else {
        // 如果不是缓存页面，则强制刷新
        window.location.reload();
        messageApi.info("页面已刷新");
      }
    } catch (error) {
      console.error("刷新页面时出错:", error);
      // 出错时回退到强制刷新
      window.location.reload();
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
        width: "100%",
        height: 64,
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
            onClick={() => toggleCollapsed()}
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
