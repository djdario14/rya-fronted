import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientesPage from '../pages/ClientesPage';
import RegistrarGastoPage from '../pages/RegistrarGastoPage';
import ReporteDiarioPage from '../pages/ReporteDiarioPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ClientesPage />} />
      <Route path="/registrar-gasto" element={<RegistrarGastoPage />} />
      <Route path="/reportes" element={<ReporteDiarioPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
