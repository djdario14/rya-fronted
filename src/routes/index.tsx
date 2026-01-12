import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientesPage from '../pages/ClientesPage';
import DetalleClientePage from '../pages/DetalleClientePage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ClientesPage />} />
      <Route path="/clientes/:id" element={<DetalleClientePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
