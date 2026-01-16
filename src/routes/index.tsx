import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientesPage from '../pages/ClientesPage';
import DetalleClientePage from '../pages/DetalleClientePage';
import RegistrarGastoPage from '../pages/RegistrarGastoPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ClientesPage />} />
      <Route path="/clientes/:id" element={<DetalleClientePage />} />
      <Route path="/registrar-gasto" element={<RegistrarGastoPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
