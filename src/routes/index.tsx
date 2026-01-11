import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientesPage from '../pages/ClientesPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ClientesPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
