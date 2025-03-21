import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { MenuItem } from "@/types";
import React from "react";
import { routes } from "@/router";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const SidebarComponent: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从路由配置生成菜单项
  const generateMenuItems = (
    routeList = routes,
    parentPath = ""
  ): MenuItem[] => {
    return routeList
      .filter((route) => !route.meta?.hidden) // 过滤掉隐藏的路由
      .map((route) => {
        const fullPath =
          `${
            parentPath.endsWith("/") || route.path.startsWith("/")
              ? parentPath
              : parentPath + "/"
          }` + route.path;

        const menuItem: MenuItem = {
          key: fullPath,
          icon: route.meta?.icon,
          label: route.meta?.title || "",
        };

        // 如果有子路由，递归生成子菜单
        if (route.children && route.children.length > 0) {
          const filteredChildren = route.children.filter(
            (child) => !child.meta?.hidden
          );
          if (filteredChildren.length > 0) {
            menuItem.children = generateMenuItems(filteredChildren, fullPath);
          }
        }

        return menuItem;
      });
  };

  const menuItems = generateMenuItems(routes[0].children);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
        overflow: "auto",
      }}
      width={200}
      collapsedWidth={80}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/logo.svg"
            alt="Logo"
            style={{
              width: collapsed ? 32 : 32,
              height: 32,
              marginRight: collapsed ? 0 : 8,
            }}
          />
          {!collapsed && (
            <h1
              style={{
                color: "#1890ff",
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              React Admin
            </h1>
          )}
        </div>
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["/"]}
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          borderRight: 0,
          fontWeight: 500,
        }}
      />
    </Sider>
  );
};

export default SidebarComponent;
