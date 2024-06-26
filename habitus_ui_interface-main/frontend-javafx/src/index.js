import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, HashRouter } from "react-router-dom";
import { GridPage } from './pages';
import 'index.css';
import SplashScreen from 'SplashScreen';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
      <Route path="/" element={<SplashScreen apiurl="http://127.0.0.1:8000" />} />
        <Route path="/grid" element={<GridPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);