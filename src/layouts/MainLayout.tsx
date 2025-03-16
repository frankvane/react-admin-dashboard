import React, { useState } from "react";

import FooterComponent from "./components/Footer";
import HeaderComponent from "./components/Header";
import KeepAlive from "../components/KeepAlive";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SidebarComponent from "./components/Sidebar";
import { TagsView } from "../components";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
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
