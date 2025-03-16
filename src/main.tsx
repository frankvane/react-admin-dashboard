import "./index.css";

import { AliveScope } from "react-activation";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

// 在 antd 5.x 中，应该使用以下引入方式
// 注意：在 antd 5.x 中，不再需要显式引入 CSS 文件
// 如果需要自定义主题，可以使用 ConfigProvider 组件

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AliveScope>
    <App />
  </AliveScope>
);
