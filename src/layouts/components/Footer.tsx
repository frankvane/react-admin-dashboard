import { Layout, Typography } from "antd";

import React from "react";

const { Footer } = Layout;
const { Text, Link } = Typography;

const FooterComponent: React.FC = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        padding: "12px 50px",
        backgroundColor: "#fff",
        height: "auto",
        position: "sticky",
        bottom: 0,
        zIndex: 1,
        width: "100%",
        borderTop: "1px solid #e8e8e8",
        marginLeft: 0,
        marginTop: 16,
      }}
    >
      <Text style={{ fontSize: 14 }}>
        React Admin Dashboard ©{new Date().getFullYear()} Created with{" "}
        <Link href="https://ant.design" target="_blank">
          Ant Design
        </Link>
      </Text>
    </Footer>
  );
};

export default FooterComponent;
