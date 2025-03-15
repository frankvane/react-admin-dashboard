import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterComponent from './components/Footer';
import HeaderComponent from './components/Header';
import SidebarComponent from './components/Sidebar';
import { TagsView } from '../components';
import KeepAlive from '../components/KeepAlive';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout>
        <HeaderComponent
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
        />
        <TagsView />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
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