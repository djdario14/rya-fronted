import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import ClientesPage from '../pages/ClientesPage';
import RegistrarGastoPage from '../pages/RegistrarGastoPage';
import ReporteDiarioPage from '../pages/ReporteDiarioPage';
import ClienteDetallePage from '../pages/ClienteDetallePage';
import MiRutaPage from '../pages/MiRutaPage';
import AgendaPage from '../pages/AgendaPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ClientesPage />} />
      <Route path="/registrar-gasto" element={<RegistrarGastoPage />} />
      <Route path="/reportes" element={<ReporteDiarioPage />} />
      <Route path="/cliente/:id" element={<ClienteDetallePage />} />
      <Route path="/clientes/:id" element={<ClienteDetallePage />} />
      <Route path="/gps" element={<MiRutaPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
