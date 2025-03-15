import { AppRoutes } from "./router";
import { BrowserRouter } from "react-router-dom";
import React from "react";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
