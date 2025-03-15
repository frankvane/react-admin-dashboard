import React, { useState } from "react";

import FooterComponent from "./components/Footer";
import HeaderComponent from "./components/Header";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SidebarComponent from "./components/Sidebar";
import { KeepAlive, TagsView } from "../components";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
          background: "#f0f2f5",
        }}
      >
        <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <TagsView />
        <Content
          style={{
            margin: "16px 16px 0",
            padding: 0,
            flex: 1,
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* 使用 KeepAlive 组件包裹 Outlet，实现页面缓存 */}
          <KeepAlive>
            <Outlet />
          </KeepAlive>
        </Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default MainLayout;