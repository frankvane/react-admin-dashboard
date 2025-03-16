import { Layout, Spin } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import React, { Suspense, lazy, useState } from "react";

import FooterComponent from "./components/Footer";
import HeaderComponent from "./components/Header";
import { KeepAlive } from "react-activation";
import SidebarComponent from "./components/Sidebar";
import { TagsView } from "../components";
import { getRouteMetaByPath } from "@/router/routes";

const { Content } = Layout;

// 直接导入 User 组件，而不是通过路由懒加载
const User = lazy(() => import("@/pages/acl/permissions/user"));

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 获取当前路由的元数据
  const currentRouteMeta = getRouteMetaByPath(location.pathname);
  // 判断当前路由是否需要缓存
  const shouldKeepAlive = currentRouteMeta?.keepAlive === true;
  // 获取当前路径的最后一段作为缓存的key
  const pathKey = location.pathname.split("/").pop() || "Default";

  console.log(
    "shouldKeepAlive",
    shouldKeepAlive,
    "pathKey",
    pathKey,
    "location",
    location.pathname
  );

  // 渲染内容
  const renderContent = () => {
    // 如果是用户管理页面，直接渲染 User 组件
    if (location.pathname.includes("/permissions/user")) {
      if (shouldKeepAlive) {
        return (
          <KeepAlive when={true} id="user" cacheKey="user" name="user">
            <div id="user" key="user">
              <Suspense fallback={<Spin size="large" />}>
                <User />
              </Suspense>
            </div>
          </KeepAlive>
        );
      } else {
        return (
          <Suspense fallback={<Spin size="large" />}>
            <User />
          </Suspense>
        );
      }
    }

    // 其他页面正常渲染
    return (
      <Suspense fallback={<Spin size="large" />}>
        <Outlet />
      </Suspense>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            left: collapsed ? 80 : 200,
            zIndex: 9,
          }}
        >
          <HeaderComponent
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
          />
          <TagsView />
        </div>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            marginTop: 120, // 为固定的header和tagsView留出空间
            overflow: "auto",
          }}
        >
          {renderContent()}
        </Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
