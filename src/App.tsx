import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Dashboard } from "./pages";
import { MainLayout } from "./layouts";
import React from "react";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="documentation" element={<div>Documentation Page</div>} />
          <Route path="guide" element={<div>Guide Page</div>} />
          <Route path="permission" element={<div>Permission Page</div>} />
          <Route path="component" element={<div>Component Page</div>} />
          <Route path="business" element={<div>Business Page</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
