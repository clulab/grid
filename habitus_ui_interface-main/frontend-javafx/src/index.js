import { GridPage } from "./pages";
import { SplashScreen } from "./SplashScreen";

import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, HashRouter } from "react-router-dom";

import 'index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<GridPage />} />
        // <Route path="/" element={<SplashScreen />} />
        // <Route path="/grid" element={<GridPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
