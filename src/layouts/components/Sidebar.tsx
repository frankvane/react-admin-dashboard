import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { MenuItem } from "../../types";
import React, { useEffect, useState } from "react";
import routes from "../../router/routes";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
};

const SidebarComponent: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 从路由配置生成菜单项
  const generateMenuItems = (routeList = routes): MenuItem[] => {
    return routeList
      .filter((route) => !route.meta?.hidden) // 过滤掉隐藏的路由
      .map((route) => {
        const menuItem: MenuItem = {
          key: route.path,
          icon: route.meta?.icon,
          label: route.meta?.title || "",
        };

        // 如果有子路由，递归生成子菜单
        if (route.children && route.children.length > 0) {
          const filteredChildren = route.children.filter(
            (child) => !child.meta?.hidden
          );
          if (filteredChildren.length > 0) {
            menuItem.children = generateMenuItems(filteredChildren);
          }
        }

        return menuItem;
      });
  };

  const menuItems = generateMenuItems();

  // 处理菜单点击
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
    setSelectedKeys([key]);
  };

  // 处理子菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 根据当前路径设置选中的菜单项和展开的子菜单
  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const openKeysSet = new Set<string>();
    
    // 构建可能的父路径
    let currentPath = "";
    pathParts.forEach((part) => {
      currentPath += `/${part}`;
      openKeysSet.add(currentPath);
    });
    
    // 移除当前路径，只保留父路径
    openKeysSet.delete(location.pathname);
    
    setSelectedKeys([location.pathname]);
    if (!collapsed) {
      setOpenKeys(Array.from(openKeysSet));
    }
  }, [location.pathname, collapsed]);

  // 当折叠状态改变时，处理子菜单的展开状态
  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    } else {
      // 恢复之前的展开状态
      const pathParts = location.pathname.split("/").filter(Boolean);
      const openKeysSet = new Set<string>();
      
      let currentPath = "";
      pathParts.forEach((part) => {
        currentPath += `/${part}`;
        openKeysSet.add(currentPath);
      });
      
      openKeysSet.delete(location.pathname);
      setOpenKeys(Array.from(openKeysSet));
    }
  }, [collapsed, location.pathname]);

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
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
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