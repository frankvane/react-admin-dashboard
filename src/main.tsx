import "./index.css";
// 在 antd 5.x 中，应该使用以下引入方式
// 注意：在 antd 5.x 中，不再需要显式引入 CSS 文件
// 如果需要自定义主题，可以使用 ConfigProvider 组件

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
